import { OrderJourneyPanel } from "@/components/results/OrderJourneyPanel";
import { ResultViewer } from "@/components/results/ResultViewer";
import { LazyFooter } from "@/components/shared/LazyFooter";
import { PageContainer } from "@/components/shared/PageContainer";
import { getOrderById, getResultsByOrderId } from "@/lib/api";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Test Results | Ez LabTesting",
  description: "View your test results",
};

export default async function ResultViewerPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const [results, order] = await Promise.all([
    getResultsByOrderId(orderId),
    getOrderById(orderId),
  ]);

  const hasOrder = Boolean(order);
  const hasResults = Boolean(results && results.length > 0);

  if (!hasOrder || !hasResults) {
    redirect(`/results/${orderId}/pending`);
  }

  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <main id='main-content-section' className='flex-1'>
          <PageContainer>
            <div className='py-8'>
              <OrderJourneyPanel orderId={orderId} />
              <div className='my-8' />
              <ResultViewer results={results} order={order} />
            </div>
          </PageContainer>
        </main>
      </div>
      <LazyFooter />
    </>
  );
}
