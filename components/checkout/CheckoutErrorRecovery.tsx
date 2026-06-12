"use client";

import { Button } from "@/components/ui/button";
import { useCheckoutError } from "@/lib/checkout-error-context";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ManualLabSupportRequest from "./ManualLabSupportRequest";

interface CheckoutErrorRecoveryProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function CheckoutErrorRecovery({
  onRetry,
  isRetrying = false,
}: CheckoutErrorRecoveryProps) {
  const router = useRouter();
  const { error, clearError } = useCheckoutError();
  const [showManualSupport, setShowManualSupport] = useState(false);

  if (!error) return null;

  const handleGoBack = () => {
    clearError();
    router.push("/checkout/patient-info");
  };

  const handleRetry = () => {
    onRetry();
  };

  const handleSupportSuccess = () => {
    clearError();
    setShowManualSupport(false);
  };

  if (showManualSupport) {
    return (
      <div className='space-y-4'>
        <button
          onClick={() => setShowManualSupport(false)}
          className='text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:dark:text-blue-300'
        >
          ← Back to error recovery
        </button>
        <ManualLabSupportRequest
          orderId={error.orderId}
          onSuccess={handleSupportSuccess}
        />
      </div>
    );
  }

  return (
    <div className='border border-destructive bg-destructive/5 rounded-lg p-6 space-y-4'>
      <div className='flex items-start gap-3'>
        <AlertCircle className='h-5 w-5 text-destructive mt-0.5 flex-shrink-0' />
        <div className='flex-1'>
          <h3 className='font-semibold text-destructive'>
            Process Interrupted
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>{error.message}</p>
          <p className='text-xs text-muted-foreground mt-2'>
            Order ID: {error.orderId}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Button onClick={handleRetry} disabled={isRetrying} className='w-full'>
          {isRetrying ? "Retrying..." : "Try Again"}
        </Button>
        <Button onClick={handleGoBack} variant='outline' className='w-full'>
          Go Back to Checkout
        </Button>
        <Button
          onClick={() => setShowManualSupport(true)}
          variant='secondary'
          className='w-full'
        >
          Get Manual Support
        </Button>
      </div>

      <p className='text-xs text-muted-foreground text-center'>
        Need help? Our support team is ready to assist. Click "Get Manual
        Support" to submit a detailed request.
      </p>
    </div>
  );
}
