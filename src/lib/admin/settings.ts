import { getDb } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export type SiteSettings = {
  brandName: string;
  domain: string;
  email: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTiktok: string;
  socialLinkedin: string;
  twitterHandle: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  gtmId: string;
  gaId: string;
  googleAdsId: string;
  resendApiKey: string;
  resendFrom: string;
  joinCountBase: number;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: siteConfig.name,
  domain: siteConfig.url.replace(/^https?:\/\//, ""),
  email: siteConfig.email,
  metaTitle: siteConfig.defaultTitle,
  metaDescription: siteConfig.description,
  ogImage: siteConfig.ogImage,
  socialInstagram: siteConfig.socials.instagram,
  socialFacebook: siteConfig.socials.facebook,
  socialTiktok: siteConfig.socials.tiktok,
  socialLinkedin: siteConfig.socials.linkedin,
  twitterHandle: "",
  googleSiteVerification: "",
  bingSiteVerification: "",
  gtmId: "",
  gaId: "",
  googleAdsId: "",
  resendApiKey: "",
  resendFrom: "",
  joinCountBase: 0,
};

function mergeSettings(raw: Partial<SiteSettings> | null): SiteSettings {
  const merged = {
    ...DEFAULT_SETTINGS,
    ...(raw ?? {}),
  };

  return {
    brandName: String(merged.brandName ?? DEFAULT_SETTINGS.brandName),
    domain: String(merged.domain ?? DEFAULT_SETTINGS.domain),
    email: String(merged.email ?? DEFAULT_SETTINGS.email),
    metaTitle: String(merged.metaTitle ?? DEFAULT_SETTINGS.metaTitle),
    metaDescription: String(
      merged.metaDescription ?? DEFAULT_SETTINGS.metaDescription,
    ),
    ogImage: String(merged.ogImage ?? DEFAULT_SETTINGS.ogImage),
    socialInstagram: String(
      merged.socialInstagram ?? DEFAULT_SETTINGS.socialInstagram,
    ),
    socialFacebook: String(
      merged.socialFacebook ?? DEFAULT_SETTINGS.socialFacebook,
    ),
    socialTiktok: String(merged.socialTiktok ?? DEFAULT_SETTINGS.socialTiktok),
    socialLinkedin: String(
      merged.socialLinkedin ?? DEFAULT_SETTINGS.socialLinkedin,
    ),
    twitterHandle: String(merged.twitterHandle ?? DEFAULT_SETTINGS.twitterHandle),
    googleSiteVerification: String(
      merged.googleSiteVerification ?? DEFAULT_SETTINGS.googleSiteVerification,
    ),
    bingSiteVerification: String(
      merged.bingSiteVerification ?? DEFAULT_SETTINGS.bingSiteVerification,
    ),
    gtmId: String(merged.gtmId ?? DEFAULT_SETTINGS.gtmId),
    gaId: String(merged.gaId ?? DEFAULT_SETTINGS.gaId),
    googleAdsId: String(merged.googleAdsId ?? DEFAULT_SETTINGS.googleAdsId),
    resendApiKey: String(merged.resendApiKey ?? DEFAULT_SETTINGS.resendApiKey),
    resendFrom: String(merged.resendFrom ?? DEFAULT_SETTINGS.resendFrom),
    joinCountBase: Number(merged.joinCountBase ?? DEFAULT_SETTINGS.joinCountBase) || 0,
  };
}

export function getSiteSettings(): SiteSettings {
  const database = getDb();
  const row = database
    .prepare("SELECT data FROM site_settings WHERE id = 1")
    .get() as { data: string } | undefined;

  if (!row) return { ...DEFAULT_SETTINGS };

  try {
    return mergeSettings(JSON.parse(row.data) as Partial<SiteSettings>);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSiteSettings(next: SiteSettings): SiteSettings {
  const database = getDb();
  const cleaned = mergeSettings(next);
  database
    .prepare(
      `INSERT INTO site_settings (id, data) VALUES (1, ?)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data`,
    )
    .run(JSON.stringify(cleaned));
  return cleaned;
}

/** Prefer DB value, then env — for secrets used at runtime. */
export function resolveResendConfig() {
  const settings = getSiteSettings();
  return {
    apiKey: settings.resendApiKey || process.env.RESEND_API_KEY || "",
    from:
      settings.resendFrom ||
      process.env.RESEND_FROM ||
      `NeighbrVille <hello@${process.env.RESEND_DOMAIN ?? "resend.dev"}>`,
  };
}

export function publicSettingsMask(settings: SiteSettings) {
  return {
    ...settings,
    resendApiKey: settings.resendApiKey
      ? maskSecret(settings.resendApiKey)
      : "",
  };
}

function maskSecret(value: string) {
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export function applySecretUpdate(
  current: string,
  incoming: string | undefined,
): string {
  if (incoming === undefined) return current;
  const trimmed = incoming.trim();
  if (!trimmed) return "";
  if (trimmed.includes("••••")) return current;
  return trimmed;
}

export function getPublicSocialLinks(settings = getSiteSettings()) {
  return [
    settings.socialInstagram,
    settings.socialFacebook,
    settings.socialTiktok,
    settings.socialLinkedin,
  ].filter(Boolean);
}
