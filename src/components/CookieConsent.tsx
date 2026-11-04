"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) {
      setVisible(false);
      return;
    }
    setVisible(readCookieConsent() === null);
  }, [pathname]);

  function decide(choice: CookieConsentChoice) {
    writeCookieConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto flex w-full max-w-[34rem] flex-col gap-3 border border-chocolate/15 bg-cream px-4 py-3.5 text-chocolate shadow-[0_12px_40px_rgba(47,27,14,0.22)] sm:max-w-[38rem] sm:flex-row sm:items-end sm:gap-5 sm:px-5 sm:py-4">
        <div className="min-w-0 flex-1">
          <p className="font-playfair text-[1.15rem] font-normal italic leading-none tracking-[-0.02em] text-chocolate sm:text-[1.25rem]">
            Cookies
          </p>
          <p className="mt-2 font-inter text-[12.5px] leading-[1.45] text-chocolate/85 sm:text-[13px]">
            We use a few cookies to keep the site working and, if you allow it,
            to understand how NeighbrVille is used.{" "}
            <Link
              href="/privacy#cookies"
              className="underline decoration-chocolate/40 underline-offset-[3px] transition-opacity hover:opacity-70"
            >
              Privacy policy
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:pb-0.5">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="px-3 py-2 font-inter text-[12px] uppercase tracking-[0.06em] text-chocolate/75 transition-opacity hover:opacity-70"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="bg-chocolate px-3.5 py-2.5 font-inter text-[12px] font-medium uppercase tracking-[0.06em] text-cream transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
