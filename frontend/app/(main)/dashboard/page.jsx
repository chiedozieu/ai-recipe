import {
  getAreas,
  getCategories,
  getRecipeOfTheDay,
} from "@/actions/mealdb.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategoryEmoji, getCountryFlag } from "@/lib/data";
import { ArrowRightIcon, Flame, GlobeIcon } from "lucide-react";
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
                      <Badge
                        variant="outline"
                        className="border-2 border-orange-600 text-orange-700 bg-orange-50 font-bold"
                      >
                        {recipeOfTheDay.strCategory}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-2 border-stone-900 text-stone-700 bg-stone-50 font-bold"
                      >
                        <GlobeIcon className="mr-1 h-3 w-3" />
                        {recipeOfTheDay.strArea}
                      </Badge>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                      {recipeOfTheDay.strMeal}
                    </h2>
                    <p className="text-stone-600 mb-6 line-clamp-3 font-light text-lg">
                      {recipeOfTheDay.strInstructions?.substring(0, 200)}...
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      className="cursor-pointer"
                    >
                      Start Cooking{" "}
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-all duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* browse by category */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">
              Browse by Category
            </h2>
            <p className="text-lg text-stone-600 font-light">
              Find recipes that match your culinary preferences.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link
                key={category.strCategory}
                href={`/recipes/category/${category.strCategory.toLowerCase()}`}
              >
                <div className="bg-white p-6 border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg transition-all text-center group">
                  <div className="text-4xl mb-3">
                    {getCategoryEmoji(category.strCategory)}
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors text-sm">
                    {category.strCategory}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* browse by area */}

        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">
              Explore world cuisines
            </h2>
            <p className="text-lg text-stone-600 font-light">
              Travel the globe through food.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {areas.map((area) => (
              <Link
                key={area.strArea}
                href={`/recipes/cuisine/${area.strArea.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="bg-stone-50 p-5 border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center">
                    <span className="text-3xl mr-1">
                      {getCountryFlag(area.strArea)}
                    </span>
                    <span className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors text-sm">
                      {area.strArea}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* browse by cuisine */}
      </div>
    </div>
  );
};

export default DashboardPage;
