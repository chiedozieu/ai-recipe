import useFetch from "@/hooks/use-fetch";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const RecipeGrid = ({ type, value, fetchAction, backLink }) => {
  const { data, loading, fn: fetchMeals } = useFetch(fetchAction);

  useEffect(() => {
    if (value) {
      // capitalize the first letter for api call
      const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
      fetchMeals(formattedValue);
    }
  }, [value]);

  const meals = data?.meals || [];
  const displayName = value?.replace(/-/g, " "); // replace hyphens with spaces

  


  return (
    <div className="min-h-screen bg-stone-50 pt-14 pb-16 ps-x">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-stone-900 capitalize tracking-tight leading-tight">
            {displayName}{" "}
            <span className="text-orange-600">
              {type === "cuisine" ? " Cuisine " : "Recipe"}
            </span>
          </h1>
          {!loading && meals.length > 0 && (
            <p className="mt-2 text-stone-600 pl-2">
              {meals.length} delicious {displayName}{" "}
              {type === "cuisine" ? " dishes " : "recipes"} to choose from
            </p>
          )}
        </div>

        {/* loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2Icon className="animate-spin size-10 text-orange-600 mb-4" />
            <p className="text-stone-500 ml-2"> Loading...</p>
          </div>
        )}
        {/* meals */}
        {
                !loading && meals.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {meals.map((meal) => (
                            <Link href={`/recipe/${meal.idMeal}`} key={meal.idMeal}>
                                <div className="shadow-lg rounded-md overflow-hidden">
                                    <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-stone-900 mb-2">{meal.strMeal}</h2>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            }
            { /* no meals found */}
            {
                !loading && meals.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🍽</div>
                            <h3 className="text-2xl font-bold text-stone-900 mb-2">
                                No recipes found
                            </h3>
                            <p className="text-stone-500 mb-6">
                                We couldn&apos;t find any {displayName}{" "} {type === "cuisine" ? " dishes " : "recipes"}
                            </p>
                            <Link href={backLink} className="">
                                <span className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors font-semibold">
                                    <ArrowLeftIcon className="size-4" />
                                    Go back to explore more
                                </span>
                            </Link>
                    </div>
                )
            }
      </div>
    </div>
  );
};

export default RecipeGrid;
