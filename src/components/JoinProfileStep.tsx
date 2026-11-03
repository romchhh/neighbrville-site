"use client";

import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  CATEGORIES,
  INTERESTS,
  LANGUAGES,
  shareJoinInvite,
  scrollToJoinPanel,
  type JoinRole,
} from "@/lib/join";

export type { JoinRole };

type ProfileCopy = {
  leftTitle: ReactNode;
  rightTitle: ReactNode;
  banner: ReactNode;
  bannerAlign: "right" | "center";
  updateNote: string;
  invitePrompt: string;
  inviteCta: string;
  completeNote: string;
  fields: "neighbr" | "partner";
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
        Make NeighbrVille
        <br />
        more <span className="italic">personal</span>
      </>
    ),
    banner: (
      <>
        You’re joining{" "}
        <span className="underline underline-offset-[3px]">1170 people</span>{" "}
        helping build NeighbrVille
      </>
    ),
    bannerAlign: "right",
    updateNote: "We’ll keep you updated as NeighbrVille grows in your city",
    invitePrompt: "Know someone who would love this too?",
    inviteCta: "Invite a Neighbr",
    completeNote:
      "Your interests and location help us match you with the right people and experiences nearby.",
    fields: "neighbr",
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
    banner:
      "You’re joining 1170 future Neighbrs, Hosts, and Partners helping build a more connected local life",
    bannerAlign: "center",
    updateNote:
      "We’ll keep you updated as NeighbrVille grows in your city and share next steps for Founding Hosts",
    invitePrompt: "Share that you’re joined on your socials!",
    inviteCta: "Share NeighbrVille",
    completeNote:
      "Thanks for telling us what you can bring — we’ll reach out as we open Founding Host opportunities.",
    fields: "partner",
  },
};

type DropdownFieldProps = {
  menuId?: string;
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  open: boolean;
  onToggle: () => void;
  boxed?: boolean;
};

function ProfileTextField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  value,
  onChange,
  multiline = false,
  rows = 2,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const fieldClassName =
    "mt-2 w-full border-0 border-b border-chocolate/55 bg-transparent pb-2.5 font-inter text-[16px] text-chocolate outline-none transition-colors duration-200 focus:border-chocolate";

  return (
    <div>
      <label htmlFor={id} className="block font-inter text-[15px] font-medium text-chocolate">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName}
        />
      )}
    </div>
  );
}

