"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { JoinProfileForm } from "@/components/JoinProfileForm";
import { JoinMemberCount } from "@/components/JoinMemberCount";
import type { PublicRegistration } from "@/lib/join-registration-types";

type JoinEditClientProps = {
  token: string;
};

export function JoinEditClient({ token }: JoinEditClientProps) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [registration, setRegistration] = useState<PublicRegistration | null>(
    null,
  );
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const response = await fetch(`/api/join/edit/${encodeURIComponent(token)}`);
      if (response.status === 404) {
        setNotFound(true);
        setRegistration(null);
        return;
      }
      if (!response.ok) throw new Error("load_failed");
      const data = (await response.json()) as PublicRegistration;
      setRegistration(data);
    } catch {
      setError("Could not load your details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSave(profile: Parameters<typeof JoinProfileForm>[0]["initial"]) {
    if (!registration) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/join/edit/${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        },
      );
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not save changes.");
        return;
      }
      setSaved(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Could not save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const role = registration?.role ?? "neighbr";

  return (
    <main className="min-h-dvh overflow-x-clip bg-chocolate text-cream">
      <div className="pb-16 pt-[calc(var(--header-space)+1.5rem)] lg:pb-24 lg:pt-[calc(var(--header-space)+2.5rem)]">
        {loading ? (
          <p className="page-x py-12 font-inter text-[15px] text-cream/80">
            Loading your details…
          </p>
        ) : notFound ? (
          <div className="page-x max-w-xl py-12 text-cream">
            <h1 className="font-playfair text-[clamp(2rem,8vw,3rem)] uppercase leading-[0.9] tracking-[-0.04em]">
              Link not found
            </h1>
            <p className="mt-6 font-inter text-[15px] leading-[1.45] text-cream/85">
              This edit link may have expired or is invalid. Join the waitlist on
              our homepage or use the link from your confirmation email.
            </p>
            <Link
              href="/#join"
              className="mt-10 inline-block font-playfair text-[1.5rem] uppercase italic underline underline-offset-[6px]"
            >
              Join the waitlist
            </Link>
          </div>
        ) : saved && registration ? (
          <div className="join-profile-shell relative mx-auto grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 lg:gap-0">
            <div className="page-x flex flex-col bg-cream py-10 text-chocolate lg:px-14 lg:py-14">
              <h1 className="max-w-[12ch] font-playfair text-[clamp(2.2rem,9.5vw,3.75rem)] uppercase leading-[0.88] tracking-[-0.05em]">
                Changes <span className="italic">saved</span>
              </h1>
              <p className="mt-6 max-w-[36ch] font-inter text-[14px] leading-[1.4] text-chocolate">
                Your waitlist details for {registration.email} are updated. We’ll
                keep you posted as NeighbrVille grows.
              </p>
              <p className="mt-10 bg-chocolate px-5 py-4 text-center font-inter text-[13px] leading-[1.35] text-cream sm:text-[14px]">
                <JoinMemberCount role={role} />
              </p>
              <Link
                href="/"
                className="mt-12 font-playfair text-[clamp(1.45rem,5vw,1.85rem)] uppercase italic underline underline-offset-[8px]"
              >
                Back to the site
              </Link>
            </div>
            <div className="flex flex-col justify-center px-[var(--page-gutter-x)] py-10 lg:px-14">
              <button
                type="button"
                onClick={() => setSaved(false)}
                className="max-w-[560px] bg-cream px-8 py-10 text-left text-chocolate"
              >
                <span className="font-playfair text-[clamp(1.85rem,6vw,2.4rem)] uppercase leading-[0.92] tracking-[-0.045em]">
                  Edit again
                </span>
              </button>
            </div>
          </div>
        ) : registration ? (
          <div className="join-profile-shell relative mx-auto grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 lg:gap-0">
            <div className="page-x flex flex-col bg-cream py-10 text-chocolate lg:px-14 lg:py-14">
              <h1 className="max-w-[14ch] font-playfair text-[clamp(2.2rem,9.5vw,3.75rem)] uppercase leading-[0.88] tracking-[-0.05em]">
                Edit your <span className="italic">details</span>
              </h1>
              <p className="mt-6 max-w-[36ch] font-inter text-[14px] leading-[1.4] text-chocolate">
                Update what you shared when you joined — this link is private to{" "}
                <strong>{registration.email}</strong>.
              </p>
              <p className="mt-10 bg-chocolate px-5 py-4 text-center font-inter text-[13px] leading-[1.35] text-cream sm:text-[14px]">
                <JoinMemberCount role={role} />
              </p>
            </div>
            <div className="flex flex-col justify-center px-[var(--page-gutter-x)] pb-12 pt-4 lg:px-14 lg:pb-16">
              <p className="mb-4 font-inter text-[13px] text-cream/80">
                {registration.name} · {registration.email}
              </p>
              <JoinProfileForm
                role={role}
                initial={registration.profile}
                submitLabel="Save changes"
                submitting={submitting}
                error={error}
                onSubmit={onSave}
              />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
