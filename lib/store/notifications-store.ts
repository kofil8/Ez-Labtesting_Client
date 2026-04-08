import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationItem } from "@/lib/services/notifications.api";

type NotificationsState = {
  notifications: NotificationItem[];
  unreadCount: number;
  hydrated: boolean;
  ownerUserId: string | null;
  setHydrated: (value: boolean) => void;
  ensureUserScope: (userId: string | null) => void;
  setNotifications: (
    items: NotificationItem[],
    userId?: string | null,
  ) => void;
  prependNotification: (item: NotificationItem) => void;
  setUnreadCount: (count: number) => void;
  markAsReadLocal: (id: string) => void;
  markAllAsReadLocal: () => void;
  removeNotificationLocal: (id: string) => void;
  resetNotifications: () => void;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      hydrated: false,
      ownerUserId: null,

      setHydrated: (value) => set({ hydrated: value }),

      ensureUserScope: (userId) => {
        const currentOwner = get().ownerUserId;

        if (!userId) {
          set({
            notifications: [],
            unreadCount: 0,
            ownerUserId: null,
          });
          return;
        }

        if (currentOwner && currentOwner !== userId) {
          set({
            notifications: [],
            unreadCount: 0,
            ownerUserId: userId,
          });
          return;
        }

        if (!currentOwner) {
          set({ ownerUserId: userId });
        }
      },

      setNotifications: (items, userId) =>
        set({
          notifications: items.slice(0, 100),
          unreadCount: items.filter((item) => !item.isRead).length,
          ownerUserId: userId ?? get().ownerUserId,
        }),

      prependNotification: (item) => {
        const { notifications, ownerUserId } = get();

        if (ownerUserId && item.userId && ownerUserId !== item.userId) {
          return;
        }

        const exists = notifications.some((notification) => {
          return notification.id === item.id;
        });

        const next = exists
          ? notifications.map((notification) =>
              notification.id === item.id ? item : notification,
            )
          : [item, ...notifications].slice(0, 100);

        set({
          notifications: next,
          unreadCount: next.filter((notification) => !notification.isRead).length,
          ownerUserId: ownerUserId ?? item.userId ?? null,
        });
      },

      setUnreadCount: (count) => set({ unreadCount: count }),

      markAsReadLocal: (id) => {
        const next = get().notifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
                readAt: notification.readAt ?? new Date().toISOString(),
              }
            : notification,
        );

        set({
          notifications: next,
          unreadCount: next.filter((notification) => !notification.isRead).length,
        });
      },

      markAllAsReadLocal: () => {
        const now = new Date().toISOString();
        const next = get().notifications.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt ?? now,
        }));

        set({
          notifications: next,
          unreadCount: 0,
        });
      },

      removeNotificationLocal: (id) => {
        const next = get().notifications.filter(
          (notification) => notification.id !== id,
        );

        set({
          notifications: next,
          unreadCount: next.filter((notification) => !notification.isRead).length,
        });
      },

      resetNotifications: () =>
        set({
          notifications: [],
          unreadCount: 0,
          ownerUserId: null,
        }),
    }),
    {
      name: "ezlab-notifications-store",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        ownerUserId: state.ownerUserId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
