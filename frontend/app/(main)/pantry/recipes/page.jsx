"use client";

import { getRecipeByPantryIngredients } from "@/actions/recipe.actions";
import PricingModal from "@/components/PricingModal";
import RecipeCard from "@/components/RecipeCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import {
  ArrowLeftIcon,
  ChefHatIcon,
  Loader2Icon,
  PackageIcon,
  PackageOpenIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const PantryRecipesPage = () => {
  const {
    loading,
    data: recipesData,
    fn: fetchSuggestions,
  } = useFetch(getRecipeByPantryIngredients);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const recipes = recipesData?.recipes || [];
  const ingredientsUsed = recipesData?.ingredientsUsed || "";

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* header titles */}
        <div className="mb-8">
          <Link
            href="/pantry"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-4 font-medium"
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <ChefHatIcon className="size-16 text-green-600" />
            <div className="">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
                What Can I Make?
              </h1>
              <p className="text-stone-600 font-light">
                AI-powered recipe suggestions based on your pantry ingredients
              </p>
            </div>
          </div>
          {/* ingredients used */}
          {ingredientsUsed && (
            <div className="bg-white p-4 border-2 border-stone-200 mb-4">
              <div className="flex items-start gap-3">
                <PackageIcon className="size-5 text-orange-600 mt-0.5 shrink-0" />
                <div className="">
                  <h3 className="font-bold text-stone-900 mb-1">
                    Your available ingredients
                  </h3>
                  <p className="text-stone-600 font-light text-sm">
                    {ingredientsUsed}
                  </p>
                </div>
              </div>
            </div>
          )}
          {recipesData !== undefined && (
            <div className="bg-orange-50 p-4 border-2 border-orange-200 inline-flex items-center gap-3">
              <SparklesIcon className="size-5 text-orange-600" />
              <div className="text-sm">
                {recipesData.recommendationsLimit === "unlimited" ? (
                  <>
                    <span className="font-bold text-green-600">∞</span>
                    <span className="text-orange-700 font-light">
                      {" "}
                      Unlimited AI recommendations (Pro Plan)
                    </span>
                  </>
                ) : (
                  <span className="text-orange-700 font-light">
                    Upgrade to Pro Plan for unlimited AI recommendations
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        {/* loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2Icon className="size-12 animate-spin text-green-600 mb-6" />
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              Finding recipes for you...
            </h2>
            <p className="font-light text-stone-500">
              AI Chef is analyzing your ingredients...
            </p>
          </div>
        )}

        {/* recipe grid- using RecipeCard component */}
        {!loading && recipes.length > 0 && (
          <div className="">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="text-green-600 size-5" />
                <h2 className="text-2xl font-bold text-stone-900">
                  Recipe suggestions
                </h2>
                <Badge
                  variant="outline"
                  className="border-2 border-stone-900 text-stone-900 font-bold uppercase tracking-wide"
                >
                  {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
                </Badge>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
            {/* rendering */}
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} variant="pantry" />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  fetchSuggestions(new FormData())
                  window.scrollTo(0, 0)
                  }}
                disabled={loading}
                className="border-2 cursor-pointer border-stone-900 hover:bg-stone-900 hover:text-white gap-2"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="animate-spin size-4" />
                    Loading...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="size-4" />
                    Get New Suggestions
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* empty pantry state */}
        {!loading && recipes.length === 0 && recipesData?.success === false && (
          <div className="flex flex-col items-center justify-center py-20">
            <PackageOpenIcon className="size-12 text-stone-600 mb-6" />
            <div className="text-2xl font-bold text-red-500 mb-2">Oops!</div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              No recipes found
            </h2>
            <p className="font-light text-stone-500">
              Try adding more ingredients to your pantry
            </p>
          </div>
        )}
        {/* monthly limit reached */}
        {!loading && recipesData === undefined && (
          <div className="bg-linear-to-br from-orange-50 to-amber-50 p-12 border-2 border-orange-200 text-center">
            <PackageOpenIcon className="size-12 text-stone-600 mb-6" />
            <div className="bg-orange-100 size-20 border-2 border-orange-200 flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="size-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">
              Monthly Limit Reached
            </h3>
            <div className="text-stone-600 mb-8 max-w-md mx-auto font-light">
              You have reached your monthly limit of 10 AI recipe suggestions.
              Upgrade to a Pro plan to get unlimited suggestions.
            </div>
            <PricingModal>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 cursor-pointer">
                <SparklesIcon className="size-4" />
                Upgrade to Pro
              </Button>
            </PricingModal>
          </div>
        )}
      </div>
    </div>
  );
};

export default PantryRecipesPage;
