import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase.config";

export const getPushToken = async () => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    });

    return token;
  } catch (err) {
    console.error("Push token error:", err);
    return null;
  }
};
