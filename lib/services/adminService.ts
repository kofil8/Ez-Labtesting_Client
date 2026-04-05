import { clientFetch, getApiUrl } from "@/lib/api-client";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export type AdminRecord = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: AdminRole;
  isActive: boolean;
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
  email: string;
  password: string;
  role: AdminRole;
};

export type UpdateAdminPayload = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
}>;

async function handleJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = data?.message || "Something went wrong";
    const error: any = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data.data as T;
}

export async function getAdmins(
  page = 1,
  limit = 10,
): Promise<AdminListResponse> {
  const url = getApiUrl(`/superadmin/admins?page=${page}&limit=${limit}`);
  const res = await clientFetch(url, { method: "GET" });
  return handleJsonResponse<AdminListResponse>(res);
}

export async function createAdmin(
  payload: CreateAdminPayload,
): Promise<AdminRecord> {
  const url = getApiUrl("/superadmin/admins");
  const res = await clientFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<AdminRecord>(res);
}

export async function updateAdmin(
  id: string,
  payload: UpdateAdminPayload,
): Promise<AdminRecord> {
  const url = getApiUrl(`/superadmin/admins/${id}`);
  const res = await clientFetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<AdminRecord>(res);
}

export async function deleteAdmin(id: string): Promise<void> {
  const url = getApiUrl(`/superadmin/admins/${id}`);
  const res = await clientFetch(url, { method: "DELETE" });
  await handleJsonResponse(res);
}

export async function setTemporaryPassword(
  adminId: string,
): Promise<{ temporaryPassword: string }> {
  const url = getApiUrl(`/superadmin/admins/${adminId}/temporary-password`);
  const res = await clientFetch(url, { method: "POST" });
  const data = await handleJsonResponse<{
    adminId: string;
    temporaryPassword: string;
  }>(res);
  return { temporaryPassword: data.temporaryPassword };
}
