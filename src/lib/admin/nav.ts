export type AdminNavIcon =
  | "dashboard"
  | "leads"
  | "analytics"
  | "settings";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: AdminNavIcon;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/registrations", label: "Registrations", icon: "leads" },
  { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export function getAdminPageTitle(pathname: string) {
  const item = ADMIN_NAV.find((entry) => pathname.startsWith(entry.href));
  return item?.label ?? "Admin";
}
