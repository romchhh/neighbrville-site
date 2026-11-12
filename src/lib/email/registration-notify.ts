import {
  getSiteSettings,
  resolveRegistrationNotifyEmails,
} from "@/lib/admin/settings";
import { sendResendEmail } from "@/lib/email/resend-client";
import type { JoinRole } from "@/lib/join";
import type { RegistrationProfile } from "@/lib/join-registration-types";
import { absoluteUrl, siteConfig } from "@/lib/site";

const CHOCOLATE = "#2f1b0e";
const CREAM = "#f7d5ac";
const IVORY = "#fbf6ec";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function roleLabel(role: JoinRole) {
  return role === "partner" ? "Founding Partner" : "Founding Neighbr";
}

function formatList(items: string[]) {
  return items.length ? items.join(", ") : "—";
}

export type RegistrationNotifyPayload = {
  name: string;
  email: string;
  role: JoinRole;
  profile: RegistrationProfile;
  createdAt?: string;
  isTest?: boolean;
};

export function buildRegistrationNotifyHtml(payload: RegistrationNotifyPayload) {
  const adminUrl = absoluteUrl("/admin/registrations");
  const when = payload.createdAt
    ? new Date(payload.createdAt).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "just now";
  const title = payload.isTest
    ? "Test: new registration alert"
    : "New waitlist registration";

  const rows: Array<[string, string]> = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Role", roleLabel(payload.role)],
    ["City / area", payload.profile.location || "—"],
    ["Address", payload.profile.address || "—"],
    ["Interests", formatList(payload.profile.interests)],
    ["Languages", formatList(payload.profile.languages)],
    ["Categories", formatList(payload.profile.categories)],
    ["Socials", payload.profile.socials || "—"],
    ["About", payload.profile.about || "—"],
    ["Signed up", when],
  ];

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(47,27,14,0.12);font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${CHOCOLATE};opacity:0.7;width:34%;vertical-align:top;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(47,27,14,0.12);font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.45;color:${CHOCOLATE};vertical-align:top;white-space:pre-wrap;">
            ${escapeHtml(value)}
          </td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${CHOCOLATE};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${CHOCOLATE};">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${CREAM};">
              ${escapeHtml(siteConfig.name)} · internal alert
            </td>
          </tr>
          <tr>
            <td style="background-color:${CREAM};color:${CHOCOLATE};padding:28px 28px 8px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:400;letter-spacing:-0.03em;line-height:1.05;text-transform:uppercase;color:${CHOCOLATE};">
                ${escapeHtml(title)}
              </h1>
              <p style="margin:12px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:${CHOCOLATE};">
                ${
                  payload.isTest
                    ? "This is a test message from Admin → Settings. Real signups will look the same."
                    : `${escapeHtml(payload.name)} just finished the waitlist form.`
                }
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${CREAM};padding:8px 28px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${detailRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:${IVORY};padding:24px 28px;">
              <a href="${adminUrl}" style="display:inline-block;background-color:${CHOCOLATE};color:${CREAM};font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 20px;">
                Open registrations
              </a>
              <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.4;color:${CHOCOLATE};opacity:0.7;">
                Recipients are managed in Admin → Settings → Notifications.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildRegistrationNotifyText(payload: RegistrationNotifyPayload) {
  const adminUrl = absoluteUrl("/admin/registrations");
  const title = payload.isTest
    ? "Test: new registration alert"
    : "New waitlist registration";

  return [
    title,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Role: ${roleLabel(payload.role)}`,
    `City / area: ${payload.profile.location || "—"}`,
    `Address: ${payload.profile.address || "—"}`,
    `Interests: ${formatList(payload.profile.interests)}`,
    `Languages: ${formatList(payload.profile.languages)}`,
    `Categories: ${formatList(payload.profile.categories)}`,
    `Socials: ${payload.profile.socials || "—"}`,
    `About: ${payload.profile.about || "—"}`,
    "",
    `Admin: ${adminUrl}`,
  ].join("\n");
}

export async function sendRegistrationNotifyEmail(
  payload: RegistrationNotifyPayload,
  recipientsOverride?: string[],
) {
  const settings = getSiteSettings();
  const recipients = (
    recipientsOverride ?? resolveRegistrationNotifyEmails()
  )
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (recipients.length === 0) {
    return { ok: false as const, reason: "no_recipients" as const };
  }

  const subject = payload.isTest
    ? `[Test] New registration — ${payload.name}`
    : `New registration — ${payload.name} (${roleLabel(payload.role)})`;

  const contactEmail = settings.email || siteConfig.email;
  // Keep Reply-To on a verified inbox — registrant address is already in the body.
  // One bad Reply-To / shared To-batch previously bounced the whole alert.
  const replyTo = contactEmail;
  const html = buildRegistrationNotifyHtml(payload);
  const text = buildRegistrationNotifyText(payload);

  // Send separately so one invalid recipient cannot bounce the whole list.
  const delivered: string[] = [];
  const failed: Array<{ email: string; error: unknown }> = [];
  let missingKey = false;

  const results = await Promise.all(
    recipients.map(async (email) => {
      const result = await sendResendEmail({
        to: email,
        subject,
        html,
        text,
        replyTo,
      });
      return { email, result };
    }),
  );

  for (const { email, result } of results) {
    if (result.ok) {
      delivered.push(email);
      continue;
    }
    if (result.reason === "missing_api_key") {
      missingKey = true;
      break;
    }
    failed.push({ email, error: result.error });
    console.error("[registration-notify]", email, result.error);
  }

  if (missingKey) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[registration-notify] RESEND_API_KEY missing. Would notify:",
        recipients.join(", "),
        payload.email,
      );
    }
    return { ok: false as const, reason: "missing_api_key" as const };
  }

  if (delivered.length === 0) {
    return {
      ok: false as const,
      reason: "send_failed" as const,
      recipients: delivered,
      failed,
    };
  }

  if (failed.length > 0) {
    console.error(
      "[registration-notify] partial failure",
      failed.map((item) => item.email).join(", "),
    );
  }

  return {
    ok: true as const,
    recipients: delivered,
    failed,
  };
}
