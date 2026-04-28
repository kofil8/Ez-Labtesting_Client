import { describe, expect, it } from "vitest";
import { normalizeNotificationItem } from "./notifications.api";

describe("normalizeNotificationItem", () => {
  it("normalizes backend notification payload fields", () => {
    expect(
      normalizeNotificationItem({
        notificationId: "notification-1",
        userId: "user-1",
        type: "ORDER_CREATED",
        title: "Order Created",
        body: "Body",
        data: { clickAction: "/dashboard/customer/results/order-1" },
        priority: "HIGH",
        isRead: false,
        createdAt: "2026-04-26T01:00:00.000Z",
        sentAt: "2026-04-26T01:00:01.000Z",
      }),
    ).toEqual({
      id: "notification-1",
      userId: "user-1",
      type: "ORDER_CREATED",
      title: "Order Created",
      body: "Body",
      data: { clickAction: "/dashboard/customer/results/order-1" },
      priority: "HIGH",
      isRead: false,
      createdAt: "2026-04-26T01:00:00.000Z",
      sentAt: "2026-04-26T01:00:01.000Z",
      readAt: undefined,
    });
  });
});
