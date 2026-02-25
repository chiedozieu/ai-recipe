import {
  getAreas,
  getCategories,
  getMealsByArea,
  getMealsByCategory,
  getRecipeOfTheDay,
} from "@/actions/mealdb.actions";
import { Badge } from "@/components/ui/badge";
import { Flame, GlobeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardPage = async () => {
  const recipeData = await getRecipeOfTheDay();
  const categoriesData = await getCategories();
  const areasData = await getAreas();

  const recipeOfTheDay = recipeData?.recipe;
  const categories = categoriesData?.categories || [];
  const areas = areasData?.areas || [];
  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5">
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-4 tracking-tight leading-tight">
            Fresh Recipes, Served Daily 🔥
          </h1>
          <p className="max-w-2xl text-xl text-stone-600 font-light">
            Discover delicious recipes from around the world. Try a new recipe
            every day and make your cooking experience more enjoyable.
          </p>
        </div>
        {/* recipeOfTheDay Hero section */}
        {recipeOfTheDay && (
          <section className="mb-24 relative">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="h-6 w-6 text-orange-600" />
              <h2 className="text-3xl font-sans text-stone-900 font-bold">
                Recipe of the Day
              </h2>
            </div>

            <Link
              href={`/recipe?cook=${encodeURIComponent(recipeOfTheDay.strMeal)}`}
            >
              <div className="relative bg-white border-2 border-stone-900 overflow-hidden hover:border-orange-600 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-4/3 md:aspect-auto border-b-2 md:border-b-0 md:border-r-2 border-stone-900">
                    <Image
                      fill
                      src={recipeOfTheDay.strMealThumb}
                      alt={recipeOfTheDay.strMeal}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-6 flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-2 border-orange-600 text-orange-700 bg-orange-50 font-bold">
                        {recipeOfTheDay.strCategory}
                      </Badge>
                      <Badge variant="outline" className="border-2 border-stone-900 text-stone-700 bg-stone-50 font-bold">
                      <GlobeIcon className="mr-1 h-3 w-3" />
                        {recipeOfTheDay.strArea}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* browse by category */}

        {/* browse by cuisine */}
      </div>
    </div>
  );
};

export default DashboardPage;
