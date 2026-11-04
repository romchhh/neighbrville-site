"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { scrollToJoinPanel, isValidEmail, type JoinRole, type JoinStep } from "@/lib/join";

import { JoinProfileStep } from "./JoinProfileStep";

/*
  Layout is built in "design pixels" taken from the mockups:
    mobile  → 240px wide mockup  (--u = column width / 240, column ≤ 480px)
    desktop → 1157px wide mockup (--u = section width / 1157)
  Every size below is calc(N * var(--u)), so the section keeps the exact
  proportions of the mockups at any width.
*/

const neighbrBenefits = [
  "Founding Member status",
  "Early access",
  "Lifetime Premium",
  "Exclusive perks & updates",
];

const partnerBenefits = [
  "Early Visibility",
  "Collaboration Opportunities",
  "Audience Insights",
  "Featured Launch Partner",
];

const NOTE: [string, string] = ["Free to join. No big", "commitment required"];

const formCopy: Record<JoinRole, { title: ReactNode; footer: [string, string] }> =
  {
    neighbr: {
      title: (
        <>
          <span className="block whitespace-nowrap">
            Become a <span className="italic">Founding</span>
          </span>
          <span className="block">Neighbr</span>
        </>
      ),
      footer: ["Come as you are", "Beginners welcome"],
    },
    partner: {
      title: (
        <>
          <span className="block whitespace-nowrap">
            Become a <span className="italic">Founding</span>
          </span>
          <span className="block whitespace-nowrap">Host or Partner</span>
        </>
      ),
      footer: ["Come as you are", "Beginners welcome"],
    },
  };

const cardTitle =
  "absolute left-[calc(12*var(--u))] top-[calc(18*var(--u))] whitespace-nowrap font-inter font-semibold uppercase leading-[1.3] tracking-[0.04em] text-[length:max(10px,calc(7.2*var(--u)))] lg:left-[calc(25*var(--u))] lg:top-[calc(24*var(--u))] lg:leading-[1.35] lg:text-[length:max(11px,calc(12.5*var(--u)))]";

const cardList =
  "absolute left-[calc(12*var(--u))] top-[calc(46*var(--u))] list-disc whitespace-nowrap pl-[calc(12*var(--u))] font-inter leading-[1.2] text-[length:max(10px,calc(7.2*var(--u)))] lg:left-[calc(25*var(--u))] lg:top-[calc(83*var(--u))] lg:pl-[calc(17*var(--u))] lg:leading-[1.15] lg:text-[length:max(11px,calc(10.5*var(--u)))]";

const cardDesc =
  "absolute left-[calc(12*var(--u))] top-[calc(91*var(--u))] whitespace-nowrap font-inter leading-[1.25] text-[length:max(10px,calc(7.2*var(--u)))] lg:left-[calc(25*var(--u))] lg:top-[calc(168*var(--u))] lg:leading-[1.15] lg:text-[length:max(11px,calc(10.5*var(--u)))]";

const cardButton =
  "absolute bottom-[calc(24*var(--u))] left-[calc(12*var(--u))] text-left font-playfair italic uppercase leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[5px] transition-opacity hover:opacity-80 text-[length:calc(16.5*var(--u))] lg:bottom-[calc(25*var(--u))] lg:left-[calc(25*var(--u))] lg:underline-offset-[6px] lg:text-[length:calc(21.5*var(--u))]";

