import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { CookieIcon, RefrigeratorIcon, SparklesIcon } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { checkUser } from "@/lib/checkUser";
import PricingModal from "./PricingModal";
import { Badge } from "./ui/badge";

const Header = async () => {
  const user = await checkUser();
  return (
    <header className="fixed top-0 w-full border-b border-stone-200  bg-stone-50/95 z-40 supports-backdrop-filters:bg-stone-50/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"}>
          <Image src="/orange-logo.png" alt="Logo" width={60} height={60} />
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600">
          <Link
            href="/recipe"
            className="text-stone-600 hover:text-orange-600 flex gap-1.5 items-center transition-colors duration-300"
          >
            <CookieIcon className="size-4" />
            My Recipes
          </Link>
          <Link
            href="/pantry"
            className="text-stone-600 hover:text-orange-600 flex gap-1.5 items-center transition-colors duration-300"
          >
            <RefrigeratorIcon className="size-4" />
            My Pantry
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* Show the user button when the user is signed in */}
          <SignedIn>
            {/* How To Cook */}
            {user && (
              <PricingModal subscription={user.subscription}>
                <Badge
                  variant="outline"
                  className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all ${user.subscriptionTier === "pro" ? "bg-linear-to-r from-orange-600 to-amber-500 text-white border-none shadow-sm hover:bg-linear-to-r hover:from-orange-700 hover:to-amber-600 cursor-pointer" : "bg-stone-200/50 border-stone-200/50 text-stone-600 cursor-pointer hover:bg-stone-300/50 hover:border-stone-300"} `}
                >
                  <SparklesIcon
                    className={`size-3 ${user.subscriptionTier === "pro" ? "text-white fill-white/20" : "text-stone-500"}`}
                  />
                  <span className="">
                    {user.subscriptionTier === "pro" ? "Pro Chef" : "Free Plan"}
                  </span>
                </Badge>
              </PricingModal>
            )}
            <UserDropdown />
          </SignedIn>

          {/* Show the sign in and sign up buttons when the user is not signed in */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                className="text-stone-600 hover:text-orange-600 font-medium cursor-pointer"
              >
                <h2 className="text-stone-600 hover:scale-125 transition-all duration-300">
                  Login
                </h2>
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                variant="primary"
                className="rounded-full cursor-pointer px-6 text-white"
              >
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
