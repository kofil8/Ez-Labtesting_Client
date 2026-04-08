import { clientFetch, getApiUrl } from "@/lib/api-client";

export type NotificationPlatform = "web" | "android" | "ios";

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

interface ApiEnvelope<T> {
  data?: T;
  message?: string;
  [key: string]: unknown;
}

interface RegisterPushTokenPayload {
  token: string;
  platform?: NotificationPlatform;
}

interface SendTestNotificationPayload {
  title: string;
  body: string;
}

interface FetchNotificationsParams {
  page?: number;
  limit?: number;
}

interface NotificationsListResult {
  data: NotificationItem[];
}

function buildJsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? { ...(value as object) } : {};
}

async function parseJson<T>(response: Response): Promise<ApiEnvelope<T>> {
  return response.json().catch(() => ({}));
}

async function assertOk<T>(
  response: Response,
  fallbackMessage: string,
): Promise<ApiEnvelope<T>> {
  const payload = await parseJson<T>(response);

  if (!response.ok) {
    throw new Error(payload.message || fallbackMessage);
  }

  return payload;
}

export function normalizeNotificationItem(value: unknown): NotificationItem {
  const item = toRecord(value);
  const nestedUser = toRecord(item.user);

  return {
    id:
      String(item.id ?? item._id ?? item.notificationId ?? "")
        .trim() || `notification-${Date.now()}`,
    userId: String(item.userId ?? nestedUser.id ?? item.recipientId ?? ""),
    type: String(item.type ?? item.category ?? "SYSTEM_ALERT"),
    title: String(item.title ?? item.subject ?? "Notification"),
    body: String(item.body ?? item.message ?? ""),
    data: toRecord(item.data),
    isRead: Boolean(item.isRead ?? item.read ?? false),
    createdAt: String(
      item.createdAt ?? item.created_at ?? new Date().toISOString(),
    ),
    readAt:
      typeof item.readAt === "string"
        ? item.readAt
        : typeof item.read_at === "string"
          ? item.read_at
          : undefined,
  };
}

function extractNotificationItems(payload: ApiEnvelope<unknown>) {
  const nestedData = toRecord(payload.data);
  const candidates = [
    payload.data,
    nestedData.notifications,
    payload.notifications,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map(normalizeNotificationItem);
    }
  }

  return [] as NotificationItem[];
}

async function requestActionVariants(
  requests: Array<{ method: "POST" | "PATCH"; url: string }>,
  fallbackMessage: string,
) {
  let lastError: Error | null = null;

  for (const request of requests) {
    const response = await clientFetch(request.url, {
      method: request.method,
      headers: buildJsonHeaders(),
    });

    const payload = await parseJson<unknown>(response);
    if (response.ok) {
      return;
    }

    if (response.status === 404 || response.status === 405) {
      lastError = new Error(payload.message || fallbackMessage);
      continue;
    }

    throw new Error(payload.message || fallbackMessage);
  }

  throw lastError || new Error(fallbackMessage);
}

export async function fetchNotifications(
  params: FetchNotificationsParams = {},
): Promise<NotificationsListResult> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 20));

  const response = await clientFetch(
    `${getApiUrl("/notifications")}?${searchParams.toString()}`,
    {
      method: "GET",
    },
  );

  const payload = await assertOk<unknown>(
    response,
    "Failed to fetch notifications",
  );

  return {
    data: extractNotificationItems(payload),
  };
}

export async function fetchUnreadCount(): Promise<number> {
  const response = await clientFetch(getApiUrl("/notifications/unread-count"), {
    method: "GET",
  });

  const payload = await assertOk<unknown>(
    response,
    "Failed to fetch unread notification count",
  );
  const nestedData = toRecord(payload.data);

  const unreadCount =
    nestedData.unreadCount ??
    nestedData.count ??
    payload.unreadCount ??
    payload.count ??
    0;

  return Number.isFinite(Number(unreadCount)) ? Number(unreadCount) : 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  const encodedId = encodeURIComponent(id);
  await requestActionVariants(
    [
      {
        method: "POST",
        url: getApiUrl(`/notifications/${encodedId}/read`),
      },
      {
        method: "PATCH",
        url: getApiUrl(`/notifications/${encodedId}/read`),
      },
    ],
    "Failed to mark notification as read",
  );
}

export async function markAllNotificationsRead(): Promise<void> {
  await requestActionVariants(
    [
      {
        method: "POST",
        url: getApiUrl("/notifications/read-all"),
      },
      {
        method: "PATCH",
        url: getApiUrl("/notifications/read-all"),
      },
      {
        method: "POST",
        url: getApiUrl("/notifications/mark-all-read"),
      },
      {
        method: "PATCH",
        url: getApiUrl("/notifications/mark-all-read"),
      },
    ],
    "Failed to mark all notifications as read",
  );
}

export async function registerPushToken(
  payload: RegisterPushTokenPayload,
): Promise<void> {
  const response = await clientFetch(getApiUrl("/notifications/register"), {
    method: "POST",
    headers: buildJsonHeaders(),
    body: JSON.stringify({
      token: payload.token,
      platform: payload.platform ?? "web",
    }),
  });

  await assertOk(response, "Failed to register push token");
}

export async function unregisterPushToken(token: string): Promise<void> {
  const response = await clientFetch(getApiUrl("/notifications/unregister"), {
    method: "POST",
    headers: buildJsonHeaders(),
    body: JSON.stringify({ token }),
  });

  await assertOk(response, "Failed to unregister push token");
}

export async function sendTestNotification(
  payload: SendTestNotificationPayload,
): Promise<unknown> {
  const response = await clientFetch(getApiUrl("/notifications/test-user"), {
    method: "POST",
    headers: buildJsonHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await assertOk<unknown>(
    response,
    "Failed to send test notification",
  );

  return data.data;
}

export class NotificationsApiService {
  static fetchNotifications = fetchNotifications;
  static fetchUnreadCount = fetchUnreadCount;
  static markNotificationRead = markNotificationRead;
  static markAllNotificationsRead = markAllNotificationsRead;
  static registerPushToken = registerPushToken;
  static unregisterPushToken = unregisterPushToken;
  static sendTestNotification = sendTestNotification;
  static normalizeNotificationItem = normalizeNotificationItem;
}
