import { NextResponse } from "next/server";

import {
  getPageviewCount,
  getTopPages,
  getVisitsSeries,
} from "@/lib/admin/analytics";
import { requireAdmin } from "@/lib/admin/session";
import {
  getRegistrationStats,
  listRegistrations,
  rowToPublic,
} from "@/lib/registrations";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const stats = getRegistrationStats();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const visitsWeek = getPageviewCount(weekAgo.toISOString());
  const visitsTotal = getPageviewCount();

  return NextResponse.json({
    stats: [
      {
        id: "regs",
        label: "Registrations",
        value: String(stats.total),
        delta: `+${stats.last7Days} / 7d`,
        hint: "All waitlist entries",
        trend: "up" as const,
      },
      {
        id: "completed",
        label: "Completed profiles",
        value: String(stats.completed),
        delta: `${stats.neighbrs} neighbr · ${stats.partners} partner`,
        hint: "Counted on the site banner",
        trend: "up" as const,
      },
      {
        id: "visits",
        label: "Pageviews (7d)",
        value: String(visitsWeek),
        delta: `${visitsTotal} total`,
        hint: "Tracked site visits",
        trend: "up" as const,
      },
      {
        id: "confirmed",
        label: "Emails confirmed",
        value: String(stats.confirmed),
        delta:
          stats.total === 0
            ? "—"
            : `${Math.round((stats.confirmed / stats.total) * 100)}% of signups`,
        hint: "Clicked Confirm email in the welcome letter",
        trend: "up" as const,
      },
    ],
    visitsSeries: getVisitsSeries(7),
    topPages: getTopPages(6),
    recentRegistrations: listRegistrations(8).map((row) => ({
      id: row.id,
      ...rowToPublic(row),
      createdAt: row.created_at,
    })),
  });
}
