import { Button } from "@/components/ui/button";
import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, ClipboardList } from "lucide-react";
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
    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-slate-950'>
            Recent Orders
          </h2>
          <p className='mt-1 text-sm text-slate-600'>
            Latest order activity and current fulfillment status.
          </p>
        </div>
        <Button asChild variant='outline' size='sm' className='w-full sm:w-auto'>
          <Link href='/profile/orders'>View All Orders</Link>
        </Button>
      </div>

      {ordersError ? (
        <div className='mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
          <div className='flex gap-3'>
            <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
            <p>{ordersError}</p>
          </div>
        </div>
      ) : null}

      {recentOrders.length === 0 && !ordersError ? (
        <div className='mt-5'>
          <EmptyState
            icon={ClipboardList}
            title='No orders yet'
            description='Start by browsing available lab tests. Your orders and result status will appear here.'
            actionHref='/tests'
            actionLabel='Browse Tests'
          />
        </div>
      ) : null}

      {recentOrders.length > 0 ? (
        <>
          <div className='mt-5 hidden overflow-x-auto rounded-2xl border border-slate-200 lg:block'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-slate-50 text-xs font-semibold uppercase text-slate-500'>
                <tr>
                  <th className='whitespace-nowrap px-4 py-3'>Order ID</th>
                  <th className='min-w-[220px] px-4 py-3'>Test</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3'>Date</th>
                  <th className='px-4 py-3 text-right'>Amount</th>
                  <th className='px-4 py-3 text-right'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200'>
                {recentOrders.map((order) => (
                  <tr key={order.id} className='bg-white'>
                    <td className='whitespace-nowrap px-4 py-4 font-medium text-slate-950'>
                      {order.orderNumber}
                    </td>
                    <td className='max-w-[260px] px-4 py-4 text-slate-600'>
                      <span className='line-clamp-1'>
                        {order.primaryTest?.testName || "Lab order"}
                      </span>
                    </td>
                    <td className='px-4 py-4'>
                      <StatusBadge order={order} />
                    </td>
                    <td className='px-4 py-4 text-slate-600'>
                      {formatSafeDate(order.createdAt)}
                    </td>
                    <td className='px-4 py-4 text-right font-medium text-slate-950'>
                      {formatCurrency(order.total)}
                    </td>
                    <td className='px-4 py-4 text-right'>
                      <Button asChild variant='ghost' size='sm'>
                        <Link href={getOrderHref(order)}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-5 space-y-3 lg:hidden'>
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className='rounded-2xl border border-slate-200 bg-slate-50 p-4'
              >
                <div className='flex flex-col gap-3 xs:flex-row xs:items-start xs:justify-between'>
                  <div className='min-w-0'>
                    <p className='font-semibold text-slate-950'>
                      {order.orderNumber}
                    </p>
                    <p className='mt-1 line-clamp-2 text-sm text-slate-600'>
                      {order.primaryTest?.testName || "Lab order"}
                    </p>
                  </div>
                  <StatusBadge order={order} />
                </div>
                <div className='mt-4 grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-slate-500'>Date</p>
                    <p className='mt-1 font-medium text-slate-950'>
                      {formatSafeDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className='text-slate-500'>Amount</p>
                    <p className='mt-1 font-medium text-slate-950'>
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
                <Button asChild variant='outline' size='sm' className='mt-4 w-full'>
                  <Link href={getOrderHref(order)}>View Order</Link>
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
