"use client";

import {
  useId,
  useState,
  type FormEvent,
} from "react";

import {
  CATEGORIES,
  INTERESTS,
  LANGUAGES,
  type JoinRole,
} from "@/lib/join";
import type { RegistrationProfile } from "@/lib/join-registration-types";

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
            className="shrink-0 border border-chocolate px-2 py-1 font-inter text-[11px] uppercase tracking-[0.03em] text-chocolate transition-opacity hover:opacity-70"
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

export type JoinProfileFormProps = {
  role: JoinRole;
  initial?: RegistrationProfile;
  submitLabel?: string;
  submitting?: boolean;
  error?: string | null;
  onSubmit: (profile: RegistrationProfile) => void | Promise<void>;
};

export function JoinProfileForm({
  role,
  initial,
  submitLabel = "Complete my profile",
  submitting = false,
  error,
  onSubmit,
}: JoinProfileFormProps) {
  const locationId = useId();
  const socialId = useId();
  const aboutId = useId();

  const [openMenu, setOpenMenu] = useState<
    "interests" | "languages" | "categories" | null
  >(null);
  const [interests, setInterests] = useState<string[]>(
    initial?.interests ?? [],
  );
  const [languages, setLanguages] = useState<string[]>(
    initial?.languages ?? [],
  );
  const [categories, setCategories] = useState<string[]>(
    initial?.categories ?? [],
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [socials, setSocials] = useState(initial?.socials ?? "");
  const [about, setAbout] = useState(initial?.about ?? "");

  const interestsOpen = openMenu === "interests";
  const languagesOpen = openMenu === "languages";
  const categoriesOpen = openMenu === "categories";
  const isNeighbr = role === "neighbr";

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpenMenu(null);
    void onSubmit({
      interests,
      languages,
      categories,
      location,
      address,
      socials,
      about,
    });
  }

  return (
    <form
      id="join-profile-form"
      onSubmit={handleSubmit}
      className="join-step-enter relative z-10 flex w-full flex-col bg-cream px-6 py-8 text-chocolate sm:px-8 sm:py-9 lg:px-10 lg:py-11"
    >
      {isNeighbr ? (
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

      {error ? (
        <p className="mt-8 font-inter text-[13px] leading-[1.35] text-chocolate" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <button
          type="submit"
          disabled={submitting}
          className="whitespace-nowrap text-left font-playfair text-[clamp(1.5rem,6vw,1.95rem)] uppercase italic leading-none tracking-[-0.03em] underline decoration-[1px] underline-offset-[8px] transition-opacity hover:opacity-80 disabled:opacity-50 lg:text-[clamp(1.55rem,calc(2.2*var(--dvw)),2.15rem)]"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
        <p className="max-w-[18ch] font-inter text-[12px] leading-[1.3] text-chocolate/70 sm:text-right">
          You can update your details anytime by email
        </p>
      </div>
    </form>
  );
}
