"use client";

import { Button } from "@/components/ui/button";
import { isPaymentSubmitDisabled } from "@/lib/checkout/flow-guards";
import { confirmPaymentIntent, createPaymentIntent } from "@/lib/services";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

interface PaymentFormProps {
  amount: number;
  customerEmail: string;
  customerName: string;
  orderId?: string;
  disabled?: boolean;
  paymentMethodType?: "card" | "automatic";
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm = ({
  amount,
  customerEmail,
  customerName,
  orderId,
  disabled = false,
  paymentMethodType = "automatic",
  onSuccess,
  onError,
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
    paymentMethodOrder: ["link", "paypal", "card", "crypto"],
    wallets: {
      applePay: "auto",
      googlePay: "auto",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe is not loaded yet");
      return;
    }

    const submitResult = await elements.submit();
    if (submitResult.error) {
      onError(submitResult.error.message || "Payment form is incomplete");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create payment intent on the backend
      const paymentIntentResponse = await createPaymentIntent({
        amount,
        customerEmail,
        customerName,
        paymentMethodType,
        metadata: orderId ? { orderId } : undefined,
      });

      const { clientSecret, paymentIntentId } = paymentIntentResponse;

      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
      });

      if (error) {
        onError(error.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      // Step 3: Verify payment status on backend
      if (
        paymentIntent?.status === "succeeded" ||
        paymentIntent?.status === "processing"
      ) {
        const confirmResponse = await confirmPaymentIntent({
          paymentIntentId,
        });

        if (
          confirmResponse.status === "succeeded" ||
          confirmResponse.status === "processing"
        ) {
          onSuccess(paymentIntentId);
        } else {
          onError("Payment confirmation failed");
        }
      } else {
        onError(`Payment status: ${paymentIntent?.status}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      onError(
        error instanceof Error
          ? error.message
          : "An error occurred during payment",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='bg-white p-6 rounded-lg border'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Payment Information
            </label>
            <div className='stripe-payment-element'>
              <PaymentElement options={paymentElementOptions} />
            </div>
          </div>
        </div>
      </div>

      <Button
        type='submit'
        disabled={isPaymentSubmitDisabled({
          disabled,
          stripeReady: Boolean(stripe),
          isProcessing,
          amount: safeAmount,
        })}
        className='w-full'
        size='lg'
      >
        {isProcessing ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Processing...
          </>
        ) : (
          `Pay $${safeAmount.toFixed(2)}`
        )}
      </Button>

      <p className='text-xs text-center text-gray-500'>
        Accepted: Link, PayPal, Card, Apple Pay, Google Pay, Crypto Pay
      </p>
    </form>
  );
};

interface StripePaymentProps {
  amount: number;
  customerEmail: string;
  customerName: string;
  orderId?: string;
  disabled?: boolean;
  paymentMethodType?: "card" | "automatic";
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export const StripePayment = ({
  amount,
  customerEmail,
  customerName,
  orderId,
  disabled = false,
  paymentMethodType = "automatic",
  onSuccess,
  onError,
}: StripePaymentProps) => {
  const [error, setError] = useState<string | null>(null);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-sm text-red-800'>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <p className='text-sm text-blue-800'>
          <strong>Total Amount:</strong> ${safeAmount.toFixed(2)}
        </p>
      </div>

      <PaymentForm
        amount={safeAmount}
        customerEmail={customerEmail}
        customerName={customerName}
        orderId={orderId}
        disabled={disabled}
        paymentMethodType={paymentMethodType}
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  );
};
