"use client";

import { useEffect, useState } from "react";

import { adminFetch } from "../adminApi";
import { AreaChart } from "../AdminCharts";
import {
  AdminCard,
  AdminPageHeader,
  StatCard,
  StatusBadge,
} from "../AdminUi";
import ui from "../AdminUi.module.css";

type DashboardPayload = {
  stats: Array<{
    id: string;
    label: string;
    value: string;
    delta: string;
    hint: string;
    trend: "up" | "down" | "neutral";
  }>;
  visitsSeries: Array<{ label: string; value: number }>;
  topPages: Array<{ path: string; views: number; share: string }>;
  recentRegistrations: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    profileCompleted: boolean;
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

export default function DashboardView() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void adminFetch<DashboardPayload>("/api/admin/dashboard")
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className={ui.empty}>Error: {error}</p>;
  if (!data) return <p className={ui.loading}>Loading dashboard…</p>;

  return (
    <div className={ui.stack}>
      <AdminPageHeader
        title="Site overview"
        description="Live waitlist registrations and page visits for NeighbrVille."
      />

      <div className={ui.grid4}>
        {data.stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className={ui.grid2}>
        <AdminCard title="Visits this week" subtitle="Pageviews by day">
          <AreaChart data={data.visitsSeries} />
        </AdminCard>

        <AdminCard title="Recent registrations" subtitle="Latest waitlist entries">
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {data.recentRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={ui.empty}>
                      No registrations yet.
                    </td>
                  </tr>
                ) : (
                  data.recentRegistrations.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        <div style={{ color: "var(--admin-muted)", fontSize: 12 }}>
                          {item.email}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={item.role} />
                      </td>
                      <td>
                        <StatusBadge
                          status={item.profileCompleted ? "completed" : "new"}
                        />
                      </td>
                      <td>{formatTime(item.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Top pages" subtitle="By tracked pageviews">
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Page</th>
                <th>Views</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {data.topPages.length === 0 ? (
                <tr>
                  <td colSpan={3} className={ui.empty}>
                    No visits tracked yet — open the public site.
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
    </div>
  );
}
