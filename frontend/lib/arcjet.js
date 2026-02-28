import arcjet, { tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.NEXT_PUBLIC_ARCJET_KEY,
  rules: [],
});

// free tier pantry scans limited to 10 per month
export const freePantryScans = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 10,
    interval: "30d",
    capacity: 10,
  }),
);

// free tier meal recommendations limited to 5 per month

export const freeMealRecommendations = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 5,
    interval: "30d",
    capacity: 5,
  }),
);

// pro tier meal suggestions unlimited
// 1000 meal suggestions per day

export const proTierLimit = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 1000,
    interval: "1d",
    capacity: 1000,
  }),
);


