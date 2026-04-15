/**
 * API Endpoints Map
 *
 * Single source of truth for all API endpoints.
 * Used by both frontend and backend for consistency.
 * Import this instead of hardcoding URLs.
 */

import { getApiUrl as toApiUrl } from "@/lib/api/config";

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
    CONFIRM_PAYMENT: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/confirm-payment`),
    RETRY_ACCESS: (orderId: string) =>
      toApiUrl(`/orders/${orderId}/retry-access`),
  },

  // Payment endpoints
  PAYMENTS: {
    CREATE_INTENT: toApiUrl("/payments/create-intent"),
    CONFIRM: toApiUrl("/payments/confirm"),
    GET_STATUS: (paymentIntentId: string) =>
      toApiUrl(`/payments/${paymentIntentId}`),
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
