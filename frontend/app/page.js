import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { ArrowRightIcon, FlameIcon, StarIcon, TimerIcon, Users2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center md:flex-row gap-12 md:gap-20">
            <div className="flex-1 text-center md:text-left ">
              <Badge
                variant="outline"
                className="border-2 border-orange-600 text-orange-700 bg-orange-50 text-sm font-bold mb-6 tracking-wide"
              >
                <FlameIcon className="mr-2 h-5 w-5" color="red" />
                #1 AI Cooking Assistant
              </Badge>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-0.9 tracking-tight">
                Turn your
                <span className="text-orange-600"> leftovers </span>
                into <br />
                masterpieces.
              </h1>
              <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-lg mx-auto md:mx-0 font-light">
                Snap a photo of your fridge or pantry and let AI do the rest.
                Save money, reduce waste, and eat healthier.
              </p>

              <Link href="/dashboard">
                <Button
                  size="xl"
                  variant="primary"
                  className="px-8 py-6 text-lg group cursor-pointer"
                >
                  Start Cooking Free{" "}
                  <ArrowRightIcon className="ml-2 size-5 group-hover:translate-x-1 transition-all" />
                </Button>
              </Link>
            </div>
            <Card
              className={
                "relative aspect-square md:aspect-4/5 border-4 border-stone-900 bg-stone-200 overflow-hidden py-0"
              }
            >
              <Image
                src="/pasta-dish.png"
                alt="pasta-dish"
                height={500}
                width={500}
                className="object-cover w-full h-full"
              />
              <Card className="absolute bottom-8 right-8 left-8 bg-white/95 backdrop-blur-sm border-2 border-stone-900 py-0">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="">
                      <div className="flex gap-0.5">
                        <h3 className="font-bold text-lg">
                          Rustic Tomato Basil Pasta
                        </h3>
                         <Badge
                          variant="outline"
                          className="border-2 border-green-700 bg-green-50 text-green-700 font-bold "
                        >
                          98% MATCH
                        </Badge>
                      </div>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className="w-3 h-3 text-orange-500 fill-orange-500"
                          />
                        ))}
                       
                      </div>
                      
                      <div className="flex gap-2 mt-1 text-xs text-gray-400 font-bold items-center">
                        <div className="flex gap-0.5 items-center">
                          <TimerIcon className="h-3 w-3" />
                          25 min
                        </div>

                        <div className="flex gap-0.5 items-center">
                          <Users2Icon className="h-3 w-3" />
                          2 servings
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
