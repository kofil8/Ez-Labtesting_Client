"use client";

import { OnboardingPrompt } from "@/components/profile/OnboardingPrompt";
import { OrderTrackingCard } from "@/components/results/OrderTrackingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  getOrdersByUserId,
  UserOrderSummary,
} from "@/lib/services/order.service";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import {
  Calendar,
  Clock3,
  FileText,
  FlaskConical,
  LifeBuoy,
  Loader2,
  MapPin,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CustomerOrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "LAB_ORDER_PLACED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "MANUAL_REVIEW"
  | "LAB_SUBMISSION_PENDING"
  | "LAB_SUBMISSION_RETRYING"
  | "LAB_SUBMISSION_FAILED_RETRYABLE"
  | "LAB_SUBMISSION_FAILED_FINAL"
  | string;

function buildOrderTracking(order: UserOrderSummary) {
  const normalized = (
    order.status || "PENDING_PAYMENT"
  ).toUpperCase() as CustomerOrderStatus;

  if (normalized === "COMPLETED") {
    return {
      currentStep: 4,
      totalSteps: 4,
      status: "completed" as const,
      statusLabel: "Results Available",
      description:
        "Your results are ready. You can view and download your report now.",
      estimatedCompletion: formatDateShort(order.updatedAt),
      labOrderId: order.accessOrderId || undefined,
      requisitionUrl: order.requisitionPdfUrl || undefined,
    };
  }

  if (normalized === "LAB_ORDER_PLACED") {
    return {
      currentStep: 3,
      totalSteps: 4,
      status: "processing" as const,
      statusLabel: "Lab Order Submitted",
      description: "Your order has been sent to the lab and is in processing.",
      estimatedCompletion: formatDateShort(order.updatedAt),
      labOrderId: order.accessOrderId || undefined,
      requisitionUrl: order.requisitionPdfUrl || undefined,
    };
  }

  if (
    normalized === "MANUAL_REVIEW" ||
    normalized === "LAB_SUBMISSION_FAILED_RETRYABLE" ||
    order.manualReviewRequired
  ) {
    return {
      currentStep: 3,
      totalSteps: 4,
      status: "needs_review" as const,
      statusLabel: "Needs Review",
      description:
        "Your order needs manual review before final lab submission. Our team is actively checking it.",
      estimatedCompletion: formatDateShort(order.updatedAt),
      labOrderId: order.accessOrderId || undefined,
      requisitionUrl: order.requisitionPdfUrl || undefined,
    };
  }

  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED" ||
    normalized === "LAB_SUBMISSION_FAILED_FINAL"
  ) {
    return {
      currentStep: 2,
      totalSteps: 4,
      status: "failed" as const,
      statusLabel: normalized === "CANCELLED" ? "Cancelled" : "Action Required",
      description:
        "There was a problem completing your order. Please contact support or review order details.",
      estimatedCompletion: formatDateShort(order.updatedAt),
      labOrderId: order.accessOrderId || undefined,
      requisitionUrl: order.requisitionPdfUrl || undefined,
    };
  }

  if (
    normalized === "PAID" ||
    normalized === "LAB_SUBMISSION_PENDING" ||
    normalized === "LAB_SUBMISSION_RETRYING"
  ) {
    return {
      currentStep: 2,
      totalSteps: 4,
      status: "processing" as const,
      statusLabel: "Payment Processed",
      description:
        "Payment is confirmed. We are preparing your lab submission and requisition details.",
      estimatedCompletion: formatDateShort(order.updatedAt),
      labOrderId: order.accessOrderId || undefined,
      requisitionUrl: order.requisitionPdfUrl || undefined,
    };
  }

  return {
    currentStep: 1,
    totalSteps: 4,
    status: "pending" as const,
    statusLabel: "Pending Payment",
    description:
      "Complete checkout to place your lab order and receive requisition details.",
    estimatedCompletion: formatDateShort(order.updatedAt),
    labOrderId: order.accessOrderId || undefined,
    requisitionUrl: order.requisitionPdfUrl || undefined,
  };
}

