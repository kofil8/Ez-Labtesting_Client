/**
 * API Endpoints Map
 *
 * Single source of truth for all API endpoints.
 * Used by both frontend and backend for consistency.
 * Import this instead of hardcoding URLs.
 */

import { getApiUrl as toApiUrl } from "@/lib/api/config";

function buildLocationStatusQuery(params?: {
  checkoutState?: string;
  zipCode?: string;
  testId?: string;
  laboratoryId?: string;
  publicIp?: string;
  laboratoryCode?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.checkoutState) {
    searchParams.set("checkoutState", params.checkoutState);
  }

  if (params?.zipCode) {
    searchParams.set("zipCode", params.zipCode);
  }

  if (params?.testId) {
    searchParams.set("testId", params.testId);
  }

  if (params?.laboratoryId) {
    searchParams.set("laboratoryId", params.laboratoryId);
  }

  if (params?.publicIp) {
    searchParams.set("publicIp", params.publicIp);
  }

  if (params?.laboratoryCode) {
    searchParams.set("laboratoryCode", params.laboratoryCode);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const API_ENDPOINTS = {
  // Order endpoints
  ORDERS: {
    CREATE: toApiUrl("/orders"),
    RESUME: toApiUrl("/orders/resume"),
    MANUAL_REVIEW: (limit = 100) =>
      toApiUrl(
        `/orders/manual-review?limit=${encodeURIComponent(String(limit))}`,
      ),
    ALL: (params?: { page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      const query = searchParams.toString();
      return toApiUrl(`/orders${query ? `?${query}` : ""}`);
    },
    GET_BY_USER: (userId: string) => toApiUrl(`/orders/user/${userId}`),
    GET_STATUS: (orderId: string) => toApiUrl(`/orders/${orderId}/status`),
    GET_BY_ID: (orderId: string) => toApiUrl(`/orders/${orderId}`),
    GET_TRACKING: (orderId: string) => toApiUrl(`/orders/${orderId}/tracking`),
    GET_REQUISITION: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/requisition`),
    CONFIRM_PAYMENT: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/confirm-payment`),
    CONFIRM_ORDER: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/confirm-order`),
    RETRY_ACCESS: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/retry-access`),
    MANUAL_REORDER: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/manual-reorder`),
    REQUEST_REFUND: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/request-refund`),
    APPROVE_REFUND: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/approve-refund`),
  },

  // Payment endpoints
  PAYMENTS: {
    CREATE_INTENT: toApiUrl("/payment/order-intent"),
    CONFIRM: toApiUrl("/payment/confirm-payment-intent"),
    GET_STATUS: (paymentIntentId: string) =>
      toApiUrl(`/payment/${paymentIntentId}`),
  },

  // Lab tests
  LAB_TESTS: {
    GET_ALL: toApiUrl("/lab-tests"),
    GET_BY_ID: (testId: string) => toApiUrl(`/lab-tests/${testId}`),
  },

  // Super Admin
  SUPERADMIN: {
    DASHBOARD_SUMMARY: toApiUrl("/superadmin/dashboard-summary"),
    CUSTOM_NOTIFICATION_BROADCAST: toApiUrl(
      "/notifications/admin/custom-broadcast",
    ),
  },

  SUPPORT: {
    TICKETS: toApiUrl("/support/tickets"),
    GET_TICKET: (ticketId: string) => toApiUrl(`/support/tickets/${ticketId}`),
    MESSAGES: (ticketId: string) =>
      toApiUrl(`/support/tickets/${ticketId}/messages`),
    STATUS: (ticketId: string) =>
      toApiUrl(`/support/tickets/${ticketId}/status`),
  },

  STATE_RESTRICTIONS: {
    LOCATION_STATUS: (params?: {
      checkoutState?: string;
      zipCode?: string;
      testId?: string;
      laboratoryId?: string;
      publicIp?: string;
      laboratoryCode?: string;
    }) =>
      toApiUrl(
        `/location/restriction-status${buildLocationStatusQuery(params)}`,
      ),
    LEGACY_LOCATION_STATUS: (params?: {
      checkoutState?: string;
      zipCode?: string;
      testId?: string;
      laboratoryId?: string;
      publicIp?: string;
      laboratoryCode?: string;
    }) =>
      toApiUrl(
        `/state-restrictions/location-status${buildLocationStatusQuery(params)}`,
      ),
  },
};

/**
 * Helper function to get full API URL
 */
export function getApiUrl(endpoint: string): string {
  return endpoint;
}

/**
 * Helper to check if error response
 */
export function isErrorResponse(response: any): boolean {
  return response && typeof response === "object" && "code" in response;
}
