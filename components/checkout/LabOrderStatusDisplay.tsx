"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  LAB_ORDER_STATUS_DESCRIPTION,
  LAB_ORDER_STATUS_LABELS,
  useLabOrderStatus,
} from "@/lib/hooks/useLabOrderStatus";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";

interface LabOrderStatusDisplayProps {
  orderId: string;
  compact?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-slate-100 text-slate-800 dark:bg-slate-800",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900",
  LAB_ORDER_PLACED: "bg-green-100 text-green-800 dark:bg-green-900",
  LAB_SUBMISSION_PENDING: "bg-blue-100 text-blue-800 dark:bg-blue-900",
  LAB_SUBMISSION_RETRYING: "bg-amber-100 text-amber-800 dark:bg-amber-900",
  LAB_SUBMISSION_FAILED_RETRYABLE:
    "bg-orange-100 text-orange-800 dark:bg-orange-900",
  LAB_SUBMISSION_FAILED_FINAL: "bg-red-100 text-red-800 dark:bg-red-900",
  MANUAL_REVIEW: "bg-red-100 text-red-800 dark:bg-red-900",
  REFUND_PENDING: "bg-slate-100 text-slate-800 dark:bg-slate-800",
  REFUNDED: "bg-slate-100 text-slate-800 dark:bg-slate-800",
  IN_PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900",
  CANCELLED: "bg-slate-100 text-slate-800 dark:bg-slate-800",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING_PAYMENT: <Clock className='h-4 w-4' />,
  PAID: <CheckCircle2 className='h-4 w-4' />,
  LAB_ORDER_PLACED: <CheckCircle2 className='h-4 w-4' />,
  LAB_SUBMISSION_PENDING: <Loader2 className='h-4 w-4 animate-spin' />,
  LAB_SUBMISSION_RETRYING: <Loader2 className='h-4 w-4 animate-spin' />,
  LAB_SUBMISSION_FAILED_RETRYABLE: <AlertCircle className='h-4 w-4' />,
  LAB_SUBMISSION_FAILED_FINAL: <AlertCircle className='h-4 w-4' />,
  MANUAL_REVIEW: <AlertCircle className='h-4 w-4' />,
  REFUND_PENDING: <Clock className='h-4 w-4' />,
  REFUNDED: <CheckCircle2 className='h-4 w-4' />,
  IN_PROCESSING: <Loader2 className='h-4 w-4 animate-spin' />,
  COMPLETED: <CheckCircle2 className='h-4 w-4' />,
  FAILED: <AlertCircle className='h-4 w-4' />,
  CANCELLED: <AlertCircle className='h-4 w-4' />,
};

export default function LabOrderStatusDisplay({
  orderId,
  compact = false,
}: LabOrderStatusDisplayProps) {
  const { status, isLoading, error, lastUpdated } = useLabOrderStatus({
    orderId,
    pollInterval: 5000,
  });

  if (isLoading && !status) {
    return (
      <div className='text-center py-4'>
        <Loader2 className='h-6 w-6 animate-spin mx-auto text-muted-foreground' />
        <p className='text-sm text-muted-foreground mt-2'>
          Loading lab order status...
        </p>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className='text-center py-4 text-red-600'>
        <AlertCircle className='h-6 w-6 mx-auto mb-2' />
        <p className='text-sm'>Failed to load status</p>
      </div>
    );
  }

  if (!status) return null;

  const label = LAB_ORDER_STATUS_LABELS[status.status] || status.status;
  const description = LAB_ORDER_STATUS_DESCRIPTION[status.status] || "";
  const colorClass =
    STATUS_COLORS[status.status] || "bg-slate-100 text-slate-800";
  const icon = STATUS_ICONS[status.status];

  if (compact) {
    return (
      <div className='flex items-center gap-2'>
        <div className={`p-1.5 rounded ${colorClass}`}>{icon}</div>
        <div>
          <p className='text-sm font-medium'>{label}</p>
          {lastUpdated && (
            <p className='text-xs text-muted-foreground'>
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className='p-6'>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <div>
            <h3 className='font-semibold text-lg'>Lab Order Status</h3>
            <p className='text-sm text-muted-foreground'>Order ID: {orderId}</p>
          </div>
          <Badge className={`${colorClass} border-0`}>
            <span className='mr-2'>{icon}</span>
            {label}
          </Badge>
        </div>

        <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-4'>
          <p className='text-sm text-blue-900 dark:text-blue-100'>
            {description}
          </p>
        </div>

        {status.confirmedLabLocation && (
          <div>
            <h4 className='text-sm font-medium mb-2'>Lab Location</h4>
            <div className='bg-slate-50 dark:bg-slate-900 rounded p-3 text-sm space-y-1'>
              <p className='font-medium'>{status.confirmedLabLocation.name}</p>
              <p className='text-muted-foreground'>
                {status.confirmedLabLocation.address}
              </p>
              {status.confirmedLabLocation.phone && (
                <p className='text-muted-foreground'>
                  {status.confirmedLabLocation.phone}
                </p>
              )}
            </div>
          </div>
        )}

        {lastUpdated && (
          <p className='text-xs text-muted-foreground border-t pt-3'>
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}
      </div>
    </Card>
  );
}
