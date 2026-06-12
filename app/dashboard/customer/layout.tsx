import { CustomerDashboardShell } from "@/components/dashboard/customer/CustomerDashboardShell";
import { getCustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { getDashboardRouteForRole, normalizeUserRole } from "@/lib/auth/shared";
import { redirect } from "next/navigation";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getCustomerDashboardViewer();

  if (!viewer) {
    redirect("/login?from=/dashboard/customer");
  }

  const role = normalizeUserRole(viewer.role);
  if (role && role !== "customer") {
    redirect(getDashboardRouteForRole(role));
  }

  return (
    <CustomerDashboardShell viewer={viewer}>{children}</CustomerDashboardShell>
  );
}