function Field({
  id,
  label,
  name,
  type,
  autoComplete,
  value,
  onChange,
  onBlur,
  error,
}: {
  id: string;
  label: string;
  name: string;
  type: "text" | "email";
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <div
        className={`relative h-[calc(18*var(--u))] border-b transition-colors lg:h-[calc(26*var(--u))] ${
          error
            ? "border-chocolate"
            : "border-chocolate/40 focus-within:border-chocolate"
        }`}
      >
        <input
          id={id}
          name={name}
          type={type}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="peer absolute inset-0 h-full w-full border-0 bg-transparent p-0 font-inter text-[16px] text-chocolate outline-none"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-0 top-1/2 origin-left -translate-y-1/2 font-inter text-chocolate/70 transition-all duration-200 ease-out text-[length:max(10px,calc(6.5*var(--u)))] peer-focus:top-0 peer-focus:-translate-y-[125%] peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-[125%] peer-[:not(:placeholder-shown)]:scale-[0.85] lg:text-[length:max(11px,calc(10*var(--u)))]"
        >
          {label}
        </label>
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 font-inter text-[13px] leading-[1.3] text-chocolate"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function JoinSectionInner() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<JoinRole | null>(null);
  const [step, setStep] = useState<JoinStep>("waitlist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollTicketRef = useRef(0);
  const nameId = useId();
  const emailId = useId();
  const expanded = role !== null;
  const copy = role ? formCopy[role] : null;

  useEffect(() => {
    document.documentElement.classList.toggle("join-open", expanded);
    return () => {
      document.documentElement.classList.remove("join-open");
      document.documentElement.classList.remove("join-focus");
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const section = document.getElementById("join");
    if (!section) return;

    const onFocusIn = (event: FocusEvent) => {
      if (section.contains(event.target as Node)) {
        document.documentElement.classList.add("join-focus");
      }
    };

    const onFocusOut = () => {
      window.requestAnimationFrame(() => {
        if (!section.contains(document.activeElement)) {
          document.documentElement.classList.remove("join-focus");
        }
      });
    };

    section.addEventListener("focusin", onFocusIn);
    section.addEventListener("focusout", onFocusOut);
    return () => {
      section.removeEventListener("focusin", onFocusIn);
      section.removeEventListener("focusout", onFocusOut);
      document.documentElement.classList.remove("join-focus");
    };
  }, [expanded]);

  function scrollFormIntoView(behavior: ScrollBehavior) {
    const target =
      document.getElementById("join-waitlist-form") ?? panelRef.current;
    scrollToJoinPanel(target, {
      align: "form",
      behavior,
    });
  }

  function scheduleScrollToForm(openingFresh: boolean, switchingRole: boolean) {
    scrollTicketRef.current += 1;
    const ticket = scrollTicketRef.current;

    const scroll = (behavior: ScrollBehavior) => {
      if (ticket !== scrollTicketRef.current) return;
      scrollFormIntoView(behavior);
    };

    if (!openingFresh && !switchingRole) {
      window.setTimeout(() => scroll("smooth"), 100);
      window.setTimeout(() => scroll("auto"), 220);
      return;
    }

    let settled = false;
    const settle = () => {
      if (settled || ticket !== scrollTicketRef.current) return;
      settled = true;
      scroll("smooth");
      window.setTimeout(() => scroll("auto"), 150);
    };

    const expandPanel = document.querySelector<HTMLElement>(".join-panel-expand");
    expandPanel?.addEventListener("transitionend", settle, { once: true });
    window.setTimeout(settle, 720);
  }

  function openForm(next: JoinRole) {
    const openingFresh = role === null;
    const switchingRole = role !== null && role !== next;

    if (role !== next) {
      setEmailError(null);
    }
    setStep("waitlist");
    setRole(next);
    scheduleScrollToForm(openingFresh, switchingRole);
    void import("@/lib/analytics/track").then(({ track }) => {
      track("join_open", { value: next });
    });
  }

  // Deep-link: /?as=neighbr#join or /?as=partner#join
  useEffect(() => {
    const as = searchParams.get("as");
    if (as !== "neighbr" && as !== "partner") return;
    setRole(as);
    setStep("waitlist");
    scheduleScrollToForm(true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on ?as= deep link
  }, [searchParams]);

  function onWaitlistSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setEmailError(null);
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!role) return;

    setWaitlistSubmitting(true);
    setEmailError(null);

    void (async () => {
      try {
        const response = await fetch("/api/join/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            email,
            role,
          }),
        });
        const data = (await response.json()) as { error?: string };

        if (response.status === 409) {
          setEmailError(
            data.error ??
              "This email is already registered. Check your inbox for the edit link.",
          );
          return;
        }
        if (!response.ok) {
          setEmailError(
            data.error ?? "Could not join the waitlist. Please try again.",
          );
          return;
        }
        setStep("profile");
      } catch {
        setEmailError("Could not join the waitlist. Please try again.");
      } finally {
        setWaitlistSubmitting(false);
      }
    })();
  }

  return (
    <section
      id="join"
      className={`snap-block join-section relative z-20 w-full text-cream [--u:calc(min(100cqw,480px)/240)] [container-type:inline-size] lg:[--u:calc(100cqw/1157)] ${
        expanded ? "join-section--open overflow-hidden" : "overflow-hidden"
      }`}
    >
      {/*
        Background photo. It is sized to the fully opened section, so it never
        rescales while the form expands — the opening panel simply reveals
        more of the same picture.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(1018*var(--u))] min-h-full lg:h-[calc(1300*var(--u))]"
        aria-hidden
      >
        <Image
          src="/images/sections/be-here.webp"
          alt=""
          fill
          sizes="100vw"
          quality={75}
          loading="lazy"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/20" />
      </div>
      <span className="sr-only">Neighbors gathered around outdoor tables</span>

      <div className="relative z-10 mx-auto w-full max-w-[480px] lg:max-w-none">
        {/* ───────── First screen ───────── */}
        <div className="relative h-[calc(511*var(--u))] lg:h-[calc(650*var(--u))]">
          <h2 className="absolute left-[calc(14*var(--u))] top-[calc(38*var(--u))] whitespace-nowrap font-playfair font-normal uppercase leading-[0.92] tracking-[-0.045em] text-[length:calc(22*var(--u))] lg:left-[calc(32*var(--u))] lg:top-[calc(32*var(--u))] lg:leading-[0.9] lg:text-[length:var(--section-title)]">
            Be here <span className="italic">from</span>{" "}
            <br className="lg:hidden" />
            the <span className="italic">beginning</span>
          </h2>

          <p className="absolute left-[calc(14*var(--u))] top-[calc(87*var(--u))] whitespace-nowrap font-inter leading-[1.24] text-white text-[length:max(10px,calc(7.1*var(--u)))] lg:left-[calc(31*var(--u))] lg:top-[calc(97*var(--u))] lg:text-[length:max(11px,calc(9.5*var(--u)))]">
            Join early to get first access and
            <br />
            help us build the experiences your
            <br />
            neighborhood needs
          </p>

          <div className="absolute left-1/2 top-[calc(130*var(--u))] grid w-[calc(212*var(--u))] -translate-x-1/2 grid-cols-1 gap-[calc(10*var(--u))] lg:top-[calc(181*var(--u))] lg:w-[calc(702*var(--u))] lg:grid-cols-2 lg:gap-x-[calc(52*var(--u))] lg:gap-y-0">
            <article className="relative h-[calc(172*var(--u))] bg-chocolate text-cream lg:h-[calc(279*var(--u))]">
              <h3 className={cardTitle}>Benefits for Neighbrs</h3>
              <ul className={cardList}>
                {neighbrBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={cardDesc}>
                Want to discover new experiences,
                <span className="max-lg:hidden"> your</span>
                <br />
                <span className="lg:hidden">your </span>people, your neighborhood?
              </p>
              <button
                type="button"
                onClick={() => openForm("neighbr")}
                aria-expanded={role === "neighbr"}
                className={cardButton}
              >
                Become a Neighbr
              </button>
            </article>

            <article className="relative h-[calc(172*var(--u))] bg-cream text-chocolate lg:h-[calc(279*var(--u))]">
              <h3 className={cardTitle}>Benefits for Hosts and Partners</h3>
              <ul className={cardList}>
                {partnerBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={cardDesc}>
                Want to contribute events, spaces,
                <br />
                programs, resources, or ideas?
              </p>
              <button
                type="button"
                onClick={() => openForm("partner")}
                aria-expanded={role === "partner"}
                className={cardButton}
              >
                Become a Partner
              </button>
            </article>
          </div>

          <h2 className="absolute right-[calc(27*var(--u))] top-[calc(511*var(--u))] z-20 hidden whitespace-nowrap text-right font-playfair font-normal uppercase leading-[0.9] tracking-[-0.045em] text-[length:var(--section-title)] lg:block">
            Help <span className="italic">bring</span> NeighbrVille
            <br />
            to <span className="italic">your city</span>
          </h2>
        </div>

        {/* ───────── Expanding panel ───────── */}
        <div
          className={`join-panel-expand grid motion-reduce:transition-none ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              ref={panelRef}
              id="waitlist"
              className={
                step === "profile"
                  ? "join-expanded-panel join-panel-fluid relative z-10 w-full bg-transparent"
                  : "relative z-10 w-full"
              }
            >
              {copy && role && step === "profile" ? (
                <JoinProfileStep
                  key={role}
                  role={role}
                  name={name}
                  email={email.trim().toLowerCase()}
                  onBack={() => setStep("waitlist")}
                />
              ) : null}

              {copy && step === "waitlist" ? (
                <div className="join-step-enter grid min-h-dvh grid-cols-1 lg:min-h-[var(--screen)] lg:grid-cols-2 lg:items-stretch">
                  {/* Left — full-height cream like Value section */}
                  <div className="page-x relative flex min-h-[58svh] flex-col bg-cream py-8 text-chocolate lg:min-h-[var(--screen)] lg:px-14 lg:py-20">
                    <h3 className="relative z-10 shrink-0 font-playfair text-[clamp(1.85rem,8.4vw,2.55rem)] font-normal uppercase leading-[0.92] tracking-[-0.045em] lg:text-[length:var(--section-title)] lg:leading-[0.9]">
                      {copy.title}
                    </h3>

                    <div className="relative z-[1] flex min-h-0 flex-1 items-center justify-between gap-2 font-inter text-[clamp(0.5625rem,2.55vw,0.8125rem)] uppercase tracking-[0.02em] text-chocolate sm:tracking-[0.03em] lg:gap-3 lg:text-[13px] lg:tracking-[0.03em]">
                      <span className="shrink-0 whitespace-nowrap">
                        {copy.footer[0]}
                      </span>
                      <span className="shrink-0" aria-hidden>
                        ×
                      </span>
                      <span className="shrink-0 whitespace-nowrap">
                        {copy.footer[1]}
                      </span>
                    </div>

                    <p className="relative z-10 mt-auto shrink-0 font-inter text-[15px] leading-[1.35] text-chocolate lg:hidden">
                      {NOTE[0]}
                      <br />
                      {NOTE[1]}
                    </p>
                  </div>

                  {/* Right — form over photo, full height */}
                  <div className="relative flex min-h-[42svh] items-center justify-center px-[calc(14*var(--u))] py-[calc(28*var(--u))] lg:min-h-[var(--screen)] lg:px-14 lg:py-20">
                    <form
                      id="join-waitlist-form"
                      onSubmit={onWaitlistSubmit}
                      className="relative flex w-full max-w-[420px] scroll-mt-[calc(var(--header-space)+1rem)] flex-col bg-cream px-[calc(12*var(--u))] pb-[calc(22*var(--u))] pt-[calc(16*var(--u))] text-chocolate lg:max-w-none lg:scroll-mt-[calc(var(--header-space)+1.5rem)] lg:px-12 lg:pb-12 lg:pt-10"
                    >
                      <Field
                        id={nameId}
                        label="Your name*"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={setName}
                      />
                      <div className="mt-[calc(12*var(--u))] lg:mt-8">
                        <Field
                          id={emailId}
                          label="Email*"
                          name="email"
                          type="email"
                          autoComplete="email"
                        value={email}
                        onChange={(value) => {
                          setEmail(value);
                          if (emailError) setEmailError(null);
                        }}
                        onBlur={() => {
                          if (!email.trim()) {
                            setEmailError(null);
                            return;
                          }
                          if (!isValidEmail(email)) {
                            setEmailError("Please enter a valid email address.");
                          }
                        }}
                        error={emailError}
                      />
                      </div>

                      <div className="mt-[calc(25*var(--u))] flex items-center justify-between gap-4 lg:mt-12">
                        <button
                          type="submit"
                          disabled={waitlistSubmitting}
                          className="text-left font-playfair italic uppercase leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[5px] transition-opacity hover:opacity-80 disabled:opacity-50 text-[length:calc(15.5*var(--u))] lg:underline-offset-[6px] lg:text-[clamp(1.35rem,calc(2*var(--dvw)),1.75rem)]"
                        >
                          {waitlistSubmitting ? "Joining…" : "Join the waitlist"}
                        </button>
                        <p className="hidden text-right font-inter text-[13px] leading-[1.26] text-chocolate/70 lg:block lg:text-[14px]">
                          {NOTE[0]}
                          <br />
                          {NOTE[1]}
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JoinSection() {
  return (
    <Suspense
      fallback={
        <section
          id="join"
          className="join-section snap-block relative min-h-[var(--join-first-height)] bg-chocolate"
          aria-hidden
        />
      }
    >
      <JoinSectionInner />
    </Suspense>
  );
}