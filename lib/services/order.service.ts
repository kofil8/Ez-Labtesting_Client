import { clientFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-contracts/endpoints";
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/lib/api-contracts/order.contract";
import { extractApiMessage } from "@/lib/auth/shared";
import { isRegionRestrictedError } from "@/lib/services/state-restriction.service";
import type { Order } from "@/types/order";

export interface OrderDetailsResponse {
  id: string;
  orderNumber?: string;
  status:
    | "PENDING_PAYMENT"
    | "PAID"
    | "LAB_ORDER_PLACED"
    | "LAB_SUBMISSION_PENDING"
    | "LAB_SUBMISSION_RETRYING"
    | "LAB_SUBMISSION_FAILED_RETRYABLE"
    | "LAB_SUBMISSION_FAILED_FINAL"
    | "MANUAL_REVIEW"
    | "REFUND_PENDING"
    | "REFUNDED"
    | "IN_PROCESSING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";
  requisitionPdfUrl?: string | null;
  labVisitInstructions?: string | null;
  manualReviewRequired?: boolean;
  accessOrderId?: string | null;
  accessErrorMessage?: string | null;
  labSubmissionErrorMessage?: string | null;
  labSubmissionErrorCode?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  subtotal?: number;
  processingFee?: number;
  total?: number;
  patientAddress?: string | null;
  confirmedLabLocation?: {
    siteId?: string;
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
  } | null;
  updatedAt?: string;
}

export interface OrderTrackingResponse {
  orderId: string;
  status: string;
  currentStep: number;
  steps: Array<{
    step: number;
    label: string;
    completed: boolean;
    completedAt?: string | null;
  }>;
  labLocation?: {
    name?: string;
    address?: string;
    phone?: string;
    hours?: string;
    lat?: number;
    lng?: number;
  } | null;
  requisitionUrl?: string | null;
  estimatedResultsDate?: string | null;
  lastUpdated?: string;
}

export interface RequisitionDownloadResponse {
  url: string;
}

export interface ManualReviewOrderSummary {
  id: string;
  status: string;
  manualReviewRequired: boolean;
  total: number;
  updatedAt: string;
  paidAt?: string | null;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  test?: {
    id: string;
    testName: string;
    price?: number;
  } | null;
}

export interface UserOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  processingFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  labOrderPlacedAt?: string | null;
  requisitionPdfUrl?: string | null;
  labVisitInstructions?: string | null;
  manualReviewRequired: boolean;
  accessOrderId?: string | null;
  itemsCount: number;
  primaryTest?: {
    id: string;
    testName: string;
    price: number;
  } | null;
}

const EMPTY_CUSTOMER_ADDRESS = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
};

const EMPTY_CUSTOMER_NOTIFICATIONS = {
  email: false,
  sms: false,
};

function normalizeAdminOrder(order: any): Order {
  const patient = order.patient || {};
  const itemCount = Number(order.itemCount || order.itemsCount || 0);
  const status = String(order.status || order.orderStatus || "PENDING_PAYMENT");

  return {
    id: String(order.id),
    userId: String(order.userId || ""),
    orderNumber: order.orderNumber || undefined,
    orderStatus: order.orderStatus ? String(order.orderStatus) : status,
    status: status as Order["status"],
    paymentStatus: order.paymentStatus
      ? String(order.paymentStatus)
      : undefined,
    tests: Array.from({ length: Math.max(0, itemCount) }, (_, index) => ({
      testId: `${order.id}-test-${index + 1}`,
      testName: itemCount === 1 ? "Lab test" : `Lab test ${index + 1}`,
      price: 0,
    })),
    itemCount,
    totalAmount: Number(order.total || order.totalAmount || 0),
    subtotal: Number(order.subtotal || 0),
    discount: Number(order.discount || 0),
    manualReviewRequired: Boolean(order.manualReviewRequired),
    accessOrderId: order.accessOrderId || null,
    paidAt: order.paidAt || null,
    submittedToLabAt: order.submittedToLabAt || null,
    labOrderPlacedAt: order.labOrderPlacedAt || null,
    requisitionPdfUrl: order.requisitionPdfUrl || null,
    drawCenter: order.drawCenter || null,
    customerInfo: {
      firstName: String(patient.firstName || ""),
      lastName: String(patient.lastName || ""),
      email: String(order.customerEmailSnapshot || ""),
      phone: String(order.customerPhoneSnapshot || ""),
      dateOfBirth: "",
      address: EMPTY_CUSTOMER_ADDRESS,
      notifications: EMPTY_CUSTOMER_NOTIFICATIONS,
    },
    paymentMethod: "card",
    createdAt: String(order.createdAt || new Date().toISOString()),
    updatedAt: order.updatedAt ? String(order.updatedAt) : undefined,
    completedAt:
      status === "COMPLETED" || status === "completed"
        ? String(order.updatedAt || new Date().toISOString())
        : undefined,
  };
}

