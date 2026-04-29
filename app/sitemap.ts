import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ezlabtesting.com";

  const routes = [
    "",
    "/how-it-works",
    "/find-lab-center",
    "/faqs",
    "/help-center",
    "/lab-partner",
    "/privacy-policy",
    "/terms-of-service",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // You can also fetch dynamic routes here (e.g., specific tests or panels)
  // and append them to the routes array.

  return routes;
}
