import { describe, expect, it } from "vitest";

import { finalizePaymentAfterStripe } from "@/lib/checkout/payment-finalization";

describe("payment finalization orchestrator", () => {
  it("does not navigate when required info is missing", async () => {
    const confirmCalls: Array<[string, string]> = [];
    const finalizingCalls: boolean[] = [];
    let missingCount = 0;
    let navigateCount = 0;
    const finalizeErrors: string[] = [];

    const confirmOrderPayment = async (
      orderId: string,
      paymentIntentId: string,
    ) => {
      confirmCalls.push([orderId, paymentIntentId]);
    };
    const onMissingInformation = () => {
      missingCount += 1;
    };
    const onNavigateToVisitLab = () => {
      navigateCount += 1;
    };
    const onFinalizeError = (message: string) => {
      finalizeErrors.push(message);
    };
    const setIsFinalizing = (value: boolean) => {
      finalizingCalls.push(value);
    };

    const result = await finalizePaymentAfterStripe(
      {
        orderId: null,
        paymentIntentId: "pi_123",
        hasAccessPayload: false,
      },
      {
        confirmOrderPayment,
        onMissingInformation,
        onNavigateToVisitLab,
        onFinalizeError,
        setIsFinalizing,
      },
    );

    expect(result).toBe("missing_info");
    expect(missingCount).toBe(1);
    expect(confirmCalls.length).toBe(0);
    expect(navigateCount).toBe(0);
    expect(finalizeErrors.length).toBe(0);
    expect(finalizingCalls.length).toBe(0);
  });

  it("navigates to visit-lab after successful confirmation", async () => {
    const confirmCalls: Array<[string, string]> = [];
    const finalizingCalls: boolean[] = [];
    let missingCount = 0;
    let navigateCount = 0;
    const finalizeErrors: string[] = [];

    const confirmOrderPayment = async (
      orderId: string,
      paymentIntentId: string,
    ) => {
      confirmCalls.push([orderId, paymentIntentId]);
      return {};
    };
    const onMissingInformation = () => {
      missingCount += 1;
    };
    const onNavigateToVisitLab = () => {
      navigateCount += 1;
    };
    const onFinalizeError = (message: string) => {
      finalizeErrors.push(message);
    };
    const setIsFinalizing = (value: boolean) => {
      finalizingCalls.push(value);
    };

    const result = await finalizePaymentAfterStripe(
      {
        orderId: "ord_123",
        paymentIntentId: "pi_123",
        hasAccessPayload: true,
      },
      {
        confirmOrderPayment,
        onMissingInformation,
        onNavigateToVisitLab,
        onFinalizeError,
        setIsFinalizing,
      },
    );

    expect(result).toBe("success");
    expect(confirmCalls).toEqual([["ord_123", "pi_123"]]);
    expect(navigateCount).toBe(1);
    expect(missingCount).toBe(0);
    expect(finalizeErrors.length).toBe(0);
    expect(finalizingCalls).toEqual([true, false]);
  });

  it("does not navigate and reports error when confirmation fails", async () => {
    const confirmCalls: Array<[string, string]> = [];
    const finalizingCalls: boolean[] = [];
    let missingCount = 0;
    let navigateCount = 0;
    const finalizeErrors: string[] = [];

    const confirmOrderPayment = async (
      orderId: string,
      paymentIntentId: string,
    ) => {
      confirmCalls.push([orderId, paymentIntentId]);
      throw new Error("verification timeout");
    };
    const onMissingInformation = () => {
      missingCount += 1;
    };
    const onNavigateToVisitLab = () => {
      navigateCount += 1;
    };
    const onFinalizeError = (message: string) => {
      finalizeErrors.push(message);
    };
    const setIsFinalizing = (value: boolean) => {
      finalizingCalls.push(value);
    };

    const result = await finalizePaymentAfterStripe(
      {
        orderId: "ord_123",
        paymentIntentId: "pi_123",
        hasAccessPayload: true,
      },
      {
        confirmOrderPayment,
        onMissingInformation,
        onNavigateToVisitLab,
        onFinalizeError,
        setIsFinalizing,
      },
    );

    expect(result).toBe("error");
    expect(confirmCalls).toEqual([["ord_123", "pi_123"]]);
    expect(navigateCount).toBe(0);
    expect(missingCount).toBe(0);
    expect(finalizeErrors).toEqual(["verification timeout"]);
    expect(finalizingCalls).toEqual([true, false]);
  });
});
