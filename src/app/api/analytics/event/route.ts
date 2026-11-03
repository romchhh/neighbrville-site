import { NextResponse } from "next/server";

import { isAnalyticsType } from "@/lib/analytics/events";
import { recordAnalyticsEvent } from "@/lib/admin/analytics";

type Body = {
  type?: string;
  path?: string;
  referrer?: string;
  value?: string | number;
  meta?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let body: Body | null = null;
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    body = (await request.json().catch(() => null)) as Body | null;
  } else {
    const text = await request.text().catch(() => "");
    try {
      body = JSON.parse(text) as Body;
    } catch {
      body = null;
    }
  }

  const type = body?.type?.trim() ?? "";
  if (!isAnalyticsType(type)) {
    return NextResponse.json({ ok: false, error: "invalid_type" }, { status: 400 });
  }

  const event = recordAnalyticsEvent({
    type,
    path: (body?.path || "/").trim() || "/",
    referrer: body?.referrer,
    value: body?.value != null ? String(body.value) : undefined,
    meta: body?.meta,
  });

  return NextResponse.json({ ok: true, id: event.id });
}
