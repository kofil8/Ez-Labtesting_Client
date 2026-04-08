import { describe, expect, it, vi } from "vitest";

function createStorage() {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    get length() {
      return Object.keys(store).length;
    },
  };
}

const firstNotification = {
  id: "notification-1",
  userId: "user-1",
  type: "SYSTEM_ALERT",
  title: "First",
  body: "First body",
  data: {},
  isRead: false,
  createdAt: "2026-04-07T00:00:00.000Z",
};

const secondNotification = {
  ...firstNotification,
  id: "notification-2",
  title: "Second",
  createdAt: "2026-04-07T00:05:00.000Z",
};

describe("notifications-store", () => {
  async function loadStore() {
    vi.resetModules();
    vi.stubGlobal("localStorage", createStorage());

    const { useNotificationsStore } = await import("./notifications-store");
    useNotificationsStore.getState().resetNotifications();
    return useNotificationsStore;
  }

  it("dedupes notifications on prepend", async () => {
    const useNotificationsStore = await loadStore();
    useNotificationsStore.getState().prependNotification(firstNotification);
    useNotificationsStore.getState().prependNotification({
      ...firstNotification,
      title: "Updated",
    });

    const state = useNotificationsStore.getState();
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0]?.title).toBe("Updated");
    expect(state.unreadCount).toBe(1);
    vi.unstubAllGlobals();
  });

  it("tracks unread counts for local read mutations", async () => {
    const useNotificationsStore = await loadStore();
    useNotificationsStore
      .getState()
      .setNotifications([firstNotification, secondNotification], "user-1");

    useNotificationsStore.getState().markAsReadLocal(firstNotification.id);
    expect(useNotificationsStore.getState().unreadCount).toBe(1);

    useNotificationsStore.getState().markAllAsReadLocal();
    expect(useNotificationsStore.getState().unreadCount).toBe(0);
    expect(
      useNotificationsStore
        .getState()
        .notifications.every((notification) => notification.isRead),
    ).toBe(true);
    vi.unstubAllGlobals();
  });

  it("removes notifications and recomputes unread count", async () => {
    const useNotificationsStore = await loadStore();
    useNotificationsStore
      .getState()
      .setNotifications([firstNotification, secondNotification], "user-1");

    useNotificationsStore
      .getState()
      .removeNotificationLocal(firstNotification.id);

    const state = useNotificationsStore.getState();
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0]?.id).toBe(secondNotification.id);
    expect(state.unreadCount).toBe(1);
    vi.unstubAllGlobals();
  });

  it("resets notifications when the scoped user changes", async () => {
    const useNotificationsStore = await loadStore();
    useNotificationsStore
      .getState()
      .setNotifications([firstNotification], "user-1");

    useNotificationsStore.getState().ensureUserScope("user-2");

    const state = useNotificationsStore.getState();
    expect(state.ownerUserId).toBe("user-2");
    expect(state.notifications).toEqual([]);
    expect(state.unreadCount).toBe(0);
    vi.unstubAllGlobals();
  });
});
