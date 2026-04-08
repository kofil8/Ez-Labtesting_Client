import { getAccessTokenFromServer } from "@/app/actions/get-token";
import { clientRefreshToken } from "@/lib/token-utils";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let socketToken: string | null = null;
let connectPromise: Promise<Socket> | null = null;

function getSocketBaseUrl() {
  const apiUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:7001");

  return apiUrl.replace(/\/api\/v1\/?$/, "");
}

async function getNotificationAuthToken() {
  let token = (await getAccessTokenFromServer())?.token;

  if (!token) {
    try {
      await clientRefreshToken();
      token = (await getAccessTokenFromServer())?.token;
    } catch {
      token = null;
    }
  }

  if (!token) {
    throw new Error("Authentication token is required for notifications");
  }

  return token;
}

export async function connectNotificationSocket() {
  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    const token = await getNotificationAuthToken();

    if (socket && socketToken === token) {
      return socket;
    }

    if (socket) {
      disconnectNotificationSocket();
    }

    socket = io(getSocketBaseUrl(), {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token },
    });
    socketToken = token;

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
