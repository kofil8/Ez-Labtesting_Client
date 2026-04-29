"use client";

import {
  getPushRegistrationAttemptKey,
  getStoredPushRegistration,
  requestPushPermissionAndToken,
  setStoredPushRegistration,
} from "@/lib/push";
import { registerPushToken } from "@/lib/services/notifications.api";
import { useEffect } from "react";

export function usePushRegister(userId?: string) {
  useEffect(() => {
    if (!userId) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "denied") return;

    const currentUserId = userId;
    const attemptKey = getPushRegistrationAttemptKey(currentUserId);
    if (sessionStorage.getItem(attemptKey) === "1") return;

    async function register() {
      sessionStorage.setItem(attemptKey, "1");

      try {
        const token = await requestPushPermissionAndToken();
        if (!token) return;

        const storedRegistration = getStoredPushRegistration();
        if (
          storedRegistration?.token === token &&
          storedRegistration.userId === currentUserId
        ) {
          return;
        }

        await registerPushToken({ token, platform: "web" });
        setStoredPushRegistration({ token, userId: currentUserId });
      } catch (err) {
        console.error("Push registration failed", err);
      }
    }

    register();
  }, [userId]);
}
