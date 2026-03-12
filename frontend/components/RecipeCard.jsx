import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { ChefHatIcon, ClockIcon, UsersIcon } from "lucide-react";
import { Button } from "./ui/button";

const RecipeCard = ({ recipe, variant = "default" }) => {
  const getRecipeData = () => {
    // for mealdb recipes (category/cuisine pages)
    if (recipe.strMeal) {
      return {
        title: recipe.strMeal,
        image: recipe.strMealThumb,
        href: `/recipe?cook=${encodeURIComponent(recipe.strMeal)}`,
        showImage: true,
      };
    }
    // for ai generated pantry recipes
    if (recipe.matchPercentage) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        matchPercentage: recipe.matchPercentage,
        missingIngredients: recipe.missingIngredients || [],
        image: recipe.image, // image support
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl, // show if image exists
      };
    }

    // strapi recipes (for saved recipes, search results)
    if (recipe) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        image: recipe.imageUrl,
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl,
      };
    }

    return {};
  };
  const data = getRecipeData();


  if (variant === "grid") {
    return (
      <Link href={data.href}>
        <Card className="rounded-none overflow-hidden border-stone-200 hover:shadow-xl hover:translate-y-1 transition-all duration-300 cursor-pointer group pt-0">
          {data.showImage ? (
            <div className="relative aspect-square">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover"
                sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-xs font-medium">
                    Click to view recipe
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <CardHeader className="text-sm font-light text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            <CardTitle>{data.title}</CardTitle>
          </CardHeader>
        </Card>
      </Link>
    );
  }

  if (variant === "pantry") {
    return (
      <Card>
        <CardHeader>
          {/*country & category badges */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {data.cuisine && (
                  <Badge
                    variant="outline"
                    className="border-orange-200 capitalize text-orange-600"
                  >
                    {data.cuisine}
                  </Badge>
                )}
                {data.category && (
                  <Badge
                    variant="outline"
                    className="border-stone-200 capitalize text-stone -600"
                  >
                    {data.category}
                  </Badge>
                )}
              </div>
            </div>
            {/* match percentage badge */}
            {data.matchPercentage && (
              <div className="flex flex-col items-end gap-1">
                <Badge
                  variant="outline"
                  className={`${
                    data.matchPercentage >= 90
                      ? "bg-green-600"
                      : data.matchPercentage >= 75
                        ? "bg-orange-600"
                        : "bg-stone-600"
                  } text-white text-lg px-3 py-1`}
                >
                  {data.matchPercentage}%
                </Badge>
                <span className="text-xs text-stone-500">Match</span>
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-stone-900">
            {data.title}
          </CardTitle>
          {data.description && (
            <CardDescription className="text-stone-600 leading-relaxed mt-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          {(data.prepTime || data.cookTime || data.servings) && (
            <div className="flex gap-4 text-sm text-stone-500">
              {(data.prepTime || data.cookTime) && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>
                    {parseInt(data.prepTime || 0) +
                      parseInt(data.cookTime || 0)}{" "}
                    minutes
                  </span>
                </div>
              )}
              {data.servings && (
                <div className="flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>{data.servings} servings</span>
                </div>
              )}
            </div>
          )}
          {data.missingIngredients && data.missingIngredients.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-100 ">
              <h4 className="text-sm font-semibold text-orange-900 mb-2">
                You will need:
              </h4>
              {data.missingIngredients.map((ingredient, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-orange-200 bg-white text-orange-700 mr-0.5"
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href={data.href} className="w-full">
            <Button className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white gap-2">
              <ChefHatIcon className="h-4 w-4" />
              View Full Recipe
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (variant === "list") {
    return (
      <Link href={data.href} className="">
        <Card className="rounded-none border-stone-200 hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group overflow-hidden py-0 ">
          <div className="flex flex-col md:flex-row">
            {/* image if available */}
            {data.showImage && data.image ? (
              <div className="relative w-full md:w-48 aspect-video md:aspect-square shrink-0">
                <Image
                  className="object-cover group-hover:scale-105 transition-all duration-500 ease-in-out"
                  src={data.image}
                  alt={data.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>
            ) : (
              <div className="relative w-full md:w-48 aspect-video md:aspect-square shrink-0 bg-linear-to-br from-orange-400 to-amber-400 flex items-center justify-center">
                <ChefHatIcon className="h-12 w-12 text-white/30" />
              </div>
            )}
            {/* card content */}
            <div className="flex-1 py-5">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {data.cuisine && (
                    <Badge
                      variant="outline"
                      className="border-orange-200 capitalize text-orange-600"
                    >
                      {data.cuisine}
                    </Badge>
                  )}
                  {data.category && (
                    <Badge
                      variant="outline"
                      className="border-stone-200 capitalize text-stone-600"
                    >
                      {data.category}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                  {data.title}
                </CardTitle>
                {data.description && (
                  <CardDescription className="line-clamp-2">
                    {data.description}
                  </CardDescription>
                )}
              </CardHeader>
              {(data.prepTime || data.cookTime || data.servings) && (
                <CardContent>
                  <div className="flex gap-4 text-sm text-stone-500 pt-4 ">
                    {(data.prepTime || data.cookTime) && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>
                          {parseInt(data.prepTime || 0) +
                            parseInt(data.cookTime || 0)}{" "}
                          minutes
                        </span>
                      </div>
                    )}
                    {data.servings && (
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-4 w-4" />
                        <span>{data.servings} servings</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return <div></div>;
};

export default RecipeCard;
