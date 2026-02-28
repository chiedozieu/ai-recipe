"use server";

import { freePantryScans, proTierLimit } from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";
import { request } from "@arcjet/next";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(STRAPI_API_TOKEN);

export async function scanPantryImage(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const isPro = user.subscriptionTier === "pro";

    // Apply arcjet rate limit based on user subscription tier

    // apply Arcjet rate limit based on tier

    const arcjetClient = isPro ? proTierLimit : freePantryScans;

    // create a request object for Arcjet
    const req = await request();

    const decision = await arcjetClient.protect(req, {
      userId: user.clerkId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new Error(
          `Monthly limit reached. ${isPro ? "Contact support if you need more" : "Upgrade to Pro for unlimited scans"}`,
        );
      }

      throw new Error("Request denied by security system");
    }

    const imageFile = formData.get("image");
    if(!imageFile) {
      throw new Error("No image file found");
    }
    // to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64");

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5.flash-lite",
    })

    const prompt = `You are a professional chef and ingredient recognition expert. Analyze this image of a pantry/fridge and identify all visible food ingredients.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanations):
[
  {
    "name": "ingredient name",
    "quantity": "estimated quantity with unit",
    "confidence": 0.95
  }
]

Rules:
- Only identify food ingredients (not containers, utensils, or packaging)
- Be specific (e.g., "Cheddar Cheese" not just "Cheese")
- Estimate realistic quantities (e.g., "3 eggs", "1 cup milk", "2 tomatoes")
- Confidence should be 0.7-1.0 (omit items below 0.7)
- Maximum 20 items
- Common pantry staples are acceptable (salt, pepper, oil)`;
    const result = await model.generateContent([
       { prompt,
        inlineData: {
            mimeType: imageFile.type,
            data: base64Image,

        } } 
    ]);
    const response = await result.response;
    const text = response.text();

    let ingredients;
    try {
        const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        ingredients = JSON.parse(cleanText);
    } catch (error) {
     console.error("Failed to parse Gemini response:", text);   
     throw new Error("Failed to parse ingredients. Please try again.");
    }

    if(!Array.isArray(ingredients)  || ingredients.length === 0) {
        throw new Error("No ingredients detected in the image. Please try again.");
    }

    return {
      success: true,
      ingredients: ingredients.slice(0, 20),
      scansLimit: isPro ? "unlimited" : 10,
      message: `Found ${ingredients.length} ingredients in the image.`,
    }
    
  } catch (error) {
    console.error(error, "Error scanning pantry image");
    throw new Error(error.message || "Failed to scan pantry image");
  }
}
