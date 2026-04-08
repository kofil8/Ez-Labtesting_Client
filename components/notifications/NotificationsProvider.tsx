"use client";

import { usePushRegister } from "@/hook/usePushRegister";
import { useAuth } from "@/lib/auth-context";
import { subscribeForegroundMessages } from "@/lib/push";
import {
  fetchNotifications,
  fetchUnreadCount,
  normalizeNotificationItem,
  type NotificationItem,
} from "@/lib/services/notifications.api";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "@/lib/services/notifications.socket";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { useEffect } from "react";
import { toast } from "sonner";

function createForegroundNotification(
  payload: any,
  userId: string,
): NotificationItem {
  return normalizeNotificationItem({
    id:
      payload?.data?.notificationId ||
      payload?.messageId ||
      `fg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    userId,
    type: payload?.data?.type || "SYSTEM_ALERT",
    title: payload?.notification?.title || "Notification",
    body: payload?.notification?.body || "",
    data: payload?.data || {},
    isRead: false,
    createdAt: new Date().toISOString(),
  });
}

export default function NotificationsProvider() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const userId = user?.id;

  const ensureUserScope = useNotificationsStore((state) => state.ensureUserScope);
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications,
  );
  const prependNotification = useNotificationsStore(
    (state) => state.prependNotification,
  );
  const setUnreadCount = useNotificationsStore((state) => state.setUnreadCount);
  const markAsReadLocal = useNotificationsStore(
    (state) => state.markAsReadLocal,
  );
  const resetNotifications = useNotificationsStore(
    (state) => state.resetNotifications,
  );

  usePushRegister(isAuthenticated ? userId : undefined);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !userId) {
      resetNotifications();
      disconnectNotificationSocket();
      return;
    }

    ensureUserScope(userId);
  }, [
    ensureUserScope,
    isAuthenticated,
    isLoading,
    resetNotifications,
    userId,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    let active = true;
    ensureUserScope(userId);

    async function initNotifications() {
      try {
        const [notificationsRes, unreadCount] = await Promise.all([
          fetchNotifications({ page: 1, limit: 20 }),
          fetchUnreadCount(),
        ]);

        if (!active) return;

        setNotifications(notificationsRes.data, userId);
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error("Failed to initialize notifications", error);
      }
    }

    void initNotifications();

    return () => {
      active = false;
    };
  }, [
    ensureUserScope,
    isAuthenticated,
    setNotifications,
    setUnreadCount,
    userId,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    let active = true;
    let cleanup: (() => void) | undefined;

    async function setupSocket() {
      try {
        const socket = await connectNotificationSocket();
        if (!active) return;

        const handleConnect = () => {
          console.debug("Notification socket connected");
        };

        const handleNewNotification = (payload: NotificationItem) => {
          prependNotification(
            normalizeNotificationItem({
              ...payload,
              userId: payload?.userId || userId,
              isRead: false,
              createdAt: payload?.createdAt || new Date().toISOString(),
            }),
          );
        };

        const handleCountUpdate = ({
          unreadCount,
        }: {
          unreadCount: number;
        }) => {
          setUnreadCount(unreadCount);
        };

        const handleRead = ({ id }: { id: string }) => {
          markAsReadLocal(id);
        };

        const handleData = (result: { data: NotificationItem[] }) => {
          const items = Array.isArray(result?.data)
            ? result.data.map(normalizeNotificationItem)
            : [];
          setNotifications(items, userId);
        };

        const handleConnectError = (error: Error) => {
          console.error("Notification socket connection error", error);
        };

        socket.on("connect", handleConnect);
        socket.on("notification:new", handleNewNotification);
        socket.on("notification:count-update", handleCountUpdate);
        socket.on("notification:read", handleRead);
        socket.on("notification:data", handleData);
        socket.on("connect_error", handleConnectError);

        cleanup = () => {
          socket.off("connect", handleConnect);
          socket.off("notification:new", handleNewNotification);
          socket.off("notification:count-update", handleCountUpdate);
          socket.off("notification:read", handleRead);
          socket.off("notification:data", handleData);
          socket.off("connect_error", handleConnectError);
        };
      } catch (error) {
        console.error("Failed to connect notification socket", error);
      }
    }

    void setupSocket();

    return () => {
      active = false;
      cleanup?.();
      disconnectNotificationSocket();
    };
  }, [
    isAuthenticated,
    markAsReadLocal,
    prependNotification,
    setNotifications,
    setUnreadCount,
    userId,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const currentUserId = userId;
    let active = true;
    let unsubscribe: (() => void) | undefined;

    async function setupForegroundListener() {
      try {
        unsubscribe = await subscribeForegroundMessages((payload) => {
          if (!active) return;

          const item = createForegroundNotification(payload, currentUserId);
          prependNotification(item);
          toast(item.title, {
            description: item.body || undefined,
          });
        });
      } catch (error) {
        console.error("Failed to subscribe to foreground messages", error);
      }
    }

    void setupForegroundListener();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [isAuthenticated, prependNotification, userId]);

  return null;
}
