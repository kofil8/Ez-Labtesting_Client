import { getPaymentFinalizeErrorMessage } from "@/lib/checkout/flow-guards";

type FinalizeDeps = {
  confirmOrderPayment: (
    orderId: string,
    paymentIntentId: string,
  ) => Promise<unknown>;
  onMissingInformation: () => void;
  onNavigateToVisitLab: () => void;
  onFinalizeError: (message: string) => void;
  setIsFinalizing: (value: boolean) => void;
};

type FinalizeParams = {
  orderId?: string | null;
  paymentIntentId: string;
  hasAccessPayload: boolean;
};

export async function finalizePaymentAfterStripe(
  params: FinalizeParams,
  deps: FinalizeDeps,
): Promise<"missing_info" | "success" | "error"> {
  const { orderId, paymentIntentId, hasAccessPayload } = params;

  if (!hasAccessPayload || !orderId) {
    deps.onMissingInformation();
    return "missing_info";
  }

  deps.setIsFinalizing(true);

  try {
    await deps.confirmOrderPayment(orderId, paymentIntentId);
    deps.onNavigateToVisitLab();
    return "success";
  } catch (error) {
    deps.onFinalizeError(getPaymentFinalizeErrorMessage(error));
    return "error";
  } finally {
    deps.setIsFinalizing(false);
  }
}
