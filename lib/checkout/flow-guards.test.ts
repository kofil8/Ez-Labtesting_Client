import { describe, expect, it } from "vitest";

import {
  LAB_POLL_MAX_DELAY_MS,
  computeLabPollDelay,
  getPaymentFinalizeErrorMessage,
  hasExceededLabPollAttempts,
  isLabPollingTerminal,
  isPaymentSubmitDisabled,
  shouldRouteToVisitLab,
} from "@/lib/checkout/flow-guards";

describe("checkout flow guards", () => {
  it("locks duplicate payment submissions while processing", () => {
    expect(
      isPaymentSubmitDisabled({
        disabled: false,
        stripeReady: true,
        isProcessing: true,
        amount: 100,
      }),
    ).toBe(true);
  });

  it("requires stripe readiness and positive amount for submit", () => {
    expect(
      isPaymentSubmitDisabled({
        disabled: false,
        stripeReady: false,
        isProcessing: false,
        amount: 100,
      }),
    ).toBe(true);

    expect(
      isPaymentSubmitDisabled({
        disabled: false,
        stripeReady: true,
        isProcessing: false,
        amount: 0,
      }),
    ).toBe(true);

    expect(
      isPaymentSubmitDisabled({
        disabled: false,
        stripeReady: true,
        isProcessing: false,
        amount: 120,
      }),
    ).toBe(false);
  });

  it("keeps payment recovery messaging deterministic", () => {
    expect(getPaymentFinalizeErrorMessage()).toContain("could not finalize");
    expect(getPaymentFinalizeErrorMessage(new Error("verify timeout"))).toBe(
      "verify timeout",
    );
  });

  it("detects terminal lab polling states", () => {
    expect(
      isLabPollingTerminal({
        status: "LAB_ORDER_PLACED",
        requisitionPdfUrl: null,
      }),
    ).toBe(true);
    expect(
      isLabPollingTerminal({ status: "PAID", manualReviewRequired: true }),
    ).toBe(true);
    expect(
      isLabPollingTerminal({ status: "PAID", requisitionPdfUrl: "https://x" }),
    ).toBe(true);
    expect(isLabPollingTerminal({ status: "PAID" })).toBe(false);
  });

  it("applies bounded backoff with max attempt cutoff", () => {
    expect(computeLabPollDelay(0)).toBeGreaterThan(0);
    expect(computeLabPollDelay(100)).toBe(LAB_POLL_MAX_DELAY_MS);
    expect(hasExceededLabPollAttempts(25)).toBe(true);
    expect(hasExceededLabPollAttempts(24)).toBe(false);
  });

  it("routes resumable paid orders to visit-lab", () => {
    expect(shouldRouteToVisitLab("PAID")).toBe(true);
    expect(shouldRouteToVisitLab("LAB_ORDER_PLACED")).toBe(true);
    expect(shouldRouteToVisitLab("COMPLETED")).toBe(true);
    expect(shouldRouteToVisitLab("PENDING_PAYMENT")).toBe(false);
  });
});
