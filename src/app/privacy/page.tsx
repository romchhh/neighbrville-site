import { readFileSync } from "node:fs";
import path from "node:path";

import Link from "next/link";

import { DisableScrollSnap } from "@/components/DisableScrollSnap";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  JsonLd,
  breadcrumbJsonLd,
  privacyPageJsonLd,
} from "@/components/JsonLd";
import { PrivacyMarkdown } from "@/lib/privacy-markdown";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/privacy",
    title: "Privacy Policy",
    description: `Privacy Notice for ${siteConfig.name} — how we collect, use, and protect your personal information when you join the waitlist and use our site.`,
    keywords: [
      "NeighbrVille privacy policy",
      "data protection",
      "GDPR",
      "waitlist privacy",
    ],
  });
}

function loadPrivacyMarkdown() {
  return readFileSync(
    path.join(process.cwd(), "src/content/privacy-policy.md"),
    "utf8",
  );
}

export default function PrivacyPage() {
  const source = loadPrivacyMarkdown();

  return (
    <>
      <DisableScrollSnap />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <JsonLd data={privacyPageJsonLd()} />
      <Header />
      <main className="min-h-dvh overflow-x-clip bg-chocolate text-cream">
        <section className="page-shell page-x flex flex-col items-center pb-16 pt-[calc(var(--header-space)+2.5rem)] lg:pb-24 lg:pt-[calc(var(--header-space)+3.5rem)]">
          <div className="w-full max-w-[42rem]">
            <Link
              href="/"
              className="inline-block font-inter text-[12px] uppercase tracking-[0.14em] text-cream/65 transition-opacity hover:opacity-80"
            >
              ← Back to home
            </Link>

            <div className="mt-8 lg:mt-10">
              <PrivacyMarkdown source={source} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
