import { getPublicSocialLinks, getSiteSettings } from "@/lib/admin/settings";
import { experienceCatalog } from "@/lib/seo-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function siteJsonLd() {
  const settings = getSiteSettings();
  const brand = settings.brandName || siteConfig.name;
  const description = settings.metaDescription || siteConfig.description;
  const email = settings.email || siteConfig.email;
  const sameAs = getPublicSocialLinks(settings);

  const organization = {
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: brand,
    legalName: brand,
    url: siteConfig.url,
    email,
    description,
    foundingDate: "2025",
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/logo.svg"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/opengraph-image"),
    sameAs,
    areaServed: siteConfig.cities.map((city) => ({
      "@type": "City",
      name: city,
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email,
        availableLanguage: ["English"],
      },
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteConfig.url,
    name: brand,
    description,
    inLanguage: "en-US",
    publisher: { "@id": absoluteUrl("/#organization") },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": absoluteUrl("/#webpage"),
    url: siteConfig.url,
    name: settings.metaTitle || siteConfig.defaultTitle,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#organization") },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl("/opengraph-image"),
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#about"],
    },
  };

  const experiences = {
    "@type": "ItemList",
    "@id": absoluteUrl("/#experiences-list"),
    name: "Featured NeighbrVille experiences",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: experienceCatalog.length,
    itemListElement: experienceCatalog.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.name,
        description: item.description,
        image: absoluteUrl(item.image),
        provider: { "@id": absoluteUrl("/#organization") },
        areaServed: {
          "@type": "City",
          name: item.location,
        },
        serviceType: "Local community experience",
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, webpage, experiences],
  };
}

export function faqJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/#faq"),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? { item: absoluteUrl(item.path) }
        : {}),
    })),
  };
}

export function privacyPageJsonLd() {
  const settings = getSiteSettings();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl("/privacy#webpage"),
    url: absoluteUrl("/privacy"),
    name: `Privacy Policy · ${settings.brandName || siteConfig.name}`,
    description: `Privacy Notice for ${settings.brandName || siteConfig.name} — how we collect, use, and protect your personal information.`,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-US",
  };
}
