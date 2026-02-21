import { currentUser } from "@clerk/nextjs/server";
import { toast } from "sonner";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    console.log("No User found");
    return null;
  }

  if (!STRAPI_API_TOKEN) {
    console.log("No STRAPI_API_TOKEN found in env");
    toast.error(error.message);
    return null;
  }

  const subscriptionTier = "free"; // TODO: implement pricing logic here

  try {
    // Check if the user exists in Strapi
    const existingUserResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if (!existingUserResponse.ok) {
      const errorText = await existingUserResponse.text();
      console.error("Error checking user in Strapi:", errorText);
      return null;
    }

    const existingUserData = await existingUserResponse.json();

    if (existingUserData.length > 0) {
      const existingUser = existingUserData[0];

      if (existingUser.subscriptionTier !== subscriptionTier) {
        await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ subscriptionTier }),
        });
      }
      return {...existingUser, subscriptionTier};
    }
  } catch (error) {}
};
