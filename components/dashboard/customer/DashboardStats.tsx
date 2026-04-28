import type {
  CustomerDashboardOrder,
  CustomerDashboardViewer,
} from "@/lib/dashboard/customer.server";
import { formatCurrency } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  FileCheck2,
  WalletCards,
} from "lucide-react";
import { getDashboardSummary } from "./dashboard-helpers";

export function DashboardStats({
  viewer,
  orders,
}: {
  viewer: CustomerDashboardViewer;
  orders: CustomerDashboardOrder[];
}) {
  const summary = getDashboardSummary(viewer, orders);

  const cards = [
    {
      label: "Total Orders",
      value: summary.totalOrders.toString(),
      helper: "All lab orders",
      icon: ClipboardList,
      tone: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Active",
      value: summary.active.toString(),
      helper: "In checkout or fulfillment",
      icon: Activity,
      tone: "text-cyan-600 bg-cyan-50 border-cyan-100",
    },
    {
      label: "Results Ready",
      value: summary.resultsReady.toString(),
      helper: "Completed reports",
      icon: FileCheck2,
      tone: "text-teal-600 bg-teal-50 border-teal-100",
    },
    {
      label: "Needs Help",
      value: summary.attention.toString(),
      helper: "Review or support",
      icon: AlertTriangle,
      tone: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      label: "Total Spend",
      value: formatCurrency(summary.totalSpent),
      helper: "Recorded order totals",
      icon: WalletCards,
      tone: "text-blue-700 bg-blue-50 border-blue-100",
    },
  ];

  return (
    <section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-5'>
      {cards.map(({ label, value, helper, icon: Icon, tone }) => (
        <div
          key={label}
          className='rounded-2xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/25 transition-shadow hover:shadow-xl hover:shadow-blue-100/40'
        >
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                {label}
              </p>
              <p className='mt-2 break-words text-2xl font-semibold tracking-normal text-slate-950'>
                {value}
              </p>
            </div>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${tone}`}>
              <Icon className='h-4 w-4' />
            </span>
          </div>
          <p className='mt-3 text-sm leading-5 text-slate-600'>{helper}</p>
        </div>
      ))}
    </section>
  );
}
