"use client";

import type {
  CustomerDashboardOrder,
  CustomerDashboardViewer,
} from "@/lib/dashboard/customer.server";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  LifeBuoy,
  LockKeyhole,
  Mail,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardAction = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

type JourneyStep = {
  label: string;
  description: string;
  state: "complete" | "current" | "upcoming";
};

type ChartSlice = {
  name: string;
  value: number;
  color: string;
  description: string;
};

const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
]);

const CHART_COLORS = {
  sky: "#0ea5e9",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  slate: "#94a3b8",
};

function getStatusMeta(order: CustomerDashboardOrder) {
  const status = order.status.toUpperCase();

  if (status === "COMPLETED") {
    return {
      label: "Results ready",
      shortLabel: "Completed",
      tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "text-emerald-600",
      surface: "from-emerald-500/12 via-white to-emerald-50",
    };
  }

  if (status === "MANUAL_REVIEW") {
    return {
      label: "Needs review",
      shortLabel: "Review",
      tone: "bg-amber-50 text-amber-700 border-amber-200",
      accent: "text-amber-600",
      surface: "from-amber-500/12 via-white to-amber-50",
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
      shortLabel: "Attention",
      tone: "bg-rose-50 text-rose-700 border-rose-200",
      accent: "text-rose-600",
      surface: "from-rose-500/12 via-white to-rose-50",
    };
  }

  if (status === "REFUNDED") {
    return {
      label: "Refunded",
      shortLabel: "Refunded",
      tone: "bg-slate-100 text-slate-700 border-slate-200",
      accent: "text-slate-600",
      surface: "from-slate-400/12 via-white to-slate-50",
    };
  }

  if (status === "LAB_ORDER_PLACED") {
    return {
      label: "Ready for collection",
      shortLabel: "Visit lab",
      tone: "bg-sky-50 text-sky-700 border-sky-200",
      accent: "text-sky-600",
      surface: "from-sky-500/12 via-white to-sky-50",
    };
  }

  if (status === "PAID" || status === "LAB_SUBMISSION_PENDING") {
    return {
      label: "In fulfillment",
      shortLabel: "In progress",
      tone: "bg-cyan-50 text-cyan-700 border-cyan-200",
      accent: "text-cyan-600",
      surface: "from-cyan-500/12 via-white to-cyan-50",
    };
  }

  return {
    label: "Pending payment",
    shortLabel: "Pending",
    tone: "bg-slate-100 text-slate-700 border-slate-200",
    accent: "text-slate-600",
    surface: "from-slate-300/12 via-white to-slate-50",
  };
}

function getOrderHref(order: CustomerDashboardOrder) {
  return `/results/${order.id}`;
}

function getActionCenter(
  activeOrder?: CustomerDashboardOrder | null,
  latestOrder?: CustomerDashboardOrder | null,
): DashboardAction {
  if (!activeOrder && latestOrder?.status.toUpperCase() === "COMPLETED") {
    return {
      title: `${latestOrder.orderNumber} has final results ready`,
      description:
        "Your latest completed order is available for review. Open the result page to download documents and revisit the care timeline.",
      primaryHref: getOrderHref(latestOrder),
      primaryLabel: "Open Results",
      secondaryHref: "/tests",
      secondaryLabel: "Order Another Test",
    };
  }

  if (!activeOrder) {
    return {
      title: "Ready for your next order",
      description:
        "Start a new lab order anytime. Status updates and final reports will appear here automatically.",
      primaryHref: "/tests",
      primaryLabel: "Browse Tests",
      secondaryHref: "/find-lab-center",
      secondaryLabel: "Find a Lab Center",
    };
  }

  const orderHref = getOrderHref(activeOrder);
  const status = activeOrder.status.toUpperCase();

  if (status === "PENDING_PAYMENT") {
    return {
      title: `${activeOrder.orderNumber} is waiting for payment`,
      description:
        "Payment needs to clear before requisition generation and lab fulfillment can continue.",
      primaryHref: orderHref,
      primaryLabel: "Review Order Status",
      secondaryHref: "/help-center",
      secondaryLabel: "Contact Support",
    };
  }

  if (status === "MANUAL_REVIEW") {
    return {
      title: `${activeOrder.orderNumber} is under manual review`,
      description:
        "Operations is reviewing this order before final submission. Avoid placing a duplicate order while this one is being checked.",
      primaryHref: orderHref,
      primaryLabel: "Track This Order",
      secondaryHref: "/help-center",
      secondaryLabel: "Contact Support",
    };
  }

  if (status === "LAB_ORDER_PLACED" && activeOrder.requisitionPdfUrl) {
    return {
      title: `${activeOrder.orderNumber} is ready for lab collection`,
      description:
        "Your requisition is available. Bring it with a valid photo ID when you visit the lab center.",
      primaryHref: orderHref,
      primaryLabel: "Open Order Details",
      secondaryHref: "/find-lab-center",
      secondaryLabel: "Find a Lab Center",
    };
  }

  if (status === "PAID" || status === "LAB_SUBMISSION_PENDING") {
    return {
      title: `${activeOrder.orderNumber} is moving through fulfillment`,
      description:
        "Payment is confirmed and the lab order is being prepared. Requisition and collection details will appear here next.",
      primaryHref: orderHref,
      primaryLabel: "Track This Order",
      secondaryHref: "/help-center",
      secondaryLabel: "Get Support",
    };
  }

  return {
    title: `${activeOrder.orderNumber} needs attention`,
    description:
      "An issue is blocking the order. Review the latest details or contact support for help.",
    primaryHref: orderHref,
    primaryLabel: "Review Order",
    secondaryHref: "/help-center",
    secondaryLabel: "Contact Support",
  };
}

