import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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
  "/admin",
];

// Check if route is public
function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip auth check for public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Read access token from cookie (not HttpOnly)
  const accessToken = req.cookies.get("accessToken")?.value;

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
