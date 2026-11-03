import crypto from "node:crypto";

import {
  isAnalyticsType,
  type AnalyticsEventType,
} from "@/lib/analytics/events";
import { getDb } from "@/lib/db";

export type { AnalyticsEventType };
export { isAnalyticsType };

export type AnalyticsEvent = {
  id: string;
  type: AnalyticsEventType;
  path: string;
  referrer: string;
  value: string;
  meta: Record<string, unknown>;
  createdAt: string;
};

export function recordAnalyticsEvent(input: {
  type: AnalyticsEventType;
  path: string;
  referrer?: string;
  value?: string;
  meta?: Record<string, unknown>;
}) {
  const database = getDb();
  const id = crypto.randomBytes(12).toString("hex");
  const createdAt = new Date().toISOString();

  database
    .prepare(
      `INSERT INTO analytics_events (id, type, path, referrer, value, meta, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.type,
      input.path || "/",
      input.referrer ?? "",
      input.value ?? "",
      JSON.stringify(input.meta ?? {}),
      createdAt,
    );

  // Keep table bounded
  const count = (
    database.prepare("SELECT COUNT(*) AS c FROM analytics_events").get() as {
      c: number;
    }
  ).c;
  if (count > 8000) {
    database
      .prepare(
        `DELETE FROM analytics_events WHERE id IN (
          SELECT id FROM analytics_events ORDER BY created_at ASC LIMIT ?
        )`,
      )
      .run(count - 6000);
  }

  return { id, createdAt };
}

export function listRecentEvents(limit = 40): AnalyticsEvent[] {
  const rows = getDb()
    .prepare(
      `SELECT id, type, path, referrer, value, meta, created_at AS createdAt
       FROM analytics_events
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .all(limit) as Array<{
    id: string;
    type: AnalyticsEventType;
    path: string;
    referrer: string;
    value: string;
    meta: string;
    createdAt: string;
  }>;

  return rows.map((row) => ({
    ...row,
    meta: safeJson(row.meta),
  }));
}

function safeJson(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // ignore
  }
  return {};
}

export function getVisitsSeries(days = 7) {
  const database = getDb();
  const series: Array<{ label: string; value: number; key: string }> = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    const label = day.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    series.push({ label, value: 0, key });
  }

  const since = series[0]?.key ?? new Date().toISOString().slice(0, 10);
  const rows = database
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS count
       FROM analytics_events
       WHERE type = 'pageview' AND created_at >= ?
       GROUP BY day`,
    )
    .all(`${since}T00:00:00.000Z`) as Array<{ day: string; count: number }>;

  const map = new Map(rows.map((row) => [row.day, row.count]));
  return series.map((item) => ({
    label: item.label,
    value: map.get(item.key) ?? 0,
  }));
}

export function getTopPages(limit = 8) {
  const rows = getDb()
    .prepare(
      `SELECT path, COUNT(*) AS views
       FROM analytics_events
       WHERE type = 'pageview'
       GROUP BY path
       ORDER BY views DESC
       LIMIT ?`,
    )
    .all(limit) as Array<{ path: string; views: number }>;

  const total = rows.reduce((sum, row) => sum + row.views, 0) || 1;
  return rows.map((row) => ({
    path: row.path,
    views: row.views,
    share: `${Math.round((row.views / total) * 100)}%`,
  }));
}

export function getPageviewCount(sinceIso?: string) {
  if (sinceIso) {
    const row = getDb()
      .prepare(
        `SELECT COUNT(*) AS count FROM analytics_events
         WHERE type = 'pageview' AND created_at >= ?`,
      )
      .get(sinceIso) as { count: number };
    return row.count;
  }
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS count FROM analytics_events WHERE type = 'pageview'`,
    )
    .get() as { count: number };
  return row.count;
}

export function getEventBreakdown() {
  const rows = getDb()
    .prepare(
      `SELECT type, COUNT(*) AS count
       FROM analytics_events
       GROUP BY type
       ORDER BY count DESC`,
    )
    .all() as Array<{ type: string; count: number }>;

  const labels: Record<string, string> = {
    pageview: "Page views",
    join_open: "Join form opened",
    join_complete: "Profiles completed",
  };

  return rows.map((row) => ({
    type: row.type,
    label: labels[row.type] ?? row.type,
    count: row.count,
  }));
}
