"use client";

import { useCheckout } from "@/lib/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { step, orderId } = useCheckout();

  useEffect(() => {
    if (step === "PAYMENT") {
      router.replace("/checkout/payment");
      return;
    }

    if (step === "VISIT_LAB" || step === "CONFIRMATION") {
      router.replace(orderId ? "/checkout/visit-lab" : "/checkout/patient-info");
      return;
    }

    router.replace("/checkout/patient-info");
  }, [orderId, router, step]);

  return null;
}
