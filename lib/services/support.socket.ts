import { getApiOrigin } from "@/lib/api/config";
import { handleAuthFailure, refreshSession } from "@/lib/auth/client";
import { isAuthSessionErrorMessage } from "@/lib/auth/session-errors";
import { getCartDeviceId } from "@/lib/store/cart-store";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let socketToken: string | null = null;
let connectPromise: Promise<Socket> | null = null;

interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: "CUSTOMER" | "ADMIN" | "SYSTEM";
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  message: string;
  createdAt: string;
}

interface TicketUpdateData {
  ticketId: string;
  status: string;
  updatedAt: string;
}

interface TypingData {
  ticketId: string;
  userId: string;
  userEmail: string;
  isTyping: boolean;
}

type MessageHandler = (message: SupportMessage) => void;
type TicketUpdateHandler = (data: TicketUpdateData) => void;
type TypingHandler = (data: TypingData) => void;
type ErrorHandler = (error: { type: string; message: string }) => void;

const messageHandlers = new Set<MessageHandler>();
const ticketUpdateHandlers = new Set<TicketUpdateHandler>();
const typingHandlers = new Set<TypingHandler>();
const errorHandlers = new Set<ErrorHandler>();

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

export async function connectSupportSocket() {
  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    let hasRetriedAfterRefresh = false;

    if (socket && socket.connected && socketToken === "cookie-session") {
      return socket;
    }

    if (socket) {
      disconnectSupportSocket();
    }

    socket = io(getSocketBaseUrl(), {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: {
        deviceId: getCartDeviceId(),
      },
    });
    socketToken = "cookie-session";

    // Wait for actual connection before resolving
    await new Promise<void>((resolve, reject) => {
      if (socket!.connected) {
        resolve();
        return;
      }

      let timeout: ReturnType<typeof setTimeout>;

      const onConnect = () => {
        clearTimeout(timeout);
        socket!.off("connect_error", onError);
        resolve();
      };
      const onError = (err: Error) => {
        if (!isSocketAuthError(err)) {
          clearTimeout(timeout);
          socket!.off("connect", onConnect);
          reject(err);
        }
        // Auth errors: session refresh will reconnect, which fires "connect"
      };

      timeout = setTimeout(() => {
        socket!.off("connect", onConnect);
        socket!.off("connect_error", onError);
        reject(new Error("Support socket connection timed out"));
      }, 10000);

      socket!.once("connect", onConnect);
      socket!.once("connect_error", onError);
    });

    // Set up event listeners
    socket.on("support:new-message", (message: SupportMessage) => {
      messageHandlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error("Error in message handler:", error);
        }
      });
    });

    socket.on("support:ticket-updated", (data: TicketUpdateData) => {
      ticketUpdateHandlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error("Error in ticket update handler:", error);
        }
      });
    });

    socket.on("support:user-typing", (data: TypingData) => {
      typingHandlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error("Error in typing handler:", error);
        }
      });
    });

    socket.on("support:error", (error: { type: string; message: string }) => {
      console.error("Support socket error:", error);
      errorHandlers.forEach((handler) => {
        try {
          handler(error);
        } catch (err) {
          console.error("Error in error handler:", err);
        }
      });
    });

    socket.on("connect_error", async (error) => {
      if (!isSocketAuthError(error)) {
        console.error("Support socket connection failed", error);
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

    socket.on("connect", () => {
      console.log("Support socket connected");
    });

    socket.on("disconnect", (reason) => {
      console.log("Support socket disconnected:", reason);
    });

    return socket;
  })();

  try {
    return await connectPromise;
  } finally {
    connectPromise = null;
  }
}

export function getSupportSocket() {
  return socket;
}

export function disconnectSupportSocket() {
  if (socket) {
    // Remove all listeners
    socket.off("support:new-message");
    socket.off("support:ticket-updated");
    socket.off("support:user-typing");
    socket.off("support:error");
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");

    socket.disconnect();
    socket = null;
    socketToken = null;

    // Clear all handlers
    messageHandlers.clear();
    ticketUpdateHandlers.clear();
    typingHandlers.clear();
    errorHandlers.clear();
  }
}

/**
 * Join a ticket room for real-time updates
 */
export async function joinTicket(ticketId: string): Promise<void> {
  const socket = await connectSupportSocket();
  socket.emit("support:join-ticket", ticketId);
}

/**
 * Leave a ticket room
 */
export async function leaveTicket(ticketId: string): Promise<void> {
  if (!socket) return;
  socket.emit("support:leave-ticket", ticketId);
}

/**
 * Send a message to a ticket
 */
export async function sendMessage(
  ticketId: string,
  message: string,
): Promise<void> {
  const socket = await connectSupportSocket();
  socket.emit("support:send-message", { ticketId, message });
}

/**
 * Send typing indicator
 */
export async function sendTypingIndicator(
  ticketId: string,
  isTyping: boolean,
): Promise<void> {
  if (!socket) return;
  socket.emit("support:typing", { ticketId, isTyping });
}

/**
 * Subscribe to new messages
 */
export function onNewMessage(handler: MessageHandler) {
  messageHandlers.add(handler);

  return () => {
    messageHandlers.delete(handler);
  };
}

/**
 * Subscribe to ticket updates
 */
export function onTicketUpdate(handler: TicketUpdateHandler) {
  ticketUpdateHandlers.add(handler);

  return () => {
    ticketUpdateHandlers.delete(handler);
  };
}

/**
 * Subscribe to typing indicators
 */
export function onTyping(handler: TypingHandler) {
  typingHandlers.add(handler);

  return () => {
    typingHandlers.delete(handler);
  };
}

/**
 * Subscribe to errors
 */
export function onError(handler: ErrorHandler) {
  errorHandlers.add(handler);

  return () => {
    errorHandlers.delete(handler);
  };
}

/**
 * Check if socket is connected
 */
export function isSupportSocketConnected(): boolean {
  return socket?.connected ?? false;
}
