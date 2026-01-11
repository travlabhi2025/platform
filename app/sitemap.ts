import { MetadataRoute } from "next";
import { getAllTripIds } from "@/lib/trip-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://travlabhi.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/trip-terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    // Get all trip IDs for dynamic pages
    const tripIds = await getAllTripIds();

    // Generate trip pages
    const tripPages: MetadataRoute.Sitemap = tripIds.map((tripId) => ({
      url: `${baseUrl}/trip/${tripId}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...tripPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages only if there's an error fetching trips
    return staticPages;
  }
}
