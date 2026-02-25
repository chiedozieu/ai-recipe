import PricingSection from "@/components/PricingSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES, HOW_IT_WORKS_STEPS, SITE_STATS } from "@/lib/data";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRightIcon,
  FlameIcon,
  StarIcon,
  TimerIcon,
  Users2Icon,
} from "lucide-react";
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
                          <Users2Icon className="h-3 w-3" />2 servings
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
      <section className="py-12 border-y-2 border-stone-900 bg-stone-900 ">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {SITE_STATS.map((stat, index) => (
            <div key={index} className="">
              <div className="text-4xl font-bold mb-1 text-stone-50">
                {stat.val}
              </div>
              <Badge
                variant="secondary"
                className="bg-transparent uppercase text-sm text-orange-500 tracking-wide font-medium border-none"
              >
                {stat.label}
              </Badge>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Your Smart Kitchen
            </h2>
            <p className="text-xl text-stone-600 font-light">
              Everything you need to master your meal prep.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-2 border-stone-200 bg-white hover:border-orange-600 hover:shadow-lg py-0 transition-all duration-300 group hover:cursor-pointer"
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="border-2 border-stone-200 bg-orange-50 p-3 group-hover:bg-orange-100 group-hover:border-orange-600 transition-colors duration-300">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs text-stone-600 bg-stone-100 uppercase tracking-wide border border-stone-200"
                      >
                        {feature.limit}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-lg text-stone-600 font-light">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-24 px-4 border-y-2 border-stone-200 bg-stone-900 text-stone-50 ">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl">Cook in 3 Easy Steps</h2>
          <div className="my-12">
            {HOW_IT_WORKS_STEPS.map((item, index) => {
              return (
                <div key={index} className="">
                  <div className="flex gap-6 items-start">
                    <Badge variant="outline" className="text-6xl font-bold text-orange-500 border-none bg-transparent p-0 h-auto">
                      {item.step}
                    </Badge>
                    <div className="">
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-lg text-stone-400 font-light">{item.desc}</p>
                    </div>
                  </div>
                  {index !== HOW_IT_WORKS_STEPS.length - 1 && <div className="h-0.5 bg-stone-700 my-8" />}
                </div>
                )
            })}
          </div>
        </div>
      </section>
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <PricingSection />
        </div>
      </section>
    </div>
  );
}
