import type { Metadata } from "next";

import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import { AdminBodyClass } from "@/components/admin/AdminBodyClass";

import "./admin.css";

export const metadata: Metadata = {
  title: "NeighbrVille Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminBodyClass />
      {children}
    </AdminAuthProvider>
  );
}
