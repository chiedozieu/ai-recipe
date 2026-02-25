"use server";

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";
export async function getRecipeOfTheDay() {
  try {
    const response = await fetch(`${MEALDB_BASE}/random.php`, {
      next: { revalidate: 86400 }, // 24 hours
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe of the day");
    }
    const data = await response.json();
    return {
      success: true,
      recipe: data.meals[0],
    };
  } catch (error) {
    console.error(error, "Error fetching recipe of the day");
    throw new Error(error.message || "Failed to fetch recipe of the day");
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${MEALDB_BASE}/list.php?c=list`, {
      next: { revalidate: 604800 }, // 7 days
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return {
      success: true,
      categories: data.meals || [],
    };
  } catch (error) {
    console.error(error, "Error fetching categories");
    throw new Error(error.message || "Failed to fetch categories");
  }
}

export async function getAreas() {
  try {
    const response = await fetch(`${MEALDB_BASE}/list.php?a=list`, {
      next: { revalidate: 604800 }, // 7 days
    });
    if (!response.ok) {
      throw new Error("Failed to fetch areas");
    }
    const data = await response.json();
    return {
      success: true,
      areas: data.meals || [],
    };
  } catch (error) {
    console.error(error, "Error fetching areas");
    throw new Error(error.message || "Failed to fetch areas");
  }
}
export async function getMealsByCategory(category) {
  try {
    const response = await fetch(`${MEALDB_BASE}/filter.php?c=${category}`, {
      next: { revalidate: 86400 }, // 24 hours
    });

    if (!response.ok) {
      throw new Error("Failed to fetch meals");
    }
    const data = await response.json();
    return {
      success: true,
      meals: data.meals || [],
      category,
    };
  } catch (error) {
    console.error(error, "Error fetching meals by category");
    throw new Error(error.message || "Failed to fetch meals by category");
  }
}
export async function getMealsByArea(area) {
    try {
    const response = await fetch(`${MEALDB_BASE}/filter.php?a=${area}`, {
      next: { revalidate: 86400 }, // 24 hours
    });

    if (!response.ok) {
      throw new Error("Failed to fetch meals");
    }
    const data = await response.json();
    return {
      success: true,
      meals: data.meals || [],
      area,
    };
  } catch (error) {
    console.error(error, "Error fetching meals by area");
    throw new Error(error.message || "Failed to fetch meals by area");
  }
}
