"use client";

import { OrderTrackingCard } from "@/components/results/OrderTrackingCard";
import { RequisitionDownloader } from "@/components/results/RequisitionDownloader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { subscribeToOrderTracking } from "@/lib/services/order-tracking.socket";
import {
  getOrderDetails,
  getOrderTracking,
  retryOrderAccessPlacement,
} from "@/lib/services/order.service";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Radio,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RealtimeState = "connecting" | "live" | "polling" | "disconnected";

const mapBackendStatusToCardStatus = (
  status: string,
  manualReviewRequired?: boolean,
): "pending" | "processing" | "completed" | "failed" | "needs_review" => {
  if (manualReviewRequired) return "needs_review";
  const s = status.toUpperCase();
  if (s === "COMPLETED") return "completed";
  if (s === "FAILED" || s === "CANCELLED") return "failed";
  if (s === "PENDING_PAYMENT") return "pending";
  return "processing";
};

function isTerminalStatus(status: string) {
  const s = status.toUpperCase();
  return (
    s === "COMPLETED" || s === "FAILED" || s === "CANCELLED" || s === "REFUNDED"
  );
}

function RealtimePill({ state }: { state: RealtimeState }) {
  if (state === "live") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300'>
        <span className='relative flex h-2 w-2'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75' />
          <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-600' />
        </span>
        Live
      </span>
    );
  }
  if (state === "polling") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-cyan-300'>
        <RefreshCw className='h-3 w-3 animate-spin' />
        Syncing
      </span>
    );
  }
  if (state === "connecting") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'>
        <Radio className='h-3 w-3 animate-pulse' />
        Connecting
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300'>
      <WifiOff className='h-3 w-3' />
      Offline
    </span>
  );
}

function LastUpdatedBadge({ at }: { at: Date | null }) {
  if (!at) return null;
  return (
    <span className='text-xs text-slate-500 dark:text-slate-400'>
      Updated {at.toLocaleTimeString()}
    </span>
  );
}

interface OrderTrackingDetailProps {
  orderId: string;
}

