import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/join/edit/", "/join/edit"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/privacy", "/llms.txt"],
        disallow: ["/admin", "/api/", "/join/edit/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/privacy", "/llms.txt"],
        disallow: ["/admin", "/api/", "/join/edit/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
