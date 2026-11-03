"use client";

import { useEffect, useState } from "react";

import { adminFetch } from "../adminApi";
import { AreaChart, DonutChart } from "../AdminCharts";
import { AdminCard, AdminPageHeader, StatCard } from "../AdminUi";
import ui from "../AdminUi.module.css";

type AnalyticsPayload = {
  overview: Array<{ label: string; value: string; delta: string }>;
  visitsSeries: Array<{ label: string; value: number }>;
  topPages: Array<{ path: string; views: number; share: string }>;
  eventBreakdown: Array<{ type: string; label: string; count: number }>;
  recentEvents: Array<{
    id: string;
    type: string;
    label: string;
    path: string;
    value: string;
    createdAt: string;
  }>;
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AnalyticsView() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    void adminFetch<AnalyticsPayload>("/api/admin/analytics").then(setData);
  }, []);

  if (!data) return <p className={ui.loading}>Loading analytics…</p>;

  return (
    <div className={ui.stack}>
      <AdminPageHeader
        title="Site analytics"
        description="Pageviews and join funnel events collected on the NeighbrVille site."
      />

      <div className={ui.grid4}>
        {data.overview.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            delta={item.delta}
            hint="live SQLite data"
            trend="up"
          />
        ))}
      </div>

      <div className={ui.grid2}>
        <AdminCard title="Sessions by day">
          <AreaChart data={data.visitsSeries} />
        </AdminCard>
        <AdminCard title="Events by type">
          <DonutChart
            data={data.eventBreakdown.slice(0, 6).map((item) => ({
              label: item.label,
              value: item.count,
            }))}
          />
        </AdminCard>
      </div>

      <AdminCard title="Popular pages">
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>URL</th>
                <th>Views</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {data.topPages.length === 0 ? (
                <tr>
                  <td colSpan={3} className={ui.empty}>
                    No pageviews yet.
                  </td>
                </tr>
              ) : (
                data.topPages.map((page) => (
                  <tr key={page.path}>
                    <td>{page.path}</td>
                    <td>{page.views.toLocaleString("en-US")}</td>
                    <td>{page.share}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard title="Recent events">
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Event</th>
                <th>Path</th>
                <th>Value</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className={ui.empty}>
                    No events yet — open public pages.
                  </td>
                </tr>
              ) : (
                data.recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.label}</td>
                    <td>{event.path}</td>
                    <td>{event.value || "—"}</td>
                    <td>{formatTime(event.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
