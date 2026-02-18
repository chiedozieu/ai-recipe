import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { CookieIcon, RefrigeratorIcon } from "lucide-react";

const Header = () => {
  const user = null; // to do: get the user from clerk
  return (
    <header className="fixed top-0 w-full border-b border-stone-200 bg-stone-50/89 backdrop-blur-md z-50 supports-backdrop-filters:bg-stone-50/60">
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
            <UserButton />
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