function buildIdempotencyKey(storageKey: string): string {
  if (typeof window === "undefined") {
    return `${storageKey}-${Date.now()}`;
  }

  const existing = sessionStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? `${storageKey}-${crypto.randomUUID()}`
      : `${storageKey}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  sessionStorage.setItem(storageKey, generated);
  return generated;
}

export async function confirmOrderPayment(
  orderId: string,
  stripePaymentIntentId: string,
): Promise<{ orderId: string; status: string; paidAt?: string }> {
  const idempotencyKey = buildIdempotencyKey(
    `checkout-confirm-payment-${orderId}`,
  );

  const res = await clientFetch(API_ENDPOINTS.ORDERS.CONFIRM_PAYMENT(orderId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ orderId, stripePaymentIntentId }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to confirm payment");
  }

  const data = await res.json();
  const paymentResult = data?.data as {
    orderId: string;
    status: string;
    paidAt?: string;
  };

  // Transition to READY_FOR_LAB_SUBMISSION and enqueue lab submission.
  // Best-effort: if this fails the server polling will still work, but we
  // try here so the order moves immediately.
  try {
    const confirmRes = await clientFetch(
      API_ENDPOINTS.ORDERS.CONFIRM_ORDER(orderId),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (confirmRes.ok) {
      const confirmData = await confirmRes.json().catch(() => ({}));
      const confirmedStatus = confirmData?.data?.order?.orderStatus;
      if (confirmedStatus) {
        return { ...paymentResult, status: confirmedStatus };
      }
    }
  } catch {
    // Non-fatal: visit-lab page will poll and pick up the correct status.
  }

  return paymentResult;
}

let resumableOrderInFlight: Promise<OrderDetailsResponse | null> | null = null;

/**
 * Create a new order
 *
 * Frontend service for order creation.
 * Called when user completes patient info and clicks "Continue to Payment".
 */
export async function createOrder(
  payload: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const idempotencyKey = buildIdempotencyKey("checkout-create-order");

  const res = await clientFetch(API_ENDPOINTS.ORDERS.CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const nextError = new Error(
      extractApiMessage(error, "Failed to create order"),
    ) as Error & {
      code?: string;
      details?: Record<string, unknown>;
    };

    if (isRegionRestrictedError(error)) {
      nextError.code = error.code;
      nextError.details = error.details;
    }

    throw nextError;
  }

  const data = await res.json();

  const responseData = data?.data;

  if (responseData?.orderId) {
    return {
      orderId: responseData.orderId,
      orderNumber: responseData.orderNumber,
      status: responseData.status,
      subtotal: payload.subtotal,
      processingFee: payload.processingFee,
      total: payload.total,
      clientSecret: responseData.clientSecret,
      stripePaymentIntentId: responseData.stripePaymentIntentId,
    };
  }

  if (data?.order) {
    const toNumber = (value: unknown): number => {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : 0;
      }

      if (value && typeof value === "object") {
        const parsed = Number.parseFloat(String(value));
        return Number.isFinite(parsed) ? parsed : 0;
      }

      return 0;
    };

    const subtotal = toNumber(data.order.subtotal);
    const processingFee = toNumber(data.order.processingFee);
    const total = toNumber(data.order.total);

    return {
      orderId: data.order.id,
      status: data.order.status,
      subtotal,
      processingFee,
      total,
    };
  }

  return data as CreateOrderResponse;
}

/**
 * Mark order as "awaiting_lab_submission" (order later)
 */
export async function orderLater(
  orderId: string,
): Promise<{ success: boolean }> {
  const idempotencyKey = buildIdempotencyKey(`order-later-${orderId}`);

  const res = await clientFetch(`/api/orders/${orderId}/order-later`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ orderId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to save order for later");
  }

  return { success: true };
}

/**
 * Confirm order to lab (idempotent)
 */
export async function confirmToLab(
  orderId: string,
): Promise<{ success: boolean; requisitionUrl?: string }> {
  const idempotencyKey = buildIdempotencyKey(`confirm-to-lab-${orderId}`);

  const res = await clientFetch(`/api/orders/${orderId}/confirm-to-lab`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "Failed to confirm order to lab");
  }

  return { success: true, requisitionUrl: data?.data?.requisitionUrl };
}

/**
 * Request manual support for an order
 */
export async function requestSupport(
  orderId: string,
  details?: Record<string, unknown>,
) {
  const res = await clientFetch(`/api/orders/${orderId}/request-support`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, details }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to request support");
  }

  return { success: true };
}

export async function getOrderTracking(
  orderId: string,
): Promise<OrderTrackingResponse> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.GET_TRACKING(orderId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch order tracking");
  }

  const data = await res.json();
  const tracking = data?.data;

  if (!tracking?.orderId) {
    throw new Error("Invalid tracking response");
  }

  return tracking as OrderTrackingResponse;
}

export async function getRequisitionDownloadUrl(
  orderId: string,
): Promise<RequisitionDownloadResponse> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.GET_REQUISITION(orderId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch requisition");
  }

  const data = await res.json();
  const url = typeof data?.url === "string" ? data.url : null;

  if (!url) {
    throw new Error("Requisition download is not available yet");
  }

  return { url };
}

export async function getOrderDetails(
  orderId: string,
): Promise<OrderDetailsResponse> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch order details");
  }

  const data = await res.json();
  const order = data?.order;

  if (!order?.id) {
    throw new Error("Invalid order details response");
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber || undefined,
    status: order.status,
    subtotal: Number(order.subtotal || 0),
    processingFee: Number(order.processingFee || 0),
    total: Number(order.total || 0),
    requisitionPdfUrl: order.requisitionPdfUrl || null,
    labVisitInstructions: order.labVisitInstructions || null,
    manualReviewRequired: Boolean(order.manualReviewRequired),
    accessOrderId: order.accessOrderId || null,
    patientAddress: data?.patientAddress || null,
    confirmedLabLocation: data?.confirmedLabLocation || null,
    updatedAt: order.updatedAt,
  };
}

export async function retryOrderAccessPlacement(
  orderId: string,
): Promise<void> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.RETRY_ACCESS(orderId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to retry ACCESS placement");
  }
}

export async function getResumableOrder(): Promise<OrderDetailsResponse | null> {
  if (!resumableOrderInFlight) {
    resumableOrderInFlight = (async () => {
      const res = await clientFetch(API_ENDPOINTS.ORDERS.RESUME, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch resumable order");
      }

      const data = await res.json();
      const order = data?.order;

      if (!order) {
        return null;
      }

      if (!order?.id) {
        throw new Error("Invalid resumable order response");
      }

      return {
        id: order.id,
        orderNumber: order.orderNumber || undefined,
        status: order.status,
        subtotal: Number(order.subtotal || 0),
        processingFee: Number(order.processingFee || 0),
        total: Number(order.total || 0),
        requisitionPdfUrl: order.requisitionPdfUrl || null,
        labVisitInstructions: order.labVisitInstructions || null,
        manualReviewRequired: Boolean(order.manualReviewRequired),
        accessOrderId: order.accessOrderId || null,
        patientAddress: data?.patientAddress || null,
        confirmedLabLocation: data?.confirmedLabLocation || null,
        updatedAt: order.updatedAt,
      };
    })().finally(() => {
      resumableOrderInFlight = null;
    });
  }

  return resumableOrderInFlight;
}

export async function getManualReviewOrders(
  limit = 100,
): Promise<ManualReviewOrderSummary[]> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.MANUAL_REVIEW(limit), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch manual review orders");
  }

  const data = await res.json();
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  return orders.map((order: any) => ({
    id: String(order.id),
    status: String(order.status),
    manualReviewRequired: Boolean(order.manualReviewRequired),
    total: Number(order.total || 0),
    updatedAt: String(order.updatedAt || new Date().toISOString()),
    paidAt: order.paidAt || null,
    user: order.user
      ? {
          id: String(order.user.id),
          email: String(order.user.email || ""),
          firstName: order.user.firstName || null,
          lastName: order.user.lastName || null,
        }
      : null,
    test: order.test
      ? {
          id: String(order.test.id),
          testName: String(order.test.testName || ""),
          price: Number(order.test.price || 0),
        }
      : null,
  }));
}

export async function getAllOrders(params?: {
  page?: number;
  limit?: number;
}): Promise<Order[]> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.ALL(params), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch orders");
  }

  const data = await res.json();
  const orders = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.orders)
      ? data.orders
      : [];

  return orders.map(normalizeAdminOrder);
}

export async function adminManualReorder(orderId: string): Promise<void> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.MANUAL_REORDER(orderId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to manually re-order");
  }
}

export async function adminRequestRefund(
  orderId: string,
  reason?: string,
): Promise<void> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.REQUEST_REFUND(orderId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to request refund");
  }
}

export async function adminApproveRefund(
  orderId: string,
  reason?: string,
): Promise<{ refundId: string; amount: number; status: string }> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.APPROVE_REFUND(orderId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to approve refund");
  }

  const data = await res.json();
  return data?.data?.refund as {
    refundId: string;
    amount: number;
    status: string;
  };
}

export async function getOrdersByUserId(
  userId: string,
): Promise<UserOrderSummary[]> {
  const res = await clientFetch(API_ENDPOINTS.ORDERS.GET_BY_USER(userId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch orders");
  }

  const data = await res.json();
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  return orders.map((order: any) => ({
    id: String(order.id),
    orderNumber:
      String(order.orderNumber || "").trim() ||
      `ORD-${String(order.id).slice(0, 8).toUpperCase()}`,
    status: String(order.status || "PENDING_PAYMENT"),
    subtotal: Number(order.subtotal || 0),
    processingFee: Number(order.processingFee || 0),
    total: Number(order.total || 0),
    createdAt: String(order.createdAt || new Date().toISOString()),
    updatedAt: String(
      order.updatedAt || order.createdAt || new Date().toISOString(),
    ),
    paidAt: order.paidAt || null,
    labOrderPlacedAt: order.labOrderPlacedAt || null,
    requisitionPdfUrl: order.requisitionPdfUrl || null,
    labVisitInstructions: order.labVisitInstructions || null,
    manualReviewRequired: Boolean(order.manualReviewRequired),
    accessOrderId: order.accessOrderId || null,
    itemsCount: Number(order.itemsCount || 0),
    primaryTest:
      order.primaryTest || order.test
        ? {
            id: String((order.primaryTest || order.test).id),
            testName: String(
              (order.primaryTest || order.test).testName || "Lab Test",
            ),
            price: Number((order.primaryTest || order.test).price || 0),
          }
        : null,
  }));
}
