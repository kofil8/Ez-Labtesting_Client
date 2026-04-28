import { Button } from "@/components/ui/button";
import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, ClipboardList, Eye } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "./EmptyState";
import { formatSafeDate, getOrderHref } from "./dashboard-helpers";
import { StatusBadge } from "./StatusBadge";

export function RecentOrders({
  orders,
  ordersError,
}: {
  orders: CustomerDashboardOrder[];
  ordersError?: string | null;
}) {
  const recentOrders = orders.slice(0, 5);

  return (
    <section className='rounded-2xl border border-blue-100 bg-white shadow-lg shadow-blue-100/25'>
      <div className='flex flex-col gap-3 border-b border-blue-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
        <div className='min-w-0'>
          <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>
            Clinical orders
          </p>
          <h2 className='mt-1 text-lg font-semibold text-slate-950'>
            Recent Orders
          </h2>
        </div>
        <Button asChild variant='outline' size='sm' className='w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:w-auto'>
          <Link href='/profile/orders'>View All Orders</Link>
        </Button>
      </div>

      {ordersError ? (
          <div className='m-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:m-6'>
          <div className='flex gap-3'>
            <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
            <p>{ordersError}</p>
          </div>
        </div>
      ) : null}

      {recentOrders.length === 0 && !ordersError ? (
        <div className='p-5 sm:p-6'>
          <EmptyState
            icon={ClipboardList}
            title='No orders yet'
            description='Your lab orders, requisitions, and status updates will appear here after checkout.'
            actionHref='/tests'
            actionLabel='Browse Tests'
          />
        </div>
      ) : null}

      {recentOrders.length > 0 ? (
        <div className='divide-y divide-blue-100'>
          {recentOrders.map((order) => (
            <article key={order.id} className='p-5 sm:p-6'>
              <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px_130px_112px] lg:items-center'>
                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='font-semibold text-slate-950'>
                      {order.orderNumber}
                    </p>
                    <StatusBadge order={order} />
                  </div>
                  <p className='mt-1 line-clamp-1 text-sm text-slate-600'>
                    {order.primaryTest?.testName || "Lab order"}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-3 text-sm lg:block'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                      Ordered
                    </p>
                    <p className='mt-1 font-medium text-slate-950'>
                      {formatSafeDate(order.createdAt)}
                    </p>
                  </div>
                  <div className='lg:mt-3'>
                    <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                      Items
                    </p>
                    <p className='mt-1 font-medium text-slate-950'>
                      {Math.max(order.itemsCount || 0, 1)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                    Amount
                  </p>
                  <p className='mt-1 font-semibold text-slate-950'>
                    {formatCurrency(order.total)}
                  </p>
                </div>

                <Button asChild variant='outline' size='sm' className='w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700'>
                  <Link href={getOrderHref(order)}>
                    <Eye className='h-4 w-4' />
                    View
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