function buildProfileChecklist(viewer: CustomerDashboardViewer) {
  const hasPhone = Boolean(viewer.phone || viewer.phoneNumber);
  const hasDob = Boolean(viewer.dateOfBirth);
  const hasAddress = Boolean(
    viewer.address ||
      viewer.addressLine1 ||
      viewer.city ||
      viewer.state ||
      viewer.zipCode,
  );

  return [
    {
      label: "Contact phone on file",
      ready: hasPhone,
      href: "/profile",
      icon: UserCircle2,
      helper: "Used for order and support follow-up.",
    },
    {
      label: "Date of birth saved",
      ready: hasDob,
      href: "/profile",
      icon: CalendarClock,
      helper: "Needed for patient identity matching.",
    },
    {
      label: "Mailing address ready",
      ready: hasAddress,
      href: "/profile",
      icon: MapPin,
      helper: "Helps prevent profile or billing delays.",
    },
    {
      label: "Two-factor security enabled",
      ready: Boolean(viewer.mfaEnabled),
      href: "/profile/security",
      icon: LockKeyhole,
      helper: "Recommended for PHI and result access.",
    },
  ];
}

function formatMemberSince(createdAt: string) {
  const parsed = new Date(createdAt);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function buildJourneySteps(order?: CustomerDashboardOrder | null): JourneyStep[] {
  const status = order?.status.toUpperCase() ?? "";
  let currentStep = 1;

  if (status === "COMPLETED") {
    currentStep = 5;
  } else if (status === "LAB_ORDER_PLACED") {
    currentStep = 4;
  } else if (
    status === "PAID" ||
    status === "LAB_SUBMISSION_PENDING" ||
    status === "MANUAL_REVIEW" ||
    status === "FAILED" ||
    status === "CANCELLED" ||
    status === "LAB_SUBMISSION_FAILED_RETRYABLE" ||
    status === "LAB_SUBMISSION_FAILED_FINAL" ||
    status === "REFUNDED"
  ) {
    currentStep = 3;
  } else if (status === "PENDING_PAYMENT") {
    currentStep = 2;
  }

  const steps = [
    {
      label: "Choose tests",
      description: "Browse tests or panels that match the care need.",
    },
    {
      label: "Secure checkout",
      description: "Confirm patient details and complete payment.",
    },
    {
      label: "Requisition prep",
      description: "We create and submit the lab order for fulfillment.",
    },
    {
      label: "Visit lab",
      description: "Use the requisition and complete specimen collection.",
    },
    {
      label: "Results delivered",
      description: "Final reports are released to your secure account.",
    },
  ];

  return steps.map((step, index) => {
    const stepNumber = index + 1;
    const state =
      stepNumber < currentStep
        ? "complete"
        : stepNumber === currentStep
          ? "current"
          : "upcoming";

    return {
      ...step,
      state,
    };
  });
}

function buildStatusChart(orders: CustomerDashboardOrder[]): ChartSlice[] {
  const buckets = [
    {
      name: "Pending payment",
      value: 0,
      color: CHART_COLORS.slate,
      description: "Waiting for payment confirmation.",
    },
    {
      name: "In fulfillment",
      value: 0,
      color: CHART_COLORS.cyan,
      description: "Paid or being prepared for lab submission.",
    },
    {
      name: "Ready for visit",
      value: 0,
      color: CHART_COLORS.sky,
      description: "Requisition is ready for collection.",
    },
    {
      name: "Results ready",
      value: 0,
      color: CHART_COLORS.emerald,
      description: "Completed orders with final results.",
    },
    {
      name: "Needs help",
      value: 0,
      color: CHART_COLORS.rose,
      description: "Orders needing review or support follow-up.",
    },
  ];

  for (const order of orders) {
    const status = order.status.toUpperCase();

    if (status === "PENDING_PAYMENT") {
      buckets[0].value += 1;
      continue;
    }

    if (status === "PAID" || status === "LAB_SUBMISSION_PENDING") {
      buckets[1].value += 1;
      continue;
    }

    if (status === "LAB_ORDER_PLACED") {
      buckets[2].value += 1;
      continue;
    }

    if (status === "COMPLETED") {
      buckets[3].value += 1;
      continue;
    }

    buckets[4].value += 1;
  }

  return buckets.filter((bucket) => bucket.value > 0);
}

function buildMonthlyActivity(orders: CustomerDashboardOrder[]) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    return {
      key,
      label: date.toLocaleDateString("en-US", { month: "short" }),
      orders: 0,
      spend: 0,
    };
  });

  const monthMap = new Map(months.map((month) => [month.key, month]));

  for (const order of orders) {
    const createdAt = new Date(order.createdAt);
    if (Number.isNaN(createdAt.getTime())) {
      continue;
    }

    const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
    const month = monthMap.get(key);

    if (!month) {
      continue;
    }

    month.orders += 1;
    month.spend += order.total;
  }

  return months;
}

