"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AdminIcon from "./AdminIcon";
import { useAdminAuth } from "./AdminAuthProvider";
import { ADMIN_NAV, getAdminPageTitle } from "@/lib/admin/nav";
import styles from "./AdminShell.module.css";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await logout();
    router.replace("/admin");
  }

  return (
    <div className={styles.shell}>
      <div
        className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarTop}>
          <Link href="/admin/dashboard" className={styles.brand}>
            <span className={styles.brandMark}>NV</span>
            <span className={styles.brandBadge}>Admin</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {ADMIN_NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
              >
                <AdminIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              {session?.login.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <strong>{session?.login}</strong>
              <span>{session?.name || "Administrator"}</span>
            </div>
          </div>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div className={styles.topbarCopy}>
            <p className={styles.eyebrow}>NeighbrVille</p>
            <h1 className={styles.pageTitle}>{getAdminPageTitle(pathname)}</h1>
          </div>

          <div className={styles.topbarActions}>
            <Link href="/" className={styles.siteLink} target="_blank">
              Open site
            </Link>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
