import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_COOKIE } from "@/lib/admin/constants";
import { getDb } from "@/lib/db";
import {
  signSessionToken,
  verifySignedSessionCookie,
} from "@/lib/admin/session-token";

export { ADMIN_COOKIE };

export type AdminSession = {
  token: string;
  login: string;
  createdAt: string;
  expiresAt: string;
};

function uid() {
  return crypto.randomBytes(32).toString("hex");
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function getAdminCredentials() {
  const login = (process.env.ADMIN_LOGIN ?? "admin").trim();
  const password = process.env.ADMIN_PASSWORD?.trim() ?? "";

  return { login, password };
}

export function assertAdminAuthConfigured() {
  const { password } = getAdminCredentials();

  if (isProduction()) {
    if (!password || password.length < 12) {
      return {
        ok: false as const,
        error:
          "Admin auth is not configured. Set ADMIN_PASSWORD (min 12 chars) in the environment.",
      };
    }
    return { ok: true as const };
  }

  if (!password) {
    return {
      ok: false as const,
      error:
        "Set ADMIN_PASSWORD in .env.local before signing in to the admin panel.",
    };
  }

  return { ok: true as const };
}

function timingSafeEqualString(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    // Still run a compare to reduce timing leaks on length mismatch.
    crypto.timingSafeEqual(left, left);
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

export function authenticateAdmin(login: string, password: string) {
  const configured = assertAdminAuthConfigured();
  if (!configured.ok) return false;

  const creds = getAdminCredentials();
  const loginOk = timingSafeEqualString(login.trim(), creds.login);
  const passwordOk = timingSafeEqualString(password, creds.password);
  return loginOk && passwordOk;
}

export function createAdminSession(login: string, remember: boolean) {
  const database = getDb();
  database
    .prepare("DELETE FROM admin_sessions WHERE expires_at < ?")
    .run(new Date().toISOString());

  const token = uid();
  const ttlMs = remember
    ? 1000 * 60 * 60 * 24 * 7
    : 1000 * 60 * 60 * 12;
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  database
    .prepare(
      `INSERT INTO admin_sessions (token, login, created_at, expires_at)
       VALUES (?, ?, ?, ?)`,
    )
    .run(token, login, createdAt, expiresAt);

  return {
    token,
    maxAge: Math.floor(ttlMs / 1000),
    record: { token, login, createdAt, expiresAt } satisfies AdminSession,
  };
}

export async function createSignedAdminCookie(
  login: string,
  remember: boolean,
) {
  const session = createAdminSession(login, remember);
  const value = await signSessionToken(session.token);
  return { ...session, cookieValue: value };
}

export function destroyAdminSession(token: string | undefined) {
  if (!token) return;
  getDb().prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
}

export function loadAdminSession(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT token, login, created_at AS createdAt, expires_at AS expiresAt
       FROM admin_sessions WHERE token = ?`,
    )
    .get(token) as AdminSession | undefined;

  if (!row) return null;
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    destroyAdminSession(token);
    return null;
  }
  return row;
}

export async function getRequestAdminSession() {
  const raw = (await cookies()).get(ADMIN_COOKIE)?.value;
  const token = await verifySignedSessionCookie(raw);
  return loadAdminSession(token ?? undefined);
}

export async function requireAdmin() {
  const session = await getRequestAdminSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      ),
    };
  }
  return { session, error: null };
}

export function adminCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: isProduction(),
    path: "/",
    maxAge,
  };
}
