import { OrderJourneyPanel } from "@/components/results/OrderJourneyPanel";
import { LazyFooter } from "@/components/shared/LazyFooter";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Clock3, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Results Pending | Ez LabTesting",
  description: "Track your order while results are being processed",
};

export default async function PendingResultPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <main id='main-content-section' className='flex-1'>
          <PageContainer>
            <div className='py-8 space-y-8'>
              <OrderJourneyPanel orderId={orderId} />

              <section className='rounded-2xl border border-border bg-card p-8 text-center shadow-sm'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                  <Clock3 className='h-6 w-6 text-muted-foreground' />
                </div>

                <h1 className='text-2xl font-semibold text-foreground'>
                  Results are still processing
                </h1>

                <p className='mt-3 text-sm text-muted-foreground'>
                  Your order is active and currently being processed by the lab.
                  We will show your report here as soon as it is ready.
                </p>

                <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
                  <Button asChild>
                    <Link href={`/results/${orderId}`}>
                      <RefreshCw className='mr-2 h-4 w-4' />
                      Check Again
                    </Link>
                  </Button>

                  <Button asChild variant='outline'>
                    <Link href='/results'>Back to Results</Link>
                  </Button>

                  <Button asChild variant='ghost'>
                    <Link href='/transactions'>View Orders</Link>
                  </Button>
                </div>
              </section>
            </div>
          </PageContainer>
        </main>
      </div>
      <LazyFooter />
    </>
  );
}
