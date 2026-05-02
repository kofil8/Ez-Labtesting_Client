"use client";

import { OrderTrackingCard } from "@/components/results/OrderTrackingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  getCustomerOrdersPreloaded,
  invalidateCustomerOrders,
} from "@/lib/dashboard/customer-preload.client";
import {
  retryOrderAccessPlacement,
  UserOrderSummary,
} from "@/lib/services/order.service";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  FlaskConical,
  Loader2,
  Receipt,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type OrderFilter = "ALL" | "ACTIVE" | "COMPLETED" | "ATTENTION";

function getStatusMeta(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "COMPLETED") {
    return {
      label: "Results ready",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    };
  }

  if (normalized === "FAILED" || normalized === "CANCELLED") {
    return {
      label: normalized === "FAILED" ? "Failed" : "Cancelled",
      className: "bg-rose-50 text-rose-700 border-rose-200",
      icon: AlertCircle,
    };
  }

  if (normalized === "REFUNDED") {
    return {
      label: "Refunded",
      className: "bg-slate-100 text-slate-700 border-slate-200",
      icon: Receipt,
    };
  }

  if (normalized === "MANUAL_REVIEW") {
    return {
      label: "Needs review",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertCircle,
    };
  }

  if (normalized === "LAB_ORDER_PLACED") {
    return {
      label: "Ready for lab visit",
      className: "bg-sky-50 text-sky-700 border-sky-200",
      icon: FlaskConical,
    };
  }

  if (normalized === "PAID") {
    return {
      label: "In progress",
      className: "bg-cyan-50 text-cyan-700 border-cyan-200",
      icon: Receipt,
    };
  }

  return {
    label: normalized === "PENDING_PAYMENT" ? "Pending payment" : normalized,
    className: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock3,
  };
}

function getTrackingData(order: UserOrderSummary) {
  const statusUpper = order.status.toUpperCase();

  const currentStep =
    statusUpper === "PENDING_PAYMENT"
      ? 1
      : statusUpper === "PAID"
        ? 2
        : statusUpper === "LAB_ORDER_PLACED"
          ? 3
          : statusUpper === "COMPLETED"
            ? 4
            : 1;

  const trackingStatus =
    statusUpper === "COMPLETED"
      ? "completed"
      : statusUpper === "FAILED" || statusUpper === "CANCELLED"
        ? "failed"
        : order.manualReviewRequired
          ? "needs_review"
          : statusUpper === "PENDING_PAYMENT"
            ? "pending"
            : "processing";

  const trackingDescription =
    statusUpper === "COMPLETED"
      ? "Your final report is ready to open."
      : statusUpper === "LAB_ORDER_PLACED"
        ? "Your requisition is ready. Visit the lab when convenient."
        : statusUpper === "PAID"
          ? "Payment has cleared and the lab order is being prepared."
          : statusUpper === "PENDING_PAYMENT"
            ? "Checkout is not complete yet."
            : order.manualReviewRequired
              ? "The order is being reviewed before lab submission."
              : "This order needs support follow-up.";

  return {
    currentStep,
    status: trackingStatus as
      | "pending"
      | "processing"
      | "completed"
      | "failed"
      | "needs_review",
    description: trackingDescription,
  };
}

