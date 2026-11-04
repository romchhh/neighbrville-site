"use client";

import { useEffect, useState } from "react";

import type { JoinRole } from "@/lib/join";

type JoinMemberCountProps = {
  role: JoinRole;
  /** When set after a successful signup, drives the live count and +1 highlight. */
  liveCount?: number;
  bumpSignal?: number;
};

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

export function JoinMemberCount({
  role,
  liveCount,
  bumpSignal = 0,
}: JoinMemberCountProps) {
  const [count, setCount] = useState<number | null>(liveCount ?? null);
  const [bumping, setBumping] = useState(false);

  useEffect(() => {
    if (liveCount !== undefined) {
      setCount(liveCount);
      return;
    }
    let cancelled = false;
    void fetch("/api/join/count")
      .then((response) => response.json())
      .then((data: { count?: number }) => {
        if (!cancelled && typeof data.count === "number") {
          setCount(data.count);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [liveCount]);

  useEffect(() => {
    if (bumpSignal <= 0 || liveCount === undefined) return;
    setCount(liveCount);
    setBumping(true);
    const timer = window.setTimeout(() => setBumping(false), 1400);
    return () => window.clearTimeout(timer);
  }, [bumpSignal, liveCount]);

  const display = count === null ? "…" : formatCount(count);
  const countClassName = bumping
    ? "join-count-bump underline underline-offset-[3px]"
    : "underline underline-offset-[3px]";

  if (role === "partner") {
    return (
      <>
        You’re joining{" "}
        <span className={countClassName}>{display} future Neighbrs</span>, Hosts,
        <br />
        and Partners helping build a more connected local life
      </>
    );
  }

  return (
    <>
      You’re joining <span className={countClassName}>{display} people</span>
      <br />
      helping build NeighbrVille
    </>
  );
}
