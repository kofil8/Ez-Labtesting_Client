"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hook/use-toast";
import {
  computeLabPollDelay,
  hasExceededLabPollAttempts,
  isLabPollingTerminal,
} from "@/lib/checkout/flow-guards";
import { useCheckout } from "@/lib/context/CheckoutContext";
import {
  getOrderDetails,
  getRequisitionDownloadUrl,
  getResumableOrder,
  retryOrderAccessPlacement,
} from "@/lib/services/order.service";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle,
  Download,
  FileText,
  Loader2,
  MapPin,
  RotateCcw,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CheckoutShell from "../CheckoutShell";

type FindLabCenterAccessPayload = {
  issuedAt: number;
  orderId: string;
  source?: "checkout" | "dashboard";
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
};

export default function CheckoutVisitLabPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const {
    orderId,
    patientInfo,
    order,
    selectedLab,
    setOrderId,
    setOrder,
    setLastRecoveredAt,
    resetCheckout,
  } = useCheckout();

  const [orderStatus, setOrderStatus] = useState<string>("PENDING_PAYMENT");
  const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(
    orderId,
  );
  const [requisitionPdfUrl, setRequisitionPdfUrl] = useState<string | null>(
    null,
  );
  const [labVisitInstructions, setLabVisitInstructions] = useState<
    string | null
  >(null);
  const [manualReviewRequired, setManualReviewRequired] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [isRequisitionLoading, setIsRequisitionLoading] = useState(false);
  const [pollGeneration, setPollGeneration] = useState(0);
  const hasHydratedResume = useRef(false);

  const isPaidFlow = useMemo(
    () =>
      orderStatus === "PAID" ||
      orderStatus === "LAB_ORDER_PLACED" ||
      orderStatus === "COMPLETED",
    [orderStatus],
  );

  useEffect(() => {
    if (hasHydratedResume.current) {
      return;
    }

    const hydrate = async () => {
      hasHydratedResume.current = true;
      setIsLoading(true);
      try {
        if (orderId) {
          setResolvedOrderId(orderId);
          setIsLoading(false);
          return;
        }

        const resumable = await getResumableOrder();
        if (resumable?.id) {
          setResolvedOrderId(resumable.id);
          setOrderId(resumable.id);
          setOrder({
            orderId: resumable.id,
            subtotal: resumable.subtotal ?? getTotal(),
            processingFee: resumable.processingFee ?? 2.5,
            total: resumable.total ?? getTotal() + 2.5,
          });
          setLastRecoveredAt(Date.now());
        }
      } catch (error: any) {
        setStatusError(
          error?.message || "Unable to restore checkout right now.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, [getTotal, orderId, setLastRecoveredAt, setOrder, setOrderId]);

  useEffect(() => {
    if (!resolvedOrderId || isLoading) return;

    let active = true;
    let timeoutRef: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    const load = async () => {
      const details = await getOrderDetails(resolvedOrderId);
      if (!active) return null;
      setOrderStatus(details.status);
      setRequisitionPdfUrl(details.requisitionPdfUrl || null);
      setLabVisitInstructions(details.labVisitInstructions || null);
      setManualReviewRequired(Boolean(details.manualReviewRequired));
      setStatusError(null);
      return details;
    };

    const scheduleNext = () => {
      if (!active) return;

      if (hasExceededLabPollAttempts(attempts)) {
        setIsPolling(false);
        setStatusError(
          "Lab sync is taking longer than expected. Your order is safe. You can retry shortly or check Transactions.",
        );
        return;
      }

      const delay = computeLabPollDelay(attempts);

      timeoutRef = setTimeout(async () => {
        attempts += 1;
        try {
          const details = await load();
          if (
            details &&
            isLabPollingTerminal({
              status: details.status,
              requisitionPdfUrl: details.requisitionPdfUrl,
              manualReviewRequired: details.manualReviewRequired,
            })
          ) {
            setIsPolling(false);
            return;
          }
        } catch (error: any) {
          if (active) {
            setStatusError(error?.message || "Unable to refresh order status.");
          }
        }

        scheduleNext();
      }, delay);
    };

    const startPolling = async () => {
      setIsPolling(true);
      try {
        const details = await load();
        if (
          details &&
          isLabPollingTerminal({
            status: details.status,
            requisitionPdfUrl: details.requisitionPdfUrl,
            manualReviewRequired: details.manualReviewRequired,
          })
        ) {
          setIsPolling(false);
          return;
        }
      } catch (error: any) {
        if (active) {
          setStatusError(error?.message || "Unable to refresh order status.");
        }
      }

      scheduleNext();
    };

    startPolling();

    return () => {
      active = false;
      setIsPolling(false);
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [resolvedOrderId, isLoading, pollGeneration]);

  const handleDownloadRequisition = async () => {
    if (!resolvedOrderId || !requisitionPdfUrl) return;

    try {
      setIsRequisitionLoading(true);
      const { url } = await getRequisitionDownloadUrl(resolvedOrderId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      setStatusError(error?.message || "Unable to open the requisition.");
    } finally {
      setIsRequisitionLoading(false);
    }
  };

  const handleRetryAccessPlacement = async () => {
    if (!resolvedOrderId) return;

    try {
      setIsRetrying(true);
      await retryOrderAccessPlacement(resolvedOrderId);
      toast({
        title: "Retry queued",
        description: "We are retrying your lab placement now.",
      });
      setStatusError(null);
      setPollGeneration((value) => value + 1);
    } catch (error: any) {
      setStatusError(error?.message || "Failed to retry ACCESS placement.");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleContinueToFindLab = useCallback(async () => {
    if (!resolvedOrderId) return;

    setIsContinuing(true);
    try {
      if (typeof window !== "undefined") {
        const payload: FindLabCenterAccessPayload = {
          issuedAt: Date.now(),
          orderId: resolvedOrderId,
          source: "checkout",
        };

        sessionStorage.setItem(
          "find-lab-center-access",
          JSON.stringify(payload),
        );
      }

      clearCart();
      resetCheckout();
      router.push("/find-lab-center");
    } finally {
      setIsContinuing(false);
    }
  }, [clearCart, resetCheckout, resolvedOrderId, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-primary' />
      </div>
    );
  }

  if (!resolvedOrderId) {
    return null;
  }

  return (
    <CheckoutShell
      currentStep={3}
      summaryTotal={order?.total ?? getTotal() + 2.5}
      summarySubtotal={order?.subtotal}
      summaryProcessingFee={order?.processingFee}
    >
      <div className='space-y-6'>
        <Card className='border'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-green-600' />
              Payment Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold'>
              <Shield className='h-3.5 w-3.5' />
              Your payment is secure and recorded
            </div>

            <p className='text-sm text-muted-foreground'>
              Order <span className='font-mono'>{resolvedOrderId}</span> is
              paid. If lab connection is delayed, your payment remains safe and
              your order is queued for recovery.
            </p>

            {manualReviewRequired && (
              <p className='text-sm text-amber-700 dark:text-amber-400'>
                Manual review is active for your lab submission. Payment is
                secured and our team is completing partner-side processing.
              </p>
            )}

            <div className='flex items-center justify-between gap-2'>
              <p className='text-sm font-medium'>ACCESS Processing Status</p>
              <p className='text-sm text-muted-foreground'>{orderStatus}</p>
            </div>

            {isPolling && !requisitionPdfUrl && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Syncing with lab partner...
              </div>
            )}

            {labVisitInstructions && (
              <p className='text-sm text-muted-foreground'>
                {labVisitInstructions}
              </p>
            )}

            {statusError && (
              <p className='text-sm text-red-600 dark:text-red-400'>
                {statusError}
              </p>
            )}

            {orderStatus === "FAILED" && (
              <Button
                type='button'
                variant='outline'
                onClick={handleRetryAccessPlacement}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RotateCcw className='mr-2 h-4 w-4' />
                    Retry Lab Placement
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className='border'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-primary' />
              Visit Lab Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Use Find Lab Center to confirm or change the lab for this visit.
              Your paid order remains valid even if partner APIs are temporarily
              unavailable.
            </p>

            {selectedLab && (
              <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm'>
                <p className='font-medium text-primary'>Current selected lab</p>
                <p className='mt-1 text-foreground'>{selectedLab.name}</p>
                <p className='text-muted-foreground'>{selectedLab.address}</p>
              </div>
            )}

            {requisitionPdfUrl && (
              <Button
                variant='outline'
                onClick={handleDownloadRequisition}
                disabled={isRequisitionLoading}
              >
                <Download className='mr-2 h-4 w-4' />
                {isRequisitionLoading
                  ? "Preparing requisition..."
                  : "Download Requisition"}
              </Button>
            )}

            <div className='flex flex-wrap items-center gap-3'>
              <Button
                onClick={handleContinueToFindLab}
                disabled={isContinuing || !isPaidFlow}
              >
                {isContinuing ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Opening Find Lab...
                  </>
                ) : (
                  <>
                    <MapPin className='mr-2 h-4 w-4' />
                    Select or review lab center
                  </>
                )}
              </Button>

              <Button
                variant='ghost'
                onClick={() => router.push("/dashboard/customer/transactions")}
              >
                View Orders
              </Button>
            </div>

            <p className='text-sm text-muted-foreground'>
              Total Paid:{" "}
              <span className='font-semibold'>
                {formatCurrency(order?.total ?? getTotal() + 2.5)}
              </span>
            </p>

            <p className='text-xs text-muted-foreground'>
              Patient: {patientInfo.firstName} {patientInfo.lastName}
            </p>
          </CardContent>
        </Card>
      </div>
    </CheckoutShell>
  );
}
