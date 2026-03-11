import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type UserRole =
  | "customer"
  | "admin"
  | "lab_partner"
  | "super_admin"
  | "CUSTOMER"
  | "ADMIN"
  | "LAB_PARTNER"
  | "SUPER_ADMIN";

const DASHBOARD_ROUTE_BY_ROLE: Record<string, string> = {
  // lowercase
  customer: "/dashboard/customer",
  admin: "/dashboard/admin",
  lab_partner: "/dashboard/lab-partner",
  super_admin: "/dashboard/superadmin",
  // uppercase (prisma enum)
  CUSTOMER: "/dashboard/customer",
  ADMIN: "/dashboard/admin",
  LAB_PARTNER: "/dashboard/lab-partner",
  SUPER_ADMIN: "/dashboard/superadmin",
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
  "/tests",
  "/panels",
  "/items",
  "/find-lab-center",
  "/verify-otp",
  "/cart",
  "/results",
  "/how-it-works",
  "/faqs",
  "/privacy-policy",
  "/terms-of-service",
  "/hipaa-notice",
  "/accessibility",
  "/help-center",
  "/test-preparation",
  "/lab-partner",
  // Allow service worker and messaging scope without auth so push can register
  "/firebase-messaging-sw.js",
  "/firebase-cloud-messaging-push-scope",
];

// Protected routes (require authentication)
const PROTECTED_PREFIXES = ["/checkout", "/orders", "/payment"];

const CUSTOMER_ONLY_PUBLIC_PREFIXES = ["/tests", "/panels", "/cart"];

// Role-based route access control
const ROLE_ROUTE_GUARDS: { matcher: RegExp; allowedRoles: UserRole[] }[] = [
  {
    matcher: /^\/tests(\/.*)?$/,
    allowedRoles: ["customer", "CUSTOMER"],
  },
  {
    matcher: /^\/panels(\/.*)?$/,
    allowedRoles: ["customer", "CUSTOMER"],
  },
  {
    matcher: /^\/cart(\/.*)?$/,
    allowedRoles: ["customer", "CUSTOMER"],
  },
  {
    matcher: /^\/checkout(\/.*)?$/,
    allowedRoles: ["customer", "CUSTOMER"],
  },
  {
    matcher: /^\/dashboard\/superadmin(\/.*)?$/,
    allowedRoles: ["super_admin", "SUPER_ADMIN"],
  },
  {
    matcher: /^\/dashboard\/admin(\/.*)?$/,
    allowedRoles: ["admin", "ADMIN"],
  },
  {
    matcher: /^\/dashboard\/lab-partner(\/.*)?$/,
    allowedRoles: ["lab_partner", "LAB_PARTNER"],
  },
  {
    matcher: /^\/dashboard\/customer(\/.*)?$/,
    allowedRoles: ["customer", "CUSTOMER"],
  },
  {
    matcher: /^\/find-lab-center(\/.*)?$/,
    allowedRoles: ["customer", "CUSTOMER"],
  },
];

// Check if route is public
function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

// Check if route requires authentication
function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isCustomerOnlyPublicPath(pathname: string) {
  return CUSTOMER_ONLY_PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
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
    payload?.role ||
    payload?.user?.role ||
    payload?.data?.role ||
    payload?.userRole ||
    null;

  return normalizeRole(maybeRole);
}

function getDashboardPath(role: UserRole | null) {
  if (!role) return DASHBOARD_ROUTE_BY_ROLE.customer;
  return DASHBOARD_ROUTE_BY_ROLE[role] || DASHBOARD_ROUTE_BY_ROLE.customer;
}

function normalizeRole(role: unknown): UserRole | null {
  if (!role) return null;
  const raw = String(role).trim();
  const normalized = raw.toLowerCase().replace(/[-\s]+/g, "_");

  // Check exact, normalized, and uppercased-normalized
  const candidates = [raw, normalized, normalized.toUpperCase()];

  for (const candidate of candidates) {
    if (DASHBOARD_ROUTE_BY_ROLE[candidate]) {
      return candidate as UserRole;
    }
  }

  return null;
}

function isRoleAllowed(pathname: string, role: UserRole | null) {
  // If no matching guard, allow (non-dashboard routes will be handled by app auth)
  const guard = ROLE_ROUTE_GUARDS.find((g) => g.matcher.test(pathname));
  if (!guard) return true;
  if (!role) return false;
  return guard.allowedRoles.includes(role);
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  // Bypass auth for development if enabled
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

  // Extract role directly from JWT (authoritative source)
  const userRole = getRoleFromToken(accessToken);

  // Reduced logging - only log in development and only non-asset requests
  if (
    process.env.NODE_ENV === "development" &&
    !pathname.startsWith("/_next")
  ) {
    console.log(
      `[PROXY] Path: ${pathname}, Token: ${accessToken ? "exists" : "none"}, Role: ${userRole}`,
    );
  }

  // IMPORTANT: Check protected paths first (checkout, orders, payment)
  if (isProtectedPath(pathname)) {
    if (!bypassAuth && !accessToken) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", `${pathname}${search || ""}`);
      console.log(
        `[PROXY] PROTECTED: Redirecting ${pathname} to login (from: ${pathname}${search})`,
      );
      return NextResponse.redirect(loginUrl);
    }

    if (!bypassAuth && !isRoleAllowed(pathname, userRole)) {
      if (!userRole) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("from", `${pathname}${search || ""}`);
        return NextResponse.redirect(loginUrl);
      }

      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = getDashboardPath(userRole);
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    // Checkout is customer-only even when authenticated
    if (pathname === "/checkout" || pathname.startsWith("/checkout/")) {
      if (!userRole) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("from", `${pathname}${search || ""}`);
        return NextResponse.redirect(loginUrl);
      }

      if (!isRoleAllowed(pathname, userRole)) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = getDashboardPath(userRole);
        redirectUrl.search = "";
        return NextResponse.redirect(redirectUrl);
      }
    }

    // If token exists or bypass is enabled, allow through
    return NextResponse.next();
  }

  // If no access token exists, redirect authenticated routes to login
  if (!accessToken) {
    // If trying to access authenticated route, redirect to login
    if (!isPublicPath(pathname) && pathname !== "/dashboard") {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", `${pathname}${search}`);
      console.log(
        `[PROXY] NO TOKEN: Redirecting ${pathname} to login (from: ${pathname}${search})`,
      );
      return NextResponse.redirect(loginUrl);
    }

    // For public routes, allow through
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    // Default: redirect to login
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from the public home/dashboard root to their role dashboard
  if (pathname === "/" || pathname === "/dashboard") {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = getDashboardPath(userRole);
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  // Customer-only commerce routes are public for guests,
  // but restricted for authenticated non-customer roles.
  if (
    !bypassAuth &&
    accessToken &&
    isCustomerOnlyPublicPath(pathname) &&
    !isRoleAllowed(pathname, userRole)
  ) {
    if (!userRole) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", `${pathname}${search || ""}`);
      return NextResponse.redirect(loginUrl);
    }

    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = getDashboardPath(userRole);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  // Skip auth check for public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Enforce role-based dashboard access
  if (!isRoleAllowed(pathname, userRole)) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[PROXY] BLOCKING: ${pathname} for role ${userRole}, redirecting to ${getDashboardPath(userRole)}`,
      );
    }
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = getDashboardPath(userRole);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (
    process.env.NODE_ENV === "development" &&
    !pathname.startsWith("/_next")
  ) {
    console.log(`[PROXY] ALLOWING: ${pathname} for role ${userRole}`);
  }
  // Token exists and role is allowed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|public).*)"],
};
