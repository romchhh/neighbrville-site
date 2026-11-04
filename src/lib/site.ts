import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_TITLE,
} from "@/lib/seo-content";

export const siteConfig = {
  name: "NeighbrVille",
  shortName: "NeighbrVille",
  description: DEFAULT_META_DESCRIPTION,
  defaultTitle: DEFAULT_META_TITLE,
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://neighbrville.com").replace(
    /\/$/,
    "",
  ),
  locale: "en_US",
  email: "info@neighbrville.com",
  launch: "Early 2027",
  cities: ["London", "Berlin"] as const,
  ogImage: "/opengraph-image",
  keywords: [
    "NeighbrVille",
    "local community",
    "neighborhood experiences",
    "community events London",
    "community events Berlin",
    "meet neighbors",
    "local activities",
    "host experiences",
    "community platform",
    "neighborhood clubs",
    "pottery workshop",
    "repair cafe",
  ],
  socials: {
    instagram: "https://www.instagram.com/neighbrville/",
    facebook: "https://www.facebook.com/neighbrville",
    tiktok: "https://www.tiktok.com/@neighbrville",
    linkedin: "https://www.linkedin.com/company/neighbrville",
  },
} as const;

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
