"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  MapPin,
  RotateCcw,
  Zap,
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

export function OrderTrackingCard({
  orderId,
  orderNumber,
  testCount,
  totalAmount,
  tracking,
  onRetry,
  isRetrying,
}: OrderTrackingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "failed":
        return "bg-red-100 text-red-700 border-red-300";
      case "needs_review":
        return "bg-amber-100 text-amber-700 border-amber-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className='w-5 h-5 text-emerald-600' />;
      case "processing":
        return <Clock className='w-5 h-5 text-blue-600 animate-spin' />;
      case "failed":
        return <AlertCircle className='w-5 h-5 text-red-600' />;
      case "needs_review":
        return <Zap className='w-5 h-5 text-amber-600' />;
      default:
        return <Clock className='w-5 h-5 text-slate-600' />;
    }
  };

  const progressPercentage = (tracking.currentStep / tracking.totalSteps) * 100;

  const steps = [
    { label: "Order Placed", icon: "📋" },
    { label: "Payment Processed", icon: "💰" },
    { label: "Lab Order Submitted", icon: "📤" },
    { label: "Results Available", icon: "🔬" },
  ];

  return (
    <Card className='overflow-hidden border-slate-200 dark:border-slate-700'>
      <CardHeader className='bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800 dark:to-transparent pb-3'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <span>{orderNumber}</span>
              <Badge variant='outline' className='text-xs'>
                {testCount} {testCount === 1 ? "test" : "tests"}
              </Badge>
            </CardTitle>
            <p className='text-sm text-muted-foreground mt-1'>
              Total:{" "}
              <span className='font-semibold text-foreground'>
                ${totalAmount.toFixed(2)}
              </span>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            {getStatusIcon(tracking.status)}
            <Badge className={`${getStatusColor(tracking.status)} border`}>
              {tracking.statusLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6 pt-6'>
        {/* Status Description */}
        <div className='bg-blue-50 dark:bg-blue-950/30 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-900'>
          <p className='text-sm text-blue-900 dark:text-blue-200'>
            {tracking.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex justify-between items-center text-sm'>
            <span className='font-medium'>Progress</span>
            <span className='text-muted-foreground'>
              {tracking.currentStep} of {tracking.totalSteps}
            </span>
          </div>
          <Progress value={progressPercentage} className='h-2' />
        </div>

        {/* Timeline Steps */}
        <div className='space-y-3'>
          {steps.map((step, index) => {
            const isCompleted = index < tracking.currentStep;
            const isCurrent = index === tracking.currentStep - 1;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCompleted || isCurrent
                    ? "bg-slate-100 dark:bg-slate-700"
                    : "bg-slate-50 dark:bg-slate-800"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : isCurrent
                        ? "bg-blue-100 text-blue-700 animate-pulse"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? "✓" : step.icon}
                </div>
                <div className='flex-1'>
                  <p
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {isCurrent && (
                  <span className='text-xs font-semibold text-blue-600 dark:text-blue-400'>
                    In Progress
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Estimated Completion */}
        {tracking.estimatedCompletion && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Calendar className='w-4 h-4' />
            <span>
              Estimated completion:{" "}
              <strong>{tracking.estimatedCompletion}</strong>
            </span>
          </div>
        )}

        {/* Lab Location - if assigned */}
        {tracking.labLocation && (
          <div className='border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2'>
            <div className='flex items-start gap-2'>
              <MapPin className='w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0' />
              <div>
                <p className='text-sm font-medium'>
                  {tracking.labLocation.name}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {tracking.labLocation.address}
                </p>
              </div>
            </div>
            <Button asChild variant='ghost' size='sm' className='w-full'>
              <Link href='/find-lab-center'>View Directions</Link>
            </Button>
          </div>
        )}

        {/* Lab Order ID */}
        {tracking.labOrderId && (
          <div className='text-xs space-y-1'>
            <p className='text-muted-foreground'>Lab Order ID</p>
            <p className='font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded'>
              {tracking.labOrderId}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-2 pt-3'>
          {tracking.requisitionUrl && (
            <Button variant='outline' size='sm' asChild className='flex-1'>
              <a href={tracking.requisitionUrl} download target='_blank'>
                <Download className='w-4 h-4 mr-2' />
                Requisition
              </a>
            </Button>
          )}

          {tracking.status === "needs_review" && onRetry && (
            <Button
              size='sm'
              onClick={onRetry}
              disabled={isRetrying}
              className='flex-1'
            >
              {isRetrying ? (
                <>
                  <Clock className='w-4 h-4 mr-2 animate-spin' />
                  Retrying...
                </>
              ) : (
                <>
                  <RotateCcw className='w-4 h-4 mr-2' />
                  Retry
                </>
              )}
            </Button>
          )}

          {tracking.status === "failed" && (
            <Button variant='ghost' size='sm' asChild className='flex-1'>
              <Link href='/help-center'>Get Help</Link>
            </Button>
          )}

          <Button variant='ghost' size='sm' asChild className='flex-1'>
            <Link href={`/results/${orderId}`}>
              <Eye className='w-4 h-4 mr-2' />
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
