"use client";

import {
  getOrGenerateRecipe,
  removeRecipeFromCollection,
  saveRecipeToCollection,
} from "@/actions/recipe.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BookmarkCheckIcon,
  BookmarkIcon,
  ClockIcon,
  CookingPotIcon,
  FlameIcon,
  ListChecksIcon,
  Loader2Icon,
  LoaderIcon,
  RefreshCcwIcon,
  SaladIcon,
  ScaleIcon,
  ShoppingBasketIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function RecipeContent() {
  const searchParams = useSearchParams();
  const recipeName = searchParams.get("cook");
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [recipeId, setRecipeId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // get or generate recipe
  const {
    loading: loadingRecipe,
    data: recipeData,
    fn: fetchRecipe,
  } = useFetch(getOrGenerateRecipe);

  console.log("Recipe Data ", recipeData);

  // save to collection
  const {
    loading: saving,
    data: saveData,
    fn: saveToCollection,
  } = useFetch(saveRecipeToCollection);

  // remove from collection
  const {
    loading: removing,
    data: removeData,
    fn: removeFromCollection,
  } = useFetch(removeRecipeFromCollection);

  // handle save success
  useEffect(() => {
    if (saveData?.success) {
      if (saveData.alreadySaved) {
        toast.info("Recipe is already in your collection");
      } else {
        setIsSaved(true);
        toast.success("Recipe saved to your collection!");
      }
    }
  }, [saveData]);

  // handle remove success
  useEffect(() => {
    if (removeData?.success) {
      setIsSaved(false);
      toast.success("Recipe removed from your collection!");
    }
  }, [removeData]);

  const handleToggleSave = async () => {
    if (!recipeId) return;
    const formData = new FormData();
    formData.append("recipeId", recipeId);

    if (isSaved) {
      await removeFromCollection(formData);
    } else {
      await saveToCollection(formData);
    }
  };

  // fetch recipe on mount
  useEffect(() => {
    if (recipeName && !recipe) {
      const formData = new FormData();
      formData.append("recipeName", recipeName);
      fetchRecipe(formData);
    }
  }, [recipeName]);

  //update recipe when data arrives
  useEffect(() => {
    if (recipeData?.success) {
      setRecipe(recipeData.recipe);
      setRecipeId(recipeData.recipe.id);
      setIsSaved(recipeData.isSaved);
      if (recipeData.formDatabase) {
        toast.success("Recipe loaded from database");
      } else {
        toast.success("New recipe generated and saved!");
      }
    }
  }, [recipeData]);

  // No recipe name in url
  if (!recipeName) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16 ">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <div className="bg-stone-50 size-20 border-2 border-orange-200 flex items-center justify-center mx-auto mb-6">
            <AlertCircleIcon className="text-orange-600 size-10" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            No recipe specified
          </h2>
          <p className="text-stone-600 font-light mb-6">
            Please select a recipe from the dashboard
          </p>
          <Link href="/dashboard" className="">
            <Button className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  //loading state

  if (loadingRecipe === null || loadingRecipe) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <ClockIcon className="text-orange-600 animate-spin size-16 mx-auto mb-6" />
          <p className="text-stone-600">Preparing your Recipe...</p>
          <p className="text-stone-600 font-light">
            Our AI Chef is crafting detail instructions for you{" "}
            <span className="font-bold text-orange-600">{recipeName}</span>
            ...
          </p>
        </div>
      </div>
    );
  }
  //error state

  if (loadingRecipe === false && !recipe) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <div className="bg-stone-50 size-20 border-2 border-orange-200 flex items-center justify-center mx-auto mb-6">
            <AlertCircleIcon className="text-orange-600 size-10" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Failed to load recipe
          </h2>
          <p className="text-stone-600 font-light mb-6">
            Something went wrong, please try again
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-2 border-stone-900 hover:bg-stone-900 hover:text-white cursor-pointer"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer hover:text-white"
            >
              <RefreshCcwIcon className="size-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeftIcon className="size-4" />
            Dashboard
          </Link>
          <div className="bg-white p-8 md:p-10 border-2 border-stone-200 mb-6">
            {recipe.imageUrl && (
              <div className="relative w-full h-72 overflow-hidden mb-7">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="outline"
                className="text-orange-600 border-2 border-orange-200 capitalize"
              >
                {recipe.cuisine}
              </Badge>
              <Badge
                variant="outline"
                className="text-stone-600 border-2 border-stone-200 capitalize"
              >
                {recipe.category}
              </Badge>
            </div>
            {/* title */}
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
              {recipe.title}
            </h1>
            {/* description */}
            <p className="text-md font-light text-stone-600 mb-6">
              {recipe.description}
            </p>
            <div className="flex flex-wrap gap-6 text-stone-600 mb-6">
              <div className="flex items-center gap-1">
                <ClockIcon className="size-5 text-orange-600 hover:animate-spin" />
                <span className="font-medium">
                  {parseInt(recipe.prepTime || 0) +
                    parseInt(recipe.cookTime || 0)}{" "}
                  mins total
                </span>
              </div>
              <div className="flex items-center gap-1">
                <UsersIcon className="size-5 text-orange-600 hover:scale-110 transition-all duration-300" />
                <span className="font-medium"> {recipe.servings} servings</span>
              </div>
              {recipe.nutrition?.calories && (
                <div className="flex items-center gap-1">
                  <FlameIcon className="size-5 text-orange-600 hover:animate-pulse transition-all duration-300" />
                  <span className="font-medium">
                    {recipe.nutrition.calories} cal/serving
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleToggleSave}
                disabled={saving || removing}
                className={`${isSaved ? "bg-green-600 hover:bg-green-700 border-2 border-green-600" : "bg-orange-600 hover:bg-orange-700 border-2 border-orange-600"} text-white cursor-pointer gap-2 transition-all`}
              >
                {saving || removing ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    {saving ? "Saving..." : "Removing..."}
                  </>
                ) : (
                  <>
                    {isSaved ? (
                      <>
                        <BookmarkCheckIcon className="size-4" />
                        Saved to collection
                      </>
                    ) : (
                      <>
                        <BookmarkIcon className="size-4" />
                        Save to collection
                      </>
                    )}
                  </>
                )}
              </Button>
              {/* pdf download button */}
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* left column: ingredients & nutrition */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 border-2 border-stone-200 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <SaladIcon className="size-7 text-orange-600" />
                Ingredients
              </h2>
              {Object.entries(
                recipe.ingredients.reduce((acc, ing) => {
                  const cat = ing.category || "Other";
                  if (!acc[cat]) {
                    acc[cat] = [];
                  }
                  acc[cat].push(ing);
                  return acc;
                }, {}),
              ).map(([category, items]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-bold text-red -800 mb-3 tracking-wide uppercase">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((ingredient, i) => (
                      <li
                        key={i}
                        className="flex items-start justify-between gap-2 py-2 text-stone-700 border-b border-stone-100 last:border-0"
                      >
                        <span className="flex-1">{ingredient.item}</span>
                        <span className="text-orange-600 font-bold text-sm whitespace-nowrap">
                          {ingredient.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* nutrition info */}
              {recipe.nutrition && (
                <div className="mt-6 pt-6 border-t-2 border-stone-200">
                  <h3 className="font-bold text-stone-900 mb-3 uppercase tracking-wide text-sm">
                    Nutrition (per serving)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50 p-3 text-center border-2 border-orange-100">
                      <div className="text-2xl font-bold text-orange-600">
                        {recipe.nutrition.calories}
                      </div>
                      <div className="text-xs text-stone-500 fond-bold uppercase tracking-wide">Calories</div>
                    </div>
                    <div className="bg-orange-50 p-3 text-center border-2 border-orange-100">
                      <div className="text-2xl font-bold text-orange-600">
                        {recipe.nutrition.protein}
                      </div>
                      <div className="text-xs text-stone-500 fond-bold uppercase tracking-wide">
                        Protein
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 text-center border-2 border-orange-100">
                      <div className="text-2xl font-bold text-orange-600">
                        {recipe.nutrition.carbs}
                      </div>
                      <div className="text-xs text-stone-500 fond-bold uppercase tracking-wide">
                        Carbs
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 text-center border-2 border-orange-100">
                      <div className="text-2xl font-bold text-orange-600">
                        {recipe.nutrition.fat}
                      </div>
                      <div className="text-xs text-stone-500 fond-bold uppercase tracking-wide">
                        Fat
                      </div>
                    </div>
                   
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* right column: instructions & tips */}
          <div className="lg:col-span-2 space-y-6"></div>
        </div>
      </div>
    </div>
  );
}
export default function RecipePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center py-20">
            <Loader2Icon className="text-orange-600 animate-spin size-16 mx-auto mb-6" />
            <p className="text-stone-600">Loading Recipe...</p>
          </div>
        </div>
      }
    >
      <RecipeContent />
    </Suspense>
  );
}
