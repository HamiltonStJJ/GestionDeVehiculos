// app/pages/admin/layout.tsx
import CustomerLayout from "@/app/layouts/CustomerLayout";


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CustomerLayout>{children}</CustomerLayout>;
}