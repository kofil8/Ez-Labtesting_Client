"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getManualReviewOrders,
  retryOrderAccessPlacement,
  type ManualReviewOrderSummary,
} from "@/lib/services/order.service";
import {
  getSuperAdminDashboardSummary,
  type SuperAdminDashboardSummary,
} from "@/lib/services/superadmin.service";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Lock,
  ShoppingCart,
  TestTube2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Color palette for charts
const CHART_COLORS = {
  primary: "#dc2626",
  secondary: "#f97316",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
};

const PIE_COLORS = [
  "#dc2626",
  "#f97316",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
  "#8b5cf6",
];

export function SuperAdminDashboard() {
  const [dashboardSummary, setDashboardSummary] =
    useState<SuperAdminDashboardSummary | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const [manualReviewOrders, setManualReviewOrders] = useState<
    ManualReviewOrderSummary[]
  >([]);
  const [isManualReviewLoading, setIsManualReviewLoading] = useState(true);
  const [manualReviewError, setManualReviewError] = useState<string | null>(
    null,
  );
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);
  const [isRetryingAllVisible, setIsRetryingAllVisible] = useState(false);
  const [manualReviewTimeFilter, setManualReviewTimeFilter] = useState<
    "all" | "24h" | "72h"
  >("all");
  const [bulkRetrySummary, setBulkRetrySummary] = useState<{
    attempted: number;
    succeeded: number;
    failed: number;
    failedOrderIds: string[];
  } | null>(null);

  const loadManualReviewOrders = async () => {
    try {
      setIsManualReviewLoading(true);
      const orders = await getManualReviewOrders(50);
      setManualReviewOrders(orders);
      setManualReviewError(null);
    } catch (error: any) {
      setManualReviewError(
        error?.message || "Failed to load manual review orders.",
      );
    } finally {
      setIsManualReviewLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsDashboardLoading(true);
        const summary = await getSuperAdminDashboardSummary();
        setDashboardSummary(summary);
        setDashboardError(null);
      } catch (error: any) {
        setDashboardError(error?.message || "Failed to load dashboard data.");
      } finally {
        setIsDashboardLoading(false);
      }
    };

    loadDashboard();
    loadManualReviewOrders();
  }, []);

  const filteredManualReviewOrders = useMemo(() => {
    if (manualReviewTimeFilter === "all") {
      return manualReviewOrders;
    }

    const now = Date.now();
    const cutoffMs =
      manualReviewTimeFilter === "24h"
        ? 24 * 60 * 60 * 1000
        : 72 * 60 * 60 * 1000;

    return manualReviewOrders.filter((order) => {
      const updatedTime = new Date(order.updatedAt).getTime();
      return Number.isFinite(updatedTime) && now - updatedTime <= cutoffMs;
    });
  }, [manualReviewOrders, manualReviewTimeFilter]);

  const handleRetryManualReviewOrder = async (
    orderId: string,
    shouldRefresh = true,
    suppressErrorSurface = false,
  ) => {
    try {
      setRetryingOrderId(orderId);
      await retryOrderAccessPlacement(orderId);
      if (shouldRefresh) {
        await loadManualReviewOrders();
      }
      return true;
    } catch (error: any) {
      if (!suppressErrorSurface) {
        setManualReviewError(
          error?.message || "Failed to retry ACCESS placement for this order.",
        );
      }
      return false;
    } finally {
      setRetryingOrderId(null);
    }
  };

  const handleRetryAllVisible = async () => {
    if (filteredManualReviewOrders.length === 0) {
      return;
    }

    try {
      setIsRetryingAllVisible(true);
      setManualReviewError(null);
      setBulkRetrySummary(null);

      let succeeded = 0;
      let failed = 0;
      const failedOrderIds: string[] = [];

      for (const order of filteredManualReviewOrders) {
        const ok = await handleRetryManualReviewOrder(order.id, false, true);
        if (ok) {
          succeeded += 1;
        } else {
          failed += 1;
          if (failedOrderIds.length < 3) {
            failedOrderIds.push(order.id);
          }
        }
      }

      await loadManualReviewOrders();
      setBulkRetrySummary({
        attempted: filteredManualReviewOrders.length,
        succeeded,
        failed,
        failedOrderIds,
      });
    } catch (error: any) {
      setManualReviewError(
        error?.message || "Failed to retry all visible manual review orders.",
      );
    } finally {
      setIsRetryingAllVisible(false);
    }
  };

  const stats =
    dashboardSummary?.stats ||
    ({
      totalRevenue: 0,
      totalOrders: 0,
      pendingResults: 0,
      activeTests: 0,
      averageOrderValue: 0,
      completedOrders: 0,
      revenueGrowth: 0,
      orderGrowth: 0,
      activePromoCodes: 0,
      totalUsers: 0,
      activeAdmins: 0,
    } as const);

  const revenueByMonth = dashboardSummary?.revenueByMonth || [];
  const ordersByStatus = dashboardSummary?.ordersByStatus || [];
  const topSellingTests = dashboardSummary?.topSellingTests || [];
  const revenueByPaymentMethod = dashboardSummary?.revenueByPaymentMethod || [];
  const recentOrders = dashboardSummary?.recentOrders || [];

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: stats.revenueGrowth,
      icon: DollarSign,
      description: "All time revenue",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: stats.orderGrowth,
      icon: ShoppingCart,
      description: `${stats.completedOrders} completed`,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      title: "Platform Users",
      value: stats.totalUsers.toString(),
      change: 12.5,
      icon: Users,
      description: "Total registered users",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Active Admins",
      value: stats.activeAdmins.toString(),
      change: 0,
      icon: Lock,
      description: "System administrators",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Pending Results",
      value: stats.pendingResults.toString(),
      change: -8.2,
      icon: Activity,
      description: "Tests awaiting results",
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      title: "Active Tests",
      value: stats.activeTests.toString(),
      change: 2.1,
      icon: TestTube2,
      description: `${stats.activePromoCodes} promo codes`,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
  ];

  return (
    <div className='space-y-8'>
      {/* System Alert Banner */}
      <div className='bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 flex gap-3'>
        <Lock className='h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
        <div>
          <h3 className='font-semibold text-red-900 dark:text-red-200'>
            Superadmin Access
          </h3>
          <p className='text-sm text-red-800 dark:text-red-300 mt-1'>
            You have full system access. All changes are logged and monitored.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      {dashboardError && (
        <div className='bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3'>
          <p className='text-sm text-red-700 dark:text-red-300'>
            {dashboardError}
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change > 0;
          const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

          return (
            <Card key={index} className='hover:shadow-lg transition-shadow'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {card.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", card.bgColor)}>
                  <Icon className={cn("h-4 w-4", card.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{card.value}</div>
                <div className='flex items-center gap-1 mt-2'>
                  <ChangeIcon
                    className={cn(
                      "h-4 w-4",
                      isPositive ? "text-green-600" : "text-red-600",
                    )}
                  />
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      isPositive ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {Math.abs(card.change)}%
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isDashboardLoading && (
        <p className='text-sm text-muted-foreground'>
          Loading dashboard data...
        </p>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Revenue Chart */}
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset='95%'
                      stopColor={CHART_COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='revenue'
                  stroke={CHART_COLORS.primary}
                  fillOpacity={1}
                  fill='url(#colorRevenue)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>
              Distribution across order statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Top Selling Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Tests</CardTitle>
            <CardDescription>Best performing tests by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={topSellingTests}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='revenue' fill={CHART_COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue breakdown by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={revenueByPaymentMethod}
                layout='vertical'
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis dataKey='name' type='category' width={140} />
                <Tooltip />
                <Bar dataKey='revenue' fill={CHART_COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Manual Review Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Review Queue</CardTitle>
          <CardDescription>
            Paid orders requiring operations follow-up due to lab submission
            interruptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
            <div className='flex flex-wrap items-center gap-2'>
              <Button
                size='sm'
                variant={
                  manualReviewTimeFilter === "all" ? "default" : "outline"
                }
                onClick={() => setManualReviewTimeFilter("all")}
              >
                All
              </Button>
              <Button
                size='sm'
                variant={
                  manualReviewTimeFilter === "24h" ? "default" : "outline"
                }
                onClick={() => setManualReviewTimeFilter("24h")}
              >
                Last 24h
              </Button>
              <Button
                size='sm'
                variant={
                  manualReviewTimeFilter === "72h" ? "default" : "outline"
                }
                onClick={() => setManualReviewTimeFilter("72h")}
              >
                Last 72h
              </Button>
            </div>

            <div className='flex items-center gap-2'>
              <p className='text-xs text-muted-foreground'>
                Visible: {filteredManualReviewOrders.length}
              </p>
              <Button
                size='sm'
                variant='outline'
                onClick={handleRetryAllVisible}
                disabled={
                  isRetryingAllVisible ||
                  isManualReviewLoading ||
                  filteredManualReviewOrders.length === 0
                }
              >
                {isRetryingAllVisible ? "Retrying All..." : "Retry All Visible"}
              </Button>
            </div>
          </div>

          {bulkRetrySummary && (
            <div
              className={cn(
                "mb-4 rounded-md border px-3 py-2 text-sm",
                bulkRetrySummary.failed > 0
                  ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"
                  : "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/20 dark:text-green-300",
              )}
            >
              Retry summary: {bulkRetrySummary.succeeded}/
              {bulkRetrySummary.attempted} succeeded, {bulkRetrySummary.failed}{" "}
              failed.
              {bulkRetrySummary.failedOrderIds.length > 0 && (
                <div className='mt-1 text-xs'>
                  Failed IDs: {bulkRetrySummary.failedOrderIds.join(", ")}
                </div>
              )}
            </div>
          )}

          {isManualReviewLoading ? (
            <p className='text-sm text-muted-foreground'>Loading queue...</p>
          ) : manualReviewError ? (
            <div className='space-y-3'>
              <p className='text-sm text-red-600 dark:text-red-400'>
                {manualReviewError}
              </p>
              <Button variant='outline' onClick={loadManualReviewOrders}>
                Refresh
              </Button>
            </div>
          ) : filteredManualReviewOrders.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No manual-review-required orders match this filter.
            </p>
          ) : (
            <div className='relative w-full overflow-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Order
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Customer
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Test
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Paid
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Updated
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManualReviewOrders.map((order) => (
                    <tr key={order.id} className='border-b hover:bg-muted/50'>
                      <td className='h-12 px-4 align-middle font-mono text-xs'>
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className='h-12 px-4 align-middle'>
                        {order.user?.email || "Unknown"}
                      </td>
                      <td className='h-12 px-4 align-middle'>
                        {order.test?.testName || "-"}
                      </td>
                      <td className='h-12 px-4 align-middle font-semibold'>
                        ${order.total.toFixed(2)}
                      </td>
                      <td className='h-12 px-4 align-middle text-xs text-muted-foreground'>
                        {new Date(order.updatedAt).toLocaleString()}
                      </td>
                      <td className='h-12 px-4 align-middle'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleRetryManualReviewOrder(order.id)}
                          disabled={
                            retryingOrderId === order.id || isRetryingAllVisible
                          }
                        >
                          {retryingOrderId === order.id
                            ? "Retrying..."
                            : "Retry"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative w-full overflow-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Order ID
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Customer
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Amount
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Status
                  </th>
                  <th className='h-12 px-4 text-left align-middle font-medium'>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className='border-b hover:bg-muted/50'>
                    <td className='h-12 px-4 align-middle font-mono text-xs'>
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className='h-12 px-4 align-middle'>
                      {order.customerName}
                    </td>
                    <td className='h-12 px-4 align-middle font-semibold'>
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className='h-12 px-4 align-middle'>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          order.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                        )}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className='h-12 px-4 align-middle text-xs text-muted-foreground'>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
