"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import React, { ReactNode, useMemo } from "react";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Only create the stripe promise if we have a valid key
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Log a warning in development if stripe key is missing
if (!stripeKey && typeof window !== "undefined") {
  console.warn(
    "⚠️ Stripe publishable key is not configured. " +
      "Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables. " +
      "Stripe features will not be available until configured.",
  );
}

interface StripeProviderProps {
  children: ReactNode;
  amount?: number;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
  amount = 1000,
}) => {
  const options = useMemo((): StripeElementsOptions => {
    const baseOptions: StripeElementsOptions = {
      mode: "payment" as const,
      amount,
      currency: "usd",
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#0F172A",
          colorBackground: "#FFFFFF",
          colorText: "#1F2937",
          colorDanger: "#DF1B41",
          fontFamily: "system-ui, -apple-system, sans-serif",
          spacingUnit: "4px",
          borderRadius: "6px",
        },
      },
    };

    return baseOptions;
  }, [amount]);

  // If Stripe key is not available, render children without Elements wrapper
  if (!stripePromise) {
    return <>{children}</>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};
