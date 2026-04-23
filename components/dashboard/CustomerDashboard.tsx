"use client";

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
  type UserOrderSummary,
} from "@/lib/services/order.service";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";
import {
  ArrowRight,
  CircleAlert,
  ClipboardList,
  Download,
  FileText,
  FlaskConical,
  LifeBuoy,
  Loader2,
  ReceiptText,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DashboardAction = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const TERMINAL_STATUSES = new Set(["COMPLETED", "FAILED", "CANCELLED", "REFUNDED"]);

function getStatusMeta(order: UserOrderSummary) {
  const status = order.status.toUpperCase();

  if (status === "COMPLETED") {
    return {
      label: "Completed",
      tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (status === "MANUAL_REVIEW") {
    return {
      label: "Needs review",
      tone: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }

  if (
    status === "FAILED" ||
    status === "CANCELLED" ||
    status === "LAB_SUBMISSION_FAILED_RETRYABLE" ||
    status === "LAB_SUBMISSION_FAILED_FINAL"
  ) {
    return {
      label: "Needs attention",
      tone: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }

  if (status === "REFUNDED") {
    return {
      label: "Refunded",
      tone: "bg-slate-100 text-slate-700 border-slate-200",
    };
  }

  if (status === "LAB_ORDER_PLACED") {
    return {
      label: "Lab order placed",
      tone: "bg-sky-50 text-sky-700 border-sky-200",
    };
  }

  if (status === "PAID" || status === "LAB_SUBMISSION_PENDING") {
    return {
      label: "In progress",
      tone: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }

  return {
    label: "Pending payment",
    tone: "bg-slate-100 text-slate-700 border-slate-200",
  };
}

function getActionCenter(order?: UserOrderSummary | null): DashboardAction {
  if (!order) {
    return {
      title: "No active orders right now",
      description:
        "Start a new lab order whenever you need it. Results and requisitions will show up here automatically.",
      primaryHref: "/tests",
      primaryLabel: "Browse Tests",
      secondaryHref: "/help-center",
      secondaryLabel: "Get Support",
    };
  }

  const status = order.status.toUpperCase();

  if (status === "PENDING_PAYMENT") {
    return {
      title: `${order.orderNumber} is waiting for payment`,
      description:
        "Complete payment to generate your requisition and move the order into lab processing.",
      primaryHref: "/results",
      primaryLabel: "Review Order Status",
      secondaryHref: "/help-center",
      secondaryLabel: "Contact Support",
    };
  }

  if (status === "MANUAL_REVIEW") {
    return {
      title: `${order.orderNumber} is under review`,
      description:
        "Our team is checking this order before final lab submission. You do not need to place a duplicate order.",
      primaryHref: "/results",
      primaryLabel: "Track This Order",
      secondaryHref: "/help-center",
      secondaryLabel: "Contact Support",
    };
  }

  if (status === "LAB_ORDER_PLACED" && order.requisitionPdfUrl) {
    return {
      title: `${order.orderNumber} is ready for collection`,
      description:
        "Download your requisition and bring it with a valid ID when you visit the lab.",
      primaryHref: "/results",
      primaryLabel: "View Order Details",
      secondaryHref: "/find-lab-center",
      secondaryLabel: "Find a Lab Center",
    };
  }

  if (status === "PAID" || status === "LAB_SUBMISSION_PENDING") {
    return {
      title: `${order.orderNumber} is moving through fulfillment`,
      description:
        "Payment is confirmed and your lab submission is being prepared. Check back here for requisition and results updates.",
      primaryHref: "/results",
      primaryLabel: "Track This Order",
      secondaryHref: "/help-center",
      secondaryLabel: "Get Support",
    };
  }

  return {
    title: `${order.orderNumber} needs your attention`,
    description:
      "There is an issue blocking this order. Review the latest order status or contact support for help.",
    primaryHref: "/results",
    primaryLabel: "Review Order",
    secondaryHref: "/help-center",
    secondaryLabel: "Contact Support",
  };
}

function DashboardLoadingState() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-48 w-full rounded-[28px]' />
      <div className='grid gap-6 xl:grid-cols-[1.4fr_1fr]'>
        <Skeleton className='h-60 w-full rounded-[28px]' />
        <Skeleton className='h-60 w-full rounded-[28px]' />
      </div>
      <Skeleton className='h-72 w-full rounded-[28px]' />
    </div>
  );
}

function DashboardShortcuts() {
  const items = [
    {
      href: "/profile",
      label: "Profile",
      description: "Update your personal and contact information.",
      icon: UserCircle2,
    },
    {
      href: "/profile/transactions",
      label: "Transactions",
      description: "Review payment and refund activity.",
      icon: ReceiptText,
    },
    {
      href: "/help-center",
      label: "Support",
      description: "Open support resources and order help.",
      icon: LifeBuoy,
    },
    {
      href: "/profile/security",
      label: "Security",
      description: "Manage password and account security settings.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {items.map(({ href, label, description, icon: Icon }) => (
        <Link key={href} href={href}>
          <Card className='h-full rounded-[24px] border-slate-200/80 bg-white/90 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg'>
            <CardContent className='flex h-full flex-col gap-4 p-5'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700'>
                <Icon className='h-5 w-5' />
              </div>
              <div>
                <h3 className='text-base font-semibold text-slate-950'>{label}</h3>
                <p className='mt-1 text-sm leading-6 text-slate-600'>
                  {description}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
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
            : "Unable to load your dashboard orders.",
        );
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (!isAuthLoading) {
      void loadOrders();
    }
  }, [isAuthenticated, isAuthLoading, user?.id]);

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
        (order) => !TERMINAL_STATUSES.has(order.status.toUpperCase()),
      ),
    [sortedOrders],
  );

  const newestActiveOrder = activeOrders[0] ?? null;
  const actionCenter = getActionCenter(newestActiveOrder);
  const historyOrders = sortedOrders.slice(0, 5);

  if (isAuthLoading) {
    return <DashboardLoadingState />;
  }

  if (!isAuthenticated || !user?.id) {
    return (
      <Card className='rounded-[28px] border-slate-200/80 bg-white/90'>
        <CardContent className='flex flex-col items-center px-6 py-14 text-center'>
          <CircleAlert className='h-10 w-10 text-slate-400' />
          <h2 className='mt-4 text-2xl font-semibold text-slate-950'>
            Sign in required
          </h2>
          <p className='mt-2 max-w-xl text-sm leading-6 text-slate-600'>
            Your customer dashboard is only available while signed in.
          </p>
          <Button asChild className='mt-6 rounded-full px-6'>
            <Link href='/login?from=/dashboard/customer'>Go to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const name = user.firstName?.trim() || "there";
  const openOrderCount = activeOrders.length;
  const completedCount = sortedOrders.filter(
    (order) => order.status.toUpperCase() === "COMPLETED",
  ).length;

  return (
    <div className='space-y-6'>
      <Card className='overflow-hidden rounded-[32px] border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(239,248,255,0.92)_55%,rgba(224,242,254,0.9)_100%)] shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)]'>
        <CardContent className='grid gap-6 px-6 py-7 lg:grid-cols-[1.35fr_0.95fr] lg:px-8'>
          <div className='space-y-4'>
            <div className='inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700'>
              Customer Overview
            </div>
            <div>
              <h2 className='text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl'>
                Welcome back, {name}
              </h2>
              <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base'>
                Manage lab orders, watch fulfillment progress, and jump into
                the next step without digging through your account pages.
              </p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <Button asChild className='rounded-full px-5'>
                <Link href='/tests'>
                  Browse Tests
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button asChild variant='outline' className='rounded-full px-5'>
                <Link href='/results'>View Results</Link>
              </Button>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'>
            <div className='rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                Open Orders
              </p>
              <p className='mt-3 text-3xl font-semibold text-slate-950'>
                {openOrderCount}
              </p>
              <p className='mt-1 text-sm text-slate-600'>
                Orders still moving through payment or lab processing.
              </p>
            </div>
            <div className='rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                Completed
              </p>
              <p className='mt-3 text-3xl font-semibold text-slate-950'>
                {completedCount}
              </p>
              <p className='mt-1 text-sm text-slate-600'>
                Orders that already reached final results.
              </p>
            </div>
            <div className='rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                Account Email
              </p>
              <p className='mt-3 text-base font-semibold text-slate-950'>
                {user.email}
              </p>
              <p className='mt-1 text-sm text-slate-600'>
                Primary contact for requisitions and results notifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {ordersError && (
        <Card className='rounded-[28px] border-rose-200 bg-rose-50/80'>
          <CardContent className='flex items-start gap-3 px-5 py-4 text-sm text-rose-700'>
            <CircleAlert className='mt-0.5 h-4 w-4 shrink-0' />
            <div>
              <p className='font-semibold'>Unable to load orders</p>
              <p className='mt-1'>{ordersError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className='grid gap-6 xl:grid-cols-[1.3fr_0.9fr]'>
        <Card className='rounded-[28px] border-slate-200/80 bg-white/90'>
          <CardHeader>
            <CardTitle className='text-xl text-slate-950'>Action Center</CardTitle>
            <CardDescription>
              The next best step based on your latest order activity.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='rounded-[24px] bg-slate-950 px-5 py-5 text-white'>
              <p className='text-sm font-medium text-sky-200'>Next action</p>
              <h3 className='mt-2 text-2xl font-semibold'>{actionCenter.title}</h3>
              <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-200'>
                {actionCenter.description}
              </p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <Button asChild className='rounded-full px-5'>
                <Link href={actionCenter.primaryHref}>
                  {actionCenter.primaryLabel}
                </Link>
              </Button>
              {actionCenter.secondaryHref && actionCenter.secondaryLabel && (
                <Button
                  asChild
                  variant='outline'
                  className='rounded-full px-5'
                >
                  <Link href={actionCenter.secondaryHref}>
                    {actionCenter.secondaryLabel}
                  </Link>
                </Button>
              )}
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                  Latest Order
                </p>
                <p className='mt-2 text-base font-semibold text-slate-950'>
                  {newestActiveOrder?.orderNumber || "No active order"}
                </p>
              </div>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                  Test Count
                </p>
                <p className='mt-2 text-base font-semibold text-slate-950'>
                  {newestActiveOrder?.itemsCount || 0}
                </p>
              </div>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                  Latest Status
                </p>
                <p className='mt-2 text-base font-semibold text-slate-950'>
                  {newestActiveOrder
                    ? getStatusMeta(newestActiveOrder).label
                    : "Ready to order"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-[28px] border-slate-200/80 bg-white/90'>
          <CardHeader>
            <CardTitle className='text-xl text-slate-950'>Account Shortcuts</CardTitle>
            <CardDescription>
              Jump directly into the most common customer tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardShortcuts />
          </CardContent>
        </Card>
      </div>

      {isLoadingOrders && (
        <Card className='rounded-[28px] border-slate-200/80 bg-white/90'>
          <CardContent className='flex items-center gap-3 px-5 py-5 text-sm text-slate-600'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Loading your latest order activity...
          </CardContent>
        </Card>
      )}

      {!isLoadingOrders && sortedOrders.length === 0 && (
        <Card className='rounded-[32px] border-slate-200/80 bg-white/92'>
          <CardContent className='px-6 py-10 text-center sm:px-10'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-sky-50 text-sky-700'>
              <FlaskConical className='h-7 w-7' />
            </div>
            <h3 className='mt-5 text-3xl font-semibold tracking-tight text-slate-950'>
              No orders yet
            </h3>
            <p className='mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600'>
              Your dashboard is ready. Once you place an order, this page will
              show the latest status, requisition links, and results progress in
              one place.
            </p>
            <Button asChild className='mt-6 rounded-full px-6'>
              <Link href='/tests'>Browse Tests</Link>
            </Button>

            <div className='mt-8 grid gap-4 text-left md:grid-cols-3'>
              {[
                "Choose a test and complete checkout.",
                "Download the requisition when it is ready.",
                "Track collection and results from this dashboard.",
              ].map((step, index) => (
                <div
                  key={step}
                  className='rounded-[24px] border border-slate-200 bg-slate-50 p-5'
                >
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    Step {index + 1}
                  </p>
                  <p className='mt-3 text-sm font-medium leading-6 text-slate-800'>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoadingOrders && activeOrders.length > 0 && (
        <section className='space-y-4'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h3 className='text-xl font-semibold text-slate-950'>Active Orders</h3>
              <p className='mt-1 text-sm text-slate-600'>
                Orders that still need fulfillment, lab collection, or follow-up.
              </p>
            </div>
            <Button asChild variant='outline' className='rounded-full'>
              <Link href='/results'>View all orders</Link>
            </Button>
          </div>

          <div className='grid gap-4 xl:grid-cols-3'>
            {activeOrders.slice(0, 3).map((order) => {
              const status = getStatusMeta(order);

              return (
                <Card
                  key={order.id}
                  className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-sm'
                >
                  <CardHeader className='space-y-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <CardTitle className='text-lg text-slate-950'>
                          {order.orderNumber}
                        </CardTitle>
                        <CardDescription className='mt-1 text-sm text-slate-600'>
                          {order.primaryTest?.testName || "Lab order"} •{" "}
                          {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                        </CardDescription>
                      </div>
                      <Badge variant='outline' className={cn("rounded-full", status.tone)}>
                        {status.label}
                      </Badge>
                    </div>

                    <div className='grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3'>
                      <div className='rounded-2xl bg-slate-50 p-3'>
                        <p className='text-xs uppercase tracking-[0.16em] text-slate-500'>
                          Ordered
                        </p>
                        <p className='mt-2 text-sm font-semibold text-slate-900'>
                          {formatDateShort(order.createdAt)}
                        </p>
                      </div>
                      <div className='rounded-2xl bg-slate-50 p-3'>
                        <p className='text-xs uppercase tracking-[0.16em] text-slate-500'>
                          Total
                        </p>
                        <p className='mt-2 text-sm font-semibold text-slate-900'>
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div className='rounded-2xl bg-slate-50 p-3'>
                        <p className='text-xs uppercase tracking-[0.16em] text-slate-500'>
                          Last Updated
                        </p>
                        <p className='mt-2 text-sm font-semibold text-slate-900'>
                          {formatDateShort(order.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex flex-wrap gap-3'>
                      {order.requisitionPdfUrl && (
                        <Button asChild className='rounded-full'>
                          <a href={order.requisitionPdfUrl} target='_blank' rel='noreferrer'>
                            <Download className='mr-2 h-4 w-4' />
                            Requisition
                          </a>
                        </Button>
                      )}
                      <Button asChild variant='outline' className='rounded-full'>
                        <Link href='/results'>
                          <ClipboardList className='mr-2 h-4 w-4' />
                          View Results
                        </Link>
                      </Button>
                      <Button asChild variant='ghost' className='rounded-full'>
                        <Link href='/help-center'>
                          <LifeBuoy className='mr-2 h-4 w-4' />
                          Support
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {!isLoadingOrders && historyOrders.length > 0 && (
        <Card className='rounded-[28px] border-slate-200/80 bg-white/92'>
          <CardHeader>
            <CardTitle className='text-xl text-slate-950'>Recent History</CardTitle>
            <CardDescription>
              Your latest five orders with status and amount at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {historyOrders.map((order) => {
              const status = getStatusMeta(order);

              return (
                <div
                  key={order.id}
                  className='flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between'
                >
                  <div>
                    <p className='text-sm font-semibold text-slate-950'>
                      {order.orderNumber}
                    </p>
                    <p className='mt-1 text-sm text-slate-600'>
                      {order.primaryTest?.testName || "Lab order"} •{" "}
                      {formatDateShort(order.createdAt)}
                    </p>
                  </div>
                  <div className='flex flex-wrap items-center gap-3'>
                    <Badge variant='outline' className={cn("rounded-full", status.tone)}>
                      {status.label}
                    </Badge>
                    <span className='text-sm font-semibold text-slate-950'>
                      {formatCurrency(order.total)}
                    </span>
                    <Button asChild variant='ghost' className='rounded-full'>
                      <Link href='/results'>
                        <FileText className='mr-2 h-4 w-4' />
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
