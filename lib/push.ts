import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export async function requestPushPermissionAndToken() {
  if (typeof window === "undefined") return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
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
