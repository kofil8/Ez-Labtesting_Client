"use server";

import { authenticatedFetch } from "@/lib/api-helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

// Types
export type AdminRole = "ADMIN" | "LAB_PARTNER" | "SUPER_ADMIN";
export type ManagedAdminRole = Exclude<AdminRole, "SUPER_ADMIN">;
export type AccountStatus = "ACTIVE" | "DISABLED" | "BLOCKED";

export type AdminRecord = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
  role: AdminRole;
  status: AccountStatus;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminListResponse = {
  admins: AdminRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type CreateAdminPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: ManagedAdminRole;
};

export type UpdateAdminPayload = Partial<{
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: ManagedAdminRole;
  status: AccountStatus;
}>;

type ActionResult<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};

/**
 * Server-side fetch helper for superadmin endpoints
 * Handles authentication via cookies
 */
async function serverFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await authenticatedFetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    return response;
  } catch (error: any) {
    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      throw new Error(
        "Unable to connect to server. The server may be down. Please try again later.",
      );
    }
    throw new Error(
      error.message ||
        "Network error occurred. Please check your connection and try again.",
    );
  }
}

/**
 * Parse JSON response and handle errors
 */
async function handleJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = data?.message || "Something went wrong";
    throw new Error(message);
  }

  return data.data as T;
}

/**
 * Get paginated list of admins
 */
export async function getAdminsAction(
  page = 1,
  limit = 10,
): Promise<ActionResult<AdminListResponse>> {
  try {
    const url = `${API_BASE_URL}/superadmin/admins?page=${page}&limit=${limit}`;
    const response = await serverFetch(url, { method: "GET" });
    const data = await handleJsonResponse<AdminListResponse>(response);

    return { ok: true, data };
  } catch (error: any) {
    console.error("getAdminsAction error:", error);
    return {
      ok: false,
      message: error.message || "Failed to fetch admins",
    };
  }
}

/**
 * Create a new admin
 */
export async function createAdminAction(
  payload: CreateAdminPayload,
): Promise<ActionResult<AdminRecord>> {
  try {
    const url = `${API_BASE_URL}/superadmin/admins`;
    const response = await serverFetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await handleJsonResponse<AdminRecord>(response);

    return { ok: true, data };
  } catch (error: any) {
    console.error("createAdminAction error:", error);
    return {
      ok: false,
      message: error.message || "Failed to create admin",
    };
  }
}

/**
 * Update an existing admin
 */
export async function updateAdminAction(
  id: string,
  payload: UpdateAdminPayload,
): Promise<ActionResult<AdminRecord>> {
  try {
    const url = `${API_BASE_URL}/superadmin/admins/${id}`;
    const response = await serverFetch(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const data = await handleJsonResponse<AdminRecord>(response);

    return { ok: true, data };
  } catch (error: any) {
    console.error("updateAdminAction error:", error);
    return {
      ok: false,
      message: error.message || "Failed to update admin",
    };
  }
}

/**
 * Delete an admin
 */
export async function deleteAdminAction(
  id: string,
): Promise<ActionResult<void>> {
  try {
    const url = `${API_BASE_URL}/superadmin/admins/${id}`;
    const response = await serverFetch(url, { method: "DELETE" });
    await handleJsonResponse(response);

    return { ok: true };
  } catch (error: any) {
    console.error("deleteAdminAction error:", error);
    return {
      ok: false,
      message: error.message || "Failed to delete admin",
    };
  }
}

/**
 * Set a temporary password for an admin
 */
export async function setTemporaryPasswordAction(
  adminId: string,
): Promise<ActionResult<{ temporaryPassword: string }>> {
  try {
    const url = `${API_BASE_URL}/superadmin/admins/${adminId}/temporary-password`;
    const response = await serverFetch(url, { method: "POST" });
    const data = await handleJsonResponse<{
      adminId: string;
      temporaryPassword: string;
    }>(response);

    return {
      ok: true,
      data: { temporaryPassword: data.temporaryPassword },
    };
  } catch (error: any) {
    console.error("setTemporaryPasswordAction error:", error);
    return {
      ok: false,
      message: error.message || "Failed to set temporary password",
    };
  }
}
