/**
 * Order Status API Contracts
 *
 * Defines the shape of data for fetching order status.
 * Used by frontend after Stripe redirect or for polling.
 * Provides visibility into order lifecycle and lab processing.
 */

/**
 * Order status lifecycle
 */
export type OrderStatus =
  | "PENDING_PAYMENT" // Order created, waiting for payment
  | "PAID" // Payment confirmed, ready for lab
  | "LAB_ORDER_PLACED" // Order sent to lab
  | "LAB_SUBMISSION_PENDING" // Reserved for async partner states
  | "LAB_SUBMISSION_RETRYING" // Reserved for retry state
  | "LAB_SUBMISSION_FAILED_RETRYABLE" // Reserved for retryable failure
  | "LAB_SUBMISSION_FAILED_FINAL" // Reserved for final submission failure
  | "MANUAL_REVIEW" // Requires manual operations review
  | "REFUND_PENDING" // Refund requested/in progress
  | "REFUNDED" // Refund completed
  | "IN_PROCESSING" // Lab is processing the test
  | "COMPLETED" // Results are ready
  | "FAILED" // Payment or lab processing failed
  | "CANCELLED"; // Order was cancelled

/**
 * Response when fetching order status
 * Used after Stripe redirect and for polling
 */
export interface OrderStatusResponse {
  orderId: string;
  status: OrderStatus;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp

  // Lab processing details (optional, populated after payment)
  labLocation?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // Patient confirmation details (optional, after lab processing starts)
  confirmationCode?: string; // Reference code for patient

  // Requisition form (optional, available after payment)
  requisitionPdfUrl?: string; // URL to download lab requisition form

  // Results (optional, available when COMPLETED)
  resultsUrl?: string; // URL to view/download results

  // Error details (optional, if status is FAILED)
  errorMessage?: string;
}

/**
 * Response for bulk order status check (future feature)
 */
export interface OrderStatusBulkResponse {
  orders: OrderStatusResponse[];
}
