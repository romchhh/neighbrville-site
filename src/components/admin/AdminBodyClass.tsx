"use client";

import { useEffect } from "react";

/** Applies Filo-style admin body theme while /admin is mounted. */
export function AdminBodyClass() {
  useEffect(() => {
    document.body.classList.add("nv-admin");
    return () => {
      document.body.classList.remove("nv-admin");
    };
  }, []);

  return null;
}
