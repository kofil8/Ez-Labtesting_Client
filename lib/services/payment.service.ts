import { clientFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-contracts/endpoints";
import {
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
} from "@/lib/api-contracts/payment.contract";

function parseErrorMessage(payload: any, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  return (
    payload.message ||
    payload.error ||
    payload?.data?.message ||
    payload?.details?.message ||
    fallback
  );
}

export async function createPaymentIntent(
  request: CreatePaymentIntentRequest,
): Promise<CreatePaymentIntentResponse> {
  const res = await clientFetch(API_ENDPOINTS.PAYMENTS.CREATE_INTENT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(parseErrorMessage(data, "Failed to create payment intent"));
  }

  const payload = data?.data ?? data;

  return {
    clientSecret: payload.clientSecret,
    paymentIntentId: payload.paymentIntentId,
    amount: payload.amount,
    currency: payload.currency,
  } as CreatePaymentIntentResponse;
}

export async function confirmPaymentIntent(
  request: ConfirmPaymentRequest,
): Promise<ConfirmPaymentResponse> {
  const res = await clientFetch(API_ENDPOINTS.PAYMENTS.CONFIRM, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      parseErrorMessage(data, "Failed to confirm payment intent"),
    );
  }

  const payload = data?.data ?? data;

  return {
    paymentIntentId: payload.paymentIntentId,
    status: payload.status,
  } as ConfirmPaymentResponse;
}
