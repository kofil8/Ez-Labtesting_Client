"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";

interface TestDetail {
  testId: string;
  testName: string;
  price: number;
  cptCode?: string;
  labCode?: string;
  labName?: string;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface MxMerchantPaymentProps {
  orderId: string;
  amount: number;
  tests: TestDetail[];
  customerInfo: CustomerInfo;
  promoCode?: string;
  discount?: number;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: string) => void;
}

export function MxMerchantPayment({
  orderId,
  amount,
  tests,
  customerInfo,
  promoCode,
  discount = 0,
  onPaymentSuccess,
  onPaymentError,
}: MxMerchantPaymentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Prepare payment metadata with full order and customer details
    const paymentMetadata = {
      // Order Information
      orderId,
      amount,
      currency: "USD",
      timestamp: new Date().toISOString(),

      // Customer Information - For Mx Dashboard visibility
      customer: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        dateOfBirth: customerInfo.dateOfBirth,
        address: {
          street: customerInfo.address.street,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          zipCode: customerInfo.address.zipCode,
        },
      },

      // Test/Panel Details - For itemized tracking in Mx Dashboard
      lineItems: tests.map((test, index) => ({
        itemId: test.testId,
        itemName: test.testName,
        cptCode: test.cptCode,
        labCode: test.labCode,
        labName: test.labName,
        price: test.price,
        quantity: 1,
        category: "lab-test",
        description: `Lab Test: ${test.testName}${
          test.cptCode ? ` (CPT: ${test.cptCode})` : ""
        }`,
      })),

      // Discount Information
      ...(promoCode &&
        discount > 0 && {
          promoCode,
          discount,
          discountType: "percentage",
        }),

      // Metadata for reconciliation
      metadata: {
        source: "EzLabTesting",
        platform: "web",
        version: "1.0",
        testCount: tests.length,
      },
    };

    // Post message to iframe with payment metadata
    const iframeOrigin =
      process.env.NEXT_PUBLIC_MX_MERCHANT_IFRAME_ORIGIN ||
      "https://hostedpayments.mxmerchant.com";
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "SET_PAYMENT_DATA",
          payload: paymentMetadata,
        },
        iframeOrigin
      );
    }

    // Listen for payment events from iframe
    const handleIframeMessage = (event: MessageEvent) => {
      // Accept messages from the iframe origin or from same-origin (useful for local dev/testing)
      const allowedOrigins = [iframeOrigin, window.location.origin];
      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      const { type, payload } = event.data || {};

      if (type === "PAYMENT_SUCCESS") {
        onPaymentSuccess?.(payload?.transactionId || payload?.id);
      } else if (type === "PAYMENT_ERROR") {
        onPaymentError?.(payload?.message || "Payment failed");
      }
    };

    window.addEventListener("message", handleIframeMessage);

    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [
    orderId,
    amount,
    tests,
    customerInfo,
    promoCode,
    discount,
    onPaymentSuccess,
    onPaymentError,
  ]);

  return (
    <div className='space-y-4'>
      {/* Branding Header */}
      <div className='flex items-center gap-3 mb-4'>
        <img
          src='/images/mx-merchant-logo.png'
          alt='Mx Merchant'
          className='h-8 w-auto'
        />
        <span className='text-xs font-semibold text-blue-700 dark:text-blue-300'>
          Secure Payment by Mx Merchant
        </span>
      </div>

      {/* Mx Merchant Hosted Form Iframe */}
      <div className='rounded-lg border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20 p-4'>
        <iframe
          ref={iframeRef}
          src={`https://hostedpayments.mxmerchant.com/iframe?apiKey=${
            process.env.NEXT_PUBLIC_MX_MERCHANT_API_KEY ||
            "YOUR_MX_MERCHANT_API_KEY"
          }`}
          title='Mx Merchant Hosted Payment'
          className='w-full h-96 min-h-[350px] rounded-lg border-none'
          allow='payment'
        />

        {/* Security Information */}
        <div className='mt-4 space-y-3'>
          <div className='flex items-center gap-2'>
            <img
              src='/images/pci-badge.png'
              alt='PCI DSS Compliant'
              className='h-5 w-auto'
            />
            <span className='text-xs text-muted-foreground'>
              PCI DSS Compliant • 256-bit SSL Encryption
            </span>
          </div>

          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <ShieldCheck className='h-4 w-4 text-green-600' />
            <span>
              Your card data is never stored on our servers. All payments are
              securely processed by Mx Merchant.
            </span>
          </div>

          {/* Payment Details Summary for Mx Dashboard */}
          <div className='mt-4 pt-4 border-t border-blue-200 dark:border-blue-900/30'>
            <p className='text-[10px] font-mono text-muted-foreground mb-2'>
              Order ID: {orderId}
            </p>
            <p className='text-[10px] font-mono text-muted-foreground mb-2'>
              Customer: {customerInfo.firstName} {customerInfo.lastName} (
              {customerInfo.email})
            </p>
            <p className='text-[10px] font-mono text-muted-foreground'>
              Tests:{" "}
              {tests
                .map(
                  (t) => `${t.testName}${t.cptCode ? ` [${t.cptCode}]` : ""}`
                )
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
