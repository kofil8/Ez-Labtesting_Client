import { OrderTrackingDetail } from "@/components/dashboard/customer/OrderTrackingDetail";
import { DashboardSectionHeader } from "@/components/dashboard/customer/DashboardSectionHeader";
import { Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return {
    title: `Order ${orderId.slice(0, 8).toUpperCase()} | Ez LabTesting`,
    description: "Real-time tracking for your lab order",
  };
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Order tracking'
        title='Real-time order status'
        description='Live updates from your lab order — status changes, requisition availability, and step-by-step progress.'
        icon={Activity}
      />
      <OrderTrackingDetail orderId={orderId} />
    </div>
  );
}
