import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/session";
import { getSiteSettings, normalizeNotifyEmails } from "@/lib/admin/settings";
import { sendRegistrationNotifyEmail } from "@/lib/email/registration-notify";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json().catch(() => null)) as {
    emails?: unknown;
  } | null;

  const settings = getSiteSettings();
  const recipients = normalizeNotifyEmails(
    body?.emails ?? settings.registrationNotifyEmails,
  );

  if (recipients.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Add at least one notification email before sending a test.",
      },
      { status: 400 },
    );
  }

  const result = await sendRegistrationNotifyEmail(
    {
      name: "Test Neighbr",
      email: "test.signup@example.com",
      role: "neighbr",
      profile: {
        interests: ["Culinary & Food Culture", "Outdoors & Nature"],
        languages: ["English"],
        categories: ["Culinary & Food Culture"],
        location: "Berlin",
        address: "",
        socials: "@neighbrville",
        about: "This is a test alert from Admin → Settings.",
      },
      createdAt: new Date().toISOString(),
      isTest: true,
    },
    recipients,
  );

  if (!result.ok) {
    const message =
      result.reason === "missing_api_key"
        ? "Resend API key is missing. Add it under Integrations."
        : result.reason === "no_recipients"
          ? "Add at least one notification email before sending a test."
          : "Could not send the test email. Check Resend settings and try again.";
    return NextResponse.json(
      { ok: false, error: message, reason: result.reason },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    recipients: result.recipients,
  });
}
