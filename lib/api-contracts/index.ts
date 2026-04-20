/**
 * API Contracts - Single Export Point
 *
 * Import all contract types from here instead of individual files.
 * Ensures consistency across the frontend.
 */

// Order contracts
export type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderInfo,
  Patient,
} from "./order.contract";

// Payment contracts
export type {
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
} from "./payment.contract";

// Order status contracts
export { type OrderStatus } from "./order-status.contract";
export type {
  OrderStatusBulkResponse,
  OrderStatusResponse,
} from "./order-status.contract";

// Error contracts
export { ErrorCode } from "./error.contract";
export type {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "./error.contract";

// Endpoints
export { API_ENDPOINTS, getApiUrl, isErrorResponse } from "./endpoints";
// ACCESS Lab contracts
export {
  isAccessOrderPayloadComplete,
  validateDobFormat,
  validateEmailFormat,
  validatePhoneFormat,
} from "./access-order.contract";
export type {
  AccessOrderPayload,
  AccessPatientInfo,
} from "./access-order.contract";
export type {
  RestrictionSource,
  RestrictionStatus,
  RestrictionStatusResponse,
  RestrictionType,
} from "@/types/restriction";
