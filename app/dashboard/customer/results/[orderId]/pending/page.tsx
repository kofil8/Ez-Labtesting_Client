import { OrderJourneyPanel } from "@/components/results/OrderJourneyPanel";
import { Button } from "@/components/ui/button";
import { Clock3, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Results Pending | Ez LabTesting",
  description: "Track your order while results are being processed",
};

export default async function DashboardCustomerPendingResultPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className='space-y-6'>
      <OrderJourneyPanel orderId={orderId} />

      <section className='rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-lg shadow-blue-100/25'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100'>
          <Clock3 className='h-6 w-6 text-slate-500' />
        </div>

        <h1 className='text-2xl font-semibold text-slate-950'>
          Results are still processing
        </h1>

        <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600'>
          Your order is active and currently being processed by the lab. We will
          show your report here as soon as it is ready.
        </p>

        <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
          <Button asChild>
            <Link href={`/dashboard/customer/results/${orderId}`}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Check Again
            </Link>
          </Button>

          <Button asChild variant='outline'>
            <Link href='/dashboard/customer/results'>Back to Results</Link>
          </Button>

          <Button asChild variant='ghost'>
            <Link href='/dashboard/customer/orders'>View Orders</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
