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
        "/book/",
        "/booking-confirmation/",
        "/booking-status",
        "/_next/",
        "/admin/",
      ],
    },
    sitemap: "https://travlabhi.com/sitemap.xml",
  };
}
