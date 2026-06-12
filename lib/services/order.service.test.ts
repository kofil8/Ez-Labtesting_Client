import { describe, expect, it, vi } from "vitest";

const { clientFetch } = vi.hoisted(() => ({
  clientFetch: vi.fn(),
}));

vi.mock("@/lib/api-client", () => ({
  clientFetch,
}));

import { createOrder } from "./order.service";

describe("order service", () => {
  it("surfaces REGION_RESTRICTED errors with code and details", async () => {
    clientFetch.mockReset();
    clientFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        code: "REGION_RESTRICTED",
        message: "Ordering is unavailable in your region.",
        details: {
          stateCode: "NY",
          laboratoryRoute: "ACCESS",
          restrictionType: "BLOCKED",
        },
      }),
    });

    await expect(
      createOrder({
        labTestId: "test-1",
        subtotal: 10,
        processingFee: 2.5,
        total: 12.5,
        patient: {
          firstName: "A",
          lastName: "B",
          dob: "1990-01-01",
          gender: "Male",
        },
        accessPayloadJson: {
          patient: {
            state: "NY",
          },
        },
      }),
    ).rejects.toMatchObject({
      message: "Ordering is unavailable in your region.",
      code: "REGION_RESTRICTED",
      details: {
        stateCode: "NY",
        laboratoryRoute: "ACCESS",
        restrictionType: "BLOCKED",
      },
    });
  });
});
