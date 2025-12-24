import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type UserRole = "customer" | "admin" | "lab_partner";

const DASHBOARD_ROUTE_BY_ROLE: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  customer: "/dashboard/customer",
  lab_partner: "/dashboard/lab-partner",
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
  const maybeRole =
    payload?.role || payload?.user?.role || payload?.data?.role || null;

  if (
    maybeRole === "customer" ||
    maybeRole === "admin" ||
    maybeRole === "lab_partner"
  ) {
    return maybeRole;
  }

  return null;
}

function getDashboardPath(role: UserRole | null) {
  return role
    ? DASHBOARD_ROUTE_BY_ROLE[role]
    : DASHBOARD_ROUTE_BY_ROLE.customer;
}

export default function DashboardIndexPage() {
  const accessToken = cookies().get("accessToken")?.value;
  const userRole = getRoleFromToken(accessToken);

  if (!accessToken) {
    redirect("/login");
  }

  redirect(getDashboardPath(userRole));
}
