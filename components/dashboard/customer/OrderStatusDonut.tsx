"use client";

import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getOrderStatusDistribution } from "./dashboard-helpers";

export function OrderStatusDonut({
  orders,
}: {
  orders: CustomerDashboardOrder[];
}) {
  const data = getOrderStatusDistribution(orders);
  const visibleData = data.filter((item) => item.value > 0);
  const hasOrders = orders.length > 0;

  return (
    <section className='rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
          Order mix
        </p>
        <h2 className='mt-1 text-lg font-semibold text-slate-950'>
          Status Breakdown
        </h2>
      </div>

      <div className='mt-5 h-56'>
        {hasOrders ? (
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={visibleData}
                dataKey='value'
                nameKey='name'
                innerRadius='58%'
                outerRadius='82%'
                paddingAngle={3}
              >
                {visibleData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className='flex h-full items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/50 text-center'>
            <p className='max-w-[220px] text-sm leading-6 text-slate-600'>
              Status mix will populate after you place lab orders.
            </p>
          </div>
        )}
      </div>

      <div className='mt-4 grid grid-cols-2 gap-2'>
        {data.map((item) => (
          <div key={item.name} className='flex min-w-0 items-center gap-2 text-sm'>
            <span
              className='h-2.5 w-2.5 shrink-0 rounded-full'
              style={{ backgroundColor: item.color }}
            />
            <span className='min-w-0 flex-1 truncate text-slate-600'>
              {item.name}
            </span>
            <span className='font-semibold text-slate-950'>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
