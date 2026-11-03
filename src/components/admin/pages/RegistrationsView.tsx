"use client";

import { useEffect, useMemo, useState } from "react";

import { adminFetch } from "../adminApi";
import { Modal } from "../AdminForm";
import {
  AdminCard,
  AdminPageHeader,
  CopyIconButton,
  DeleteIconButton,
  GhostButton,
  StatusBadge,
} from "../AdminUi";
import ui from "../AdminUi.module.css";

type Registration = {
  id: number;
  email: string;
  name: string;
  role: "neighbr" | "partner";
  profileCompleted: boolean;
  editToken: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    interests: string[];
    languages: string[];
    categories: string[];
    location: string;
    address: string;
    socials: string;
    about: string;
  };
};

type Filter = "all" | "completed" | "incomplete" | "neighbr" | "partner";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function RegistrationsView() {
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Registration | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await adminFetch<{ registrations: Registration[] }>(
        "/api/admin/registrations",
      );
      setItems(data.registrations);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === "completed" && !item.profileCompleted) return false;
      if (filter === "incomplete" && item.profileCompleted) return false;
      if (filter === "neighbr" && item.role !== "neighbr") return false;
      if (filter === "partner" && item.role !== "partner") return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.profile.location.toLowerCase().includes(q) ||
        item.profile.address.toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  async function remove(id: number) {
    if (!window.confirm("Delete this registration?")) return;
    await adminFetch("/api/admin/registrations", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setDetail(null);
    await load();
  }

  async function copyEditLink(token: string) {
    const url = `${window.location.origin}/join/edit/${token}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 1600);
  }

  const filters: Array<{ id: Filter; label: string }> = [
    { id: "all", label: "All" },
    { id: "completed", label: "Completed" },
    { id: "incomplete", label: "Incomplete" },
    { id: "neighbr", label: "Neighbrs" },
    { id: "partner", label: "Partners" },
  ];

  return (
    <div className={ui.stack}>
      <AdminPageHeader
        title="Waitlist registrations"
        description="Everyone who joined with name + email. Completed profiles count toward the public total."
        action={
          <GhostButton onClick={() => void load()}>Refresh</GhostButton>
        }
      />

      <div className={ui.filters}>
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${ui.filterChip} ${filter === item.id ? ui.filterChipActive : ""}`}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AdminCard>
        <div className={ui.formGrid} style={{ marginBottom: 16 }}>
          <label className={ui.field}>
            <span>Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, email, city…"
            />
          </label>
        </div>

        {loading ? (
          <p className={ui.loading}>Loading…</p>
        ) : (
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={ui.empty}>
                      No matching registrations.
                    </td>
                  </tr>
                ) : (
                  visible.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <button
                          type="button"
                          className={ui.linkBtn}
                          onClick={() => {
                            setCopiedLink(false);
                            setDetail(item);
                          }}
                        >
                          <strong>{item.name}</strong>
                        </button>
                      </td>
                      <td>{item.email}</td>
                      <td>
                        <StatusBadge status={item.role} />
                      </td>
                      <td>
                        <StatusBadge
                          status={item.profileCompleted ? "completed" : "new"}
                        />
                      </td>
                      <td>{formatTime(item.createdAt)}</td>
                      <td>
                        <DeleteIconButton
                          label="Delete"
                          onClick={() => void remove(item.id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {detail ? (
        <Modal
          title={detail.name}
          onClose={() => {
            setCopiedLink(false);
            setDetail(null);
          }}
          wide
        >
          <div className={ui.formGrid}>
            <p>
              <strong>Email:</strong> {detail.email}
            </p>
            <p>
              <strong>Role:</strong> {detail.role}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {detail.profileCompleted ? "Completed" : "Incomplete"}
            </p>
            <p>
              <strong>Joined:</strong> {formatTime(detail.createdAt)}
            </p>
            {detail.role === "neighbr" ? (
              <>
                <p>
                  <strong>Location:</strong> {detail.profile.location || "—"}
                </p>
                <p>
                  <strong>Interests:</strong>{" "}
                  {detail.profile.interests.join(", ") || "—"}
                </p>
                <p>
                  <strong>Languages:</strong>{" "}
                  {detail.profile.languages.join(", ") || "—"}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Address:</strong> {detail.profile.address || "—"}
                </p>
                <p>
                  <strong>Categories:</strong>{" "}
                  {detail.profile.categories.join(", ") || "—"}
                </p>
                <p>
                  <strong>Socials:</strong> {detail.profile.socials || "—"}
                </p>
                <p>
                  <strong>About:</strong> {detail.profile.about || "—"}
                </p>
              </>
            )}
            <p className={ui.iconActions} style={{ alignItems: "center" }}>
              <span>
                <strong>Edit link:</strong>{" "}
                <a
                  href={`/join/edit/${detail.editToken}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  /join/edit/{detail.editToken.slice(0, 8)}…
                </a>
              </span>
              <CopyIconButton
                label="Copy edit link"
                copied={copiedLink}
                onClick={() => void copyEditLink(detail.editToken)}
              />
            </p>
          </div>
          <div className={ui.formActions}>
            <DeleteIconButton
              label="Delete registration"
              onClick={() => void remove(detail.id)}
            />
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
