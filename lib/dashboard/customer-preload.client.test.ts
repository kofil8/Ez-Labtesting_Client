import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getOrdersByUserId } = vi.hoisted(() => ({
  getOrdersByUserId: vi.fn(),
}));

vi.mock("@/lib/services/order.service", () => ({
  getOrdersByUserId,
}));

import {
  __resetCustomerDashboardPreloadCacheForTests,
  getCustomerOrdersPreloaded,
  invalidateCustomerOrders,
  preloadCustomerOrders,
} from "./customer-preload.client";

function buildOrder(id: string) {
  return {
    id,
    orderNumber: `ORD-${id}`,
    status: "COMPLETED",
    subtotal: 10,
    processingFee: 2,
    total: 12,
    createdAt: "2026-05-02T00:00:00.000Z",
    updatedAt: "2026-05-02T00:00:00.000Z",
    paidAt: null,
    labOrderPlacedAt: null,
    requisitionPdfUrl: null,
    labVisitInstructions: null,
    manualReviewRequired: false,
    accessOrderId: null,
    itemsCount: 1,
    primaryTest: null,
  };
}

describe("customer dashboard preload cache", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-02T00:00:00.000Z"));
    getOrdersByUserId.mockReset();
    __resetCustomerDashboardPreloadCacheForTests();
  });

  afterEach(() => {
    __resetCustomerDashboardPreloadCacheForTests();
    vi.useRealTimers();
  });

  it("deduplicates simultaneous order preloads for the same user", async () => {
    const orders = [buildOrder("order-1")];
    getOrdersByUserId.mockResolvedValue(orders);

    const [first, second] = await Promise.all([
      preloadCustomerOrders("user-1"),
      getCustomerOrdersPreloaded("user-1"),
    ]);

    expect(getOrdersByUserId).toHaveBeenCalledTimes(1);
    expect(first).toBe(orders);
    expect(second).toBe(orders);
  });

  it("separates cached orders by user id", async () => {
    const firstOrders = [buildOrder("order-1")];
    const secondOrders = [buildOrder("order-2")];
    getOrdersByUserId
      .mockResolvedValueOnce(firstOrders)
      .mockResolvedValueOnce(secondOrders);

    await expect(preloadCustomerOrders("user-1")).resolves.toBe(firstOrders);
    await expect(preloadCustomerOrders("user-2")).resolves.toBe(secondOrders);

    expect(getOrdersByUserId).toHaveBeenNthCalledWith(1, "user-1");
    expect(getOrdersByUserId).toHaveBeenNthCalledWith(2, "user-2");
  });

  it("returns cached orders inside the TTL", async () => {
    const orders = [buildOrder("order-1")];
    getOrdersByUserId.mockResolvedValue(orders);

    await preloadCustomerOrders("user-1");
    vi.setSystemTime(new Date("2026-05-02T00:00:29.000Z"));
    const cached = await getCustomerOrdersPreloaded("user-1");

    expect(cached).toBe(orders);
    expect(getOrdersByUserId).toHaveBeenCalledTimes(1);
  });

  it("refetches orders after invalidation", async () => {
    const firstOrders = [buildOrder("order-1")];
    const secondOrders = [buildOrder("order-2")];
    getOrdersByUserId
      .mockResolvedValueOnce(firstOrders)
      .mockResolvedValueOnce(secondOrders);

    await preloadCustomerOrders("user-1");
    invalidateCustomerOrders("user-1");
    await expect(getCustomerOrdersPreloaded("user-1")).resolves.toBe(secondOrders);

    expect(getOrdersByUserId).toHaveBeenCalledTimes(2);
  });

  it("refetches orders after the TTL expires", async () => {
    const firstOrders = [buildOrder("order-1")];
    const secondOrders = [buildOrder("order-2")];
    getOrdersByUserId
      .mockResolvedValueOnce(firstOrders)
      .mockResolvedValueOnce(secondOrders);

    await preloadCustomerOrders("user-1");
    vi.setSystemTime(new Date("2026-05-02T00:00:31.000Z"));
    await expect(getCustomerOrdersPreloaded("user-1")).resolves.toBe(secondOrders);

    expect(getOrdersByUserId).toHaveBeenCalledTimes(2);
  });

  it("does not keep a failed request in cache", async () => {
    const orders = [buildOrder("order-1")];
    getOrdersByUserId
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(orders);

    await expect(preloadCustomerOrders("user-1")).rejects.toThrow("Network error");
    await expect(getCustomerOrdersPreloaded("user-1")).resolves.toBe(orders);

    expect(getOrdersByUserId).toHaveBeenCalledTimes(2);
  });
});
