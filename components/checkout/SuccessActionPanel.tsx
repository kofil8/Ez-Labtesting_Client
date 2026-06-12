"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hook/use-toast";
import { useCheckoutError } from "@/lib/checkout-error-context";
import {
  confirmToLab,
  orderLater,
  requestSupport,
} from "@/lib/services/order.service";
import { useEffect, useState } from "react";
import CheckoutErrorRecovery from "./CheckoutErrorRecovery";
import LabOrderStatusDisplay from "./LabOrderStatusDisplay";

export default function SuccessActionPanel({ orderId }: { orderId: string }) {
  const [isSubmittingLater, setIsSubmittingLater] = useState(false);
  const [isConfirmingLab, setIsConfirmingLab] = useState(false);
  const [labConfirmed, setLabConfirmed] = useState(false);
  const [manualSupportNeeded, setManualSupportNeeded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { error, setError, clearError } = useCheckoutError();

  // If error exists and is for a different order, clear it
  useEffect(() => {
    if (error && error.orderId !== orderId) {
      clearError();
    }
  }, [orderId, error, clearError]);

  const handleOrderLater = async () => {
    setIsSubmittingLater(true);
    try {
      await orderLater(orderId);
      clearError();
      toast({
        title: "Saved",
        description: "Order saved for later submission to the lab.",
      });
    } catch (err) {
      const errorMessage = (err as Error)?.message || "Failed to save order";
      setError({
        step: "order-later",
        message: errorMessage,
        orderId,
        timestamp: Date.now(),
      });
      toast({
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmittingLater(false);
    }
  };

  const handleConfirmToLab = async () => {
    setIsConfirmingLab(true);
    try {
      const res = await confirmToLab(orderId);
      if (res?.success) {
        setLabConfirmed(true);
        clearError();
        toast({
          title: "Confirmed",
          description: "Order submitted to the lab.",
        });
      } else {
        const errorMessage = "Lab confirmation failed. Request manual support.";
        setError({
          step: "confirm-to-lab",
          message: errorMessage,
          orderId,
          timestamp: Date.now(),
        });
        setManualSupportNeeded(true);
        toast({
          title: "Partial Failure",
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = (err as Error)?.message || "Lab confirmation failed";
      setError({
        step: "confirm-to-lab",
        message: errorMessage,
        orderId,
        timestamp: Date.now(),
      });
      setManualSupportNeeded(true);
      toast({
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsConfirmingLab(false);
    }
  };

  const handleRequestSupport = async () => {
    try {
      await requestSupport(orderId, { reason: "LAB_CONFIRM_FAILED" });
      clearError();
      toast({
        title: "Support requested",
        description: "Our team will contact you shortly.",
      });
    } catch (err) {
      const errorMessage =
        (err as Error)?.message || "Failed to request support";
      setError({
        step: "request-support",
        message: errorMessage,
        orderId,
        timestamp: Date.now(),
      });
      toast({
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const handleRetry = async () => {
    if (!error) return;

    setIsRetrying(true);
    try {
      if (error.step === "order-later") {
        await handleOrderLater();
      } else if (error.step === "confirm-to-lab") {
        await handleConfirmToLab();
      } else if (error.step === "request-support") {
        await handleRequestSupport();
      }
    } finally {
      setIsRetrying(false);
    }
  };

  if (error) {
    return (
      <CheckoutErrorRecovery onRetry={handleRetry} isRetrying={isRetrying} />
    );
  }

  return (
    <div className='space-y-6'>
      {/* Lab Order Status */}
      <LabOrderStatusDisplay orderId={orderId} />

      {/* Action Buttons */}
      <div className='space-y-4'>
        {!labConfirmed && (
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button
              onClick={handleOrderLater}
              disabled={isSubmittingLater}
              variant='outline'
              className='flex-1'
            >
              {isSubmittingLater ? "Saving..." : "Order Later"}
            </Button>
            <Button
              onClick={handleConfirmToLab}
              disabled={isConfirmingLab}
              className='flex-1'
            >
              {isConfirmingLab ? "Submitting..." : "Confirm Order to Lab"}
            </Button>
          </div>
        )}

        {labConfirmed && (
          <div className='p-4 border rounded bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'>
            <p className='font-semibold text-green-900 dark:text-green-100'>
              ✓ Order confirmed to lab
            </p>
            <p className='text-sm text-green-800 dark:text-green-200 mt-1'>
              You can download the requisition or find the lab on the map.
            </p>
          </div>
        )}

        {manualSupportNeeded && (
          <div className='space-y-2'>
            <p className='text-sm font-medium'>
              Lab confirmation requires manual review
            </p>
            <Button onClick={handleRequestSupport} variant='destructive'>
              Request Manual Support
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
