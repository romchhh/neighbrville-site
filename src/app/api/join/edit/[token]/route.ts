import { NextResponse } from "next/server";

import {
  findRegistrationByToken,
  rowToPublic,
  updateProfileByToken,
  type RegistrationProfile,
} from "@/lib/registrations";

type RouteContext = { params: Promise<{ token: string }> };

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

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  const row = findRegistrationByToken(token);
  if (!row) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(rowToPublic(row));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { token } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = updateProfileByToken({
    token,
    profile: parseProfile(body as Record<string, unknown>),
  });

  if (!result.ok) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, count: result.count });
}
