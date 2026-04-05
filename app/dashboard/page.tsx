import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Enable debug logging for development
const DEBUG = process.env.NODE_ENV === "development";

type UserRole =
  | "customer"
  | "admin"
  | "lab_partner"
  | "super_admin"
  | "SUPER_ADMIN"
  | "ADMIN"
  | "LAB_PARTNER"
  | "CUSTOMER";

const DASHBOARD_ROUTE_BY_ROLE: Record<string, string> = {
  // Lowercase variants
  admin: "/dashboard/admin",
  customer: "/dashboard/customer",
  lab_partner: "/dashboard/lab-partner",
  super_admin: "/dashboard/superadmin",
  // Uppercase variants
  ADMIN: "/dashboard/admin",
  CUSTOMER: "/dashboard/customer",
  LAB_PARTNER: "/dashboard/lab-partner",
  SUPER_ADMIN: "/dashboard/superadmin",
};

function decodeJwtPayload(token: string) {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;

    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = Buffer.from(padded, "base64").toString("utf-8");

    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decode token payload", error);
    return null;
  }
}

function getRoleFromToken(token?: string): UserRole | null {
  if (!token) return null;

  const payload = decodeJwtPayload(token);

  // Try multiple possible locations for the role in JWT payload
  const maybeRole =
    payload?.role ||
    payload?.user?.role ||
    payload?.data?.role ||
    payload?.userRole ||
    null;

  const normalizedRole = normalizeRole(maybeRole);

  if (!normalizedRole) {
    DEBUG && console.log("[DEBUG] Role not recognized in mapping", maybeRole);
    return null;
  }

  DEBUG && console.log("[DEBUG] Role recognized:", normalizedRole);
  return normalizedRole;
}

function getDashboardPath(role: UserRole | null) {
  DEBUG && console.log("[DEBUG] getDashboardPath called with role:", role);

  if (!role) {
    DEBUG &&
      console.log(
        "[DEBUG] No role provided, defaulting to /dashboard/customer",
      );
    return "/dashboard/customer";
  }

  const path = DASHBOARD_ROUTE_BY_ROLE[role];

  if (path) {
    DEBUG && console.log("[DEBUG] Found path for role:", role, "->", path);
    return path;
  }

  DEBUG &&
    console.log(
      "[DEBUG] Path not found for role:",
      role,
      "defaulting to /dashboard/customer",
    );
  return "/dashboard/customer";
}

export default async function DashboardIndexPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  DEBUG &&
    console.log("[DEBUG] Dashboard Page - Access Token exists:", !!accessToken);

  if (!accessToken) {
    DEBUG && console.log("[DEBUG] No access token found, redirecting to login");
    redirect("/login");
  }

  // Extract role directly from JWT (authoritative source)
  const userRole = getRoleFromToken(accessToken);
  DEBUG && console.log("[DEBUG] User role from JWT:", userRole);

  const dashboardPath = getDashboardPath(userRole);

  DEBUG && console.log("[DEBUG] Final dashboard path:", dashboardPath);
  redirect(dashboardPath);
}

function normalizeRole(role: unknown): UserRole | null {
  if (!role) return null;
  const raw = String(role).trim();
  const normalized = raw.toLowerCase().replace(/[-\s]+/g, "_");
  const candidates = [raw, normalized, normalized.toUpperCase()];

  for (const candidate of candidates) {
    if (DASHBOARD_ROUTE_BY_ROLE[candidate]) {
      return candidate as UserRole;
    }
  }

  return null;
}
