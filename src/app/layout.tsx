import type { Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";

import { CookieConsent } from "@/components/CookieConsent";
import { JsonLd, siteJsonLd } from "@/components/JsonLd";
import { MediaCache } from "@/components/MediaCache";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteTags } from "@/components/SiteTags";
import { getSiteSettings } from "@/lib/admin/settings";
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
  const settings = getSiteSettings();

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <SiteTags
          gtmId={settings.gtmId}
          gaId={settings.gaId}
          adsId={settings.googleAdsId}
        />
        <JsonLd data={siteJsonLd()} />
        <Suspense fallback={null}>
          <ScrollToTop />
          <PageViewTracker />
        </Suspense>
        <MediaCache />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
