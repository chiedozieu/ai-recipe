import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { aj } from "./lib/arcjet";

const isProtectedRoute = createRouteMatcher([
  "/recipe(.*)",
  "/recipes(.*)",
  "/pantry(.*)",
  "/dashboard(.*)",
]);


export default clerkMiddleware(async (auth, req) => {
  //arcjet protection
  const decision = await aj.protect(req)

   if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      return NextResponse.json(
        { error: "No bots allowed", reason: decision.reason },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "Request denied by security system", reason: decision.reason },
      { status: 403 },
    );
  }



  const { userId, redirectToSignIn } = await auth()
  if (!userId && isProtectedRoute(req)) {
    redirectToSignIn()
  }
  

  return NextResponse.next()
})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
