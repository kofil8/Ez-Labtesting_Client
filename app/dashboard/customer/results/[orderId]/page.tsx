import { OrderJourneyPanel } from "@/components/results/OrderJourneyPanel";
import { ResultViewer } from "@/components/results/ResultViewer";
import { getOrderById, getResultsByOrderId } from "@/lib/api";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Test Results | Ez LabTesting",
  description: "View your test results",
};

export default async function DashboardCustomerResultViewerPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const [results, order] = await Promise.all([
    getResultsByOrderId(orderId),
    getOrderById(orderId),
  ]);

  if (!order || !results || results.length === 0) {
    redirect(`/dashboard/customer/results/${orderId}/pending`);
  }

  return (
    <div className='space-y-6'>
      <OrderJourneyPanel orderId={orderId} />
      <ResultViewer results={results} order={order} />
    </div>
  );
}
