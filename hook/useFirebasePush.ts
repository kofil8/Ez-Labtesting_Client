"use client";

import { useEffect } from "react";
import { getFirebaseMessaging } from "@/lib/firebase/firebase.config";
import { onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { registerFirebaseSW } from "@/lib/firebase/register-sw";

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

        toast(payload.notification?.title || "Notification", {
          description: payload.notification?.body,
        });
      });
    };

    listen();
  }, []);

  // Request permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
};
