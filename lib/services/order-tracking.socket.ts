import { handleAuthFailure, refreshSession } from "@/lib/auth/client";
import { getApiOrigin } from "@/lib/api/config";
import { io } from "socket.io-client";

type TrackingUpdate = {
  orderId: string;
  status: string;
  currentStep: number;
  steps: Array<{
    step: number;
    label: string;
    completed: boolean;
    completedAt?: string | null;
  }>;
  labLocation?: {
    name?: string;
    address?: string;
    phone?: string;
    hours?: string;
    lat?: number;
    lng?: number;
  } | null;
  requisitionUrl?: string | null;
  estimatedResultsDate?: string | null;
  lastUpdated?: string;
};

const getSocketBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_SOCKET_URL || getApiOrigin()
  ).replace(/\/api\/v1\/?$/, "");
};

type SubscriptionHandlers = {
  onTrackingUpdate: (update: TrackingUpdate) => void;
  onError?: (message: string) => void;
};

export async function subscribeToOrderTracking(
  orderId: string,
  handlers: SubscriptionHandlers,
): Promise<() => void> {
  if (!orderId) {
    throw new Error("orderId is required for tracking subscription");
  }

  let hasRetriedAfterRefresh = false;

  const socket = io(`${getSocketBaseUrl()}/orders`, {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });

  const handleConnect = () => {
    socket.emit("order:subscribe", { orderId });
  };

  const handleTrackingUpdate = (payload: TrackingUpdate) => {
    handlers.onTrackingUpdate(payload);
  };

  const handleOrderError = (payload?: { message?: string }) => {
    if (payload?.message) {
      handlers.onError?.(payload.message);
      return;
    }

    handlers.onError?.("Failed to receive order tracking update");
  };

  const handleConnectError = async (error: Error) => {
    if (hasRetriedAfterRefresh) {
      handlers.onError?.(error.message || "Realtime connection failed");
      await handleAuthFailure();
      return;
    }

    hasRetriedAfterRefresh = true;

    try {
      await refreshSession();
      socket.connect();
      return;
    } catch {
      await handleAuthFailure();
    }

    handlers.onError?.(error.message || "Realtime connection failed");
  };

  socket.on("connect", handleConnect);
  socket.on("order:tracking-update", handleTrackingUpdate);
  socket.on("order:error", handleOrderError);
  socket.on("connect_error", handleConnectError);

  if (socket.connected) {
    handleConnect();
  }

  return () => {
    socket.emit("order:unsubscribe", { orderId });
    socket.off("connect", handleConnect);
    socket.off("order:tracking-update", handleTrackingUpdate);
    socket.off("order:error", handleOrderError);
    socket.off("connect_error", handleConnectError);
    socket.disconnect();
  };
}
