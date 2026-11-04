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
        absoluteUrl("/images/sections/be-here.webp"),
        absoluteUrl("/images/sections/village-park.png"),
        absoluteUrl("/images/experiences/pottery.webp"),
        absoluteUrl("/images/experiences/pasta-night.webp"),
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
