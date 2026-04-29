import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ezlabtesting.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/profile",
        "/profile/",
        "/transactions",
        "/transactions/",
        "/results",
        "/results/",
        "/api",
        "/api/",
        "/checkout",
        "/checkout/",
        "/auth",
        "/auth/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
