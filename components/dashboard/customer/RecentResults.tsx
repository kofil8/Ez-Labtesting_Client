import { Button } from "@/components/ui/button";
import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import {
  Download,
  FileCheck2,
  FileText,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "./EmptyState";
import {
  formatSafeDate,
  getOrderHref,
  isResultsReady,
} from "./dashboard-helpers";
import { StatusBadge } from "./StatusBadge";

export function RecentResults({
  orders,
}: {
  orders: CustomerDashboardOrder[];
}) {
  const results = orders.filter(isResultsReady).slice(0, 4);

  return (
    <section className='rounded-2xl border border-blue-100 bg-white shadow-lg shadow-blue-100/25'>
      <div className='flex flex-col gap-3 border-b border-blue-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
        <div className='min-w-0'>
          <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>
            Documents & reports
          </p>
          <h2 className='mt-1 text-lg font-semibold text-slate-950'>
            Recent Results
          </h2>
        </div>
        <Button asChild variant='outline' size='sm' className='w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:w-auto'>
          <Link href='/results'>View All Results</Link>
        </Button>
      </div>

      {results.length === 0 ? (
        <div className='grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px]'>
          <EmptyState
            icon={FileCheck2}
            title='No results ready'
            description='Completed lab reports will appear here after the lab returns final results.'
          />
          <div className='rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-4'>
            <div className='flex items-center gap-2 text-sm font-semibold text-slate-950'>
              <Sparkles className='h-4 w-4 text-blue-600' />
              Future report library
            </div>
            <p className='mt-3 text-sm leading-6 text-slate-600'>
              This area will organize connected lab PDFs, result summaries, and
              trend-ready documents when those data sources are available.
            </p>
          </div>
        </div>
      ) : (
        <div className='divide-y divide-blue-100'>
          {results.map((order) => (
            <article key={order.id} className='p-5 sm:p-6'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <FileText className='h-4 w-4 text-blue-600' />
                    <p className='min-w-0 break-words font-semibold text-slate-950'>
                      {order.primaryTest?.testName || "Lab results"}
                    </p>
                    <StatusBadge order={order} />
                  </div>
                  <p className='mt-2 text-sm text-slate-600'>
                    {order.orderNumber} - completed {formatSafeDate(order.updatedAt)}
                  </p>
                  <div className='mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-slate-600'>
                    <LockKeyhole className='h-3.5 w-3.5 text-slate-500' />
                    Secure result access
                  </div>
                </div>

                <div className='flex flex-col gap-2 sm:flex-row lg:shrink-0'>
                  <Button asChild size='sm' className='w-full bg-blue-600 hover:bg-blue-700 sm:w-auto'>
                    <Link href={getOrderHref(order)}>View Result</Link>
                  </Button>
                  {order.requisitionPdfUrl ? (
                    <Button asChild variant='outline' size='sm' className='w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:w-auto'>
                      <a
                        href={order.requisitionPdfUrl}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Download className='h-4 w-4' />
                        Requisition
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
