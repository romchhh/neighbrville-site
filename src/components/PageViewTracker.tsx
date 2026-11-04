"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { track } from "@/lib/analytics/track";
import {
  COOKIE_CONSENT_EVENT,
  hasAnalyticsConsent,
  type CookieConsentState,
} from "@/lib/cookie-consent";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return;

    function send() {
      if (!hasAnalyticsConsent()) return;
      const search = searchParams?.toString();
      const path = search ? `${pathname}?${search}` : pathname;
      track("pageview", { path });
    }

    send();

    function onConsent(event: Event) {
      const detail = (event as CustomEvent<CookieConsentState>).detail;
      if (detail?.choice === "accepted") send();
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, [pathname, searchParams]);

  return null;
}
