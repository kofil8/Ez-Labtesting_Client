import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  createdAt: string; // ISO timestamp
  read: boolean;
  data?: Record<string, unknown>;
}

interface NotificationsState {
  items: NotificationItem[];
  addNotification: (
    item: Omit<NotificationItem, "id" | "read" | "createdAt"> &
      Partial<Pick<NotificationItem, "id" | "createdAt">>
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: [],

      addNotification: (payload) => {
        const id =
          payload.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const createdAt = payload.createdAt ?? new Date().toISOString();
        const newItem: NotificationItem = {
          id,
          title: payload.title,
          body: payload.body,
          createdAt,
          read: false,
          data: payload.data,
        };

        set((state) => ({ items: [newItem, ...state.items].slice(0, 100) }));
      },

      markRead: (id) => {
        set((state) => ({
          items: state.items.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllRead: () => {
        set((state) => ({
          items: state.items.map((n) => ({ ...n, read: true })),
        }));
      },

      clearAll: () => {
        set({ items: [] });
      },

      getUnreadCount: () => get().items.filter((n) => !n.read).length,
    }),
    {
      name: "notifications-storage",
    }
  )
);
