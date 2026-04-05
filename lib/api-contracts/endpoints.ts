/**
 * API Endpoints Map
 *
 * Single source of truth for all API endpoints.
 * Used by both frontend and backend for consistency.
 * Import this instead of hardcoding URLs.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7001/api/v1";

export const API_ENDPOINTS = {
  // Order endpoints
  ORDERS: {
    CREATE: `${API_BASE_URL}/orders`,
    RESUME: `${API_BASE_URL}/orders/resume`,
    MANUAL_REVIEW: (limit = 100) =>
      `${API_BASE_URL}/orders/manual-review?limit=${encodeURIComponent(String(limit))}`,
    GET_BY_USER: (userId: string) => `${API_BASE_URL}/orders/user/${userId}`,
    GET_STATUS: (orderId: string) => `${API_BASE_URL}/orders/${orderId}/status`,
    GET_BY_ID: (orderId: string) => `${API_BASE_URL}/orders/${orderId}`,
    GET_TRACKING: (orderId: string) =>
      `${API_BASE_URL}/orders/${orderId}/tracking`,
    CONFIRM_PAYMENT: (orderId: string) =>
      `${API_BASE_URL}/orders/${orderId}/confirm-payment`,
    RETRY_ACCESS: (orderId: string) =>
      `${API_BASE_URL}/orders/${orderId}/retry-access`,
  },

  // Payment endpoints
  PAYMENTS: {
    CREATE_INTENT: `${API_BASE_URL}/payments/create-intent`,
    CONFIRM: `${API_BASE_URL}/payments/confirm`,
    GET_STATUS: (paymentIntentId: string) =>
      `${API_BASE_URL}/payments/${paymentIntentId}`,
  },

  // Lab tests
  LAB_TESTS: {
    GET_ALL: `${API_BASE_URL}/lab-tests`,
    GET_BY_ID: (testId: string) => `${API_BASE_URL}/lab-tests/${testId}`,
  },

  // Super Admin
  SUPERADMIN: {
    DASHBOARD_SUMMARY: `${API_BASE_URL}/superadmin/dashboard-summary`,
  },

  SUPPORT: {
    TICKETS: `${API_BASE_URL}/support/tickets`,
    GET_TICKET: (ticketId: string) =>
      `${API_BASE_URL}/support/tickets/${ticketId}`,
    MESSAGES: (ticketId: string) =>
      `${API_BASE_URL}/support/tickets/${ticketId}/messages`,
    STATUS: (ticketId: string) =>
      `${API_BASE_URL}/support/tickets/${ticketId}/status`,
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
