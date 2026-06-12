import { clientFetch } from "@/lib/api-client";

type BackendCartSummary = {
  subtotal?: number;
  discount?: number;
  total?: number;
  promoCode?: string | null;
  promoClamped?: boolean;
};

type PromoApplyResult = {
  code: string;
  discountAmount: number;
  discountRate: number;
  subtotal: number;
  total: number;
  promoClamped: boolean;
};

function extractBackendCart(payload: unknown): BackendCartSummary {
  if (!payload || typeof payload !== "object") return {};

  const record = payload as Record<string, any>;
  return (record.data || record.cart || record) as BackendCartSummary;
}

function toPromoApplyResult(cart: BackendCartSummary, fallbackCode: string) {
  const subtotal = Number(cart.subtotal || 0);
  const discountAmount = Number(cart.discount || 0);

  return {
    code: String(cart.promoCode || fallbackCode).toUpperCase(),
    discountAmount,
    discountRate: subtotal > 0 ? discountAmount / subtotal : 0,
    subtotal,
    total: Number(cart.total || Math.max(0, subtotal - discountAmount)),
    promoClamped: Boolean(cart.promoClamped),
  } satisfies PromoApplyResult;
}

export async function applyBackendPromoCode(
  code: string,
): Promise<PromoApplyResult> {
  const normalizedCode = code.trim().toUpperCase();

  const response = await clientFetch("/cart/apply-promo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: normalizedCode }),
    redirectOnAuthFailure: false,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || "Promo code is not available.");
  }

  return toPromoApplyResult(extractBackendCart(payload), normalizedCode);
}

export async function removeBackendPromoCode() {
  const response = await clientFetch("/cart/promo", {
    method: "DELETE",
    redirectOnAuthFailure: false,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || "Unable to remove promo code.");
  }

  return extractBackendCart(payload);
}
