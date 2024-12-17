// app/pages/admin/layout.tsx

import EmployeeLayout from "@/app/layouts/EmployeeLayout";


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EmployeeLayout>{children}</EmployeeLayout>;
}