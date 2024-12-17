// app/pages/admin/layout.tsx
import AdminLayout from "@/app/layouts/AdminLayout";


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>;
}