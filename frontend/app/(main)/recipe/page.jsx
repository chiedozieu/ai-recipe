"use client";

import {
  getOrGenerateRecipe,
  removeRecipeFromCollection,
  saveRecipeToCollection,
} from "@/actions/recipe.actions";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { AlertCircleIcon, Loader2Icon, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function RecipeContent() {
  const searchParams = useSearchParams();
  const recipeName = searchParams.get("cook");

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
            <Button className="bg-orange-600 hover:bg-orange-700 cursor-pointer">Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if(loadingRecipe === null || loadingRecipe) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <LoaderIcon className="text-orange-600 animate-spin size-16 mx-auto mb-6" />
          <p className="text-stone-600">Preparing your Recipe...</p>
          <p className="text-stone-600 font-light">
            Our AI Chef is crafting detail instructions for you{" "}
            <span className="font-bold text-orange-600">{recipeName}</span>
            ...
          </p>
    
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto max-w-4xl">{recipeName}</div>
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
