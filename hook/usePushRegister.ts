"use client";

import { requestPushPermissionAndToken } from "@/lib/push";
import { useEffect } from "react";

const REGISTERED_PUSH_TOKEN_KEY = "registered_push_token";
const PUSH_ATTEMPT_KEY_PREFIX = "push_register_attempted";

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:7001/api/v1"
  );
}

export function usePushRegister(userId?: string, accessToken?: string) {
  useEffect(() => {
    if (!userId) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "denied") return;

    const attemptKey = `${PUSH_ATTEMPT_KEY_PREFIX}:${userId}`;
    if (sessionStorage.getItem(attemptKey) === "1") return;

    async function register() {
      sessionStorage.setItem(attemptKey, "1");

      try {
        const token = await requestPushPermissionAndToken();
        if (!token) return;

        const registeredToken = localStorage.getItem(REGISTERED_PUSH_TOKEN_KEY);
        if (registeredToken === token) return;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (accessToken && accessToken !== "authenticated") {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        const response = await fetch(
          `${getApiBaseUrl()}/notifications/register`,
          {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify({ token, platform: "web" }),
          },
        );

        if (!response.ok) {
          throw new Error(`Push token registration failed: ${response.status}`);
        }

        localStorage.setItem(REGISTERED_PUSH_TOKEN_KEY, token);
      } catch (err) {
        console.error("Push registration failed", err);
      }
    }

    register();
  }, [userId, accessToken]);
}
