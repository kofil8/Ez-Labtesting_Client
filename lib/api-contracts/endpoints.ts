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
  testId?: string;
  laboratoryId?: string;
  publicIp?: string;
  laboratoryCode?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.checkoutState) {
    searchParams.set("checkoutState", params.checkoutState);
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
    GET_BY_USER: (userId: string) => toApiUrl(`/orders/user/${userId}`),
    GET_STATUS: (orderId: string) => toApiUrl(`/orders/${orderId}/status`),
    GET_BY_ID: (orderId: string) => toApiUrl(`/orders/${orderId}`),
    GET_TRACKING: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/tracking`),
    GET_REQUISITION: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/requisition`),
    CONFIRM_PAYMENT: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/confirm-payment`),
    RETRY_ACCESS: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/retry-access`),
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
  },

  SUPPORT: {
    TICKETS: toApiUrl("/support/tickets"),
    GET_TICKET: (ticketId: string) =>
      toApiUrl(`/support/tickets/${ticketId}`),
    MESSAGES: (ticketId: string) =>
      toApiUrl(`/support/tickets/${ticketId}/messages`),
    STATUS: (ticketId: string) =>
      toApiUrl(`/support/tickets/${ticketId}/status`),
  },

  STATE_RESTRICTIONS: {
    LOCATION_STATUS: (params?: {
      checkoutState?: string;
      testId?: string;
      laboratoryId?: string;
      publicIp?: string;
      laboratoryCode?: string;
    }) => toApiUrl(`/state-restrictions/location-status${buildLocationStatusQuery(params)}`),
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