export function CustomerDashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<UserOrderSummary[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id || !isAuthenticated) {
        setOrders([]);
        return;
      }

      setIsLoadingOrders(true);
      setOrdersError(null);

      try {
        const result = await getOrdersByUserId(user.id);
        setOrders(result);
      } catch (error) {
        setOrdersError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard orders.",
        );
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (!isAuthLoading) {
      loadOrders();
    }
  }, [isAuthenticated, isAuthLoading, user?.id]);

  const profileCompleteness = useMemo(() => {
    const basicInfo = Boolean(user?.firstName && user?.lastName && user?.email);
    const address = Boolean(user?.address);
    const phone = Boolean(user?.phone || user?.phoneNumber);

    const completedCount = [basicInfo, address, phone].filter(Boolean).length;

    return {
      basicInfo,
      address,
      phone,
      overall: Math.round((completedCount / 3) * 100),
    };
  }, [user]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  );

  const activeOrders = useMemo(
    () =>
      sortedOrders.filter(
        (order) =>
          !["COMPLETED", "FAILED", "CANCELLED"].includes(
            order.status.toUpperCase(),
          ),
      ),
    [sortedOrders],
  );

  const recentOrders = useMemo(() => sortedOrders.slice(0, 3), [sortedOrders]);

  const dashboardStats = useMemo(
    () => ({
      totalOrders: sortedOrders.length,
      activeOrders: activeOrders.length,
      completedOrders: sortedOrders.filter(
        (order) => order.status.toUpperCase() === "COMPLETED",
      ).length,
      requisitionsReady: sortedOrders.filter((order) =>
        Boolean(order.requisitionPdfUrl),
      ).length,
    }),
    [activeOrders.length, sortedOrders],
  );

  if (isAuthLoading) {
    return (
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4'>
        <Skeleton className='h-32 w-full rounded-xl' />
        <Skeleton className='h-24 w-full rounded-xl' />
        <Skeleton className='h-64 w-full rounded-xl' />
      </div>
    );
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
      <div className='space-y-6 lg:space-y-8'>
        <OnboardingPrompt
          completeness={profileCompleteness}
          userName={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
        />

        <Card className='border-border/50'>
          <CardHeader className='space-y-2'>
            <div className='inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground'>
              <UserRound className='h-3.5 w-3.5' />
              Customer Dashboard
            </div>
            <CardTitle className='text-2xl'>
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
            </CardTitle>
            <CardDescription>
              Track your order progress, download requisitions, and complete
              your profile for faster checkout.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className='text-2xl'>
                {dashboardStats.totalOrders}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>In Progress</CardDescription>
              <CardTitle className='text-2xl'>
                {dashboardStats.activeOrders}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Completed</CardDescription>
              <CardTitle className='text-2xl'>
                {dashboardStats.completedOrders}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>Requisitions Ready</CardDescription>
              <CardTitle className='text-2xl'>
                {dashboardStats.requisitionsReady}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump to your most-used customer workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/tests'>
                  <ShoppingBag className='mr-2 h-4 w-4' />
                  Browse Tests
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/results'>
                  <FileText className='mr-2 h-4 w-4' />
                  View Results
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/find-lab-center'>
                  <MapPin className='mr-2 h-4 w-4' />
                  Find Lab Center
                </Link>
              </Button>
              <Button asChild variant='outline' className='justify-start'>
                <Link href='/help-center'>
                  <LifeBuoy className='mr-2 h-4 w-4' />
                  Support Center
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <CardTitle>Order Tracking</CardTitle>
                <CardDescription>
                  Live status for your active orders
                </CardDescription>
              </div>
              <Button asChild variant='ghost' size='sm'>
                <Link href='/transactions'>View all orders</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isLoadingOrders && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Loading your order status...
              </div>
            )}

            {!isLoadingOrders && ordersError && (
              <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive'>
                {ordersError}
              </div>
            )}

            {!isLoadingOrders && !ordersError && activeOrders.length === 0 && (
              <div className='rounded-lg border border-dashed p-6 text-center'>
                <FlaskConical className='mx-auto h-8 w-8 text-muted-foreground' />
                <p className='mt-3 text-sm text-muted-foreground'>
                  No active orders right now. Start a new test to begin
                  tracking.
                </p>
                <Button asChild className='mt-4'>
                  <Link href='/tests'>Start New Order</Link>
                </Button>
              </div>
            )}

            {!isLoadingOrders &&
              !ordersError &&
              activeOrders
                .slice(0, 2)
                .map((order) => (
                  <OrderTrackingCard
                    key={order.id}
                    orderId={order.id}
                    orderNumber={`ORD-${order.id.slice(0, 8).toUpperCase()}`}
                    testCount={order.test ? 1 : 0}
                    totalAmount={order.total}
                    tracking={buildOrderTracking(order)}
                  />
                ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest order activity</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {recentOrders.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className='flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3'
                >
                  <div>
                    <p className='text-sm font-semibold'>
                      {order.test?.testName || "Lab Test Order"}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {`ORD-${order.id.slice(0, 8).toUpperCase()}`} •{" "}
                      {formatDateShort(order.createdAt)}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='secondary'
                      className='uppercase text-[10px]'
                    >
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                    <span className='text-sm font-medium'>
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Follow the customer flow for the fastest completion
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-lg border p-3'>
              <p className='text-xs text-muted-foreground'>Step 1</p>
              <p className='text-sm font-medium mt-1'>Download Requisition</p>
            </div>
            <div className='rounded-lg border p-3'>
              <p className='text-xs text-muted-foreground'>Step 2</p>
              <p className='text-sm font-medium mt-1'>Find Nearest Lab</p>
            </div>
            <div className='rounded-lg border p-3'>
              <p className='text-xs text-muted-foreground'>Step 3</p>
              <p className='text-sm font-medium mt-1'>Visit with ID + Form</p>
            </div>
            <div className='rounded-lg border p-3'>
              <p className='text-xs text-muted-foreground'>Step 4</p>
              <p className='text-sm font-medium mt-1'>Track Results Delivery</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
              <div className='inline-flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                Keep profile complete for faster checkout.
              </div>
              <div className='inline-flex items-center gap-2'>
                <Clock3 className='h-4 w-4' />
                Most results arrive in 24-48 hours after collection.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
