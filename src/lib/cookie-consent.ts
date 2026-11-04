export const COOKIE_CONSENT_KEY = "nv-cookie-consent";
export const COOKIE_CONSENT_EVENT = "nv-cookie-consent";

export type CookieConsentChoice = "accepted" | "rejected";

export type CookieConsentState = {
  version: 1;
  choice: CookieConsentChoice;
  decidedAt: string;
};

export function readCookieConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    if (parsed.version !== 1) return null;
    if (parsed.choice !== "accepted" && parsed.choice !== "rejected") {
      return null;
    }
    return {
      version: 1,
      choice: parsed.choice,
      decidedAt: parsed.decidedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  return readCookieConsent()?.choice === "accepted";
}

export function writeCookieConsent(choice: CookieConsentChoice) {
  const state: CookieConsentState = {
    version: 1,
    choice,
    decidedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(state));
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: state }),
  );
  return state;
}
