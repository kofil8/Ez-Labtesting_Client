import { handleAuthFailure, refreshSession } from "@/lib/auth/client";
import { isAuthSessionErrorMessage } from "@/lib/auth/session-errors";
import { getApiOrigin } from "@/lib/api/config";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let socketToken: string | null = null;
let connectPromise: Promise<Socket> | null = null;

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

export function disconnectNotificationSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    socketToken = null;
  }
}
