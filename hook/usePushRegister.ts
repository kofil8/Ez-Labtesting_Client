"use client";

import {
  getPushRegistrationAttemptKey,
  getStoredPushRegistration,
  requestPushPermissionAndToken,
  setStoredPushRegistration,
} from "@/lib/push";
import {
  registerPushToken,
  unregisterPushToken,
} from "@/lib/services/notifications.api";
import { useEffect } from "react";

export function usePushRegister(userId?: string) {
  useEffect(() => {
    if (!userId) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "denied") return;

    const attemptKey = getPushRegistrationAttemptKey(userId);
    if (sessionStorage.getItem(attemptKey) === "1") return;

    let cancelled = false;

    async function register() {
      sessionStorage.setItem(attemptKey, "1");

      try {
        const token = await requestPushPermissionAndToken();
        if (cancelled || !token) return;

        const storedRegistration = getStoredPushRegistration();
        if (
          storedRegistration?.token === token &&
          storedRegistration.userId === userId
        ) {
          return;
        }

        if (
          storedRegistration?.token &&
          storedRegistration.token !== token
        ) {
          try {
            await unregisterPushToken(storedRegistration.token);
          } catch (error) {
            console.warn("Failed to unregister stale push token", error);
          }
        }

        await registerPushToken({ token, platform: "web" });
        if (cancelled) return;

        setStoredPushRegistration({ token, userId: userId ?? null });
      } catch (err) {
        console.error("Push registration failed", err);
        sessionStorage.removeItem(attemptKey);
      }
    }

    void register();

    return () => {
      cancelled = true;
    };
  }, [userId]);
}