export function ResultsList() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<UserOrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderFilter>("ALL");

  const loadOrders = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getCustomerOrdersPreloaded(user.id);
      setOrders(data);
    } catch (loadError) {
      console.error("Error loading orders:", loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your orders.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user?.id) {
      const timeoutId = window.setTimeout(() => {
        void loadOrders();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [isAuthLoading, isAuthenticated, user, loadOrders]);

  const filteredOrders = orders.filter((order) => {
    const status = order.status.toUpperCase();
    const isAttention =
      status === "FAILED" ||
      status === "CANCELLED" ||
      status === "REFUNDED" ||
      status === "LAB_SUBMISSION_FAILED_RETRYABLE" ||
      status === "LAB_SUBMISSION_FAILED_FINAL" ||
      order.manualReviewRequired;
    const isCompleted = status === "COMPLETED";
    const isActive = !isCompleted && !isAttention;

    if (filter === "ALL") return true;
    if (filter === "COMPLETED") return isCompleted;
    if (filter === "ATTENTION") return isAttention;
    return isActive;
  });

  const stats = {
    total: orders.length,
    active: orders.filter((order) => {
      const status = order.status.toUpperCase();
      return ![
        "COMPLETED",
        "FAILED",
        "CANCELLED",
        "REFUNDED",
        "LAB_SUBMISSION_FAILED_RETRYABLE",
        "LAB_SUBMISSION_FAILED_FINAL",
      ].includes(status) && !order.manualReviewRequired;
    }).length,
    completed: orders.filter((order) => order.status.toUpperCase() === "COMPLETED")
      .length,
    attention: orders.filter(
      (order) =>
        order.status.toUpperCase() === "FAILED" ||
        order.status.toUpperCase() === "CANCELLED" ||
        order.status.toUpperCase() === "REFUNDED" ||
        order.status.toUpperCase() === "LAB_SUBMISSION_FAILED_RETRYABLE" ||
        order.status.toUpperCase() === "LAB_SUBMISSION_FAILED_FINAL" ||
        order.manualReviewRequired,
    ).length,
  };

  if (isAuthLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-28 w-full rounded-[24px]' />
        <Skeleton className='h-48 w-full rounded-[24px]' />
        <Skeleton className='h-48 w-full rounded-[24px]' />
      </div>
    );
  }

  if (!isAuthenticated || !user?.id) {
    return (
      <Card className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
        <CardContent className='pb-8 pt-8 text-center'>
          <AlertCircle className='mx-auto mb-3 h-10 w-10 text-slate-400' />
          <h2 className='text-xl font-semibold text-slate-900'>Sign in required</h2>
          <p className='mb-5 mt-2 text-slate-600'>
            Sign in to view orders, requisitions, and lab results.
          </p>
          <Button asChild className='rounded-full'>
            <Link href='/login?from=/dashboard/customer/results'>
              Go to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='rounded-[28px] border-rose-200 bg-rose-50/70'>
        <CardContent className='pb-6 pt-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h2 className='text-lg font-semibold text-rose-700'>
                Unable to load orders
              </h2>
              <p className='mt-1 text-sm text-rose-700/90'>{error}</p>
            </div>
            <Button
              variant='outline'
              onClick={loadOrders}
              className='shrink-0 rounded-full'
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        <Card className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
          <CardContent className='flex items-center justify-center gap-2 pb-6 pt-6 text-slate-600'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Loading your orders...
          </CardContent>
        </Card>
        <Skeleton className='h-48 w-full rounded-[24px]' />
        <Skeleton className='h-48 w-full rounded-[24px]' />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className='rounded-[28px] border-sky-200 bg-sky-50/50 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
        <CardContent className='pb-10 pt-10 text-center'>
          <FileText className='mx-auto mb-4 h-14 w-14 text-slate-400' />
          <h2 className='text-2xl font-semibold text-slate-900'>No orders yet</h2>
          <p className='mb-6 mt-2 text-slate-600'>
            Place your first lab order to track status and documents here.
          </p>
          <Button asChild size='lg' className='rounded-full'>
            <Link href='/tests'>Browse Tests</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const filterButton = (key: OrderFilter, label: string, count: number) => (
    <Button
      key={key}
      size='sm'
      variant={filter === key ? "default" : "outline"}
      onClick={() => setFilter(key)}
      className={cn(
        "rounded-full",
        filter === key && "bg-sky-600 hover:bg-sky-700",
      )}
    >
      {label} ({count})
    </Button>
  );

  return (
    <div className='space-y-5'>
      <Card className='rounded-[30px] border-slate-200/80 bg-[linear-gradient(135deg,rgba(14,165,233,0.12)_0%,rgba(255,255,255,0.96)_52%,rgba(16,185,129,0.08)_100%)] shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)]'>
        <CardContent className='grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4'>
          <div className='rounded-[22px] border border-white/70 bg-white/85 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Total orders
            </p>
            <p className='mt-2 text-2xl font-semibold text-slate-950'>
              {stats.total}
            </p>
          </div>
          <div className='rounded-[22px] border border-white/70 bg-white/85 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Active
            </p>
            <p className='mt-2 text-2xl font-semibold text-slate-950'>
              {stats.active}
            </p>
          </div>
          <div className='rounded-[22px] border border-white/70 bg-white/85 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Results ready
            </p>
            <p className='mt-2 text-2xl font-semibold text-slate-950'>
              {stats.completed}
            </p>
          </div>
          <div className='rounded-[22px] border border-white/70 bg-white/85 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Needs help
            </p>
            <p className='mt-2 text-2xl font-semibold text-rose-700'>
              {stats.attention}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className='flex flex-wrap gap-2'>
        {filterButton("ALL", "All", stats.total)}
        {filterButton("ACTIVE", "Active", stats.active)}
        {filterButton("COMPLETED", "Completed", stats.completed)}
        {filterButton("ATTENTION", "Attention", stats.attention)}
      </div>

      {filteredOrders.length === 0 ? (
        <Card className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
          <CardContent className='pb-8 pt-8 text-center'>
            <p className='text-slate-600'>No orders in this view.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-5'>
          {filteredOrders.map((order) => {
            const status = getStatusMeta(order.status);
            const StatusIcon = status.icon;
            const tracking = getTrackingData(order);

            return (
              <div key={order.id} className='space-y-3'>
                <Card className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
                  <CardHeader className='pb-4'>
                    <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                      <div>
                        <CardTitle className='text-lg text-slate-900'>
                          {order.orderNumber}
                        </CardTitle>
                        <p className='mt-1 text-sm text-slate-600'>
                          {order.primaryTest?.testName || "Lab order"} • Ordered{" "}
                          {formatDateShort(order.createdAt)}
                        </p>
                      </div>

                      <Badge
                        variant='outline'
                        className={cn("rounded-full font-medium", status.className)}
                      >
                        <StatusIcon className='mr-1 h-3.5 w-3.5' />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className='grid gap-3 sm:grid-cols-3'>
                    <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/80 p-4'>
                      <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                        Total paid
                      </p>
                      <p className='mt-2 text-base font-semibold text-slate-900'>
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                    <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/80 p-4'>
                      <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                        Items
                      </p>
                      <p className='mt-2 text-base font-semibold text-slate-900'>
                        {Math.max(order.itemsCount || 0, 1)}
                      </p>
                    </div>
                    <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/80 p-4'>
                      <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                        Last update
                      </p>
                      <p className='mt-2 text-base font-semibold text-slate-900'>
                        {formatDateShort(order.updatedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <OrderTrackingCard
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  testCount={Math.max(order.itemsCount || 0, 1)}
                  totalAmount={order.total}
                  tracking={{
                    currentStep: tracking.currentStep,
                    totalSteps: 4,
                    status: tracking.status,
                    statusLabel: status.label,
                    description: tracking.description,
                    requisitionUrl: order.requisitionPdfUrl || undefined,
                    labOrderId: order.accessOrderId || undefined,
                    estimatedCompletion:
                      order.status === "COMPLETED"
                        ? undefined
                        : "24-48 hours after sample collection",
                  }}
                  onRetry={async () => {
                    setRetryingOrderId(order.id);
                    try {
                      await retryOrderAccessPlacement(order.id);
                      invalidateCustomerOrders(user.id);
                      await loadOrders();
                    } finally {
                      setRetryingOrderId(null);
                    }
                  }}
                  isRetrying={retryingOrderId === order.id}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
