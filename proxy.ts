import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  decodeJwtPayload,
  getDashboardRouteForRole,
  normalizeUserRole,
  NormalizedUserRole,
  verifyJwtToken,
} from "@/lib/auth/shared";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=(self), payment=(self)",
} as const;

// Public routes (no auth required)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/mfa",
  "/tests",
  "/panels",
  "/items",
  "/find-lab-center",
  "/verify-otp",
  "/cart",
  "/how-it-works",
  "/faqs",
  "/privacy-policy",
  "/terms-of-service",
  "/hipaa-notice",
  "/accessibility",
  "/help-center",
  "/lab-partners",
  "/test-preparation",
  "/firebase-messaging-sw.js",
  "/firebase-messaging-config.js",
  "/firebase-cloud-messaging-push-scope",
];

const PUBLIC_FILE_ROUTES = new Set(["/robots.txt", "/sitemap.xml"]);

// Protected routes (require authentication)
const PROTECTED_PREFIXES = ["/checkout", "/orders", "/payment"];

const CUSTOMER_ONLY_PUBLIC_PREFIXES = ["/tests", "/panels", "/cart"];

// Role-based route access control
const ROLE_ROUTE_GUARDS: {
  matcher: RegExp;
  allowedRoles: NormalizedUserRole[];
}[] = [
  {
    matcher: /^\/tests(\/.*)?$/,
    allowedRoles: ["customer"],
  },
  {
    matcher: /^\/panels(\/.*)?$/,
    allowedRoles: ["customer"],
  },
  {
    matcher: /^\/cart(\/.*)?$/,
    allowedRoles: ["customer"],
  },
  {
    matcher: /^\/checkout(\/.*)?$/,
    allowedRoles: ["customer"],
  },
  {
    matcher: /^\/dashboard\/superadmin(\/.*)?$/,
    allowedRoles: ["super_admin"],
  },
  {
    matcher: /^\/dashboard\/admin(\/.*)?$/,
    allowedRoles: ["admin"],
  },
  {
    matcher: /^\/dashboard\/lab-partner(\/.*)?$/,
    allowedRoles: ["lab_partner"],
  },
  {
    matcher: /^\/dashboard\/customer(\/.*)?$/,
    allowedRoles: ["customer"],
  },
  {
    matcher: /^\/find-lab-center(\/.*)?$/,
    allowedRoles: ["customer"],
  },
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

function isValidRedirectPath(path: string | null): path is string {
  if (!path) return false;
  const trimmed = path.trim();
  if (trimmed.startsWith("//")) return false;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return false;
  if (trimmed.includes("\n") || trimmed.includes("\r")) return false;
  return true;
}

function sanitizePathForRedirect(path: string): string {
  return path.replace(/[\r\n]/g, "").slice(0, 500);
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isCustomerOnlyPublicPath(pathname: string): boolean {
  return CUSTOMER_ONLY_PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getCanonicalCustomerDashboardPath(pathname: string): string | null {
  const mappings: Record<string, string> = {
    "/profile": "/dashboard/customer/profile",
    "/profile/pages/personal": "/dashboard/customer/profile",
    "/profile/orders": "/dashboard/customer/orders",
    "/profile/transactions": "/dashboard/customer/transactions",
    "/transactions": "/dashboard/customer/transactions",
    "/profile/security": "/dashboard/customer/security",
    "/change-password": "/dashboard/customer/change-password",
    "/results": "/dashboard/customer/results",
  };

  if (mappings[pathname]) return mappings[pathname];

  const pendingResultMatch = pathname.match(/^\/results\/([^/]+)\/pending$/);
  if (pendingResultMatch) {
    return `/dashboard/customer/results/${pendingResultMatch[1]}/pending`;
  }

  const resultMatch = pathname.match(/^\/results\/([^/]+)$/);
  if (resultMatch) {
    return `/dashboard/customer/results/${resultMatch[1]}`;
  }

  return null;
}

async function getRoleFromTokenSecure(token?: string): Promise<NormalizedUserRole | null> {
  if (!token) return null;

  const segments = token.split(".");
  if (segments.length !== 3) return null;

  if (process.env.JWT_SECRET) {
    const { valid, payload } = await verifyJwtToken(token);
    if (!valid) return null;

    const maybeRole =
      (payload as any)?.role ||
      (payload as any)?.user?.role ||
      (payload as any)?.data?.role ||
      (payload as any)?.userRole ||
      null;
    return normalizeUserRole(maybeRole);
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

function isRoleAllowed(
  pathname: string,
  role: NormalizedUserRole | null,
): boolean {
  const guard = ROLE_ROUTE_GUARDS.find((g) => g.matcher.test(pathname));
  if (!guard) return true;
  if (!role) return false;
  return guard.allowedRoles.includes(role);
}

function buildLoginRedirect(
  req: NextRequest,
  fromPath: string,
  search = "",
): NextResponse {
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("from", sanitizePathForRedirect(`${fromPath}${search}`));
  return NextResponse.redirect(loginUrl);
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const hasSessionCookie = Boolean(accessToken || refreshToken);

  if (PUBLIC_FILE_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // Extract role from JWT with signature verification when JWT_SECRET is available
  const userRole = await getRoleFromTokenSecure(accessToken);
  const canonicalCustomerPath = getCanonicalCustomerDashboardPath(pathname);

  if (canonicalCustomerPath) {
    if (!hasSessionCookie) {
      return buildLoginRedirect(req, canonicalCustomerPath, search);
    }
    const canonicalUrl = req.nextUrl.clone();
    canonicalUrl.pathname = canonicalCustomerPath;
    return NextResponse.redirect(canonicalUrl);
  }

  if (isProtectedPath(pathname)) {
    if (!hasSessionCookie) {
      return buildLoginRedirect(req, pathname, search);
    }
    if (!accessToken && refreshToken) {
      return NextResponse.next();
    }
    if (!isRoleAllowed(pathname, userRole)) {
      if (!userRole) {
        return buildLoginRedirect(req, pathname, search);
      }
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = getDashboardRouteForRole(userRole);
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (!hasSessionCookie) {
    if (!isPublicPath(pathname) && pathname !== "/dashboard") {
      return buildLoginRedirect(req, pathname, search);
    }
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }
    return buildLoginRedirect(req, pathname, search);
  }

  if (!accessToken && refreshToken) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "/dashboard") {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = getDashboardRouteForRole(userRole);
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  if (
    accessToken &&
    isCustomerOnlyPublicPath(pathname) &&
    !isRoleAllowed(pathname, userRole)
  ) {
    if (!userRole) {
      return buildLoginRedirect(req, pathname, search);
    }
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = getDashboardRouteForRole(userRole);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!isRoleAllowed(pathname, userRole)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = getDashboardRouteForRole(userRole);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|public).*)"],
};