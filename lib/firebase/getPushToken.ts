import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase.config";

export const getPushToken = async () => {
  try {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    });

    return token;
  } catch (err) {
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code?: unknown }).code)
        : "";

    if (
      code === "messaging/permission-blocked" ||
      code === "messaging/permission-default"
    ) {
      return null;
    }

    console.error("Push token error:", err);
    return null;
  }
};
