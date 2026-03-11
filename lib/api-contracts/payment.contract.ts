/**
 * Payment Intent API Contracts
 *
 * Defines the shape of data for Stripe payment intent creation.
 * Frontend sends minimal info, backend handles Stripe integration.
 * No Stripe keys or sensitive data is exposed to frontend.
 */

/**
 * Request to create a Stripe payment intent
 * Frontend sends amount and customer details
 */
export interface CreatePaymentIntentRequest {
  amount: number;
  customerEmail: string;
  customerName: string;
  paymentMethodType?: "card" | "automatic";
  metadata?: Record<string, string>;
}

/**
 * Response containing Stripe client secret
 * Frontend uses this to confirm payment with Stripe
 * Client secret is single-use and expires after ~15 minutes
 */
export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number; // Total amount in cents (e.g., 3150 for $31.50)
  currency: string; // e.g., "usd"
}

/**
 * Request to confirm/verify payment status after Stripe confirmation
 */
export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

/**
 * Response after payment confirmation
 */
export interface ConfirmPaymentResponse {
  paymentIntentId: string;
  status: "succeeded" | "processing" | "requires_action";
}
