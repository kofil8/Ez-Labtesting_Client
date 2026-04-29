"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  MapPin,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

export interface OrderTrackingStatus {
  currentStep: number;
  totalSteps: number;
  status: "pending" | "processing" | "completed" | "failed" | "needs_review";
  statusLabel: string;
  description: string;
  estimatedCompletion?: string;
  labOrderId?: string;
  requisitionUrl?: string;
  labLocation?: {
    name: string;
    address: string;
  };
}

interface OrderTrackingCardProps {
  orderId: string;
  orderNumber: string;
  testCount: number;
  totalAmount: number;
  tracking: OrderTrackingStatus;
  onRetry?: () => Promise<void>;
  isRetrying?: boolean;
}

const STEP_LABELS = [
  "Order placed",
  "Payment confirmed",
  "Lab order submitted",
  "Results ready",
];

function getStatusAppearance(status: OrderTrackingStatus["status"]) {
  if (status === "completed") {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
      iconTone: "text-emerald-600",
      banner: "border-emerald-200 bg-emerald-50 text-emerald-900",
    };
  }

  if (status === "processing") {
    return {
      badge: "border-sky-200 bg-sky-50 text-sky-700",
      icon: Clock,
      iconTone: "text-sky-600",
      banner: "border-sky-200 bg-sky-50 text-sky-900",
    };
  }

  if (status === "failed") {
    return {
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      icon: AlertCircle,
      iconTone: "text-rose-600",
      banner: "border-rose-200 bg-rose-50 text-rose-900",
    };
  }

  if (status === "needs_review") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      icon: ShieldAlert,
      iconTone: "text-amber-600",
      banner: "border-amber-200 bg-amber-50 text-amber-900",
    };
  }

  return {
    badge: "border-slate-200 bg-slate-50 text-slate-700",
    icon: Clock,
    iconTone: "text-slate-600",
    banner: "border-slate-200 bg-slate-50 text-slate-900",
  };
}

export function OrderTrackingCard({
  orderId,
  orderNumber,
  testCount,
  totalAmount,
  tracking,
  onRetry,
  isRetrying,
}: OrderTrackingCardProps) {
  const statusAppearance = getStatusAppearance(tracking.status);
  const StatusIcon = statusAppearance.icon;
  const progressPercentage = (tracking.currentStep / tracking.totalSteps) * 100;

  return (
    <Card className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
      <CardHeader className='border-b border-slate-100/90 pb-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <CardTitle className='flex flex-wrap items-center gap-2 text-lg text-slate-950'>
              <span>{orderNumber}</span>
              <Badge variant='outline' className='rounded-full border-slate-200 bg-slate-50 text-slate-600'>
                {testCount} {testCount === 1 ? "test" : "tests"}
              </Badge>
            </CardTitle>
            <p className='mt-2 text-sm text-slate-600'>
              Total paid:{" "}
              <span className='font-semibold text-slate-950'>
                {formatCurrency(totalAmount)}
              </span>
            </p>
          </div>

          <Badge
            variant='outline'
            className={cn("rounded-full border", statusAppearance.badge)}
          >
            <StatusIcon className={cn("mr-1 h-3.5 w-3.5", statusAppearance.iconTone)} />
            {tracking.statusLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-5 p-5'>
        <div
          className={cn(
            "rounded-[22px] border px-4 py-3 text-sm leading-6",
            statusAppearance.banner,
          )}
        >
          {tracking.description}
        </div>

        <div className='space-y-3'>
          <div className='flex items-center justify-between text-sm'>
            <span className='font-medium text-slate-900'>Progress</span>
            <span className='text-slate-500'>
              Step {tracking.currentStep} of {tracking.totalSteps}
            </span>
          </div>
          <Progress value={progressPercentage} className='h-2.5' />
        </div>

        <div className='grid gap-3 md:grid-cols-4'>
          {STEP_LABELS.map((label, index) => {
            const stepIndex = index + 1;
            const isComplete = stepIndex < tracking.currentStep;
            const isCurrent = stepIndex === tracking.currentStep;

            return (
              <div
                key={label}
                className={cn(
                  "rounded-[22px] border p-3",
                  isComplete && "border-emerald-200 bg-emerald-50/70",
                  isCurrent && "border-sky-200 bg-sky-50/70",
                  !isComplete && !isCurrent && "border-slate-200 bg-slate-50/70",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    isComplete && "bg-emerald-600 text-white",
                    isCurrent && "bg-sky-600 text-white",
                    !isComplete && !isCurrent && "bg-white text-slate-500",
                  )}
                >
                  {isComplete ? <CheckCircle2 className='h-4 w-4' /> : stepIndex}
                </div>
                <p className='mt-3 text-sm font-medium text-slate-900'>{label}</p>
                <p className='mt-1 text-xs uppercase tracking-[0.18em] text-slate-500'>
                  {isComplete ? "Done" : isCurrent ? "Current" : "Upcoming"}
                </p>
              </div>
            );
          })}
        </div>

        <div className='grid gap-3 sm:grid-cols-2'>
          {tracking.estimatedCompletion ? (
            <div className='flex items-center gap-2 rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-600'>
              <Calendar className='h-4 w-4 text-sky-600' />
              <span>
                Estimated completion:{" "}
                <strong className='font-semibold text-slate-900'>
                  {tracking.estimatedCompletion}
                </strong>
              </span>
            </div>
          ) : null}

          {tracking.labOrderId ? (
            <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3'>
              <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                Lab order ID
              </p>
              <p className='mt-2 font-mono text-sm font-medium text-slate-900'>
                {tracking.labOrderId}
              </p>
            </div>
          ) : null}
        </div>

        {tracking.labLocation ? (
          <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 p-4'>
            <div className='flex items-start gap-3'>
              <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-sky-600' />
              <div>
                <p className='text-sm font-semibold text-slate-900'>
                  {tracking.labLocation.name}
                </p>
                <p className='mt-1 text-sm text-slate-600'>
                  {tracking.labLocation.address}
                </p>
              </div>
            </div>
            <Button asChild variant='ghost' size='sm' className='mt-3 rounded-full'>
              <Link href='/find-lab-center'>View directions</Link>
            </Button>
          </div>
        ) : null}

        <div className='flex flex-wrap gap-3 pt-1'>
          {tracking.requisitionUrl ? (
            <Button variant='outline' asChild className='rounded-full'>
              <a href={tracking.requisitionUrl} download target='_blank' rel='noreferrer'>
                <Download className='h-4 w-4' />
                Requisition
              </a>
            </Button>
          ) : null}

          {tracking.status === "needs_review" && onRetry ? (
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              className='rounded-full'
            >
              {isRetrying ? (
                <>
                  <Clock className='h-4 w-4 animate-spin' />
                  Retrying
                </>
              ) : (
                <>
                  <RotateCcw className='h-4 w-4' />
                  Retry
                </>
              )}
            </Button>
          ) : null}

          {tracking.status === "failed" ? (
            <Button variant='ghost' asChild className='rounded-full'>
              <Link href='/dashboard/customer/support'>Get help</Link>
            </Button>
          ) : null}

          <Button variant='ghost' asChild className='rounded-full'>
            <Link href={`/dashboard/customer/results/${orderId}`}>
              <Eye className='h-4 w-4' />
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
