// app/pages/customer/layout.tsx
"use client";

import Sidebar from "@/components/SideBar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100"> {/* Cambios aquí */}
      <Sidebar role="customer" />
      <main className="flex-1 overflow-y-auto bg-gray-100"> {/* Cambios aquí */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}