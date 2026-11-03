import crypto from "node:crypto";

import { getSiteSettings } from "@/lib/admin/settings";
import { getDb } from "@/lib/db";
import type {
  PublicRegistration,
  RegistrationProfile,
} from "@/lib/join-registration-types";
import type { JoinRole } from "@/lib/join";
import { isValidEmail } from "@/lib/join";

export type { PublicRegistration, RegistrationProfile };

export type RegistrationRow = {
  id: number;
  email: string;
  name: string;
  role: JoinRole;
  edit_token: string;
  interests: string;
  languages: string;
  categories: string;
  location: string;
  address: string;
  socials: string;
  about: string;
  profile_completed: number;
  created_at: string;
  updated_at: string;
};

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function rowToPublic(row: RegistrationRow): PublicRegistration {
  return {
    email: row.email,
    name: row.name,
    role: row.role,
    profileCompleted: row.profile_completed === 1,
    profile: {
      interests: parseJsonArray(row.interests),
      languages: parseJsonArray(row.languages),
      categories: parseJsonArray(row.categories),
      location: row.location,
      address: row.address,
      socials: row.socials,
      about: row.about,
    },
  };
}

function nowIso() {
  return new Date().toISOString();
}

function newEditToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function getCompletedRegistrationCount(options?: {
  includeBase?: boolean;
}) {
  const database = getDb();
  const row = database
    .prepare(
      "SELECT COUNT(*) AS count FROM registrations WHERE profile_completed = 1",
    )
    .get() as { count: number };

  if (options?.includeBase === false) return row.count;
  return row.count + (getSiteSettings().joinCountBase || 0);
}

export function getRegistrationStats() {
  const database = getDb();
  const totals = database
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN profile_completed = 1 THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN role = 'neighbr' THEN 1 ELSE 0 END) AS neighbrs,
        SUM(CASE WHEN role = 'partner' THEN 1 ELSE 0 END) AS partners
       FROM registrations`,
    )
    .get() as {
    total: number;
    completed: number;
    neighbrs: number;
    partners: number;
  };

  const since = new Date();
  since.setDate(since.getDate() - 7);
  const week = database
    .prepare(
      `SELECT COUNT(*) AS count FROM registrations WHERE created_at >= ?`,
    )
    .get(since.toISOString()) as { count: number };

  return {
    total: totals.total || 0,
    completed: totals.completed || 0,
    neighbrs: totals.neighbrs || 0,
    partners: totals.partners || 0,
    last7Days: week.count || 0,
  };
}

export function listRegistrations(limit = 200) {
  return getDb()
    .prepare(
      `SELECT * FROM registrations
       ORDER BY datetime(created_at) DESC
       LIMIT ?`,
    )
    .all(limit) as RegistrationRow[];
}

export function deleteRegistration(id: number) {
  const result = getDb()
    .prepare("DELETE FROM registrations WHERE id = ?")
    .run(id);
  return result.changes > 0;
}

export function findRegistrationByEmail(email: string) {
  const database = getDb();
  return database
    .prepare("SELECT * FROM registrations WHERE email = ?")
    .get(normalizeEmail(email)) as RegistrationRow | undefined;
}

export function findRegistrationByToken(token: string) {
  const database = getDb();
  return database
    .prepare("SELECT * FROM registrations WHERE edit_token = ?")
    .get(token.trim()) as RegistrationRow | undefined;
}

export type RegisterInput = {
  name: string;
  email: string;
  role: JoinRole;
};

export type RegisterResult =
  | { ok: true; resumed: boolean }
  | { ok: false; code: "invalid_email" | "invalid_name" | "already_registered" };

export function registerWaitlist(input: RegisterInput): RegisterResult {
  const email = normalizeEmail(input.email);
  const name = normalizeName(input.name);

  if (!name || name.length > 120) {
    return { ok: false, code: "invalid_name" };
  }
  if (!isValidEmail(email)) {
    return { ok: false, code: "invalid_email" };
  }

  const existing = findRegistrationByEmail(email);
  if (existing) {
    if (existing.profile_completed === 1) {
      return { ok: false, code: "already_registered" };
    }
    const database = getDb();
    database
      .prepare(
        `UPDATE registrations
         SET name = ?, role = ?, updated_at = ?
         WHERE email = ?`,
      )
      .run(name, input.role, nowIso(), email);
    return { ok: true, resumed: true };
  }

  const database = getDb();
  const timestamp = nowIso();
  database
    .prepare(
      `INSERT INTO registrations (
        email, name, role, edit_token,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(email, name, input.role, newEditToken(), timestamp, timestamp);

  return { ok: true, resumed: false };
}

export type CompleteProfileInput = {
  email: string;
  role: JoinRole;
  profile: RegistrationProfile;
};

export type CompleteProfileResult =
  | { ok: true; editToken: string; count: number; wasAlreadyComplete: boolean }
  | {
      ok: false;
      code: "not_found" | "invalid_email" | "role_mismatch";
    };

export function completeProfile(
  input: CompleteProfileInput,
): CompleteProfileResult {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) {
    return { ok: false, code: "invalid_email" };
  }

  const row = findRegistrationByEmail(email);
  if (!row) {
    return { ok: false, code: "not_found" };
  }
  if (row.role !== input.role) {
    return { ok: false, code: "role_mismatch" };
  }

  const wasAlreadyComplete = row.profile_completed === 1;
  const database = getDb();
  const timestamp = nowIso();

  database
    .prepare(
      `UPDATE registrations SET
        interests = ?,
        languages = ?,
        categories = ?,
        location = ?,
        address = ?,
        socials = ?,
        about = ?,
        profile_completed = 1,
        updated_at = ?
      WHERE email = ?`,
    )
    .run(
      JSON.stringify(input.profile.interests),
      JSON.stringify(input.profile.languages),
      JSON.stringify(input.profile.categories),
      input.profile.location.trim(),
      input.profile.address.trim(),
      input.profile.socials.trim(),
      input.profile.about.trim(),
      timestamp,
      email,
    );

  const updated = findRegistrationByEmail(email)!;

  return {
    ok: true,
    editToken: updated.edit_token,
    count: getCompletedRegistrationCount(),
    wasAlreadyComplete,
  };
}

export type UpdateByTokenInput = {
  token: string;
  profile: RegistrationProfile;
};

export type UpdateByTokenResult =
  | { ok: true; count: number }
  | { ok: false; code: "not_found" };

export function updateProfileByToken(
  input: UpdateByTokenInput,
): UpdateByTokenResult {
  const row = findRegistrationByToken(input.token);
  if (!row) {
    return { ok: false, code: "not_found" };
  }

  const database = getDb();
  database
    .prepare(
      `UPDATE registrations SET
        interests = ?,
        languages = ?,
        categories = ?,
        location = ?,
        address = ?,
        socials = ?,
        about = ?,
        profile_completed = 1,
        updated_at = ?
      WHERE edit_token = ?`,
    )
    .run(
      JSON.stringify(input.profile.interests),
      JSON.stringify(input.profile.languages),
      JSON.stringify(input.profile.categories),
      input.profile.location.trim(),
      input.profile.address.trim(),
      input.profile.socials.trim(),
      input.profile.about.trim(),
      nowIso(),
      input.token.trim(),
    );

  return { ok: true, count: getCompletedRegistrationCount() };
}
