import { NextResponse } from "next/server";

import {
  getEventBreakdown,
  getPageviewCount,
  getTopPages,
  getVisitsSeries,
  listRecentEvents,
} from "@/lib/admin/analytics";
import { requireAdmin } from "@/lib/admin/session";
import { getRegistrationStats } from "@/lib/registrations";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const stats = getRegistrationStats();
  const visitsWeek = getPageviewCount(weekAgo.toISOString());
  const visitsTotal = getPageviewCount();

  return NextResponse.json({
    overview: [
      {
        label: "Pageviews (7d)",
        value: String(visitsWeek),
        delta: `${visitsTotal} all time`,
      },
      {
        label: "Registrations",
        value: String(stats.total),
        delta: `+${stats.last7Days} / 7d`,
      },
      {
        label: "Completed",
        value: String(stats.completed),
        delta: `${stats.neighbrs} / ${stats.partners}`,
      },
      {
        label: "Event types",
        value: String(getEventBreakdown().length),
        delta: "tracked",
      },
    ],
    visitsSeries: getVisitsSeries(14),
    topPages: getTopPages(10),
    eventBreakdown: getEventBreakdown(),
    recentEvents: listRecentEvents(50).map((event) => ({
      id: event.id,
      type: event.type,
      label:
        event.type === "pageview"
          ? "Page view"
          : event.type === "join_open"
            ? "Join opened"
            : "Profile complete",
      path: event.path,
      value: event.value,
      createdAt: event.createdAt,
    })),
  });
}
