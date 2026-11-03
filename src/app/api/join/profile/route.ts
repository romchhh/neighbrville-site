import { NextResponse } from "next/server";

import { recordAnalyticsEvent } from "@/lib/admin/analytics";
import { sendJoinConfirmationEmail } from "@/lib/email/join-confirmation";
import {
  completeProfile,
  findRegistrationByEmail,
  normalizeEmail,
  type RegistrationProfile,
} from "@/lib/registrations";
import type { JoinRole } from "@/lib/join";

function parseRole(value: unknown): JoinRole | null {
  return value === "neighbr" || value === "partner" ? value : null;
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseProfile(body: Record<string, unknown>): RegistrationProfile {
  return {
    interests: parseStringArray(body.interests),
    languages: parseStringArray(body.languages),
    categories: parseStringArray(body.categories),
    location: String(body.location ?? ""),
    address: String(body.address ?? ""),
    socials: String(body.socials ?? ""),
    about: String(body.about ?? ""),
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const role = parseRole(payload.role);
  if (!role) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const email = normalizeEmail(String(payload.email ?? ""));
  const result = completeProfile({
    email,
    role,
    profile: parseProfile(payload),
  });

  if (!result.ok) {
    const messages: Record<string, string> = {
      not_found: "Start with your name and email on the waitlist form first.",
      invalid_email: "Please enter a valid email address.",
      role_mismatch:
        "This email is registered under a different role. Use the edit link from your confirmation email.",
    };
    return NextResponse.json(
      { error: messages[result.code] ?? "Could not save profile." },
      { status: 400 },
    );
  }

  const registration = findRegistrationByEmail(email)!;
  let emailSent = false;

  if (!result.wasAlreadyComplete) {
    recordAnalyticsEvent({
      type: "join_complete",
      path: "/#join",
      value: registration.role,
      meta: { email: registration.email },
    });

    const sendResult = await sendJoinConfirmationEmail({
      to: registration.email,
      name: registration.name,
      role: registration.role,
      editToken: result.editToken,
    });
    emailSent = sendResult.ok;
  }

  return NextResponse.json({
    ok: true,
    count: result.count,
    bumped: !result.wasAlreadyComplete,
    emailSent,
  });
}
