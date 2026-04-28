"use client";

import type {
  CustomerDashboardOrder,
  CustomerDashboardViewer,
} from "@/lib/dashboard/customer.server";
import { DashboardStats } from "./DashboardStats";
import { DashboardVisuals } from "./DashboardVisuals";
import { DashboardWelcome } from "./DashboardWelcome";
import { sortOrdersByNewest } from "./dashboard-helpers";
import { HealthInsightsPlaceholder } from "./HealthInsightsPlaceholder";
import { NextActionCard } from "./NextActionCard";
import { ProfileReadiness } from "./ProfileReadiness";
import { RecentOrders } from "./RecentOrders";
import { RecentResults } from "./RecentResults";

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

  return (
    <div className='space-y-5 lg:space-y-6'>
      <DashboardWelcome viewer={viewer} />
      <DashboardStats viewer={viewer} orders={sortedOrders} />
      <DashboardVisuals orders={sortedOrders} />

      <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
        <div className='min-w-0 space-y-5'>
          <NextActionCard viewer={viewer} orders={sortedOrders} />
          <RecentOrders orders={sortedOrders} ordersError={ordersError} />
          <RecentResults orders={sortedOrders} />
        </div>

        <aside className='grid gap-5 md:grid-cols-2 xl:block xl:space-y-5'>
          <ProfileReadiness viewer={viewer} />
          <HealthInsightsPlaceholder />
        </aside>
      </div>
    </div>
  );
}
