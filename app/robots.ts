import type { MetadataRoute } from "next";

const BASE_URL = "https://imovix-app.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The product itself isn't meant to show up in search results, only
        // the marketing landing page at "/".
        disallow: "/app",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
