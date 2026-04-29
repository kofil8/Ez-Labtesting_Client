/**
 * Order API Contracts
 *
 * Defines the shape of data for creating and managing lab test orders.
 * Order may be created after payment processing.
 * One order = one lab test + patient information.
 */

/**
 * Patient information required for creating an order
 */
export interface Patient {
  firstName: string;
  lastName: string;
  dob: string; // ISO 8601 date format: YYYY-MM-DD
  gender: "Male" | "Female" | "Other";
}

/**
 * Request payload for creating a new lab test order
 * UPDATED: Now includes accessPayloadJson for ACCESS Lab integration
 */
export interface CreateOrderRequest {
  userId?: string | null;
  labTestId: string;
  labCenterId?: string; // Optional lab center for test location
  patient: Patient; // Keep for backwards compatibility
  subtotal: number;
  processingFee: number;
  total: number;
  promoCode?: string;
  accessPayloadJson: any; // ACCESS Lab payload (patient info + test details)
  stripePaymentIntentId?: string;
}

/**
 * Response from successful order creation
 * Status will always be "PENDING_PAYMENT" until Stripe processes payment
 */
export interface CreateOrderResponse {
  orderId: string;
  orderNumber?: string;
  status: "PENDING_PAYMENT" | "PAID";
  subtotal: number;
  processingFee: number;
  total: number;
  clientSecret?: string;
  stripePaymentIntentId?: string;
}

/**
 * Basic order info used in other responses
 */
export interface OrderInfo {
  orderId: string;
  status:
    | "PENDING_PAYMENT"
    | "PAID"
    | "LAB_ORDER_PLACED"
    | "COMPLETED"
    | "FAILED";
  subtotal: number;
  processingFee: number;
  total: number;
  labCenterId?: string;
  labCenter?: {
    id: string;
    name: string;
    address: string;
    phone?: string;
  };
}