function DropdownField({
  menuId,
  label,
  options,
  selected,
  onChange,
  open,
  onToggle,
  boxed = false,
}: DropdownFieldProps) {
  const listId = useId();
  const hasSelection = selected.length > 0;

  function toggleOption(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  }

  return (
    <div
      id={menuId}
      className={
        open && boxed
          ? "border border-chocolate px-4 py-3 transition-colors duration-200 sm:px-5"
          : "transition-opacity duration-200"
      }
    >
      <div
        className={`flex items-start justify-between gap-3 transition-colors duration-200 ${
          open
            ? "border-b border-chocolate pb-3"
            : "border-b border-chocolate pb-2.5"
        }`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={onToggle}
          className="min-w-0 flex-1 text-left font-inter text-[15px] text-chocolate"
        >
          <span className="block font-medium text-chocolate">{label}</span>
          {!open && hasSelection ? (
            <span className="mt-1 block text-[13px] leading-[1.35] text-chocolate">
              {selected.join(", ")}
            </span>
          ) : !open ? (
            <span className="mt-1 block text-[13px] text-chocolate/55">
              Tap to select
            </span>
          ) : null}
        </button>

        {open ? (
          <span
            aria-hidden
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-chocolate text-[14px] leading-none text-chocolate"
          >
            ▴
          </span>
        ) : hasSelection ? (
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 border border-chocolate px-2 py-1 font-inter text-[11px] uppercase tracking-[0.08em] text-chocolate transition-opacity hover:opacity-70"
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Open ${label}`}
            onClick={onToggle}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-chocolate text-[14px] leading-none text-chocolate transition-opacity hover:opacity-70"
          >
            ▾
          </button>
        )}
      </div>

      <div
        className={`join-dropdown-panel grid ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul
            id={listId}
            role="listbox"
            aria-multiselectable
            aria-hidden={!open}
            className={
              boxed
                ? "border-x border-b border-chocolate"
                : "border-x border-b border-chocolate bg-cream"
            }
          >
            {options.map((option) => {
              const checked = selected.includes(option);
              return (
                <li
                  key={option}
                  className="border-b border-chocolate/35 last:border-b-0"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={checked}
                    tabIndex={open ? 0 : -1}
                    onClick={() => toggleOption(option)}
                    className="flex w-full items-center justify-between gap-4 py-3.5 text-left font-inter text-[15px] leading-[1.25] text-chocolate transition-colors duration-150 hover:bg-chocolate/[0.04] active:bg-chocolate/[0.07]"
                  >
                    <span>{option}</span>
                    {checked ? (
                      <span
                        aria-hidden
                        className="shrink-0 text-[15px] leading-none"
                      >
                        ✓
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between gap-4 border-x border-b border-chocolate px-1 py-4">
            <p className="font-inter text-[12px] leading-[1.3] text-chocolate/75">
              {selected.length === 0
                ? "Select one or more"
                : `${selected.length} selected`}
            </p>
            <button
              type="button"
              onClick={onToggle}
              className="font-playfair text-[clamp(1.25rem,3.5vw,1.55rem)] uppercase italic leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[6px] transition-opacity hover:opacity-80"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="join-profile-shell relative box-border flex w-full flex-col gap-5 max-lg:pt-[var(--join-mobile-panel-top)] lg:grid lg:min-h-[var(--join-panel-height)] lg:grid-cols-2 lg:gap-0 lg:pt-0">
      <div className="page-x relative z-10 flex w-full flex-col bg-cream py-8 pb-8 pt-7 text-chocolate sm:pb-9 sm:pt-8 lg:px-14 lg:py-12">
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

        <p className="mt-5 max-w-[36ch] font-inter text-[11px] font-medium uppercase leading-[1.4] tracking-[0.08em] text-chocolate sm:text-[12px]">
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

      <div className="relative flex w-full flex-col justify-start px-[var(--page-gutter-x)] pb-8 pt-2 lg:justify-center lg:px-14 lg:pb-0 lg:pt-0">
        {children}
      </div>
    </div>
  );
}

type JoinProfileStepProps = {
  role: JoinRole;
  onBack: () => void;
};

export function JoinProfileStep({ role, onBack }: JoinProfileStepProps) {
  const copy = profileCopy[role];
  const locationId = useId();
  const socialId = useId();
  const aboutId = useId();

  const [completed, setCompleted] = useState(false);
  const [openMenu, setOpenMenu] = useState<
    "interests" | "languages" | "categories" | null
  >(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [socials, setSocials] = useState("");
  const [about, setAbout] = useState("");

  const interestsOpen = openMenu === "interests";
  const languagesOpen = openMenu === "languages";
  const categoriesOpen = openMenu === "categories";

  useEffect(() => {
    if (!completed) return;
    scrollToJoinPanel(document.getElementById("join-profile-done"), {
      align: "nearest",
      behavior: "smooth",
    });
  }, [completed]);

  function toggleMenu(menu: typeof openMenu) {
    setOpenMenu((current) => {
      const next = current === menu ? null : menu;
      if (next) {
        window.requestAnimationFrame(() => {
          document
            .getElementById(`join-menu-${next}`)
            ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
      }
      return next;
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpenMenu(null);
    setCompleted(true);
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
        eyebrow="Thanks for completing your profile — we’ll be in touch soon"
        banner={copy.banner}
        bannerAlign={copy.bannerAlign}
        updateNote={copy.updateNote}
        invitePrompt={copy.invitePrompt}
        inviteCta={copy.inviteCta}
        onInvite={() => shareJoinInvite(role)}
      >
        <div
          id="join-profile-done"
          className="relative z-10 w-full max-w-[560px] bg-cream px-6 py-9 text-chocolate sm:px-8 sm:py-10 lg:px-10 lg:py-12"
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
          <p className="mt-4 max-w-[20ch] font-inter text-[12px] leading-[1.3] text-chocolate/70">
            You can update your details anytime by email
          </p>
        </div>
      </ProfileShell>
    );
  }

  return (
    <ProfileShell
      onBack={onBack}
      title={copy.leftTitle}
      eyebrow="Confirm your email within 24h by clicking the button in your inbox"
      banner={copy.banner}
      bannerAlign={copy.bannerAlign}
      updateNote={copy.updateNote}
      invitePrompt={copy.invitePrompt}
      inviteCta={copy.inviteCta}
      onInvite={() => shareJoinInvite(role)}
    >
      <h3 className="mb-6 max-w-[16ch] font-playfair text-[clamp(1.9rem,7.5vw,2.85rem)] font-normal uppercase leading-[0.9] tracking-[-0.045em] text-cream lg:mb-7 lg:max-w-[15ch] lg:text-[clamp(2rem,calc(2.7*var(--dvw)),2.85rem)]">
        {copy.rightTitle}
      </h3>

      <form
        id="join-profile-form"
        onSubmit={onSubmit}
        className="join-step-enter relative z-10 flex w-full max-w-[560px] flex-col bg-cream px-6 py-8 text-chocolate sm:px-8 sm:py-9 lg:px-10 lg:py-11"
      >
        {copy.fields === "neighbr" ? (
          <div className="space-y-8 sm:space-y-9">
            <DropdownField
              menuId="join-menu-interests"
              label="Interests"
              options={INTERESTS}
              selected={interests}
              onChange={setInterests}
              open={interestsOpen}
              onToggle={() => toggleMenu("interests")}
            />
            <ProfileTextField
              id={locationId}
              label="Location (city and neighborhoods)"
              name="location"
              autoComplete="address-level2"
              value={location}
              onChange={setLocation}
            />
            <DropdownField
              menuId="join-menu-languages"
              label="Languages to practice"
              options={LANGUAGES}
              selected={languages}
              onChange={setLanguages}
              open={languagesOpen}
              onToggle={() => toggleMenu("languages")}
            />
          </div>
        ) : (
          <div className="space-y-7 sm:space-y-8">
            <ProfileTextField
              id={locationId}
              label="Address or neighbourhood"
              name="address"
              autoComplete="street-address"
              value={address}
              onChange={setAddress}
            />
            <DropdownField
              menuId="join-menu-categories"
              label="Choose your categories / tags"
              options={CATEGORIES}
              selected={categories}
              onChange={setCategories}
              open={categoriesOpen}
              boxed={categoriesOpen}
              onToggle={() => toggleMenu("categories")}
            />
            <ProfileTextField
              id={socialId}
              label="Social media links"
              name="socials"
              type="text"
              autoComplete="url"
              value={socials}
              onChange={setSocials}
            />
            <ProfileTextField
              id={aboutId}
              label="Tell us about what you do"
              name="about"
              value={about}
              onChange={setAbout}
              multiline
              rows={2}
            />
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <button
            type="submit"
            className="text-left font-playfair text-[clamp(1.5rem,6vw,1.95rem)] uppercase italic leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[8px] transition-opacity hover:opacity-80 lg:text-[clamp(1.55rem,calc(2.2*var(--dvw)),2.15rem)]"
          >
            Complete my profile
          </button>
          <p className="max-w-[18ch] font-inter text-[12px] leading-[1.3] text-chocolate/70 sm:text-right">
            You can update your details anytime by email
          </p>
        </div>
      </form>
    </ProfileShell>
  );
}
