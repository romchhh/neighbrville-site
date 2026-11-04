"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Reset window scroll on App Router navigations (unless a hash target is set). */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return;
    if (window.location.hash) return;

    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  }, [pathname]);

  return null;
}
