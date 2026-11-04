"use client";

import { useEffect, useState } from "react";

import { adminFetch } from "../adminApi";
import { Field } from "../AdminForm";
import { AdminCard, AdminPageHeader, PrimaryButton } from "../AdminUi";
import ui from "../AdminUi.module.css";
import type { SiteSettings } from "@/lib/admin/settings";

const TABS = ["General", "SEO", "Tracking", "Integrations"] as const;

export default function SettingsView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void adminFetch<{ settings: SiteSettings }>("/api/admin/settings").then(
      (data) => setSettings(data.settings),
    );
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      const data = await adminFetch<{ settings: SiteSettings }>(
        "/api/admin/settings",
        {
          method: "PUT",
          body: JSON.stringify(settings),
        },
      );
      setSettings(data.settings);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <p className={ui.loading}>Loading settings…</p>;

  return (
    <div className={ui.stack}>
      <AdminPageHeader
        title="Site settings"
        description="Brand, SEO meta, Google tags, Resend and other keys used by the live site."
        action={
          <PrimaryButton disabled={saving} onClick={() => void save()}>
            {saving ? "Saving…" : saved ? "Saved" : "Save"}
          </PrimaryButton>
        }
      />

      <div className={ui.filters}>
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            className={`${ui.filterChip} ${tab === item ? ui.filterChipActive : ""}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "General" ? (
        <>
          <AdminCard title="Brand">
            <div className={ui.formGrid}>
              <Field label="Brand name">
                <input
                  value={settings.brandName}
                  onChange={(e) =>
                    setSettings({ ...settings, brandName: e.target.value })
                  }
                />
              </Field>
              <Field label="Domain">
                <input
                  value={settings.domain}
                  onChange={(e) =>
                    setSettings({ ...settings, domain: e.target.value })
                  }
                />
              </Field>
              <Field label="Join count base (added to real signups)">
                <input
                  type="number"
                  min={0}
                  value={settings.joinCountBase}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      joinCountBase: Number(e.target.value) || 0,
                    })
                  }
                />
              </Field>
            </div>
          </AdminCard>

          <AdminCard title="Contact">
            <div className={ui.formGrid}>
              <Field label="Public contact email">
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value.trim() })
                  }
                  placeholder="info@neighbrville.com"
                  autoComplete="off"
                />
              </Field>
            </div>
            <p className={ui.statHint} style={{ marginTop: 12 }}>
              Shown in the footer, waitlist emails, privacy policy and structured
              data. After changing it, also update Resend “From address” under
              Integrations if you send from the same inbox.
            </p>
          </AdminCard>

          <AdminCard title="Social links">
            <div className={ui.formGrid}>
              <Field label="Instagram">
                <input
                  value={settings.socialInstagram}
                  onChange={(e) =>
                    setSettings({ ...settings, socialInstagram: e.target.value })
                  }
                />
              </Field>
              <Field label="Facebook">
                <input
                  value={settings.socialFacebook}
                  onChange={(e) =>
                    setSettings({ ...settings, socialFacebook: e.target.value })
                  }
                />
              </Field>
              <Field label="TikTok">
                <input
                  value={settings.socialTiktok}
                  onChange={(e) =>
                    setSettings({ ...settings, socialTiktok: e.target.value })
                  }
                />
              </Field>
              <Field label="LinkedIn">
                <input
                  value={settings.socialLinkedin}
                  onChange={(e) =>
                    setSettings({ ...settings, socialLinkedin: e.target.value })
                  }
                />
              </Field>
            </div>
          </AdminCard>
        </>
      ) : null}

      {tab === "SEO" ? (
        <>
          <AdminCard title="Default meta">
            <Field label="Meta title">
              <input
                value={settings.metaTitle}
                onChange={(e) =>
                  setSettings({ ...settings, metaTitle: e.target.value })
                }
              />
            </Field>
            <Field label="Meta description">
              <textarea
                value={settings.metaDescription}
                onChange={(e) =>
                  setSettings({ ...settings, metaDescription: e.target.value })
                }
              />
            </Field>
            <Field label="OG image path (optional override)">
              <input
                value={settings.ogImage}
                onChange={(e) =>
                  setSettings({ ...settings, ogImage: e.target.value })
                }
                placeholder="/opengraph-image"
              />
            </Field>
            <Field label="Twitter / X handle">
              <input
                value={settings.twitterHandle}
                onChange={(e) =>
                  setSettings({ ...settings, twitterHandle: e.target.value })
                }
                placeholder="@neighbrville"
              />
            </Field>
          </AdminCard>

          <AdminCard title="Search Console verification">
            <div className={ui.formGrid}>
              <Field label="Google site verification token">
                <input
                  value={settings.googleSiteVerification}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      googleSiteVerification: e.target.value,
                    })
                  }
                  placeholder="content value from google-site-verification meta"
                />
              </Field>
              <Field label="Bing site verification token">
                <input
                  value={settings.bingSiteVerification}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bingSiteVerification: e.target.value,
                    })
                  }
                  placeholder="msvalidate.01 content value"
                />
              </Field>
            </div>
          </AdminCard>
        </>
      ) : null}

      {tab === "Tracking" ? (
        <AdminCard title="Google tags">
          <div className={ui.formGrid}>
            <Field label="Google Tag Manager ID (GTM-…)">
              <input
                value={settings.gtmId}
                onChange={(e) =>
                  setSettings({ ...settings, gtmId: e.target.value })
                }
                placeholder="GTM-XXXXXXX"
              />
            </Field>
            <Field label="Google Analytics 4 ID (G-…)">
              <input
                value={settings.gaId}
                onChange={(e) =>
                  setSettings({ ...settings, gaId: e.target.value })
                }
                placeholder="G-XXXXXXXX"
              />
            </Field>
            <Field label="Google Ads ID (optional)">
              <input
                value={settings.googleAdsId}
                onChange={(e) =>
                  setSettings({ ...settings, googleAdsId: e.target.value })
                }
                placeholder="AW-XXXXXXXX"
              />
            </Field>
          </div>
          <p className={ui.statHint} style={{ marginTop: 12 }}>
            Tags are injected on the public site after you save. Leave blank to
            disable.
          </p>
        </AdminCard>
      ) : null}

      {tab === "Integrations" ? (
        <AdminCard title="Resend (transactional email)">
          <div className={ui.formGrid}>
            <Field label="Resend API key">
              <input
                value={settings.resendApiKey}
                onChange={(e) =>
                  setSettings({ ...settings, resendApiKey: e.target.value })
                }
                placeholder="re_… or leave masked"
                autoComplete="off"
              />
            </Field>
            <Field label="From address">
              <input
                value={settings.resendFrom}
                onChange={(e) =>
                  setSettings({ ...settings, resendFrom: e.target.value })
                }
                placeholder="NeighbrVille <info@neighbrville.com>"
              />
            </Field>
          </div>
          <p className={ui.statHint} style={{ marginTop: 12 }}>
            Falls back to RESEND_API_KEY / RESEND_FROM in .env if empty.
            Masked values are kept unchanged on save. Use the same inbox as
            Contact email when possible so replies stay consistent.
          </p>
        </AdminCard>
      ) : null}
    </div>
  );
}
