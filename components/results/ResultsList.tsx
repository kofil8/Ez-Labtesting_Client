"use client";

import { OrderTrackingCard } from "@/components/results/OrderTrackingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  getOrdersByUserId,
  retryOrderAccessPlacement,
  UserOrderSummary,
} from "@/lib/services/order.service";
import { formatCurrency, formatDateShort } from "@/lib/utils";
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

export function ResultsList() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<UserOrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "ALL" | "ACTIVE" | "COMPLETED" | "ATTENTION"
  >("ALL");

  const getStatusMeta = (status: string) => {
    const normalized = status.toUpperCase();

    if (normalized === "COMPLETED") {
      return {
        label: "Completed",
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

    if (normalized === "LAB_ORDER_PLACED") {
      return {
        label: "Lab Order Placed",
        className: "bg-sky-50 text-sky-700 border-sky-200",
        icon: FlaskConical,
      };
    }

    if (normalized === "PAID") {
      return {
        label: "Paid",
        className: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: Receipt,
      };
    }

    return {
      label: normalized === "PENDING_PAYMENT" ? "Pending Payment" : normalized,
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock3,
    };
  };

  const loadOrders = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getOrdersByUserId(user.id);
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
      loadOrders();
    }
  }, [isAuthLoading, isAuthenticated, user, loadOrders]);

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    if (filter === "COMPLETED") return order.status === "COMPLETED";
    if (filter === "ATTENTION") {
      return (
        order.status === "FAILED" ||
        order.status === "CANCELLED" ||
        order.manualReviewRequired
      );
    }

    return order.status !== "COMPLETED";
  });

  const stats = {
    total: orders.length,
    active: orders.filter((o) => o.status !== "COMPLETED").length,
    completed: orders.filter((o) => o.status === "COMPLETED").length,
    attention: orders.filter(
      (o) =>
        o.status === "FAILED" ||
        o.status === "CANCELLED" ||
        o.manualReviewRequired,
    ).length,
  };

  if (isAuthLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-28 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
    );
  }

  if (!isAuthenticated || !user?.id) {
    return (
      <Card className='border-slate-200'>
        <CardContent className='pt-8 pb-8 text-center'>
          <AlertCircle className='h-10 w-10 mx-auto text-slate-400 mb-3' />
          <h2 className='text-xl font-semibold text-slate-900'>
            Sign in required
          </h2>
          <p className='text-slate-600 mt-2 mb-5'>
            Please sign in to view your order history.
          </p>
          <Button asChild>
            <Link href='/login?from=/results'>Go to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='border-rose-200 bg-rose-50/40'>
        <CardContent className='pt-6 pb-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h2 className='text-lg font-semibold text-rose-700'>
                Unable to load orders
              </h2>
              <p className='mt-1 text-sm text-rose-700/90'>{error}</p>
            </div>
            <Button variant='outline' onClick={loadOrders} className='shrink-0'>
              <RefreshCw className='h-4 w-4 mr-2' />
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
        <Card className='border-slate-200'>
          <CardContent className='pt-6 pb-6 flex items-center justify-center gap-2 text-slate-600'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Loading your orders...
          </CardContent>
        </Card>
        <Skeleton className='h-40 w-full rounded-xl' />
        <Skeleton className='h-40 w-full rounded-xl' />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className='border-sky-200 bg-sky-50/30'>
        <CardContent className='pt-10 pb-10 text-center'>
          <FileText className='h-14 w-14 mx-auto text-slate-400 mb-4' />
          <h2 className='text-2xl font-semibold text-slate-900'>
            No orders yet
          </h2>
          <p className='text-slate-600 mt-2 mb-6'>
            Place your first lab order to track status and documents here.
          </p>
          <Button asChild size='lg'>
            <Link href='/tests'>Browse Tests</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const filterButton = (
    key: "ALL" | "ACTIVE" | "COMPLETED" | "ATTENTION",
    label: string,
    count: number,
  ) => (
    <Button
      key={key}
      size='sm'
      variant={filter === key ? "default" : "outline"}
      onClick={() => setFilter(key)}
      className='rounded-full'
    >
      {label} ({count})
    </Button>
  );

  return (
    <div className='space-y-5'>
      <Card className='border-slate-200 bg-gradient-to-r from-slate-50 to-white'>
        <CardContent className='pt-5 pb-5'>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <div>
              <p className='text-xs uppercase tracking-wide text-slate-500'>
                Total Orders
              </p>
              <p className='text-2xl font-semibold text-slate-900'>
                {stats.total}
              </p>
            </div>
            <div>
              <p className='text-xs uppercase tracking-wide text-slate-500'>
                Active
              </p>
              <p className='text-2xl font-semibold text-slate-900'>
                {stats.active}
              </p>
            </div>
            <div>
              <p className='text-xs uppercase tracking-wide text-slate-500'>
                Completed
              </p>
              <p className='text-2xl font-semibold text-slate-900'>
                {stats.completed}
              </p>
            </div>
            <div>
              <p className='text-xs uppercase tracking-wide text-slate-500'>
                Needs Attention
              </p>
              <p className='text-2xl font-semibold text-rose-700'>
                {stats.attention}
              </p>
            </div>
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
        <Card className='border-slate-200'>
          <CardContent className='pt-8 pb-8 text-center'>
            <p className='text-slate-600'>No orders in this view.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {filteredOrders.map((order) => {
            const status = getStatusMeta(order.status);
            const StatusIcon = status.icon;

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
                    : "processing";

            const trackingDescription =
              statusUpper === "COMPLETED"
                ? "Your results are ready to review."
                : statusUpper === "LAB_ORDER_PLACED"
                  ? "Your lab order is placed and awaiting sample collection/results."
                  : statusUpper === "PAID"
                    ? "Payment received. Preparing your lab submission."
                    : statusUpper === "PENDING_PAYMENT"
                      ? "Awaiting payment confirmation."
                      : order.manualReviewRequired
                        ? "This paid order is under manual review by our operations team."
                        : "Your order needs attention. Please contact support if this persists.";

            return (
              <div key={order.id} className='space-y-3'>
                <Card className='border-slate-200 hover:border-slate-300 transition-colors'>
                  <CardHeader className='pb-3'>
                    <div className='flex flex-wrap items-start justify-between gap-3'>
                      <div>
                        <CardTitle className='text-lg text-slate-900'>
                          Order #{order.id}
                        </CardTitle>
                        <p className='mt-1 text-sm text-slate-600'>
                          Ordered on {formatDateShort(order.createdAt)}
                          {order.test?.testName
                            ? ` - ${order.test.testName}`
                            : ""}
                        </p>
                      </div>
                      <Badge
                        variant='outline'
                        className={`font-medium ${status.className}`}
                      >
                        <StatusIcon className='h-3.5 w-3.5 mr-1' />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-3 sm:grid-cols-3'>
                      <div className='rounded-lg border border-slate-200 bg-slate-50 p-3'>
                        <p className='text-xs text-slate-500'>Subtotal</p>
                        <p className='text-base font-semibold text-slate-900'>
                          {formatCurrency(order.subtotal)}
                        </p>
                      </div>
                      <div className='rounded-lg border border-slate-200 bg-slate-50 p-3'>
                        <p className='text-xs text-slate-500'>Processing Fee</p>
                        <p className='text-base font-semibold text-slate-900'>
                          {formatCurrency(order.processingFee)}
                        </p>
                      </div>
                      <div className='rounded-lg border border-slate-200 bg-slate-50 p-3'>
                        <p className='text-xs text-slate-500'>Total Paid</p>
                        <p className='text-base font-semibold text-slate-900'>
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <OrderTrackingCard
                  orderId={order.id}
                  orderNumber={`ORD-${order.id.slice(0, 8).toUpperCase()}`}
                  testCount={1}
                  totalAmount={order.total}
                  tracking={{
                    currentStep,
                    totalSteps: 4,
                    status: trackingStatus as
                      | "pending"
                      | "processing"
                      | "completed"
                      | "failed"
                      | "needs_review",
                    statusLabel: status.label,
                    description: trackingDescription,
                    requisitionUrl: order.requisitionPdfUrl || undefined,
                    labOrderId: order.accessOrderId || undefined,
                    estimatedCompletion:
                      order.status === "COMPLETED"
                        ? undefined
                        : "24-48 hours after lab sample collection",
                  }}
                  onRetry={async () => {
                    setRetryingOrderId(order.id);
                    try {
                      await retryOrderAccessPlacement(order.id);
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
