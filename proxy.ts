import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type UserRole = "customer" | "admin" | "lab_partner";

const DASHBOARD_ROUTE_BY_ROLE: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  customer: "/dashboard/customer",
  lab_partner: "/dashboard/lab-partner",
};

// Public routes (no auth required)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/mfa",
  "/verify-otp",
  "/tests",
  "/panels",
  "/cart",
  "/find-lab-center",
  "/results",
  "/dashboard",
];

// Check if route is public
function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );
}

function decodeJwtPayload(token: string) {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;

    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = atob(padded);

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

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const userRole = getRoleFromToken(accessToken);

  // Redirect authenticated users away from the public home/dashboard root to their role dashboard
  if (accessToken && (pathname === "/" || pathname === "/dashboard")) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = getDashboardPath(userRole);
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  // Skip auth check for public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // If no access token, redirect to login
  if (!accessToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, allow access (no backend verification)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
