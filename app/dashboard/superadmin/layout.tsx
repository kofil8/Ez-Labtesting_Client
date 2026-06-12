import { SuperAdminLayoutClient } from "@/components/superadmin/SuperAdminLayoutClient";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminLayoutClient>{children}</SuperAdminLayoutClient>;
}
