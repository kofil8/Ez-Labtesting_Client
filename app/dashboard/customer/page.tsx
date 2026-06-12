import { CustomerDashboardOverview } from "@/components/dashboard/customer/CustomerDashboardOverview";
import { getCustomerDashboardData } from "@/lib/dashboard/customer.server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardCustomerPage() {
  const { viewer, orders, ordersError } = await getCustomerDashboardData();

  if (!viewer) {
    redirect("/login?from=/dashboard/customer");
  }

  return (
    <CustomerDashboardOverview
      viewer={viewer}
      orders={orders}
      ordersError={ordersError}
    />
  );
}
