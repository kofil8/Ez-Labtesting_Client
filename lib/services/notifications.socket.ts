import { handleAuthFailure, refreshSession } from "@/lib/auth/client";
import { isAuthSessionErrorMessage } from "@/lib/auth/session-errors";
import { getApiOrigin } from "@/lib/api/config";
import { getCartDeviceId } from "@/lib/store/cart-store";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let socketToken: string | null = null;
let connectPromise: Promise<Socket> | null = null;

const MANUAL_REVIEW_QUEUE_EVENT = "order:manual-review-queue-update";

export interface ManualReviewQueueUpdatePayload {
  orderId: string;
  status: string;
  manualReviewRequired: boolean;
  updatedAt: string;
}

function isSocketAuthError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  return isAuthSessionErrorMessage(message);
}

function getSocketBaseUrl() {
  return (process.env.NEXT_PUBLIC_SOCKET_URL || getApiOrigin()).replace(
    /\/api\/v1\/?$/,
    "",
  );
}

export async function connectNotificationSocket() {
  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    let hasRetriedAfterRefresh = false;

    if (socket && socketToken === "cookie-session") {
      return socket;
    }

    if (socket) {
      disconnectNotificationSocket();
    }

    socket = io(getSocketBaseUrl(), {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        deviceId: getCartDeviceId(),
      },
    });
    socketToken = "cookie-session";

    socket.on("connect_error", async (error) => {
      if (!isSocketAuthError(error)) {
        console.error("Notification socket connection failed", error);
        return;
      }

      if (hasRetriedAfterRefresh) {
        await handleAuthFailure();
        return;
      }

      hasRetriedAfterRefresh = true;

      try {
        await refreshSession();
        socket?.connect();
      } catch {
        await handleAuthFailure();
      }
    });

    return socket;
  })();

  try {
    return await connectPromise;
  } finally {
    connectPromise = null;
  }
}

export function getNotificationSocket() {
  return socket;
}

export function subscribeToManualReviewQueueUpdates(
  handler: (payload: ManualReviewQueueUpdatePayload) => void,
) {
  let active = true;
  let subscribedSocket: Socket | null = null;

  void connectNotificationSocket().then((nextSocket) => {
    if (!active) {
      return;
    }

    subscribedSocket = nextSocket;
    subscribedSocket.on(MANUAL_REVIEW_QUEUE_EVENT, handler);
  });

  return () => {
    active = false;
    subscribedSocket?.off(MANUAL_REVIEW_QUEUE_EVENT, handler);
  };
}

export function disconnectNotificationSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    socketToken = null;
  }
}
