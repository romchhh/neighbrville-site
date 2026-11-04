import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native addon — keep out of the bundler so builds stay reliable.
  serverExternalPackages: ["better-sqlite3"],
  poweredByHeader: false,
  compress: true,
  // Faster installs / leaner client chunks for known packages.
  experimental: {
    optimizePackageImports: ["resend"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Display sizes on this site are modest (polaroids ~240–312px,
    // community thumbs ~120–280px). Keep the optimizer lean.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 160, 256, 320, 384, 640],
    // Source files are path-stable WebPs — keep optimized variants a year.
    minimumCacheTTL: 60 * 60 * 24 * 365,
    qualities: [65, 72, 75, 80],
  },
  async headers() {
    const yearImmutable = "public, max-age=31536000, immutable";
    const imageOptimized =
      "public, max-age=31536000, stale-while-revalidate=604800";

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/join/edit/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: yearImmutable },
          { key: "CDN-Cache-Control", value: yearImmutable },
          { key: "Vary", value: "Accept" },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: yearImmutable },
          { key: "CDN-Cache-Control", value: yearImmutable },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          { key: "Cache-Control", value: imageOptimized },
          { key: "CDN-Cache-Control", value: imageOptimized },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: yearImmutable }],
      },
      // Direct file hits (icons, OG fallbacks, etc.)
      {
        source: "/:path*.webp",
        headers: [{ key: "Cache-Control", value: yearImmutable }],
      },
      {
        source: "/:path*.avif",
        headers: [{ key: "Cache-Control", value: yearImmutable }],
      },
      {
        source: "/:path*.svg",
        headers: [{ key: "Cache-Control", value: yearImmutable }],
      },
      {
        source: "/:path*.png",
        headers: [{ key: "Cache-Control", value: yearImmutable }],
      },
      {
        source: "/:path*.jpg",
        headers: [{ key: "Cache-Control", value: yearImmutable }],
      },
      {
        source: "/:path*.jpeg",
        headers: [{ key: "Cache-Control", value: yearImmutable }],
      },
    ];
  },
};

export default nextConfig;
