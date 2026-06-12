"use client";

import SecureCheckoutBadge from "@/components/checkout/SecureCheckoutBadge";
import SuccessActionPanel from "@/components/checkout/SuccessActionPanel";
import { useAuth } from "@/lib/auth-context";
import { useCheckoutError } from "@/lib/checkout-error-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { error } = useCheckoutError();
  const orderId = params?.get("orderId") || "";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?from=/checkout/success`);
    }
  }, [isAuthenticated, isLoading, router]);

  // If there's an error for a different order, redirect to patient-info to start fresh
  useEffect(() => {
    if (error && error.orderId !== orderId && orderId) {
      router.push("/checkout/patient-info");
    }
  }, [error, orderId, router]);

  if (!orderId) {
    return (
      <div className='p-8'>
        <h3 className='text-xl font-semibold'>Order not found</h3>
        <p className='text-sm text-muted-foreground'>No order specified.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-3xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Order Summary</h1>
          <SecureCheckoutBadge compact />
        </div>

        <SuccessActionPanel orderId={orderId} />
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={<div className='container mx-auto px-4 py-8'>Loading...</div>}
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
