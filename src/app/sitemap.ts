import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        absoluteUrl("/opengraph-image"),
        absoluteUrl("/images/sections/be-here.png"),
        absoluteUrl("/images/sections/park-community.png"),
        absoluteUrl("/images/experiences/pottery.png"),
        absoluteUrl("/images/experiences/pasta-night.png"),
      ],
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
