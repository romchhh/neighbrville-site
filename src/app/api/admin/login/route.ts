import { NextResponse } from "next/server";

import {
  clientIpFromRequest,
  consumeRateLimit,
} from "@/lib/admin/rate-limit";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  assertAdminAuthConfigured,
  authenticateAdmin,
  createSignedAdminCookie,
  destroyAdminSession,
  getRequestAdminSession,
} from "@/lib/admin/session";

export async function POST(request: Request) {
  const configured = assertAdminAuthConfigured();
  if (!configured.ok) {
    return NextResponse.json(
      { ok: false, error: configured.error },
      { status: 503 },
    );
  }

  const ip = clientIpFromRequest(request);
  const limited = consumeRateLimit(`admin-login:${ip}`, {
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    login?: string;
    password?: string;
    remember?: boolean;
  } | null;

  const login = body?.login?.trim() ?? "";
  const password = body?.password ?? "";
  const remember = Boolean(body?.remember);

  if (!login || !password) {
    return NextResponse.json(
      { ok: false, error: "missing_credentials" },
      { status: 400 },
    );
  }

  if (!authenticateAdmin(login, password)) {
    return NextResponse.json(
      { ok: false, error: "invalid_credentials" },
      { status: 401 },
    );
  }

  const { cookieValue, maxAge } = await createSignedAdminCookie(
    login,
    remember,
  );
  const response = NextResponse.json({
    ok: true,
    login,
    name: "Administrator",
  });

  response.cookies.set(ADMIN_COOKIE, cookieValue, adminCookieOptions(maxAge));
  return response;
}

export async function DELETE() {
  const session = await getRequestAdminSession();
  destroyAdminSession(session?.token);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    ...adminCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  const session = await getRequestAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, authenticated: false },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    login: session.login,
    name: "Administrator",
  });
}
