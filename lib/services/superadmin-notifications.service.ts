import { clientFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-contracts/endpoints";

export type SuperAdminNotificationRole = "CUSTOMER" | "LAB_PARTNER" | "ADMIN";

export type SuperAdminNotificationPayload = {
  title: string;
  body: string;
  targetRoles: SuperAdminNotificationRole[];
  data?: Record<string, unknown>;
};

export type SuperAdminNotificationBroadcastResult = {
  success?: boolean;
  totalUsers?: number;
  totalQueued?: number;
  failedCount?: number;
  targetRoles?: SuperAdminNotificationRole[];
  type?: string;
};

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  [key: string]: unknown;
};

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

export async function sendCustomSuperAdminNotification(
  payload: SuperAdminNotificationPayload,
): Promise<SuperAdminNotificationBroadcastResult> {
  const response = await clientFetch(
    API_ENDPOINTS.SUPERADMIN.CUSTOM_NOTIFICATION_BROADCAST,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const result = await assertOk<SuperAdminNotificationBroadcastResult>(
    response,
    "Failed to send notification",
  );

  return result.data ?? {};
}
