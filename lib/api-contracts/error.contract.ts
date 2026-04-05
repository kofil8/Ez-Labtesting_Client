/**
 * Error Response API Contract
 *
 * Standard error response format for all API endpoints.
 * Frontend uses this to handle errors consistently.
 */

/**
 * Error codes that frontend can use for i18n and specific handling
 */
export enum ErrorCode {
  // Validation errors (4xx)
  INVALID_REQUEST = "INVALID_REQUEST",
  MISSING_FIELD = "MISSING_FIELD",
  INVALID_ORDER_ID = "INVALID_ORDER_ID",
  ORDER_NOT_FOUND = "ORDER_NOT_FOUND",
  INVALID_LAB_TEST_ID = "INVALID_LAB_TEST_ID",

  // Payment errors (4xx)
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PAYMENT_CANCELLED = "PAYMENT_CANCELLED",
  PAYMENT_INTENT_NOT_FOUND = "PAYMENT_INTENT_NOT_FOUND",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  CARD_DECLINED = "CARD_DECLINED",

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  DATABASE_ERROR = "DATABASE_ERROR",

  // External service errors
  STRIPE_ERROR = "STRIPE_ERROR",
  LAB_SERVICE_ERROR = "LAB_SERVICE_ERROR",
}

/**
 * Standard API error response
 * All endpoints should return this format on error
 */
export interface ApiErrorResponse {
  code: ErrorCode | string;
  message: string;
  details?: Record<string, unknown>; // Optional additional context
  timestamp?: string; // ISO 8601 timestamp of error
  requestId?: string; // For debugging/support
}

/**
 * Success wrapper (optional for consistency)
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Union type for any API response
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
