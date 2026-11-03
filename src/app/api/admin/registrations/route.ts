import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/session";
import {
  deleteRegistration,
  listRegistrations,
  rowToPublic,
} from "@/lib/registrations";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const registrations = listRegistrations(500).map((row) => ({
    id: row.id,
    editToken: row.edit_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...rowToPublic(row),
  }));

  return NextResponse.json({ registrations });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json().catch(() => null)) as { id?: number } | null;
  const id = Number(body?.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const ok = deleteRegistration(id);
  if (!ok) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
