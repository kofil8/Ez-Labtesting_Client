import type {
  CustomerDashboardOrder,
  CustomerDashboardViewer,
} from "@/lib/dashboard/customer.server";
import { formatCurrency } from "@/lib/utils";
import {
  CircleDollarSign,
  ClipboardList,
  FileCheck2,
  UserCheck,
} from "lucide-react";
import {
  getProfileReadinessPercent,
  isOpenOrder,
  isResultsReady,
} from "./dashboard-helpers";

export function DashboardStats({
  viewer,
  orders,
}: {
  viewer: CustomerDashboardViewer;
  orders: CustomerDashboardOrder[];
}) {
  const openOrders = orders.filter(isOpenOrder).length;
  const resultsReady = orders.filter(isResultsReady).length;
  const readiness = getProfileReadinessPercent(viewer);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  const cards = [
    {
      label: "Open Orders",
      value: openOrders.toString(),
      helper: "Orders in checkout, review, or fulfillment.",
      icon: ClipboardList,
    },
    {
      label: "Results Ready",
      value: resultsReady.toString(),
      helper: "Completed reports available to view.",
      icon: FileCheck2,
    },
    {
      label: "Profile Completion",
      value: `${readiness}%`,
      helper: "Core patient and security details on file.",
      icon: UserCheck,
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      helper: "Recorded totals across your orders.",
      icon: CircleDollarSign,
    },
  ];

  return (
    <section className='grid gap-4 sm:grid-cols-2 2xl:grid-cols-4'>
      {cards.map(({ label, value, helper, icon: Icon }) => (
        <div
          key={label}
          className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
        >
          <div className='flex items-start justify-between gap-4'>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-slate-500'>{label}</p>
              <p className='mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950'>
                {value}
              </p>
            </div>
            <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100'>
              <Icon className='h-5 w-5' />
            </span>
          </div>
          <p className='mt-3 text-sm leading-6 text-slate-600'>{helper}</p>
        </div>
      ))}
    </section>
  );
}
