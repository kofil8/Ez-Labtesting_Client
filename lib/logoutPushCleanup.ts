import { unregisterPushToken } from "@/lib/services/notifications.api";
import {
  clearRegisteredPushTokenMarker,
  getStoredPushRegistration,
} from "@/lib/push";

export async function cleanupPushOnLogout() {
  if (typeof window === "undefined") return;

  const storedRegistration = getStoredPushRegistration();

  try {
    if (storedRegistration?.token) {
      await unregisterPushToken(storedRegistration.token);
    }
  } catch (error) {
    console.error("Failed to unregister push token on logout", error);
  } finally {
    clearRegisteredPushTokenMarker();
  }
}
