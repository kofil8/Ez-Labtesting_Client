import { Button } from "@/components/ui/button";
import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { Download, FileCheck2 } from "lucide-react";
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
    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-slate-950'>
            Recent Results
          </h2>
          <p className='mt-1 text-sm text-slate-600'>
            Completed reports ready for secure review.
          </p>
        </div>
        <Button asChild variant='outline' size='sm' className='w-full sm:w-auto'>
          <Link href='/results'>View All Results</Link>
        </Button>
      </div>

      {results.length === 0 ? (
        <div className='mt-5'>
          <EmptyState
            icon={FileCheck2}
            title='No results ready'
            description='Completed lab reports will appear here when they are available.'
          />
        </div>
      ) : (
        <div className='mt-5 space-y-3'>
          {results.map((order) => (
            <div
              key={order.id}
              className='flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-2'>
                  <p className='min-w-0 break-words font-semibold text-slate-950'>
                    {order.primaryTest?.testName || "Lab results"}
                  </p>
                  <StatusBadge order={order} />
                </div>
                <p className='mt-1 text-sm text-slate-600'>
                  {order.orderNumber} - completed {formatSafeDate(order.updatedAt)}
                </p>
              </div>
              <div className='flex flex-col gap-2 sm:flex-row'>
                <Button asChild size='sm' className='w-full bg-sky-700 hover:bg-sky-800 sm:w-auto'>
                  <Link href={getOrderHref(order)}>View Result</Link>
                </Button>
                {order.requisitionPdfUrl ? (
                  <Button asChild variant='outline' size='sm' className='w-full sm:w-auto'>
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
          ))}
        </div>
      )}
    </section>
  );
}