export function OrderTrackingDetail({ orderId }: OrderTrackingDetailProps) {
  const { user } = useAuth();

  const [tracking, setTracking] = useState<any | null>(null);
  const [details, setDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [realtimeState, setRealtimeState] =
    useState<RealtimeState>("connecting");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(true);
  const unsubSocketRef = useRef<(() => void) | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [trackingData, detailData] = await Promise.all([
        getOrderTracking(orderId),
        getOrderDetails(orderId),
      ]);
      if (!activeRef.current) return;
      setTracking(trackingData);
      setDetails(detailData);
      setError(null);
      setLastUpdatedAt(new Date());
    } catch (err) {
      if (!activeRef.current) return;
      setError(
        err instanceof Error ? err.message : "Unable to load order tracking.",
      );
    } finally {
      if (activeRef.current) setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    activeRef.current = true;

    const load = async () => {
      await fetchData();
    };

    void load();

    const setupSocket = async () => {
      try {
        setRealtimeState("connecting");
        const unsub = await subscribeToOrderTracking(orderId, {
          onTrackingUpdate: async (update) => {
            if (!activeRef.current) return;
            setTracking(update);
            setLastUpdatedAt(new Date());
            setRealtimeState("live");
            try {
              const detailData = await getOrderDetails(orderId);
              if (activeRef.current) setDetails(detailData);
            } catch {
              // polling will catch up
            }
          },
          onStatusChanged: (change) => {
            if (!activeRef.current) return;
            setLastUpdatedAt(new Date());
            setRealtimeState("live");
            if (change.status) {
              setDetails((prev: any) =>
                prev
                  ? {
                      ...prev,
                      status: change.status,
                      manualReviewRequired:
                        change.manualReviewRequired ??
                        prev.manualReviewRequired,
                    }
                  : prev,
              );
            }
          },
          onError: () => {
            if (!activeRef.current) return;
            setRealtimeState("disconnected");
          },
        });
        if (activeRef.current) {
          unsubSocketRef.current = unsub;
          setRealtimeState("live");
        } else {
          unsub();
        }
      } catch {
        if (activeRef.current) setRealtimeState("disconnected");
      }
    };

    void setupSocket();

    // Polling fallback every 15 s
    pollRef.current = setInterval(() => {
      if (!activeRef.current) return;
      setRealtimeState((prev) => (prev === "live" ? "live" : "polling"));
      void fetchData().then(() => {
        setRealtimeState((prev) =>
          prev === "polling" ? "disconnected" : prev,
        );
      });
    }, 15000);

    return () => {
      activeRef.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
      unsubSocketRef.current?.();
      unsubSocketRef.current = null;
    };
  }, [orderId, fetchData]);

  const trackingCardData = useMemo(() => {
    if (!tracking || !details) return null;

    const statusLabel =
      tracking.status
        ?.toString()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase()) ||
      "In Progress";

    return {
      currentStep: tracking.currentStep || 1,
      totalSteps: 4,
      status: mapBackendStatusToCardStatus(
        details.status ?? tracking.status,
        details.manualReviewRequired,
      ),
      statusLabel,
      description:
        details.labVisitInstructions ||
        "Your order is being processed. Status updates appear here in real time.",
      labOrderId: details.accessOrderId ?? undefined,
      requisitionUrl:
        details.requisitionPdfUrl ?? tracking.requisitionUrl ?? undefined,
      labLocation: tracking.labLocation
        ? {
            name: tracking.labLocation.name || "Assigned Collection Center",
            address:
              tracking.labLocation.address ||
              "Address will be available shortly",
          }
        : undefined,
      estimatedCompletion: isTerminalStatus(details.status ?? tracking.status)
        ? undefined
        : "24-48 hours after sample collection",
    };
  }, [tracking, details]);

  const terminal = details ? isTerminalStatus(details.status) : false;

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      await retryOrderAccessPlacement(orderId);
      await fetchData();
    } finally {
      setIsRetrying(false);
    }
  }, [orderId, fetchData]);

  if (loading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-[72px] w-full rounded-[24px]' />
        <Skeleton className='h-64 w-full rounded-[24px]' />
        <Skeleton className='h-48 w-full rounded-[24px]' />
      </div>
    );
  }

  if (error && !trackingCardData) {
    return (
      <Card className='rounded-[28px] border-rose-200 bg-rose-50/70 dark:border-rose-900/70 dark:bg-rose-950/30'>
        <CardContent className='flex items-start justify-between gap-4 pb-6 pt-6'>
          <div>
            <div className='flex items-center gap-2 text-rose-700'>
              <AlertCircle className='h-4 w-4' />
              <p className='font-semibold'>Unable to load tracking</p>
            </div>
            <p className='mt-1 text-sm text-rose-700/90'>{error}</p>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={fetchData}
            className='shrink-0 rounded-full'
          >
            <RefreshCw className='mr-2 h-4 w-4' />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-5'>
      {/* Realtime status bar */}
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
        <div className='flex items-center gap-3'>
          <RealtimePill state={terminal ? "disconnected" : realtimeState} />
          {terminal && (
            <Badge
              variant='outline'
              className={cn(
                "rounded-full font-medium",
                details?.status?.toUpperCase() === "COMPLETED"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700",
              )}
            >
              {details?.status?.toUpperCase() === "COMPLETED" ? (
                <CheckCircle2 className='mr-1 h-3.5 w-3.5' />
              ) : (
                <AlertCircle className='mr-1 h-3.5 w-3.5' />
              )}
              {details?.status?.replace(/_/g, " ")}
            </Badge>
          )}
          {!terminal && (
            <span className='text-sm text-slate-600 dark:text-slate-300'>
              Tracking updates automatically
            </span>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <LastUpdatedBadge at={lastUpdatedAt} />
          <Button
            variant='ghost'
            size='sm'
            onClick={fetchData}
            className='h-8 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          >
            <RefreshCw className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>

      {/* Main tracking card */}
      {trackingCardData && details && (
        <OrderTrackingCard
          orderId={orderId}
          orderNumber={
            details.orderNumber || `ORD-${orderId.slice(0, 8).toUpperCase()}`
          }
          testCount={1}
          totalAmount={Number(details.total || 0)}
          tracking={trackingCardData}
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      )}

      {/* Requisition downloader when available */}
      {details && (details.requisitionPdfUrl || tracking?.requisitionUrl) && (
        <RequisitionDownloader
          requisition={{
            orderId,
            orderNumber:
              details.orderNumber || `ORD-${orderId.slice(0, 8).toUpperCase()}`,
            requisitionId: details.accessOrderId ?? undefined,
            pdfUrl:
              details.requisitionPdfUrl ??
              tracking?.requisitionUrl ??
              undefined,
            generatedDate: details.updatedAt
              ? new Date(details.updatedAt).toLocaleDateString()
              : "",
            testsCount: 1,
            testsList: [],
            patientName:
              `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
              "Patient",
            labLocation: tracking?.labLocation
              ? {
                  name:
                    tracking.labLocation.name || "Assigned Collection Center",
                  address: tracking.labLocation.address || "",
                  city: "",
                  state: "",
                  zip: "",
                  phone: tracking.labLocation.phone || undefined,
                  hours: tracking.labLocation.hours || undefined,
                }
              : undefined,
          }}
        />
      )}

      {/* Step timeline detail */}
      {tracking?.steps && tracking.steps.length > 0 && (
        <Card className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950'>
          <CardContent className='p-5'>
            <p className='mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>
              Event timeline
            </p>
            <ol className='relative border-l border-slate-200 dark:border-slate-700'>
              {(
                tracking.steps as Array<{
                  step: number;
                  label: string;
                  completed: boolean;
                  completedAt?: string | null;
                }>
              ).map((step, idx) => (
                <li key={idx} className='mb-4 ml-5 last:mb-0'>
                  <span
                    className={cn(
                      "absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full border-2",
                      step.completed
                        ? "border-emerald-200 bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/50"
                        : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
                    )}
                  >
                    {step.completed ? (
                      <CheckCircle2 className='h-3 w-3 text-emerald-600 dark:text-emerald-400' />
                    ) : (
                      <Clock className='h-3 w-3 text-slate-400' />
                    )}
                  </span>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.completed
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {step.label}
                  </p>
                  {step.completedAt && (
                    <p className='mt-0.5 text-xs text-slate-500 dark:text-slate-400'>
                      {new Date(step.completedAt).toLocaleString()}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Back + support actions */}
      <div className='flex flex-wrap items-center gap-3 pt-1'>
        <Button asChild variant='outline' className='rounded-full'>
          <Link href='/dashboard/customer/orders'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Orders
          </Link>
        </Button>
        <Button asChild variant='ghost' className='rounded-full'>
          <Link href='/dashboard/customer/support'>Get help</Link>
        </Button>
      </div>
    </div>
  );
}
