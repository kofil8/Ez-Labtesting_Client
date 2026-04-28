"use client";

import type {
  CustomerDashboardOrder,
  CustomerDashboardViewer,
} from "@/lib/dashboard/customer.server";
import { DashboardStats } from "./DashboardStats";
import { DashboardWelcome } from "./DashboardWelcome";
import {
  isOpenOrder,
  sortOrdersByNewest,
} from "./dashboard-helpers";
import { NextActionCard } from "./NextActionCard";
import { ProfileReadiness } from "./ProfileReadiness";
import { RecentOrders } from "./RecentOrders";
import { RecentResults } from "./RecentResults";
import { SupportCard } from "./SupportCard";

export function CustomerDashboardOverview({
  viewer,
  orders,
  ordersError,
}: {
  viewer: CustomerDashboardViewer;
  orders: CustomerDashboardOrder[];
  ordersError?: string | null;
}) {
  const sortedOrders = sortOrdersByNewest(orders);
  const activeOrder = sortedOrders.find(isOpenOrder) ?? null;

  return (
    <div className='space-y-6'>
      <DashboardWelcome viewer={viewer} />
      <DashboardStats viewer={viewer} orders={sortedOrders} />

      <div className='grid gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]'>
        <div className='min-w-0 space-y-6'>
          <NextActionCard viewer={viewer} activeOrder={activeOrder} />
          <RecentOrders orders={sortedOrders} ordersError={ordersError} />
          <RecentResults orders={sortedOrders} />
        </div>

        <aside className='grid gap-6 lg:grid-cols-2 2xl:block 2xl:space-y-6'>
          <ProfileReadiness viewer={viewer} />
          <SupportCard />
        </aside>
      </div>
    </div>
  );
}
