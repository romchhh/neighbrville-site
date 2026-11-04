"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { JoinMemberCount } from "@/components/JoinMemberCount";
import { JoinProfileForm } from "@/components/JoinProfileForm";
import {
  shareJoinInvite,
  scrollToJoinPanel,
  type JoinRole,
} from "@/lib/join";
import type { RegistrationProfile } from "@/lib/join-registration-types";

export type { JoinRole };

type ProfileCopy = {
  leftTitle: ReactNode;
  rightTitle: ReactNode;
  bannerAlign: "right" | "center";
  updateNote: string;
  invitePrompt: string;
  inviteCta: string;
  completeNote: string;
};

const profileCopy: Record<JoinRole, ProfileCopy> = {
  neighbr: {
    leftTitle: (
      <>
        Thank <span className="italic">you</span>
        <br />
        for <span className="italic">joining!</span>
      </>
    ),
    rightTitle: (
      <>
        <span className="whitespace-nowrap">Make NeighbrVille</span>
        <br />
        more <span className="italic">personal</span>
      </>
    ),
    bannerAlign: "center",
    updateNote: "We’ll keep you updated as NeighbrVille grows in your city",
    invitePrompt: "Know someone who would love this too?",
    inviteCta: "Invite a Neighbr",
    completeNote:
      "Your interests and location help us match you with the right people and experiences nearby.",
  },
  partner: {
    leftTitle: (
      <>
        Thank <span className="italic">you</span>
        <br />
        for <span className="italic">joining!</span>
      </>
    ),
    rightTitle: (
      <>
        Tell us what <span className="italic">you can</span>
        <br />
        bring to <span className="italic">the village</span>
      </>
    ),
    bannerAlign: "center",
    updateNote:
      "We’ll keep you updated as NeighbrVille grows in your city and share next steps for Founding Hosts",
    invitePrompt: "Share that you’re joined on your socials!",
    inviteCta: "Share NeighbrVille",
    completeNote:
      "Thanks for telling us what you can bring — we’ll reach out as we open Founding Host opportunities.",
  },
};

function ProfileShell({
  children,
  onBack,
  title,
  eyebrow,
  banner,
  bannerAlign,
  updateNote,
  invitePrompt,
  inviteCta,
  onInvite,
}: {
  children: ReactNode;
  onBack: () => void;
  title: ReactNode;
  eyebrow: string;
  banner: ReactNode;
  bannerAlign: "right" | "center";
  updateNote: string;
  invitePrompt: string;
  inviteCta: string;
  onInvite: () => void;
}) {
  return (
    <div className="join-profile-shell relative box-border flex w-full flex-col gap-5 max-lg:pt-[var(--join-mobile-panel-top)] lg:grid lg:min-h-[var(--join-panel-height)] lg:grid-cols-2 lg:items-start lg:gap-0 lg:pt-0">
      {/* Fixed panel height on desktop so invite copy doesn't shift when
          the form dropdowns open/close and grow the right column. */}
      <div className="page-x relative z-10 flex w-full flex-col bg-cream py-8 pb-8 pt-7 text-chocolate sm:pb-9 sm:pt-8 lg:h-[var(--join-panel-height)] lg:min-h-[var(--join-panel-height)] lg:px-14 lg:py-12">
        <button
          type="button"
          onClick={onBack}
          className="self-start font-inter text-[13px] text-chocolate transition-opacity hover:opacity-70"
        >
          ← Go back
        </button>

        <h3 className="mt-10 max-w-[12ch] font-playfair text-[clamp(2.2rem,9.5vw,3.75rem)] font-normal uppercase leading-[0.88] tracking-[-0.05em] lg:mt-12 lg:text-[clamp(2.4rem,calc(3.8*var(--dvw)),3.75rem)]">
          {title}
        </h3>

        <p className="mt-5 max-w-[36ch] font-inter text-[11px] font-medium uppercase leading-[1.4] tracking-[0.03em] text-chocolate sm:text-[12px]">
          {eyebrow}
        </p>

        <p
          className={`mt-8 bg-chocolate px-5 py-4 font-inter text-[13px] leading-[1.35] text-cream sm:px-6 sm:py-[1.15rem] sm:text-[14px] ${
            bannerAlign === "center" ? "text-center" : "text-right"
          }`}
        >
          {banner}
        </p>

        <div className="mt-10 flex flex-col gap-6 lg:mt-auto lg:pt-12">
          <p className="max-w-[30ch] font-inter text-[14px] leading-[1.35] text-chocolate">
            {updateNote}
          </p>
          <div>
            <p className="font-inter text-[14px] leading-[1.35] text-chocolate">
              {invitePrompt}
            </p>
            <button
              type="button"
              onClick={onInvite}
              className="mt-4 text-left font-playfair text-[clamp(1.55rem,5.5vw,2rem)] uppercase italic leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[8px] transition-opacity hover:opacity-80 lg:text-[clamp(1.65rem,calc(2.1*var(--dvw)),2.15rem)]"
            >
              {inviteCta}
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-col justify-start px-[var(--page-gutter-x)] pb-8 pt-2 lg:px-14 lg:pb-0 lg:pt-0">
        {children}
      </div>
    </div>
  );
}

