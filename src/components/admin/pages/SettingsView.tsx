"use client";

import { useEffect, useState } from "react";

import { adminFetch } from "../adminApi";
import { Field } from "../AdminForm";
import { AdminCard, AdminPageHeader, PrimaryButton } from "../AdminUi";
import ui from "../AdminUi.module.css";
import type { SiteSettings } from "@/lib/admin/settings";
import { isValidEmail } from "@/lib/join";

const TABS = [
  "General",
  "SEO",
  "Tracking",
  "Integrations",
  "Notifications",
] as const;

function normalizeClientSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    registrationNotifyEmails: Array.isArray(settings.registrationNotifyEmails)
      ? settings.registrationNotifyEmails
      : [],
  };
}

export default function SettingsView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [hasResendKey, setHasResendKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [notifyDraft, setNotifyDraft] = useState("");
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [testingNotify, setTestingNotify] = useState(false);
  const [testNotifyMessage, setTestNotifyMessage] = useState<string | null>(
    null,
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    void adminFetch<{ settings: SiteSettings; hasResendKey?: boolean }>(
      "/api/admin/settings",
    ).then((data) => {
      setSettings(normalizeClientSettings(data.settings));
      setHasResendKey(Boolean(data.hasResendKey));
      setDirty(false);
    });
  }, []);

  async function save(nextSettings?: SiteSettings) {
    const payload = nextSettings
      ? normalizeClientSettings(nextSettings)
      : settings
        ? normalizeClientSettings(settings)
        : null;
    if (!payload) return null;
    setSaving(true);
    setSaveError(null);
    try {
      const data = await adminFetch<{
        settings: SiteSettings;
        hasResendKey?: boolean;
      }>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setSettings(normalizeClientSettings(data.settings));
      if (typeof data.hasResendKey === "boolean") {
        setHasResendKey(data.hasResendKey);
      } else {
        setHasResendKey(
          Boolean(data.settings.resendApiKey) || hasResendKey,
        );
      }
      setDirty(false);
      return normalizeClientSettings(data.settings);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save settings.";
      setSaveError(message);
      throw error;
    } finally {
      setSaving(false);
    }
  }

  function patchSettings(patch: Partial<SiteSettings>) {
    setSettings((current) =>
      current
        ? normalizeClientSettings({ ...current, ...patch })
        : current,
    );
    setDirty(true);
    setTestNotifyMessage(null);
    setSaveError(null);
  }

  async function persistNotifyEmails(nextEmails: string[]) {
    if (!settings) return;
    const next = normalizeClientSettings({
      ...settings,
      registrationNotifyEmails: nextEmails,
    });
    // Optimistic UI, then write through to SQLite via settings API.
    setSettings(next);
    setDirty(true);
    setNotifyError(null);
    setTestNotifyMessage(null);
    try {
      await save(next);
    } catch {
      // save() already recorded saveError; keep optimistic list so user can retry Save.
    }
  }

  function addNotifyEmail(raw?: string) {
    if (!settings) return;
    const value = (raw ?? notifyDraft).trim().toLowerCase();
    if (!value) return;
    if (!isValidEmail(value)) {
      setNotifyError("Enter a valid email address.");
      return;
    }
    const current = settings.registrationNotifyEmails ?? [];
    if (current.includes(value)) {
      setNotifyError("That email is already on the list.");
      return;
    }
    setNotifyDraft("");
    void persistNotifyEmails([...current, value]);
  }

  function removeNotifyEmail(email: string) {
    if (!settings) return;
    const current = settings.registrationNotifyEmails ?? [];
    void persistNotifyEmails(current.filter((item) => item !== email));
  }

  function includeContactEmail() {
    if (!settings) return;
    const contact = settings.email.trim().toLowerCase();
    if (!isValidEmail(contact)) {
      setNotifyError("Set a valid public contact email under General first.");
      return;
    }
    addNotifyEmail(contact);
  }

  async function sendTestNotify() {
    if (!settings) return;
    setTestingNotify(true);
    setTestNotifyMessage(null);
    setNotifyError(null);
    try {
      const savedSettings =
        (await save(
          normalizeClientSettings({
            ...settings,
            registrationNotifyEmails: settings.registrationNotifyEmails ?? [],
          }),
        )) ?? settings;
      const data = await adminFetch<{
        ok: boolean;
        recipients?: string[];
        failed?: string[];
        error?: string;
      }>("/api/admin/settings/test-registration-notify", {
        method: "POST",
        body: JSON.stringify({
          emails: savedSettings.registrationNotifyEmails ?? [],
        }),
      });
      if (!data.ok) {
        setTestNotifyMessage(data.error || "Could not send test email.");
        return;
      }
      const failed = data.failed?.length
        ? ` Failed: ${data.failed.join(", ")}.`
        : "";
      setTestNotifyMessage(
        `Saved & test sent to ${data.recipients?.join(", ") ?? "recipients"}.${failed}`,
      );
    } catch (error) {
      setTestNotifyMessage(
        error instanceof Error ? error.message : "Could not send test email.",
      );
    } finally {
      setTestingNotify(false);
    }
  }

  if (!settings) return <p className={ui.loading}>Loading settings…</p>;

  const notifyEmails = settings.registrationNotifyEmails ?? [];

  return (
    <div className={ui.stack}>
      <AdminPageHeader
        title="Site settings"
        description="Brand, SEO meta, Google tags, Resend and other keys used by the live site."
        action={
          <PrimaryButton
            disabled={saving || !settings}
            onClick={() => void save().catch(() => undefined)}
          >
            {saving ? "Saving…" : dirty ? "Save" : "Saved"}
          </PrimaryButton>
        }
      />

      {saveError ? <p className={ui.formError}>{saveError}</p> : null}

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
                    patchSettings({ brandName: e.target.value })
                  }
                />
              </Field>
              <Field label="Domain">
                <input
                  value={settings.domain}
                  onChange={(e) =>
                    patchSettings({ domain: e.target.value })
                  }
                />
              </Field>
              <Field label="Join count base (added to real signups)">
                <input
                  type="number"
                  min={0}
                  value={settings.joinCountBase}
                  onChange={(e) =>
                    patchSettings({ joinCountBase: Number(e.target.value) || 0,
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
                    patchSettings({ email: e.target.value.trim() })
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
                    patchSettings({ socialInstagram: e.target.value })
                  }
                />
              </Field>
              <Field label="Facebook">
                <input
                  value={settings.socialFacebook}
                  onChange={(e) =>
                    patchSettings({ socialFacebook: e.target.value })
                  }
                />
              </Field>
              <Field label="TikTok">
                <input
                  value={settings.socialTiktok}
                  onChange={(e) =>
                    patchSettings({ socialTiktok: e.target.value })
                  }
                />
              </Field>
              <Field label="LinkedIn">
                <input
                  value={settings.socialLinkedin}
                  onChange={(e) =>
                    patchSettings({ socialLinkedin: e.target.value })
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
                  patchSettings({ metaTitle: e.target.value })
                }
              />
            </Field>
            <Field label="Meta description">
              <textarea
                value={settings.metaDescription}
                onChange={(e) =>
                  patchSettings({ metaDescription: e.target.value })
                }
              />
            </Field>
            <Field label="OG image path (optional override)">
              <input
                value={settings.ogImage}
                onChange={(e) =>
                  patchSettings({ ogImage: e.target.value })
                }
                placeholder="/opengraph-image"
              />
            </Field>
            <Field label="Twitter / X handle">
              <input
                value={settings.twitterHandle}
                onChange={(e) =>
                  patchSettings({ twitterHandle: e.target.value })
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
                    patchSettings({ googleSiteVerification: e.target.value,
                    })
                  }
                  placeholder="content value from google-site-verification meta"
                />
              </Field>
              <Field label="Bing site verification token">
                <input
                  value={settings.bingSiteVerification}
                  onChange={(e) =>
                    patchSettings({ bingSiteVerification: e.target.value,
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
                  patchSettings({ gtmId: e.target.value })
                }
                placeholder="GTM-XXXXXXX"
              />
            </Field>
            <Field label="Google Analytics 4 ID (G-…)">
              <input
                value={settings.gaId}
                onChange={(e) =>
                  patchSettings({ gaId: e.target.value })
                }
                placeholder="G-XXXXXXXX"
              />
            </Field>
            <Field label="Google Ads ID (optional)">
              <input
                value={settings.googleAdsId}
                onChange={(e) =>
                  patchSettings({ googleAdsId: e.target.value })
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
                  patchSettings({ resendApiKey: e.target.value })
                }
                placeholder="re_… or leave masked"
                autoComplete="off"
              />
            </Field>
            <Field label="From address">
              <input
                value={settings.resendFrom}
                onChange={(e) =>
                  patchSettings({ resendFrom: e.target.value })
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

      {tab === "Notifications" ? (
        <AdminCard
          title="New registration alerts"
          subtitle="Who should get an email when someone finishes the waitlist form"
        >
          <p className={ui.statHint} style={{ marginBottom: 14 }}>
            Add the corporate inbox, owner email, and any ops aliases. Leave the
            list empty to disable alerts. Adding or removing an email saves to
            the database immediately.
            {" "}
            Resend:{" "}
            {hasResendKey
              ? "API key ready"
              : "API key missing — set it under Integrations or in .env"}
            .
            {saving ? " Saving…" : ""}
          </p>

          <div className={ui.emailChipList} aria-live="polite">
            {notifyEmails.length === 0 ? (
              <p className={ui.emptyInline}>No notification emails yet.</p>
            ) : (
              notifyEmails.map((email) => (
                <span key={email} className={ui.emailChip}>
                  {email}
                  <button
                    type="button"
                    className={ui.emailChipRemove}
                    aria-label={`Remove ${email}`}
                    onClick={() => removeNotifyEmail(email)}
                    disabled={saving}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <div className={ui.emailAddRow}>
            <input
              type="email"
              value={notifyDraft}
              onChange={(e) => {
                setNotifyDraft(e.target.value);
                setNotifyError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNotifyEmail();
                }
              }}
              placeholder="owner@example.com"
              autoComplete="off"
            />
            <button
              type="button"
              className={ui.ghostBtn}
              onClick={() => addNotifyEmail()}
              disabled={saving}
            >
              {saving ? "Saving…" : "Add"}
            </button>
          </div>

          {notifyError ? <p className={ui.formError}>{notifyError}</p> : null}

          <div className={ui.formActions} style={{ marginTop: 14 }}>
            <button
              type="button"
              className={ui.ghostBtn}
              onClick={includeContactEmail}
              disabled={saving}
            >
              Include contact email
            </button>
            <button
              type="button"
              className={ui.ghostBtn}
              disabled={testingNotify || saving || notifyEmails.length === 0}
              onClick={() => void sendTestNotify()}
            >
              {testingNotify ? "Sending test…" : "Send test email"}
            </button>
          </div>

          {testNotifyMessage ? (
            <p className={ui.statHint} style={{ marginTop: 12 }}>
              {testNotifyMessage}
            </p>
          ) : null}
        </AdminCard>
      ) : null}
    </div>
  );
}
