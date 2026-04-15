export type NormalizedUserRole =
  | "customer"
  | "admin"
  | "lab_partner"
  | "super_admin";

export type ApiEnvelope<T = unknown> = {
  data?: T;
  message?: string;
  error?: string;
  errorMessages?: Array<{ message?: string }>;
};

export type RegisterRequestInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export type ResetPasswordInput = {
  email: string;
  otp: string;
  password: string;
};

export const DEFAULT_DASHBOARD_ROUTE = "/dashboard/customer";

export const DASHBOARD_ROUTE_BY_ROLE: Record<NormalizedUserRole, string> = {
  admin: "/dashboard/admin",
  customer: DEFAULT_DASHBOARD_ROUTE,
  lab_partner: "/dashboard/lab-partner",
  super_admin: "/dashboard/superadmin",
};

function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function normalizeUserRole(
  role: unknown,
): NormalizedUserRole | null {
  if (!role) {
    return null;
  }

  const normalized = String(role).trim().toLowerCase().replace(/[-\s]+/g, "_");

  if (normalized in DASHBOARD_ROUTE_BY_ROLE) {
    return normalized as NormalizedUserRole;
  }

  return null;
}

export function getDashboardRouteForRole(role: unknown): string {
  const normalizedRole = normalizeUserRole(role);
  return normalizedRole
    ? DASHBOARD_ROUTE_BY_ROLE[normalizedRole]
    : DEFAULT_DASHBOARD_ROUTE;
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof atob === "function") {
    return atob(padded);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }

  throw new Error("No base64 decoder available");
}

export function decodeJwtPayload(token: string) {
  try {
    const payloadSegment = token.split(".")[1];

    if (!payloadSegment) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payloadSegment));
  } catch {
    return null;
  }
}

export function extractRoleFromToken(
  token?: string,
): NormalizedUserRole | null {
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  const maybeRole =
    payload?.role ||
    payload?.user?.role ||
    payload?.data?.role ||
    payload?.userRole ||
    null;

  return normalizeUserRole(maybeRole);
}

export function extractApiMessage(
  payload: ApiEnvelope | null | undefined,
  fallback: string,
): string {
  const nestedMessage =
    Array.isArray(payload?.errorMessages) && payload.errorMessages.length > 0
      ? payload.errorMessages[0]?.message
      : undefined;

  return payload?.message || payload?.error || nestedMessage || fallback;
}

export function buildRegisterRequest(input: RegisterRequestInput) {
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    password: input.password,
    phoneNumber: input.phone.replace(/\D/g, ""),
    ...(trimOptional(input.gender) ? { gender: trimOptional(input.gender) } : {}),
    ...(trimOptional(input.dateOfBirth)
      ? { dateOfBirth: trimOptional(input.dateOfBirth) }
      : {}),
    ...(trimOptional(input.addressLine1)
      ? { addressLine1: trimOptional(input.addressLine1) }
      : {}),
    ...(trimOptional(input.addressLine2)
      ? { addressLine2: trimOptional(input.addressLine2) }
      : {}),
    ...(trimOptional(input.city) ? { city: trimOptional(input.city) } : {}),
    ...(trimOptional(input.state)
      ? { state: trimOptional(input.state)?.toUpperCase() }
      : {}),
    ...(trimOptional(input.zipCode)
      ? { zipCode: trimOptional(input.zipCode) }
      : {}),
  };
}

export function buildResetPasswordRequest(input: ResetPasswordInput) {
  return {
    email: input.email.trim(),
    otp: input.otp.trim(),
    newPassword: input.password,
  };
}
