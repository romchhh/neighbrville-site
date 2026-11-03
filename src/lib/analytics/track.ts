"use client";

import type { AnalyticsEventType } from "@/lib/analytics/events";

type TrackInput = {
  path?: string;
  referrer?: string;
  value?: string;
  meta?: Record<string, unknown>;
};

function currentPath() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname + window.location.search;
}

export function track(type: AnalyticsEventType, input: TrackInput = {}) {
  if (typeof window === "undefined") return;

  const body = {
    type,
    path: input.path || currentPath(),
    referrer:
      input.referrer ??
      (typeof document !== "undefined" ? document.referrer : ""),
    value: input.value,
    meta: input.meta,
  };

  try {
    const json = JSON.stringify(body);
    if (navigator.sendBeacon) {
      const blob = new Blob([json], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/event", blob);
      return;
    }
  } catch {
    // fall through
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}
