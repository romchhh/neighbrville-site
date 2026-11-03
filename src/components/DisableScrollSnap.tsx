"use client";

import { useEffect } from "react";

/** Turns off page snap so long standalone pages can scroll normally. */
export function DisableScrollSnap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("no-snap");
    return () => {
      root.classList.remove("no-snap");
    };
  }, []);

  return null;
}
