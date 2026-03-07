"use server";

import { freeMealRecommendations, proTierLimit } from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";
import { DUMMY_RECIPE_RESPONSE } from "@/lib/dummy";
import { request } from "@arcjet/next";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getRecipeByPantryIngredients = async () => {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const isPro = user.subscriptionTier === "pro";

    // apply Arcjet rate limit based on tier
    const arcjetClient = isPro ? proTierLimit : freeMealRecommendations;

    // create a request object for Arcjet
    const req = await request();

    const decision = await arcjetClient.protect(req, {
      userId: user.clerkId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new Error(
          `Monthly limit reached. ${isPro ? "Contact support if you need more" : "Upgrade to Pro for unlimited meal recommendations"}`,
        );
      }

      throw new Error("Request denied by security system");
    }

    // get users pantry items
    const pantryResponse = await fetch(
      `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if (!pantryResponse.ok) {
      throw new Error("Failed to fetch pantry items");
    }
    const pantryData = await pantryResponse.json();

    if (!pantryData.data || pantryData.data.length === 0) {
      return {
        success: false,
        message: "No pantry items found. Please add some items to your pantry.",
      };
    }

    const ingredients = pantryData.data.map((item) => item.name).join(", ");

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    const prompt = `You are a professional chef. Given these available ingredients: ${ingredients}

Suggest 5 recipes that can be made primarily with these ingredients. It's okay if the recipes need 1-2 common pantry staples (salt, pepper, oil, etc.) that aren't listed.

Return ONLY a valid JSON array (no markdown, no explanations):
[
  {
    "title": "Recipe name",
    "description": "Brief 1-2 sentence description",
    "matchPercentage": 85,
    "missingIngredients": ["ingredient1", "ingredient2"],
    "category": "breakfast|lunch|dinner|snack|dessert",
    "cuisine": "italian|chinese|mexican|nigerian|etc",
    "prepTime": 20,
    "cookTime": 30,
    "servings": 4
  }
]

Rules:
- matchPercentage should be 70-100% (how many listed ingredients are used)
- missingIngredients should be common items or optional additions
- Sort by matchPercentage descending
- Make recipes realistic and delicious`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let recipeSuggestions;
    try {
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      recipeSuggestions = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error(
        "Failed to generate recipe suggestions. Please try again.",
      );
    }

    return {
      success: true,
      recipes: recipeSuggestions,
      ingredientsUsed: ingredients,
      recommendationsLimit: isPro ? "unlimited" : 5,
      message: `Found ${recipeSuggestions.length} recipes you can make. `,
    };
  } catch (error) {
    console.error(error, " ❌ Error getting recipe by pantry ingredients");
    throw new Error(
      error.message || "Failed to get recipe by pantry ingredients",
    );
  }
};

function normalizeTitle(title) {
  return title
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// helper function to get image from Unsplash
const fetchRecipeImage = async (recipeName) => {};

// get or generate recipe details
export const getOrGenerateRecipe = async (formData) => {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const recipeName = formData.get("recipeName");
    if (!recipeName) {
      throw new Error("Recipe name is required");
    }
    // normalize the title (e.g., "baked salmon" -> "Baked Salmon")
    const normalizedTitle = normalizeTitle(recipeName);

    // step-1 check if recipe already exists in DB (case insensitive search)
    // step-2 recipe doesn't exist, generate with gemini
    // step-3 fetch image from unsplash
    // step-4 save recipe to DB
    return DUMMY_RECIPE_RESPONSE;
  } catch (error) {
    console.error(error, " ❌ Error getting recipe image");
    throw new Error(error.message || "Failed to get recipe image");
  }
};

// save recipe to user's collection (bookmark)
export const saveRecipeToCollection = async (formData) => {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const recipeId = formData.get("recipeId");
    if (!recipeId) {
      throw new Error("Recipe ID is required");
    }
    // check if recipe already exists in user's collection
    const existingResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (existingResponse.ok) {
      const existingData = await existingResponse.json();
      if (existingData.data && existingData.data.length > 0) {
        return {
          success: true,
          alreadySaved: true,
          message: "Recipe already saved to collection",
        };
      }
    }
    // if not, save recipe to collection
    const saveResponse = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          user: user.id,
          recipe: recipeId,
          savedAt: new Date().toISOString(),
        },
      }),
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error("❌ Error saving recipe to collection:", errorText);
      throw new Error("Failed to save recipe to collection. Please try again.");
    }
    const savedRecipe = await saveResponse.json();
    return {
      success: true,
      alreadySaved: false,
      savedRecipe: savedRecipe.data,
      message: "Recipe saved to collection!",
    };
  } catch (error) {
    console.error(error, "❌ Error saving recipe to collection");
    throw new Error(error.message || "Failed to save recipe to collection");
  }
};

// remove recipe from user's collection (un-bookmark)
export const removeRecipeFromCollection = async (formData) => {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const recipeId = formData.get("recipeId");
    if (!recipeId) {
      throw new Error("Recipe ID is required");
    }
    // find saved recipe relation
    const searchResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!searchResponse.ok) {
      throw new Error("Failed to find saved recipe");
    }

    const searchData = await searchResponse.json();
    if (!searchData.data || searchData.data.length === 0) {
      return {
        success: true,
        message: "Recipe not found in collection",
      };
    }
  
    // delete saved recipe relation
        const savedRecipeId = searchData.data[0].id; 
        const deleteResponse = await fetch(
          `${STRAPI_URL}/api/saved-recipes/${savedRecipeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
          },
        );

        if (!deleteResponse.ok) {
          throw new Error("Failed to remove recipe from collection");
        }
        return {
          success: true,
          message: "Recipe removed from collection",
        };
      
    
  } catch (error) {
    console.error(error, "❌ Error removing recipe from collection");
    throw new Error(error.message || "Failed to remove recipe from collection");
  }
};
