import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/profile",
        "/create-trip/",
        "/edit-trip/",
        "/book/",
        "/booking-confirmation/",
        "/booking-status",
        "/unauthorized",
        "/_next/",
        "/admin/",
      ],
    },
    sitemap: "https://travlabhi.com/sitemap.xml",
  };
}
