export const LAB_POLL_BASE_DELAY_MS = 4000;
export const LAB_POLL_MAX_DELAY_MS = 15000;
export const LAB_POLL_BACKOFF_FACTOR = 1.35;
export const LAB_POLL_MAX_ATTEMPTS = 25;

export type ResumableOrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "LAB_ORDER_PLACED"
  | "COMPLETED"
  | "FAILED"
  | "MANUAL_REVIEW"
  | string;

export function shouldRouteToVisitLab(status?: ResumableOrderStatus): boolean {
  return (
    status === "PAID" || status === "LAB_ORDER_PLACED" || status === "COMPLETED"
  );
}

export function isPaymentSubmitDisabled(params: {
  disabled?: boolean;
  stripeReady: boolean;
  isProcessing: boolean;
  amount: number;
}): boolean {
  const { disabled = false, stripeReady, isProcessing, amount } = params;
  return (
    disabled ||
    !stripeReady ||
    isProcessing ||
    !Number.isFinite(amount) ||
    amount <= 0
  );
}

export function isLabPollingTerminal(params: {
  status?: string;
  requisitionPdfUrl?: string | null;
  manualReviewRequired?: boolean;
}): boolean {
  const { status, requisitionPdfUrl, manualReviewRequired } = params;

  return (
    Boolean(requisitionPdfUrl) ||
    status === "FAILED" ||
    status === "LAB_ORDER_PLACED" ||
    status === "COMPLETED" ||
    (status === "PAID" && Boolean(manualReviewRequired))
  );
}

export function computeLabPollDelay(attempt: number): number {
  if (attempt <= 0) return LAB_POLL_BASE_DELAY_MS;

  const delay = Math.round(
    LAB_POLL_BASE_DELAY_MS * Math.pow(LAB_POLL_BACKOFF_FACTOR, attempt),
  );

  return Math.min(delay, LAB_POLL_MAX_DELAY_MS);
}

export function hasExceededLabPollAttempts(attempt: number): boolean {
  return attempt >= LAB_POLL_MAX_ATTEMPTS;
}

export function getPaymentFinalizeErrorMessage(error?: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return "We could not finalize your paid order. Please retry from this page.";
}
