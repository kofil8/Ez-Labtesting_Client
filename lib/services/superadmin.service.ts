import { clientFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-contracts/endpoints";

export interface SuperAdminDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingResults: number;
  activeTests: number;
  averageOrderValue: number;
  completedOrders: number;
  revenueGrowth: number;
  orderGrowth: number;
  activePromoCodes: number;
  totalUsers: number;
  activeAdmins: number;
}

export interface DashboardChartPoint {
  name?: string;
  month?: string;
  value?: number;
  revenue?: number;
}

export interface RecentDashboardOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface SuperAdminDashboardSummary {
  stats: SuperAdminDashboardStats;
  revenueByMonth: DashboardChartPoint[];
  ordersByStatus: DashboardChartPoint[];
  topSellingTests: DashboardChartPoint[];
  revenueByPaymentMethod: DashboardChartPoint[];
  recentOrders: RecentDashboardOrder[];
}

export async function getSuperAdminDashboardSummary(): Promise<SuperAdminDashboardSummary> {
  const res = await clientFetch(API_ENDPOINTS.SUPERADMIN.DASHBOARD_SUMMARY, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to load dashboard summary");
  }

  const payload = await res.json();
  const data = payload?.data;

  if (!data?.stats) {
    throw new Error("Invalid dashboard summary response");
  }

  return {
    stats: data.stats,
    revenueByMonth: Array.isArray(data.revenueByMonth)
      ? data.revenueByMonth
      : [],
    ordersByStatus: Array.isArray(data.ordersByStatus)
      ? data.ordersByStatus
      : [],
    topSellingTests: Array.isArray(data.topSellingTests)
      ? data.topSellingTests
      : [],
    revenueByPaymentMethod: Array.isArray(data.revenueByPaymentMethod)
      ? data.revenueByPaymentMethod
      : [],
    recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
  };
}
