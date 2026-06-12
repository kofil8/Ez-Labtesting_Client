"use client";

import { getOrderDetails } from "@/lib/services/order.service";
import { useCallback, useEffect, useState } from "react";

export interface LabOrderStatus {
  orderId: string;
  status: string;
  labOrderPlacedAt?: string;
  updatedAt?: string;
  requisitionPdfUrl?: string | null;
  labVisitInstructions?: string | null;
  confirmedLabLocation?: {
    name?: string;
    address?: string;
    phone?: string;
  } | null;
  manualReviewRequired?: boolean;
}

interface UseLabOrderStatusProps {
  orderId: string;
  pollInterval?: number; // in milliseconds, default 5000ms
  enabled?: boolean;
}

export function useLabOrderStatus({
  orderId,
  pollInterval = 5000,
  enabled = true,
}: UseLabOrderStatusProps) {
  const [status, setStatus] = useState<LabOrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!orderId || !enabled) return;

    try {
      setIsLoading(true);
      const details = await getOrderDetails(orderId);
      setStatus({
        orderId: details.id,
        status: details.status,
        labOrderPlacedAt: details.updatedAt,
        updatedAt: details.updatedAt,
        requisitionPdfUrl: details.requisitionPdfUrl,
        labVisitInstructions: details.labVisitInstructions,
        confirmedLabLocation: details.confirmedLabLocation,
        manualReviewRequired: details.manualReviewRequired,
      });
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch status"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderId, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Polling interval
  useEffect(() => {
    if (!enabled || !orderId) return;

    const interval = setInterval(fetchStatus, pollInterval);
    return () => clearInterval(interval);
  }, [orderId, pollInterval, enabled, fetchStatus]);

  return {
    status,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchStatus,
  };
}

export const LAB_ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Awaiting Payment",
  PAID: "Payment Received",
  LAB_ORDER_PLACED: "Lab Order Confirmed",
  LAB_SUBMISSION_PENDING: "Submitting to Lab",
  LAB_SUBMISSION_RETRYING: "Retrying Lab Submission",
  LAB_SUBMISSION_FAILED_RETRYABLE: "Lab Submission Failed - Retrying",
  LAB_SUBMISSION_FAILED_FINAL: "Lab Submission Failed - Manual Review",
  MANUAL_REVIEW: "Manual Review Required",
  REFUND_PENDING: "Refund Processing",
  REFUNDED: "Refunded",
  IN_PROCESSING: "Sample Processing",
  COMPLETED: "Results Available",
  FAILED: "Order Failed",
  CANCELLED: "Order Cancelled",
};

export const LAB_ORDER_STATUS_DESCRIPTION: Record<string, string> = {
  PENDING_PAYMENT:
    "Your payment is being processed. Lab order will be placed once payment is confirmed.",
  PAID: "Payment confirmed. Preparing to submit your lab order.",
  LAB_ORDER_PLACED: "Your lab order has been confirmed and sent to the lab.",
  LAB_SUBMISSION_PENDING: "Your order is being submitted to the lab.",
  LAB_SUBMISSION_RETRYING: "We're retrying the lab submission. Please wait.",
  LAB_SUBMISSION_FAILED_RETRYABLE:
    "Lab submission encountered an issue. We're retrying automatically.",
  LAB_SUBMISSION_FAILED_FINAL:
    "Lab submission failed. Our team will contact you to resolve this.",
  MANUAL_REVIEW:
    "Your order requires manual review. We'll contact you shortly.",
  REFUND_PENDING: "Your refund is being processed.",
  REFUNDED: "Your order has been refunded.",
  IN_PROCESSING:
    "Your sample has been received by the lab and is being processed.",
  COMPLETED: "Your results are ready. Click below to view them.",
  FAILED: "Your order could not be processed.",
  CANCELLED: "Your order has been cancelled.",
};
