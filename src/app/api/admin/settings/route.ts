import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/session";
import {
  applySecretUpdate,
  getSiteSettings,
  publicSettingsMask,
  saveSiteSettings,
  type SiteSettings,
} from "@/lib/admin/settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = getSiteSettings();
  return NextResponse.json({
    settings: publicSettingsMask(settings),
    hasResendKey: Boolean(settings.resendApiKey || process.env.RESEND_API_KEY),
  });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json().catch(() => null)) as
    | Partial<SiteSettings>
    | null;
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const current = getSiteSettings();
  const next: SiteSettings = {
    ...current,
    ...body,
    brandName: String(body.brandName ?? current.brandName),
    domain: String(body.domain ?? current.domain),
    email: String(body.email ?? current.email),
    metaTitle: String(body.metaTitle ?? current.metaTitle),
    metaDescription: String(body.metaDescription ?? current.metaDescription),
    ogImage: String(body.ogImage ?? current.ogImage),
    socialInstagram: String(body.socialInstagram ?? current.socialInstagram),
    socialFacebook: String(body.socialFacebook ?? current.socialFacebook),
    socialTiktok: String(body.socialTiktok ?? current.socialTiktok),
    socialLinkedin: String(body.socialLinkedin ?? current.socialLinkedin),
    twitterHandle: String(body.twitterHandle ?? current.twitterHandle).trim(),
    googleSiteVerification: String(
      body.googleSiteVerification ?? current.googleSiteVerification,
    ).trim(),
    bingSiteVerification: String(
      body.bingSiteVerification ?? current.bingSiteVerification,
    ).trim(),
    gtmId: String(body.gtmId ?? current.gtmId).trim(),
    gaId: String(body.gaId ?? current.gaId).trim(),
    googleAdsId: String(body.googleAdsId ?? current.googleAdsId).trim(),
    resendFrom: String(body.resendFrom ?? current.resendFrom),
    joinCountBase: Number(body.joinCountBase ?? current.joinCountBase) || 0,
    resendApiKey: applySecretUpdate(current.resendApiKey, body.resendApiKey),
  };

  const saved = saveSiteSettings(next);
  return NextResponse.json({
    settings: publicSettingsMask(saved),
    ok: true,
  });
}