function MotionSection({
  children,
  delay = 0,
  reducedMotion,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  reducedMotion: boolean;
  className?: string;
}) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function DashboardQuickLinks() {
  const items = [
    {
      href: "/tests",
      label: "Browse tests",
      description: "Find individual diagnostics and place a new order.",
      icon: FlaskConical,
    },
    {
      href: "/find-lab-center",
      label: "Find lab center",
      description: "Locate nearby partner draw centers before or after checkout.",
      icon: MapPin,
    },
    {
      href: "/results",
      label: "Open results",
      description: "Review completed reports, pending states, and downloads.",
      icon: FileCheck2,
    },
    {
      href: "/help-center",
      label: "Get support",
      description: "Contact the care team for order, payment, or result questions.",
      icon: LifeBuoy,
    },
  ];

  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      {items.map(({ href, label, description, icon: Icon }) => (
        <Link key={href} href={href}>
          <div className='group h-full rounded-[24px] border border-slate-200/80 bg-white/90 p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition-colors group-hover:bg-sky-100'>
              <Icon className='h-5 w-5' />
            </div>
            <h3 className='mt-4 text-base font-semibold text-slate-950'>{label}</h3>
            <p className='mt-1 text-sm leading-6 text-slate-600'>{description}</p>
            <div className='mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700'>
              Open
              <ChevronRight className='h-4 w-4' />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function CustomerDashboardOverview({
  viewer,
  orders,
  ordersError,
}: {
  viewer: CustomerDashboardViewer;
  orders: CustomerDashboardOrder[];
  ordersError?: string | null;
}) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const activeOrders = sortedOrders.filter(
    (order) => !TERMINAL_STATUSES.has(order.status.toUpperCase()),
  );
  const newestActiveOrder = activeOrders[0] ?? null;
  const latestOrder = sortedOrders[0] ?? null;
  const historyOrders = sortedOrders.slice(0, 5);
  const completedCount = sortedOrders.filter(
    (order) => order.status.toUpperCase() === "COMPLETED",
  ).length;
  const attentionCount = sortedOrders.filter((order) => {
    const status = order.status.toUpperCase();
    return (
      status === "FAILED" ||
      status === "CANCELLED" ||
      status === "LAB_SUBMISSION_FAILED_RETRYABLE" ||
      status === "LAB_SUBMISSION_FAILED_FINAL" ||
      status === "MANUAL_REVIEW"
    );
  }).length;
  const readyForVisitCount = sortedOrders.filter(
    (order) => order.status.toUpperCase() === "LAB_ORDER_PLACED",
  ).length;
  const totalSpend = sortedOrders.reduce((sum, order) => sum + order.total, 0);
  const actionCenter = getActionCenter(newestActiveOrder, latestOrder);
  const checklist = buildProfileChecklist(viewer);
  const checklistReadyCount = checklist.filter((item) => item.ready).length;
  const readinessPercent = Math.round(
    (checklistReadyCount / checklist.length) * 100,
  );
  const displayName = viewer.firstName?.trim() || "there";
  const latestJourneyOrder = newestActiveOrder ?? latestOrder;
  const journeySteps = buildJourneySteps(latestJourneyOrder);
  const orderMix = buildStatusChart(sortedOrders);
  const monthlyActivity = buildMonthlyActivity(sortedOrders);
  const chartData =
    orderMix.length > 0
      ? orderMix
      : [
          {
            name: "Ready for first order",
            value: 1,
            color: CHART_COLORS.slate,
            description: "No orders yet. Start with a test or panel.",
          },
        ];
  const latestStatusMeta = latestJourneyOrder
    ? getStatusMeta(latestJourneyOrder)
    : null;

  const statCards = [
    {
      label: "Open orders",
      value: activeOrders.length.toString(),
      helper: "Orders still moving through checkout, review, or fulfillment.",
      accent: "from-sky-500/15 to-cyan-500/10",
    },
    {
      label: "Results ready",
      value: completedCount.toString(),
      helper: "Completed reports already available in your secure account.",
      accent: "from-emerald-500/15 to-teal-500/10",
    },
    {
      label: "Profile readiness",
      value: `${readinessPercent}%`,
      helper: "Core patient details completed for a smoother order flow.",
      accent: "from-slate-500/12 to-slate-200/10",
    },
    {
      label: "Lifetime spend",
      value: formatCurrency(totalSpend),
      helper: "All recorded order totals in your customer account.",
      accent: "from-violet-500/12 to-sky-500/10",
    },
  ];

  return (
    <div className='space-y-6'>
      <MotionSection reducedMotion={prefersReducedMotion} delay={0}>
        <Card className='overflow-hidden rounded-[32px] border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(15,118,110,0.94)_52%,rgba(14,165,233,0.9)_100%)] shadow-[0_30px_100px_-50px_rgba(8,47,73,0.65)]'>
          <CardContent className='relative p-0'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]' />
            <div className='relative grid gap-6 px-6 py-7 text-white lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-8'>
              <div className='space-y-5'>
                <div className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100'>
                  <Sparkles className='h-3.5 w-3.5' />
                  Overview
                </div>

                <div className='space-y-3'>
                  <h2 className='max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl'>
                    Welcome back, {displayName}
                  </h2>
                  <p className='max-w-2xl text-sm leading-7 text-sky-50/90 sm:text-base'>
                    See what needs attention, open requisitions, and return when
                    results are ready.
                  </p>
                </div>

                <div className='flex flex-wrap gap-3'>
                  <Button
                    asChild
                    className='rounded-full bg-white text-slate-950 hover:bg-slate-100'
                  >
                    <Link href={actionCenter.primaryHref}>
                      {actionCenter.primaryLabel}
                      <ArrowRight className='h-4 w-4' />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant='outline'
                    className='rounded-full border-white/25 bg-white/10 text-white hover:bg-white/15 hover:text-white'
                  >
                    <Link href='/tests'>Browse Catalog</Link>
                  </Button>
                </div>

                <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                  {statCards.map((card) => (
                    <div
                      key={card.label}
                      className={cn(
                        "rounded-[24px] border border-white/10 bg-gradient-to-br p-4 backdrop-blur-sm",
                        card.accent,
                      )}
                    >
                      <p className='text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80'>
                        {card.label}
                      </p>
                      <p className='mt-3 text-2xl font-semibold text-white'>
                        {card.value}
                      </p>
                      <p className='mt-2 text-sm leading-6 text-sky-50/80'>
                        {card.helper}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='grid gap-4'>
                <div className='rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-md'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-[0.22em] text-sky-100/75'>
                        Current focus
                      </p>
                      <h3 className='mt-2 text-2xl font-semibold text-white'>
                        {actionCenter.title}
                      </h3>
                    </div>
                    {latestStatusMeta ? (
                      <Badge
                        variant='outline'
                        className={cn(
                          "rounded-full border-white/15 bg-white/10 text-white",
                          latestStatusMeta.tone,
                        )}
                      >
                        {latestStatusMeta.shortLabel}
                      </Badge>
                    ) : null}
                  </div>

                  <p className='mt-3 text-sm leading-7 text-sky-50/85'>
                    {actionCenter.description}
                  </p>

                  <div className='mt-5 grid gap-3 sm:grid-cols-3'>
                    <div className='rounded-2xl border border-white/10 bg-slate-950/25 p-3'>
                      <p className='text-[11px] uppercase tracking-[0.18em] text-sky-100/70'>
                        Latest order
                      </p>
                      <p className='mt-2 text-sm font-semibold text-white'>
                        {latestJourneyOrder?.orderNumber || "No orders yet"}
                      </p>
                    </div>
                    <div className='rounded-2xl border border-white/10 bg-slate-950/25 p-3'>
                      <p className='text-[11px] uppercase tracking-[0.18em] text-sky-100/70'>
                        Ready for visit
                      </p>
                      <p className='mt-2 text-sm font-semibold text-white'>
                        {readyForVisitCount}
                      </p>
                    </div>
                    <div className='rounded-2xl border border-white/10 bg-slate-950/25 p-3'>
                      <p className='text-[11px] uppercase tracking-[0.18em] text-sky-100/70'>
                        Member since
                      </p>
                      <p className='mt-2 text-sm font-semibold text-white'>
                        {formatMemberSince(viewer.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-md'>
                  <div className='flex items-center gap-2 text-sky-100'>
                    <Stethoscope className='h-4 w-4' />
                    <p className='text-sm font-semibold'>Lab journey</p>
                  </div>
                  <div className='mt-4 space-y-3'>
                    {journeySteps.map((step, index) => (
                      <div key={step.label} className='flex items-start gap-3'>
                        <div
                          className={cn(
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                            step.state === "complete" &&
                              "border-emerald-300 bg-emerald-400/20 text-emerald-50",
                            step.state === "current" &&
                              "border-white/70 bg-white text-slate-950",
                            step.state === "upcoming" &&
                              "border-white/20 bg-white/10 text-sky-100/80",
                          )}
                        >
                          {step.state === "complete" ? (
                            <CheckCircle2 className='h-4 w-4' />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <p className='text-sm font-semibold text-white'>{step.label}</p>
                          <p className='text-sm leading-6 text-sky-50/78'>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionSection>

      {ordersError && (
        <MotionSection reducedMotion={prefersReducedMotion} delay={0.08}>
          <Card className='rounded-[28px] border-rose-200 bg-rose-50/90'>
            <CardContent className='flex items-start gap-3 px-5 py-4 text-sm text-rose-700'>
              <CircleAlert className='mt-0.5 h-4 w-4 shrink-0' />
              <div>
                <p className='font-semibold'>Unable to load recent order activity</p>
                <p className='mt-1'>{ordersError}</p>
              </div>
            </CardContent>
          </Card>
        </MotionSection>
      )}

      <div className='grid gap-6 xl:grid-cols-[1.15fr_0.85fr]'>
        <MotionSection reducedMotion={prefersReducedMotion} delay={0.12}>
          <Card className='rounded-[30px] border-white/70 bg-white/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)] backdrop-blur-xl'>
            <CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <CardTitle className='text-xl text-slate-950'>
                  Customer activity
                </CardTitle>
                <CardDescription>
                  Recent order activity and current status mix.
                </CardDescription>
              </div>
              <div className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                Last 6 months
              </div>
            </CardHeader>
            <CardContent className='grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
              <div className='rounded-[26px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbff_100%)] p-4'>
                <div className='mb-4 flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-sm font-semibold text-slate-950'>
                      Order momentum
                    </p>
                    <p className='text-sm text-slate-600'>
                      Orders created by month.
                    </p>
                  </div>
                </div>
                <div className='h-[260px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart data={monthlyActivity}>
                      <defs>
                        <linearGradient id='ordersArea' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor={CHART_COLORS.sky} stopOpacity={0.35} />
                          <stop offset='95%' stopColor={CHART_COLORS.sky} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='3 3' stroke='#dbe7f0' />
                      <XAxis
                        dataKey='label'
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          borderColor: "#dbe7f0",
                          boxShadow: "0 16px 40px -28px rgba(15, 23, 42, 0.45)",
                        }}
                        formatter={(value, name) => {
                          const numericValue = Array.isArray(value)
                            ? Number(value[0] ?? 0)
                            : Number(value ?? 0);

                          return [
                            name === "spend"
                              ? formatCurrency(numericValue)
                              : numericValue,
                            name === "spend" ? "Spend" : "Orders",
                          ];
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='orders'
                        stroke={CHART_COLORS.sky}
                        strokeWidth={3}
                        fill='url(#ordersArea)'
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className='grid gap-4'>
                <div className='rounded-[26px] border border-slate-200/80 bg-slate-50/85 p-4'>
                  <p className='text-sm font-semibold text-slate-950'>Order mix</p>
                  <p className='mt-1 text-sm text-slate-600'>
                    What your account activity looks like right now.
                  </p>
                  <div className='mt-4 h-[210px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey='value'
                          nameKey='name'
                          innerRadius={52}
                          outerRadius={78}
                          paddingAngle={3}
                          stroke='none'
                        >
                          {chartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "16px",
                            borderColor: "#dbe7f0",
                            boxShadow: "0 16px 40px -28px rgba(15, 23, 42, 0.45)",
                          }}
                          formatter={(value, _name, item) => {
                            const numericValue = Array.isArray(value)
                              ? Number(value[0] ?? 0)
                              : Number(value ?? 0);

                            return [numericValue, item.payload?.name ?? "Orders"];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className='space-y-2'>
                  {chartData.map((slice) => (
                    <div
                      key={slice.name}
                      className='rounded-[22px] border border-slate-200/80 bg-white px-4 py-3'
                    >
                      <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                          <span
                            className='h-3 w-3 rounded-full'
                            style={{ backgroundColor: slice.color }}
                          />
                          <div>
                            <p className='text-sm font-semibold text-slate-950'>
                              {slice.name}
                            </p>
                            <p className='text-sm text-slate-600'>
                              {slice.description}
                            </p>
                          </div>
                        </div>
                        <span className='text-lg font-semibold text-slate-950'>
                          {slice.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionSection>

        <MotionSection reducedMotion={prefersReducedMotion} delay={0.16}>
          <Card className='rounded-[30px] border-white/70 bg-white/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)] backdrop-blur-xl'>
            <CardHeader>
              <CardTitle className='text-xl text-slate-950'>
                Profile readiness
              </CardTitle>
              <CardDescription>
                Keep patient and security details current so orders move cleanly.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div className='rounded-[28px] bg-[linear-gradient(135deg,rgba(14,165,233,0.14)_0%,rgba(255,255,255,0.95)_48%,rgba(16,185,129,0.12)_100%)] p-5'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <p className='text-sm font-semibold text-slate-950'>
                      {checklistReadyCount} of {checklist.length} essentials complete
                    </p>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>
                      Keep essential patient details current for smoother orders.
                  </p>
                  </div>
                  <div className='rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white'>
                    {readinessPercent}%
                  </div>
                </div>
                <div className='mt-4 h-2 overflow-hidden rounded-full bg-slate-200'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 transition-all duration-500'
                    style={{ width: `${readinessPercent}%` }}
                  />
                </div>
              </div>

              <div className='space-y-3'>
                {checklist.map(({ label, ready, href, icon: Icon, helper }) => (
                  <Link
                    key={label}
                    href={href}
                    className='flex items-center justify-between gap-4 rounded-[22px] border border-slate-200/80 bg-slate-50/70 px-4 py-3 transition-colors hover:border-slate-300 hover:bg-white'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-2xl",
                          ready ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-600",
                        )}
                      >
                        <Icon className='h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-slate-950'>{label}</p>
                        <p className='text-sm text-slate-600'>{helper}</p>
                      </div>
                    </div>
                    {ready ? (
                      <BadgeCheck className='h-5 w-5 text-emerald-600' />
                    ) : (
                      <ArrowRight className='h-4 w-4 text-slate-400' />
                    )}
                  </Link>
                ))}
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <Button asChild variant='outline' className='rounded-full'>
                  <Link href='/profile'>Update Profile</Link>
                </Button>
                <Button asChild variant='ghost' className='rounded-full'>
                  <Link href='/profile/security'>
                    <ShieldCheck className='h-4 w-4' />
                    Security Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </MotionSection>
      </div>

      <div className='grid gap-6 xl:grid-cols-[1fr_0.92fr]'>
        <MotionSection reducedMotion={prefersReducedMotion} delay={0.2}>
          <Card className='rounded-[30px] border-white/70 bg-white/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)] backdrop-blur-xl'>
            <CardHeader>
              <CardTitle className='text-xl text-slate-950'>Action center</CardTitle>
              <CardDescription>
                The next best move based on your latest order state.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div className='rounded-[28px] bg-slate-950 p-5 text-white'>
                <p className='text-sm font-medium text-sky-200'>Next step</p>
                <h3 className='mt-2 text-2xl font-semibold'>{actionCenter.title}</h3>
                <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-200'>
                  {actionCenter.description}
                </p>

                <div className='mt-5 flex flex-wrap gap-3'>
                  <Button asChild className='rounded-full bg-white text-slate-950 hover:bg-slate-100'>
                    <Link href={actionCenter.primaryHref}>{actionCenter.primaryLabel}</Link>
                  </Button>
                  {actionCenter.secondaryHref && actionCenter.secondaryLabel ? (
                    <Button
                      asChild
                      variant='outline'
                      className='rounded-full border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white'
                    >
                      <Link href={actionCenter.secondaryHref}>
                        {actionCenter.secondaryLabel}
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-3'>
                <div className='rounded-[24px] border border-slate-200 bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                    Needs attention
                  </p>
                  <p className='mt-2 text-2xl font-semibold text-slate-950'>
                    {attentionCount}
                  </p>
                  <p className='mt-2 text-sm text-slate-600'>
                    Orders blocked by review, failure, or cancellation.
                  </p>
                </div>
                <div className='rounded-[24px] border border-slate-200 bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                    Latest test count
                  </p>
                  <p className='mt-2 text-2xl font-semibold text-slate-950'>
                    {Math.max(latestJourneyOrder?.itemsCount ?? 0, latestJourneyOrder ? 1 : 0)}
                  </p>
                  <p className='mt-2 text-sm text-slate-600'>
                    Items included in your latest tracked order.
                  </p>
                </div>
                <div className='rounded-[24px] border border-slate-200 bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                    Primary contact
                  </p>
                  <p className='mt-2 flex items-center gap-2 text-sm font-semibold text-slate-950'>
                    <Mail className='h-4 w-4 text-sky-600' />
                    <span className='truncate'>{viewer.email}</span>
                  </p>
                  <p className='mt-2 text-sm text-slate-600'>
                    Used for requisition and result notifications.
                  </p>
                </div>
              </div>

              <DashboardQuickLinks />
            </CardContent>
          </Card>
        </MotionSection>

        <MotionSection reducedMotion={prefersReducedMotion} delay={0.24}>
          <Card className='rounded-[30px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(240,249,255,0.92)_100%)] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)] backdrop-blur-xl'>
            <CardHeader>
              <CardTitle className='text-xl text-slate-950'>Care flow</CardTitle>
              <CardDescription>
                How your order moves from checkout to final report.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {journeySteps.map((step, index) => (
                <div key={step.label} className='flex items-start gap-4'>
                  <div className='flex flex-col items-center'>
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold",
                        step.state === "complete" &&
                          "border-emerald-200 bg-emerald-50 text-emerald-700",
                        step.state === "current" &&
                          "border-sky-200 bg-sky-600 text-white",
                        step.state === "upcoming" &&
                          "border-slate-200 bg-white text-slate-500",
                      )}
                    >
                      {step.state === "complete" ? (
                        <CheckCircle2 className='h-5 w-5' />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < journeySteps.length - 1 ? (
                      <div className='h-10 w-px bg-slate-200' />
                    ) : null}
                  </div>
                  <div className='min-w-0 flex-1 pb-4'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='text-sm font-semibold text-slate-950'>{step.label}</p>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                          step.state === "complete" &&
                            "bg-emerald-50 text-emerald-700",
                          step.state === "current" && "bg-sky-50 text-sky-700",
                          step.state === "upcoming" && "bg-slate-100 text-slate-600",
                        )}
                      >
                        {step.state}
                      </span>
                    </div>
                    <p className='mt-1 text-sm leading-6 text-slate-600'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className='rounded-[26px] border border-slate-200/80 bg-white p-5'>
                <p className='text-sm font-semibold text-slate-950'>Tips</p>
                <div className='mt-4 space-y-3 text-sm text-slate-600'>
                  <div className='flex items-start gap-3'>
                    <ClipboardList className='mt-0.5 h-4 w-4 shrink-0 text-sky-600' />
                    <span>Keep profile details complete before placing time-sensitive orders.</span>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Download className='mt-0.5 h-4 w-4 shrink-0 text-sky-600' />
                    <span>Download the requisition as soon as the lab order is placed.</span>
                  </div>
                  <div className='flex items-start gap-3'>
                    <ReceiptText className='mt-0.5 h-4 w-4 shrink-0 text-sky-600' />
                    <span>Return here for final results instead of relying on email alone.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionSection>
      </div>

      {sortedOrders.length === 0 ? (
        <MotionSection reducedMotion={prefersReducedMotion} delay={0.28}>
          <Card className='rounded-[32px] border-white/70 bg-white/90 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)]'>
            <CardContent className='px-6 py-10 text-center sm:px-10'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-sky-50 text-sky-700'>
                <FlaskConical className='h-7 w-7' />
              </div>
              <h3 className='mt-5 text-3xl font-semibold tracking-tight text-slate-950'>
                No orders yet
              </h3>
              <p className='mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600'>
                Once you place an order, this dashboard will show the next care
                step, requisition access, and final result delivery in one place.
              </p>
              <Button asChild className='mt-6 rounded-full px-6'>
                <Link href='/tests'>Browse Tests</Link>
              </Button>

              <div className='mt-8 grid gap-4 text-left md:grid-cols-3'>
                {[
                  "Choose a test or panel and complete secure checkout.",
                  "Wait for requisition availability and visit a partner lab.",
                  "Review final results here as soon as reports are released.",
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
        </MotionSection>
      ) : null}

      {activeOrders.length > 0 && (
        <MotionSection reducedMotion={prefersReducedMotion} delay={0.32}>
          <section className='space-y-4'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <h3 className='text-xl font-semibold text-slate-950'>Active orders</h3>
                <p className='mt-1 text-sm text-slate-600'>
                  Orders that still need fulfillment, review, lab collection, or final results.
                </p>
              </div>
              <Button asChild variant='outline' className='rounded-full'>
                <Link href='/profile/orders'>View all orders</Link>
              </Button>
            </div>

            <div className='grid gap-4 xl:grid-cols-3'>
              {activeOrders.slice(0, 3).map((order) => {
                const status = getStatusMeta(order);

                return (
                  <motion.div
                    key={order.id}
                    initial={
                      prefersReducedMotion ? undefined : { opacity: 0, y: 16 }
                    }
                    animate={
                      prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                          }
                    }
                  >
                    <Card className='h-full rounded-[30px] border-white/70 bg-white/90 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)]'>
                      <CardHeader className='space-y-4'>
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <CardTitle className='text-lg text-slate-950'>
                              {order.orderNumber}
                            </CardTitle>
                            <CardDescription className='mt-1 text-sm text-slate-600'>
                              {order.primaryTest?.testName || "Lab order"} •{" "}
                              {Math.max(order.itemsCount, 1)}{" "}
                              {Math.max(order.itemsCount, 1) === 1 ? "item" : "items"}
                            </CardDescription>
                          </div>
                          <Badge variant='outline' className={cn("rounded-full", status.tone)}>
                            {status.shortLabel}
                          </Badge>
                        </div>

                        <div
                          className={cn(
                            "rounded-[24px] border border-slate-200 bg-gradient-to-br p-4",
                            status.surface,
                          )}
                        >
                          <p className='text-sm font-semibold text-slate-950'>
                            {status.label}
                          </p>
                          <p className='mt-2 text-sm leading-6 text-slate-600'>
                            {order.labVisitInstructions ||
                              "Open the order to review the latest requisition, status detail, and next required action."}
                          </p>
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
                              Updated
                            </p>
                            <p className='mt-2 text-sm font-semibold text-slate-900'>
                              {formatDateShort(order.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-3'>
                        <div className='flex flex-wrap gap-3'>
                          {order.requisitionPdfUrl ? (
                            <Button asChild className='rounded-full'>
                              <a href={order.requisitionPdfUrl} target='_blank' rel='noreferrer'>
                                <Download className='h-4 w-4' />
                                Requisition
                              </a>
                            </Button>
                          ) : null}
                          <Button asChild variant='outline' className='rounded-full'>
                            <Link href={getOrderHref(order)}>
                              <ClipboardList className='h-4 w-4' />
                              Order details
                            </Link>
                          </Button>
                          <Button asChild variant='ghost' className='rounded-full'>
                            <Link href='/help-center'>
                              <LifeBuoy className='h-4 w-4' />
                              Support
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </MotionSection>
      )}

      {historyOrders.length > 0 && (
        <MotionSection reducedMotion={prefersReducedMotion} delay={0.36}>
          <Card className='rounded-[30px] border-white/70 bg-white/90 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)]'>
            <CardHeader>
              <CardTitle className='text-xl text-slate-950'>Recent history</CardTitle>
              <CardDescription>
                Your latest five orders with status, totals, and direct result links.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {historyOrders.map((order) => {
                const status = getStatusMeta(order);

                return (
                  <div
                    key={order.id}
                    className='flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between'
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
                        {status.shortLabel}
                      </Badge>
                      <span className='text-sm font-semibold text-slate-950'>
                        {formatCurrency(order.total)}
                      </span>
                      <Button asChild variant='ghost' className='rounded-full'>
                        <Link href={getOrderHref(order)}>
                          <FileText className='h-4 w-4' />
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </MotionSection>
      )}
    </div>
  );
}
