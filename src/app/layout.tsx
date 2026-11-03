import type { Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";

import { JsonLd, siteJsonLd } from "@/components/JsonLd";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SiteTags, SiteTagsNoscript } from "@/components/SiteTags";
import { buildPageMetadata } from "@/lib/seo";

import "./globals.css";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
  display: "swap",
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2b1a12" },
    { media: "(prefers-color-scheme: dark)", color: "#2b1a12" },
  ],
  colorScheme: "dark",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata() {
  return buildPageMetadata({ path: "/" });
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <SiteTags />
        <SiteTagsNoscript />
        <JsonLd data={siteJsonLd()} />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
