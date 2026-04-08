import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export const REGISTERED_PUSH_TOKEN_KEY = "registered_push_token";
export const PUSH_ATTEMPT_KEY_PREFIX = "push_register_attempted";

export interface StoredPushRegistration {
  token: string;
  userId: string | null;
}

async function registerMessagingServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  try {
    await navigator.serviceWorker.ready;
  } catch {
    // Fall back to the registration we already have.
  }

  return registration;
}

export async function requestPushPermissionAndToken() {
  if (typeof window === "undefined" || !("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const serviceWorkerRegistration = await registerMessagingServiceWorker();
  if (!serviceWorkerRegistration) return null;

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.replace(
      /^"|"$/g,
      "",
    ),
    serviceWorkerRegistration,
  });

  return token;
}

export async function subscribeForegroundMessages(
  callback: (payload: any) => void,
) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  return onMessage(messaging, callback);
}

export function clearRegisteredPushTokenMarker() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(REGISTERED_PUSH_TOKEN_KEY);
}

export function getStoredPushRegistration(): StoredPushRegistration | null {
  if (typeof window === "undefined") return null;

  const rawValue = localStorage.getItem(REGISTERED_PUSH_TOKEN_KEY);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as Partial<StoredPushRegistration>;
    if (typeof parsed?.token === "string") {
      return {
        token: parsed.token,
        userId:
          typeof parsed.userId === "string" && parsed.userId.length > 0
            ? parsed.userId
            : null,
      };
    }
  } catch {
    return {
      token: rawValue,
      userId: null,
    };
  }

  return null;
}

export function setStoredPushRegistration(record: StoredPushRegistration) {
  if (typeof window === "undefined") return;

  localStorage.setItem(REGISTERED_PUSH_TOKEN_KEY, JSON.stringify(record));
}

export function getPushRegistrationAttemptKey(userId: string) {
  return `${PUSH_ATTEMPT_KEY_PREFIX}:${userId}`;
}

export function clearPushRegistrationAttempts() {
  if (typeof window === "undefined") return;

  for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = sessionStorage.key(index);
    if (key?.startsWith(PUSH_ATTEMPT_KEY_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  }
}
