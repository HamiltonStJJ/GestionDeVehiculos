// app/layouts/AdminLayout.tsx
"use client";

import Sidebar from "@/components/SideBar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}