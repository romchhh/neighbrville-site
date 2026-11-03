import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/admin/settings";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function truncateMeta(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sliced = clean.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function withBrandTitle(title: string, brand: string = siteConfig.name) {
  const trimmed = title.trim();
  if (!trimmed) return brand;
  if (trimmed.toLowerCase().includes(brand.toLowerCase())) return trimmed;
  return `${trimmed} · ${brand}`;
}

export type PageMetadataOptions = {
  path?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
};

export function buildPageMetadata(
  options: PageMetadataOptions = {},
): Metadata {
  const settings = getSiteSettings();
  const brand = settings.brandName || siteConfig.name;
  const path = options.path ?? "/";
  const canonical = absoluteUrl(path);
  const title =
    options.title ??
    (settings.metaTitle || siteConfig.defaultTitle);
  const description = truncateMeta(
    options.description ??
      (settings.metaDescription || siteConfig.description),
  );
  const imagePath = options.image || settings.ogImage || siteConfig.ogImage;
  const image = absoluteUrl(imagePath);
  const imageAlt =
    options.imageAlt ??
    `${brand} — local community experiences in ${siteConfig.cities.join(" & ")}`;

  const verification: Metadata["verification"] = {};
  if (settings.googleSiteVerification) {
    verification.google = settings.googleSiteVerification;
  }
  if (settings.bingSiteVerification) {
    verification.other = {
      "msvalidate.01": settings.bingSiteVerification,
    };
  }

  return {
    metadataBase: new URL(siteConfig.url),
    title: options.title
      ? { absolute: withBrandTitle(options.title, brand) }
      : {
          default: title,
          template: `%s · ${brand}`,
        },
    description,
    keywords: options.keywords ?? [...siteConfig.keywords],
    applicationName: brand,
    authors: [{ name: brand, url: siteConfig.url }],
    creator: brand,
    publisher: brand,
    category: "community",
    alternates: {
      canonical,
    },
    openGraph: {
      type: options.ogType ?? "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: brand,
      title: typeof title === "string" ? title : brand,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: typeof title === "string" ? title : brand,
      description,
      images: [image],
      creator: settings.twitterHandle || undefined,
      site: settings.twitterHandle || undefined,
    },
    robots: options.noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    verification:
      Object.keys(verification).length > 0 ? verification : undefined,
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/brand/favicon.svg",
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    },
  };
}
