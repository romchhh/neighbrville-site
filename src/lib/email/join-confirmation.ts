import { Resend } from "resend";

import { resolveResendConfig } from "@/lib/admin/settings";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { JoinRole } from "@/lib/join";

const CHOCOLATE = "#2f1b0e";
const CREAM = "#f7d5ac";
const IVORY = "#fbf6ec";

function getResend(apiKey: string) {
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function roleLabel(role: JoinRole) {
  return role === "neighbr" ? "Neighbr" : "Partner";
}

export function buildJoinConfirmationHtml(options: {
  name: string;
  role: JoinRole;
  editUrl: string;
}) {
  const logoUrl = absoluteUrl("/brand/logo.svg");
  const siteUrl = siteConfig.url;
  const { name, role, editUrl } = options;
  const firstName = name.split(/\s+/)[0] || name;
  const roleText = roleLabel(role);
  const cities = siteConfig.cities.join(" & ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>You're on the NeighbrVille waitlist</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${CHOCOLATE};color:${IVORY};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    Thank you for joining NeighbrVille — your ${roleText} waitlist spot is confirmed.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${CHOCOLATE};margin:0;padding:0;width:100%;">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:0 0 28px;">
              <a href="${siteUrl}" style="text-decoration:none;">
                <img src="${logoUrl}" alt="NeighbrVille" width="168" height="42" style="display:block;border:0;outline:none;height:auto;max-width:168px;" />
              </a>
            </td>
          </tr>

          <!-- Cream card -->
          <tr>
            <td style="background-color:${CREAM};color:${CHOCOLATE};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:36px 32px 12px;">
                    <p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${CHOCOLATE};">
                      Waitlist confirmed
                    </p>
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:40px;font-weight:400;line-height:0.92;letter-spacing:-0.04em;text-transform:uppercase;color:${CHOCOLATE};">
                      Thank <em style="font-style:italic;">you</em>,
                      <br />
                      ${escapeHtml(firstName)}
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 32px 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${CHOCOLATE};">
                      <tr>
                        <td style="padding:18px 20px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.4;color:${IVORY};">
                          You’re joining as a <strong style="font-weight:600;">${roleText}</strong> — helping build NeighbrVille in ${cities}.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 32px 8px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:${CHOCOLATE};">
                    Your waitlist spot is saved. We’ll keep you updated as NeighbrVille grows in your city and share next steps closer to launch.
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 32px 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:${CHOCOLATE};">
                    Need to change something? Your personal edit link stays tied to
                    <strong style="font-weight:600;">${escapeHtml(name)}</strong>
                    at this email.
                  </td>
                </tr>

                <!-- CTA — site-style italic underline -->
                <tr>
                  <td align="left" style="padding:0 32px 36px;">
                    <a href="${editUrl}" style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-style:italic;font-weight:400;line-height:1;letter-spacing:-0.03em;text-transform:uppercase;color:${CHOCOLATE};text-decoration:underline;text-underline-offset:8px;text-decoration-thickness:1px;">
                      Edit my details
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ivory footer band -->
          <tr>
            <td style="background-color:${IVORY};color:${CHOCOLATE};padding:28px 32px 32px;">
              <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-style:italic;letter-spacing:-0.03em;text-transform:uppercase;color:${CHOCOLATE};">
                Find your people
              </p>
              <p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.45;color:${CHOCOLATE};">
                ${siteConfig.name} · ${siteConfig.launch} in ${cities}
              </p>
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${CHOCOLATE};opacity:0.75;">
                Button not working?
              </p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.45;word-break:break-all;">
                <a href="${editUrl}" style="color:${CHOCOLATE};text-decoration:underline;">${escapeHtml(editUrl)}</a>
              </p>
              <p style="margin:22px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.4;color:${CHOCOLATE};opacity:0.7;">
                <a href="${siteUrl}" style="color:${CHOCOLATE};text-decoration:underline;">${siteUrl.replace(/^https?:\/\//, "")}</a>
                ·
                <a href="mailto:${siteConfig.email}" style="color:${CHOCOLATE};text-decoration:underline;">${siteConfig.email}</a>
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

function buildJoinConfirmationText(options: {
  name: string;
  role: JoinRole;
  editUrl: string;
}) {
  const firstName = options.name.split(/\s+/)[0] || options.name;
  return [
    `Thank you, ${firstName}!`,
    "",
    `Your ${roleLabel(options.role)} waitlist spot on NeighbrVille is saved.`,
    `We'll keep you updated as NeighbrVille grows in ${siteConfig.cities.join(" & ")}.`,
    "",
    `Edit your details anytime:`,
    options.editUrl,
    "",
    `${siteConfig.name} · ${siteConfig.launch}`,
    siteConfig.url,
  ].join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendJoinConfirmationEmail(options: {
  to: string;
  name: string;
  role: JoinRole;
  editToken: string;
}) {
  const { apiKey, from } = resolveResendConfig();
  const resend = getResend(apiKey);
  const editUrl = absoluteUrl(`/join/edit/${options.editToken}`);

  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.info("[join-email] RESEND_API_KEY missing. Edit URL:", editUrl);
    }
    return { ok: false as const, reason: "missing_api_key" as const };
  }

  const payload = {
    name: options.name,
    role: options.role,
    editUrl,
  };

  const { error } = await resend.emails.send({
    from,
    to: options.to,
    subject: "You're on the NeighbrVille waitlist",
    html: buildJoinConfirmationHtml(payload),
    text: buildJoinConfirmationText(payload),
  });

  if (error) {
    console.error("[join-email]", error);
    return { ok: false as const, reason: "send_failed" as const };
  }

  return { ok: true as const };
}
