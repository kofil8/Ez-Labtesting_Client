"use client";

import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { ClipboardList } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getOrderActivityData } from "./dashboard-helpers";

export function OrderActivityChart({
  orders,
}: {
  orders: CustomerDashboardOrder[];
}) {
  const data = getOrderActivityData(orders);
  const hasOrders = orders.length > 0;

  return (
    <section className='rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6 xl:col-span-2'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
            Order activity
          </p>
          <h2 className='mt-1 text-lg font-semibold text-slate-950'>
            Weekly Lab Activity
          </h2>
        </div>
        <span className='rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
          Real order data
        </span>
      </div>

      <div className={hasOrders ? "mt-5 h-64" : "mt-5 h-32 sm:h-36"}>
        {hasOrders ? (
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data} margin={{ left: -18, right: 8, top: 12 }}>
              <defs>
                <linearGradient id='ordersFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#2563eb' stopOpacity={0.32} />
                  <stop offset='95%' stopColor='#2563eb' stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id='resultsFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#06b6d4' stopOpacity={0.22} />
                  <stop offset='95%' stopColor='#06b6d4' stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke='#e2e8f0' strokeDasharray='4 4' vertical={false} />
              <XAxis
                dataKey='label'
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                }}
              />
              <Area
                type='monotone'
                dataKey='orders'
                name='Orders placed'
                stroke='#2563eb'
                strokeWidth={2.5}
                fill='url(#ordersFill)'
              />
              <Area
                type='monotone'
                dataKey='results'
                name='Results completed'
                stroke='#0891b2'
                strokeWidth={2.5}
                fill='url(#resultsFill)'
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className='flex h-full items-center justify-center gap-4 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-4 text-left'>
            <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm'>
              <ClipboardList className='h-5 w-5' />
            </span>
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-slate-950'>
                No order activity yet
              </p>
              <p className='mt-1 max-w-md text-sm leading-6 text-slate-600'>
                Weekly order and result trends will appear here after checkout.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
