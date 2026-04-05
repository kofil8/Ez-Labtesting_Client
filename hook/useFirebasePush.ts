"use client";

import { getFirebaseMessaging } from "@/lib/firebase/firebase.config";
import { registerFirebaseSW } from "@/lib/firebase/register-sw";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFirebasePush = () => {
  // Register service worker
  useEffect(() => {
    registerFirebaseSW();
  }, []);

  // Foreground notifications
  useEffect(() => {
    const listen = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        console.log("🔥 Foreground notification received:", payload);
        const title = payload.notification?.title || "Notification";
        const body = payload.notification?.body;

        // Show toast for immediate visibility
        toast(title, { description: body });

        // Persist into notifications store for bell/dropdown
        try {
          const messageId = (payload as any)?.messageId as string | undefined;
          useNotificationsStore.getState().addNotification({
            id: messageId,
            title,
            body,
            data: payload.data as Record<string, unknown> | undefined,
          });
        } catch (e) {
          console.error("Failed to add notification to store", e);
        }
      });
    };

    listen();
  }, []);
};
