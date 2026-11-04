"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Critical static assets to warm into the Cache API after first paint. */
const WARM_URLS = [
  "/brand/logo.svg",
  "/images/hero/polaroid-01.webp",
  "/images/hero/polaroid-02.webp",
  "/images/hero/polaroid-03.webp",
  "/images/hero/polaroid-04.webp",
  "/images/hero/polaroid-05.webp",
  "/images/sections/about-gathering-v2.png",
  "/images/sections/be-here.webp",
];

/**
 * Registers the media service worker (cache-first for /images, /brand, /_next/image)
 * and pre-warms hero assets so repeat visits serve from cache.
 */
export function MediaCache() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (pathname?.startsWith("/admin")) return;

    let cancelled = false;

    async function register() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        if (cancelled) return;

        const ready = await navigator.serviceWorker.ready;
        const worker = ready.active || registration.active;
        worker?.postMessage({ type: "WARM", urls: WARM_URLS });
      } catch {
        // SW optional — HTTP Cache-Control still applies.
      }
    }

    // Defer so LCP / first paint aren't competing with registration.
    const timer = window.setTimeout(() => void register(), 1000);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
