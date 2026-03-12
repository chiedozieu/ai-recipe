"use client";

import { getSavedRecipes } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import {
  BookmarkIcon,
  BookmarkXIcon,
  ChefHatIcon,
  Loader2Icon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const SavedRecipesPage = () => {
  const {
    loading,
    data: recipeData,
    fn: fetchSavedRecipes,
  } = useFetch(getSavedRecipes);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const recipes = recipeData?.recipes || [];
  // console.log("recipes",recipes) // debug tomorrow morning 12th
  return (
    <div className="mx-auto min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-1 mb-8">
          <BookmarkIcon className="size-25 text-orange-600" />
          <div className="">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
              My Saved Recipes
            </h1>
            <p className=" text-stone-600 font-light">
              Your personalized recipe collection
            </p>
          </div>
        </div>
        {/*  loading state */}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2Icon className="text-orange-600 animate-spin size-12 mb-6" />
            <p className="text-stone-600">Loading Saved Recipes...</p>
          </div>
        )}

        {/* saved recipes */}
        {!loading && recipes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.documentId}
                recipe={recipe}
                variant="list"
              />
            ))}
          </div>
        )}

        {/* no saved recipes state */}
        {!loading && recipes.length === 0 && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-12 text-center border-2 border-dashed border-stone-200 ">
            <div className="bg-orange-50 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookmarkXIcon className="text-orange-600 size-10" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">
              You don&apos;t have any saved recipes yet
            </h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto">
              Start exploring recipes and Save your favorite recipes to access
              them anytime.
            </p>
            <Link href={"/dashboard"} className="">
              <Button className="bg-orange-600 hover:bg-orange-500 text-white gap-2">
                <ChefHatIcon className="size-4" />
                Explore Recipes
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipesPage;