type JoinProfileStepProps = {
  role: JoinRole;
  name: string;
  email: string;
  onBack: () => void;
};

export function JoinProfileStep({
  role,
  name,
  email,
  onBack,
}: JoinProfileStepProps) {
  const copy = profileCopy[role];
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState<number | undefined>(undefined);
  const [bumpSignal, setBumpSignal] = useState(0);
  const [emailSent, setEmailSent] = useState(true);

  const banner = (
    <JoinMemberCount
      role={role}
      liveCount={liveCount}
      bumpSignal={bumpSignal}
    />
  );

  useEffect(() => {
    if (!completed) return;
    scrollToJoinPanel(document.getElementById("join-profile-done"), {
      align: "nearest",
      behavior: "smooth",
    });
  }, [completed]);

  async function saveProfile(profile: RegistrationProfile) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/join/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          ...profile,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        count?: number;
        bumped?: boolean;
        emailSent?: boolean;
      };

      if (!response.ok || !data.ok) {
        setSubmitError(
          data.error ?? "Could not save your profile. Please try again.",
        );
        return;
      }

      if (typeof data.count === "number") {
        setLiveCount(data.count);
        if (data.bumped) {
          setBumpSignal((value) => value + 1);
        }
      }
      setEmailSent(data.emailSent !== false);
      setCompleted(true);
    } catch {
      setSubmitError("Could not save your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (completed) {
    return (
      <ProfileShell
        onBack={onBack}
        title={
          <>
            You’re <span className="italic">all set</span>
          </>
        }
        eyebrow={
          emailSent
            ? "Check your inbox — we sent a confirmation with a link to edit your details anytime"
            : "Thanks for completing your profile — we’ll be in touch soon"
        }
        banner={banner}
        bannerAlign={copy.bannerAlign}
        updateNote={copy.updateNote}
        invitePrompt={copy.invitePrompt}
        inviteCta={copy.inviteCta}
        onInvite={() => shareJoinInvite(role)}
      >
        <div
          id="join-profile-done"
          className="relative z-10 w-full bg-cream px-6 py-9 text-chocolate sm:px-8 sm:py-10 lg:px-10 lg:py-12"
        >
          <h3 className="max-w-[14ch] font-playfair text-[clamp(1.85rem,6.5vw,2.4rem)] font-normal uppercase leading-[0.92] tracking-[-0.045em]">
            Profile <span className="italic">complete</span>
          </h3>
          <p className="mt-5 max-w-[32ch] font-inter text-[14px] leading-[1.4] text-chocolate">
            {copy.completeNote}
          </p>
          <button
            type="button"
            onClick={() => setCompleted(false)}
            className="mt-10 text-left font-playfair text-[clamp(1.45rem,5.5vw,1.85rem)] uppercase italic leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[8px] transition-opacity hover:opacity-80"
          >
            Edit my profile
          </button>
          <p className="mt-4 max-w-[24ch] font-inter text-[12px] leading-[1.3] text-chocolate/70">
            {emailSent
              ? "Use the edit link in your email to update your details anytime"
              : "You can update your details anytime by email"}
          </p>
        </div>
      </ProfileShell>
    );
  }

  return (
    <ProfileShell
      onBack={onBack}
      title={copy.leftTitle}
      eyebrow={`Signed up as ${name.trim() || "you"} · ${email}`}
      banner={banner}
      bannerAlign={copy.bannerAlign}
      updateNote={copy.updateNote}
      invitePrompt={copy.invitePrompt}
      inviteCta={copy.inviteCta}
      onInvite={() => shareJoinInvite(role)}
    >
      <h3 className="mb-6 max-w-[18ch] font-playfair text-[clamp(1.9rem,7.5vw,2.85rem)] font-normal uppercase leading-[0.9] tracking-[-0.045em] text-cream lg:mb-7 lg:max-w-[17ch] lg:text-[clamp(2rem,calc(2.7*var(--dvw)),2.85rem)]">
        {copy.rightTitle}
      </h3>

      <JoinProfileForm
        role={role}
        submitting={submitting}
        error={submitError}
        onSubmit={saveProfile}
      />
    </ProfileShell>
  );
}
