"use client";

import { useLayoutEffect } from "react";

/** Turns off page snap so long standalone pages can scroll normally. */
export function DisableScrollSnap() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("no-snap");

    // Client navigations from the homepage footer keep the old scrollY;
    // pin to the top before paint so the new page doesn't open on its footer.
    if (!window.location.hash) {
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previous;
    }

    return () => {
      root.classList.remove("no-snap");
    };
  }, []);

  return null;
}
