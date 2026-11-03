"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { track } from "@/lib/analytics/track";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return;
    const search = searchParams?.toString();
    const path = search ? `${pathname}?${search}` : pathname;
    track("pageview", { path });
  }, [pathname, searchParams]);

  return null;
}
