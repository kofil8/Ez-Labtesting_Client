import "server-only";

import { authenticatedFetch } from "@/lib/api-helpers";
import { extractApiMessage, normalizeUserRole } from "@/lib/auth/shared";
import { cache } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ezlabtesting-api.com/api/v1";

export type CustomerDashboardViewer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  phone?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  profileImage?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isVerified?: boolean;
  mfaEnabled?: boolean;
};

export type CustomerDashboardOrder = {
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
};

function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toStringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function toOptionalString(value: unknown): string | undefined {
  const normalized = toStringValue(value);
  return normalized || undefined;
}

function toNumberValue(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function isAuthFailure(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("session expired") ||
    message.includes("authenticated session") ||
    message.includes("not authenticated")
  );
}

function normalizeViewer(rawProfile: unknown): CustomerDashboardViewer | null {
  const profile = toRecord(rawProfile);
  const id =
    toStringValue(profile.id) || toStringValue(profile.userId) || undefined;
  const email = toStringValue(profile.email);

  if (!id || !email) {
    return null;
  }

  return {
    id,
    email,
    firstName: toStringValue(profile.firstName, "Customer"),
    lastName: toStringValue(profile.lastName),
    role: normalizeUserRole(profile.role) || toStringValue(profile.role),
    createdAt: toStringValue(profile.createdAt, new Date().toISOString()),
    phone: toOptionalString(profile.phone),
    phoneNumber: toOptionalString(profile.phoneNumber),
    dateOfBirth: toOptionalString(profile.dateOfBirth),
    profileImage: toOptionalString(profile.profileImage),
    address: toOptionalString(profile.address),
    addressLine1: toOptionalString(profile.addressLine1),
    addressLine2: toOptionalString(profile.addressLine2),
    city: toOptionalString(profile.city),
    state: toOptionalString(profile.state),
    zipCode: toOptionalString(profile.zipCode),
    isVerified:
      typeof profile.isVerified === "boolean" ? profile.isVerified : undefined,
    mfaEnabled:
      typeof profile.mfaEnabled === "boolean" ? profile.mfaEnabled : undefined,
  };
}

function normalizeOrder(order: unknown): CustomerDashboardOrder {
  const rawOrder = toRecord(order);
  const primaryTestSource = rawOrder.primaryTest || rawOrder.test;
  const primaryTest = primaryTestSource
    ? toRecord(primaryTestSource)
    : null;

  return {
    id: toStringValue(rawOrder.id),
    orderNumber:
      toStringValue(rawOrder.orderNumber) ||
      `ORD-${toStringValue(rawOrder.id).slice(0, 8).toUpperCase()}`,
    status: toStringValue(rawOrder.status, "PENDING_PAYMENT"),
    subtotal: toNumberValue(rawOrder.subtotal),
    processingFee: toNumberValue(rawOrder.processingFee),
    total: toNumberValue(rawOrder.total),
    createdAt: toStringValue(rawOrder.createdAt, new Date().toISOString()),
    updatedAt: toStringValue(
      rawOrder.updatedAt || rawOrder.createdAt,
      new Date().toISOString(),
    ),
    paidAt: toOptionalString(rawOrder.paidAt) || null,
    labOrderPlacedAt: toOptionalString(rawOrder.labOrderPlacedAt) || null,
    requisitionPdfUrl: toOptionalString(rawOrder.requisitionPdfUrl) || null,
    labVisitInstructions:
      toOptionalString(rawOrder.labVisitInstructions) || null,
    manualReviewRequired: Boolean(rawOrder.manualReviewRequired),
    accessOrderId: toOptionalString(rawOrder.accessOrderId) || null,
    itemsCount: Math.max(0, Math.floor(toNumberValue(rawOrder.itemsCount))),
    primaryTest:
      primaryTest && toStringValue(primaryTest.id)
        ? {
            id: toStringValue(primaryTest.id),
            testName: toStringValue(primaryTest.testName, "Lab Test"),
            price: toNumberValue(primaryTest.price),
          }
        : null,
  };
}

export const getCustomerDashboardViewer = cache(
  async (): Promise<CustomerDashboardViewer | null> => {
    try {
      const response = await authenticatedFetch(buildApiUrl("/profile"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          extractApiMessage(payload, "Unable to load your profile."),
        );
      }

      const payload = await response.json().catch(() => ({}));
      return normalizeViewer(payload?.data || payload?.profile || payload);
    } catch (error) {
      if (isAuthFailure(error)) {
        return null;
      }

      throw error;
    }
  },
);

export async function getCustomerDashboardOrders(
  userId: string,
): Promise<CustomerDashboardOrder[]> {
  const response = await authenticatedFetch(buildApiUrl(`/orders/user/${userId}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(
      extractApiMessage(payload, "Unable to load your latest orders."),
    );
  }

  const payload = await response.json().catch(() => ({}));
  const orders = Array.isArray(payload?.orders) ? payload.orders : [];

  return orders.map(normalizeOrder);
}

export async function getCustomerDashboardData() {
  const viewer = await getCustomerDashboardViewer();

  if (!viewer) {
    return {
      viewer: null,
      orders: [],
      ordersError: null,
    };
  }

  try {
    const orders = await getCustomerDashboardOrders(viewer.id);
    return {
      viewer,
      orders,
      ordersError: null,
    };
  } catch (error) {
    return {
      viewer,
      orders: [],
      ordersError:
        error instanceof Error
          ? error.message
          : "Unable to load your latest orders.",
    };
  }
}
