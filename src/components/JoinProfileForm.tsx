"use client";

import { useId, useState, type FormEvent } from "react";

import {
  CATEGORIES,
  INTERESTS,
  LANGUAGES,
  type JoinRole,
} from "@/lib/join";
import type { RegistrationProfile } from "@/lib/join-registration-types";

function ProfileTextField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  value,
  onChange,
  placeholder,
  hint,
  multiline = false,
  rows = 3,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const fieldClassName =
    "mt-2.5 w-full rounded-none border border-chocolate/25 bg-cream px-3.5 py-3 font-inter text-[15px] leading-[1.35] text-chocolate outline-none transition-colors placeholder:text-chocolate/40 focus:border-chocolate";

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-inter text-[13px] font-medium uppercase tracking-[0.04em] text-chocolate"
      >
        {label}
      </label>
      {hint ? (
        <p className="mt-1 font-inter text-[12px] leading-[1.35] text-chocolate/65">
          {hint}
        </p>
      ) : null}
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} resize-y min-h-[5.5rem]`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName}
        />
      )}
    </div>
  );
}

function ChipSelect({
  label,
  hint,
  options,
  selected,
  onChange,
}: {
  label: string;
  hint?: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggleOption(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  }

  return (
    <fieldset className="min-w-0">
      <legend className="font-inter text-[13px] font-medium uppercase tracking-[0.04em] text-chocolate">
        {label}
      </legend>
      {hint ? (
        <p className="mt-1 font-inter text-[12px] leading-[1.35] text-chocolate/65">
          {hint}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={checked}
              onClick={() => toggleOption(option)}
              className={`inline-flex items-center gap-1.5 border px-3 py-2 text-left font-inter text-[13px] leading-[1.25] transition-colors ${
                checked
                  ? "border-chocolate bg-chocolate text-cream"
                  : "border-chocolate/30 bg-transparent text-chocolate hover:border-chocolate hover:bg-chocolate/[0.04]"
              }`}
            >
              <span>{option}</span>
              {checked ? (
                <span aria-hidden className="text-[12px] leading-none">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-2.5 font-inter text-[12px] leading-[1.3] text-chocolate/60">
        {selected.length === 0
          ? "Select one or more"
          : `${selected.length} selected`}
      </p>
    </fieldset>
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

  const isNeighbr = role === "neighbr";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
          <ChipSelect
            label="Interests"
            hint="Pick the experiences you’d love to try nearby"
            options={INTERESTS}
            selected={interests}
            onChange={setInterests}
          />
          <ProfileTextField
            id={locationId}
            label="Location"
            name="location"
            autoComplete="address-level2"
            value={location}
            onChange={setLocation}
            placeholder="e.g. Neukölln, Berlin"
            hint="City and neighbourhoods where you’d join"
          />
          <ChipSelect
            label="Languages to practice"
            hint="Optional — helps match language meetups"
            options={LANGUAGES}
            selected={languages}
            onChange={setLanguages}
          />
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-9">
          <ProfileTextField
            id={locationId}
            label="Address or neighbourhood"
            name="address"
            autoComplete="street-address"
            value={address}
            onChange={setAddress}
            placeholder="e.g. Kreuzberg, Berlin"
            hint="Where you host or operate"
          />
          <ChipSelect
            label="Categories / tags"
            hint="What kinds of experiences you offer"
            options={CATEGORIES}
            selected={categories}
            onChange={setCategories}
          />
          <ProfileTextField
            id={socialId}
            label="Social media links"
            name="socials"
            type="url"
            autoComplete="url"
            value={socials}
            onChange={setSocials}
            placeholder="Instagram, website, Linktree…"
          />
          <ProfileTextField
            id={aboutId}
            label="Tell us about what you do"
            name="about"
            value={about}
            onChange={setAbout}
            multiline
            rows={4}
            placeholder="Short intro to your space, workshops, or community work"
            hint="A few sentences is enough"
          />
        </div>
      )}

      {error ? (
        <p
          className="mt-8 border border-chocolate/30 bg-chocolate/[0.04] px-4 py-3 font-inter text-[13px] leading-[1.4] text-chocolate"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-10 flex flex-col gap-4 border-t border-chocolate/20 pt-8 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <button
          type="submit"
          disabled={submitting}
          className="bg-chocolate px-5 py-3.5 text-left font-inter text-[14px] font-medium leading-none text-cream transition-opacity hover:opacity-90 disabled:opacity-50 sm:px-6"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
        <p className="max-w-[22ch] font-inter text-[12px] leading-[1.35] text-chocolate/65 sm:text-right">
          You can update your details anytime from the link in your email
        </p>
      </div>
    </form>
  );
}
