import { NextResponse } from "next/server";

import {
  getCompletedRegistrationCount,
  registerWaitlist,
  type RegisterInput,
} from "@/lib/registrations";
import type { JoinRole } from "@/lib/join";

function parseRole(value: unknown): JoinRole | null {
  return value === "neighbr" || value === "partner" ? value : null;
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_email: "Please enter a valid email address.",
  invalid_name: "Please enter your name.",
  already_registered:
    "This email is already registered. Check your inbox for the link to edit your details.",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = body as Partial<RegisterInput>;
  const role = parseRole(payload.role);
  if (!role) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const result = registerWaitlist({
    name: String(payload.name ?? ""),
    email: String(payload.email ?? ""),
    role,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error: ERROR_MESSAGES[result.code] ?? "Could not register.",
        code: result.code,
      },
      { status: result.code === "already_registered" ? 409 : 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    resumed: result.resumed,
    count: getCompletedRegistrationCount(),
  });
}
