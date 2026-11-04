import { Resend } from "resend";

import { getSiteSettings, resolveResendConfig } from "@/lib/admin/settings";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { JoinRole } from "@/lib/join";

const CHOCOLATE = "#2f1b0e";
const CREAM = "#f7d5ac";
const IVORY = "#fbf6ec";

function getResend(apiKey: string) {
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function copyForRole(role: JoinRole) {
  if (role === "partner") {
    return {
      subject: "Welcome to the NeighbrVille community! 💛",
      preheader:
        "You're one of our Founding Community Partners — excited to build with you.",
      eyebrow: "Founding Community Partner",
      greeting: "Hey there, Partner!",
      headlineHtml: `Welcome to the<br /><em style="font-style:italic;">community</em>`,
      paragraphs: [
        "Welcome to NeighbrVille! We're excited to have you join us as one of our Founding Community Partners.",
        "We believe the best communities are built by the people and spaces that bring them together. That's where you come in!",
        "Whether you're hosting workshops, teaching new skills, sharing culture, or creating spaces for connection, we want to help more people discover what makes your community special.",
      ],
      nextTitle: "What's next?",
      nextBody:
        "We're preparing for our launch, and you'll be among the first to hear about partnership opportunities, platform updates, and next steps for bringing your experiences to NeighbrVille.",
      closing: [
        "We're excited to build something meaningful together, one neighborhood at a time.",
        "Here's to new faces, shared passions, and thriving local communities! 💙",
      ],
    };
  }

  return {
    subject: "You're officially a Founding Neighbr! 🏡",
    preheader:
      "Welcome to NeighbrVille — you're officially one of our Founding Neighbrs.",
    eyebrow: "Founding Neighbr",
    greeting: "Hey Neighbr!",
    headlineHtml: `You're officially a<br />Founding <em style="font-style:italic;">Neighbr</em>`,
    paragraphs: [
      "Welcome to NeighbrVille! You're officially one of our Founding Neighbrs, and we're so happy you're here.",
      "We're building a place where discovering new hobbies, exploring your city, and meeting your kind of people feels natural (and actually fun!).",
      "Think creative workshops, new languages, hidden local gems, and real connections. All right in your neighborhood.",
    ],
    nextTitle: "What's next?",
    nextBody:
      "We're getting things ready behind the scenes. As a Founding Neighbr, you'll be among the first to hear about our launch, discover local experiences, and get early access to NeighbrVille.",
    closing: [
      "In the meantime, stay curious. Your next favorite hobby (or favorite person) might be just around the corner. 💙",
    ],
  };
}

function paragraphRows(paragraphs: string[]) {
  return paragraphs
    .map(
      (text) => `
                <tr>
                  <td style="padding:0 32px 14px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:${CHOCOLATE};">
                    ${escapeHtml(text)}
                  </td>
                </tr>`,
    )
    .join("");
}

export function buildJoinConfirmationHtml(options: {
  name: string;
  role: JoinRole;
  editUrl: string;
  confirmUrl: string;
  contactEmail?: string;
}) {
  const logoUrl = absoluteUrl("/brand/logo.svg");
  const siteUrl = siteConfig.url;
  const { name, role, editUrl, confirmUrl } = options;
  const firstName = name.split(/\s+/)[0] || name;
  const copy = copyForRole(role);
  const contactEmail = options.contactEmail || siteConfig.email;
  const cities = siteConfig.cities.join(" & ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${escapeHtml(copy.subject)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${CHOCOLATE};color:${IVORY};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(copy.preheader)}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${CHOCOLATE};margin:0;padding:0;width:100%;">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;">

          <tr>
            <td align="center" style="padding:0 0 20px;">
              <a href="${siteUrl}" style="text-decoration:none;">
                <img src="${logoUrl}" alt="NeighbrVille" width="168" height="42" style="display:block;border:0;outline:none;height:auto;max-width:168px;" />
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 0 24px;">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${confirmUrl}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="0%" stroke="f" fillcolor="${CREAM}">
                <center style="color:${CHOCOLATE};font-family:Arial,sans-serif;font-size:15px;font-weight:700;">Confirm email</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-- -->
              <a href="${confirmUrl}" style="display:inline-block;background-color:${CREAM};color:${CHOCOLATE};font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;line-height:1;letter-spacing:0.02em;text-decoration:none;padding:16px 28px;border:0;">
                Confirm email
              </a>
              <!--<![endif]-->
            </td>
          </tr>

          <tr>
            <td style="background-color:${CREAM};color:${CHOCOLATE};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:36px 32px 10px;">
                    <p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${CHOCOLATE};">
                      ${escapeHtml(copy.eyebrow)}
                    </p>
                    <p style="margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.4;color:${CHOCOLATE};">
                      ${escapeHtml(copy.greeting)} 👋
                    </p>
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;line-height:0.95;letter-spacing:-0.035em;text-transform:uppercase;color:${CHOCOLATE};">
                      ${copy.headlineHtml}
                    </h1>
                    <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;color:${CHOCOLATE};opacity:0.8;">
                      Hi ${escapeHtml(firstName)} — glad you're here.
                    </p>
                  </td>
                </tr>

                ${paragraphRows(copy.paragraphs)}

                <tr>
                  <td style="padding:8px 32px 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${CHOCOLATE};">
                      <tr>
                        <td style="padding:18px 20px;">
                          <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${CREAM};">
                            ${escapeHtml(copy.nextTitle)}
                          </p>
                          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:${IVORY};">
                            ${escapeHtml(copy.nextBody)}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${paragraphRows(copy.closing)}

                <tr>
                  <td style="padding:8px 32px 8px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:${CHOCOLATE};">
                    Need to update anything? Your personal link stays tied to
                    <strong style="font-weight:600;">${escapeHtml(name)}</strong>
                    at this email.
                  </td>
                </tr>

                <tr>
                  <td align="left" style="padding:8px 32px 28px;">
                    <a href="${editUrl}" style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-style:italic;font-weight:400;line-height:1;letter-spacing:-0.03em;text-transform:uppercase;color:${CHOCOLATE};text-decoration:underline;text-underline-offset:8px;text-decoration-thickness:1px;">
                      Edit my details
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:${CHOCOLATE};">
                    See you around the Ville! 🏡<br />
                    <strong style="font-weight:600;">The NeighbrVille Team</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:${IVORY};color:${CHOCOLATE};padding:28px 32px 32px;">
              <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-style:italic;letter-spacing:-0.03em;text-transform:uppercase;color:${CHOCOLATE};">
                Find your people
              </p>
              <p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.45;color:${CHOCOLATE};">
                ${siteConfig.name} · ${siteConfig.launch} in ${cities}
              </p>
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${CHOCOLATE};opacity:0.75;">
                Confirm link not working?
              </p>
              <p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.45;word-break:break-all;">
                <a href="${confirmUrl}" style="color:${CHOCOLATE};text-decoration:underline;">${escapeHtml(confirmUrl)}</a>
              </p>
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${CHOCOLATE};opacity:0.75;">
                Edit details link
              </p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.45;word-break:break-all;">
                <a href="${editUrl}" style="color:${CHOCOLATE};text-decoration:underline;">${escapeHtml(editUrl)}</a>
              </p>
              <p style="margin:22px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.4;color:${CHOCOLATE};opacity:0.7;">
                <a href="${siteUrl}" style="color:${CHOCOLATE};text-decoration:underline;">${siteUrl.replace(/^https?:\/\//, "")}</a>
                ·
                <a href="mailto:${escapeHtml(contactEmail)}" style="color:${CHOCOLATE};text-decoration:underline;">${escapeHtml(contactEmail)}</a>
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
  confirmUrl: string;
  contactEmail?: string;
}) {
  const firstName = options.name.split(/\s+/)[0] || options.name;
  const copy = copyForRole(options.role);
  const contactEmail = options.contactEmail || siteConfig.email;

  return [
    "Confirm your email:",
    options.confirmUrl,
    "",
    copy.greeting,
    "",
    `Hi ${firstName} — glad you're here.`,
    "",
    ...copy.paragraphs,
    "",
    copy.nextTitle,
    copy.nextBody,
    "",
    ...copy.closing,
    "",
    "Need to update anything? Use your personal link:",
    options.editUrl,
    "",
    "See you around the Ville!",
    "The NeighbrVille Team",
    "",
    `${siteConfig.name} · ${siteConfig.launch}`,
    siteConfig.url,
    contactEmail,
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
  const confirmUrl = absoluteUrl(`/join/confirm/${options.editToken}`);
  const contactEmail = getSiteSettings().email || siteConfig.email;
  const copy = copyForRole(options.role);

  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[join-email] RESEND_API_KEY missing. Confirm URL:",
        confirmUrl,
        "Edit URL:",
        editUrl,
      );
    }
    return { ok: false as const, reason: "missing_api_key" as const };
  }

  const payload = {
    name: options.name,
    role: options.role,
    editUrl,
    confirmUrl,
    contactEmail,
  };

  const { error } = await resend.emails.send({
    from,
    to: options.to,
    subject: copy.subject,
    html: buildJoinConfirmationHtml(payload),
    text: buildJoinConfirmationText(payload),
    replyTo: contactEmail,
  });

  if (error) {
    console.error("[join-email]", error);
    return { ok: false as const, reason: "send_failed" as const };
  }

  return { ok: true as const };
}
