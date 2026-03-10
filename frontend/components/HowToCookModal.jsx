"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ChefHatIcon, CookingPotIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const HowToCookModal = () => {
  const router = useRouter();
  const [recipeName, setRecipeName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setRecipeName("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/recipe?cook=${encodeURIComponent(recipeName.trim())}`);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="hover:text-orange-600 transition-colors flex items-center gap-1.5 text-sm font-medium text-stone-600">
          <ChefHatIcon className="size-4" />
          How To Cook?
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-2 ">
            <CookingPotIcon className="size-8 text-orange-600" />
            How To Cook?
          </DialogTitle>
          <DialogDescription>
            Enter a recipe name and we will show you how to cook it
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="">
            <label
              htmlFor=""
              className="block text-sm font-medium text-stone-700 mb-2"
            >
              What do you want to cook?
            </label>
            <div className="relative">
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-stone-200 rounded-md text-sm shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                placeholder="e.g., Chocolate cake, Peperoni Pizza, Beef Shawarma"
                autoFocus
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-600 size-5" />
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-2  border border-orange-100">
            <h4 className="text-sm font-semibold text-orange-900 mb-2">
              Try these popular recipes
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Brunswick Stew",
                "Cheeseburger",
                "Virginia Peanut Soup",
                "Jollof Rice",
              ].map((exampleRecipe) => (
                <button
                  key={exampleRecipe}
                  onClick={() => setRecipeName(exampleRecipe)}
                  className="px-2 py-1 bg-white text-orange-700 border border-orange-200 rounded full text-xs hover:bg-orange-100 transition-colors"
                >
                  {exampleRecipe}
                </button>
              ))}
            </div>
          </div>

          <div className="">
              <Button
                variant="primary"
                type="submit"
                disabled={!recipeName.trim()}
                className={`${recipeName.trim() && "hover:cursor-pointer"} flex gap-2 w-full h-12 items-center justify-center`}
              >
                <CookingPotIcon className="size-4" />
                <p className="text-lg">Cook</p>
              </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HowToCookModal;
