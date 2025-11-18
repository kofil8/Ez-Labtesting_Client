"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ordersData from "@/data/orders.json";
import promoCodesData from "@/data/promo-codes.json";
import resultsData from "@/data/results.json";
import testsData from "@/data/tests.json";
import {
  calculateRevenueStats,
  getOrdersByStatus,
  getRecentOrders,
  getRevenueByMonth,
  getRevenueByPaymentMethod,
  getTopSellingTests,
  type Order,
} from "@/lib/admin-analytics";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  TestTube2,
} from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Color palette for charts
const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
};

const PIE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

export function AdminDashboard() {
  // Use useMemo to calculate stats from imported data
  const {
    stats,
    revenueByMonth,
    ordersByStatus,
    topSellingTests,
    revenueByPaymentMethod,
    recentOrders,
  } = useMemo(() => {
    const orders = ordersData as Order[];
    const tests = testsData as any[];
    const promoCodes = promoCodesData as any[];
    const results = resultsData as any[];

    // Calculate statistics
    const revenueStats = calculateRevenueStats(orders);
    const pendingResultsCount = results.filter(
      (r: any) => r.status === "pending" || r.status === "processing"
    ).length;
    const activeTestsCount = tests.filter((t: any) => t.enabled).length;

    // Calculate growth (mock for now - would need historical data)
    const previousMonthRevenue = revenueStats.totalRevenue * 0.88; // Simulate 12% growth
    const previousMonthOrders = orders.length * 0.92; // Simulate 8% growth
    const revenueGrowth =
      previousMonthRevenue > 0
        ? ((revenueStats.totalRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100
        : 0;
    const orderGrowth =
      previousMonthOrders > 0
        ? ((orders.length - previousMonthOrders) / previousMonthOrders) * 100
        : 0;

    return {
      stats: {
        totalRevenue: revenueStats.totalRevenue,
        totalOrders: revenueStats.totalOrders,
        pendingResults: pendingResultsCount,
        activeTests: activeTestsCount,
        averageOrderValue: revenueStats.averageOrderValue,
        completedOrders: revenueStats.completedOrders,
        revenueGrowth,
        orderGrowth,
        activePromoCodes: promoCodes.filter((p: any) => p.enabled).length,
      },
      revenueByMonth: getRevenueByMonth(orders),
      ordersByStatus: getOrdersByStatus(orders),
      topSellingTests: getTopSellingTests(orders, 5),
      revenueByPaymentMethod: getRevenueByPaymentMethod(orders),
      recentOrders: getRecentOrders(orders, 10),
    };
  }, []);

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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: stats.orderGrowth,
      icon: ShoppingCart,
      description: `${stats.completedOrders} completed`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Average Order Value",
      value: `$${stats.averageOrderValue.toFixed(2)}`,
      change: 5.2,
      icon: Activity,
      description: "Per order average",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Results",
      value: stats.pendingResults.toString(),
      change: -8.3,
      icon: TestTube2,
      description: "Awaiting processing",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Tests",
      value: stats.activeTests.toString(),
      change: 0,
      icon: Package,
      description: "Available for purchase",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Active Promo Codes",
      value: stats.activePromoCodes.toString(),
      change: 0,
      icon: CreditCard,
      description: "Currently active",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <Card
              key={index}
              className='overflow-hidden hover:shadow-lg transition-all duration-300'
            >
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold mb-1'>{stat.value}</div>
                <div className='flex items-center gap-2 text-xs'>
                  {stat.change !== 0 && (
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        isPositive ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {isPositive ? (
                        <ArrowUpRight className='h-3 w-3' />
                      ) : (
                        <ArrowDownRight className='h-3 w-3' />
                      )}
                      <span>{Math.abs(stat.change).toFixed(1)}%</span>
                    </div>
                  )}
                  <span className='text-muted-foreground'>
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Revenue Trend Chart */}
        <Card className='hover:shadow-lg transition-all duration-300'>
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
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis
                  dataKey='month'
                  className='text-xs'
                  tickFormatter={(value) => {
                    const [year, month] = value.split("-");
                    return new Date(
                      parseInt(year),
                      parseInt(month) - 1
                    ).toLocaleDateString("en-US", { month: "short" });
                  }}
                />
                <YAxis className='text-xs' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type='monotone'
                  dataKey='revenue'
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill='url(#colorRevenue)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className='hover:shadow-lg transition-all duration-300'>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Breakdown of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({
                    name,
                    percent,
                  }: {
                    name?: string;
                    percent?: number;
                  }) =>
                    `${name || "Unknown"}: ${((percent || 0) * 100).toFixed(
                      0
                    )}%`
                  }
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='count'
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Top Selling Tests */}
        <Card className='hover:shadow-lg transition-all duration-300'>
          <CardHeader>
            <CardTitle>Top Selling Tests</CardTitle>
            <CardDescription>Most popular tests by order count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={topSellingTests} layout='vertical'>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis type='number' className='text-xs' />
                <YAxis
                  dataKey='name'
                  type='category'
                  width={150}
                  className='text-xs'
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "count") return [value, "Orders"];
                    if (name === "revenue")
                      return [`$${value.toFixed(2)}`, "Revenue"];
                    return value;
                  }}
                />
                <Legend />
                <Bar
                  dataKey='count'
                  fill={CHART_COLORS.primary}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Payment Method */}
        <Card className='hover:shadow-lg transition-all duration-300'>
          <CardHeader>
            <CardTitle>Revenue by Payment Method</CardTitle>
            <CardDescription>
              Breakdown of revenue by payment type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={revenueByPaymentMethod}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis
                  dataKey='method'
                  className='text-xs'
                  tick={{ fontSize: 12 }}
                />
                <YAxis className='text-xs' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`,
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey='revenue'
                  fill={CHART_COLORS.secondary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className='hover:shadow-lg transition-all duration-300'>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-3 px-4 font-semibold text-sm text-muted-foreground'>
                    Order ID
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-sm text-muted-foreground'>
                    Customer
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-sm text-muted-foreground'>
                    Tests
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-sm text-muted-foreground'>
                    Amount
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-sm text-muted-foreground'>
                    Status
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-sm text-muted-foreground'>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className='border-b hover:bg-muted/50 transition-colors'
                  >
                    <td className='py-3 px-4 font-medium'>{order.id}</td>
                    <td className='py-3 px-4'>
                      {order.customerInfo ? (
                        <div>
                          <div className='font-medium'>
                            {order.customerInfo.firstName}{" "}
                            {order.customerInfo.lastName}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {order.customerInfo.email}
                          </div>
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>N/A</span>
                      )}
                    </td>
                    <td className='py-3 px-4'>
                      <div className='text-sm'>
                        {order.tests.length}{" "}
                        {order.tests.length === 1 ? "test" : "tests"}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {order.tests
                          .slice(0, 2)
                          .map((t: any) => t.testName)
                          .join(", ")}
                        {order.tests.length > 2 && "..."}
                      </div>
                    </td>
                    <td className='py-3 px-4 font-semibold'>
                      $
                      {order.totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          order.status === "completed" &&
                            "bg-green-100 text-green-800",
                          order.status === "pending" &&
                            "bg-yellow-100 text-yellow-800",
                          order.status === "processing" &&
                            "bg-blue-100 text-blue-800",
                          order.status === "cancelled" &&
                            "bg-red-100 text-red-800",
                          ![
                            "completed",
                            "pending",
                            "processing",
                            "cancelled",
                          ].includes(order.status) &&
                            "bg-gray-100 text-gray-800"
                        )}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-sm text-muted-foreground'>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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
