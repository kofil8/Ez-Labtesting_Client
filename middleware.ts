import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Check if auth bypass is enabled for testing
const BYPASS_AUTH = process.env.BYPASS_AUTH === "true" || process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

// Define which routes are public (no auth required)
function isPublicPath(pathname: string) {
  // Home and marketing-style pages
  if (pathname === "/") return true;

  // Auth pages
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/signup")) return true;
  if (pathname.startsWith("/mfa")) return true;
  if (pathname.startsWith("/forgot-password")) return true;
  if (pathname.startsWith("/reset-password")) return true;

  // Catalog / browsing pages
  if (pathname.startsWith("/tests")) return true; // tests list + detail
  if (pathname.startsWith("/panels")) return true; // panels list + detail
  if (pathname.startsWith("/cart")) return true; // allow cart without auth

  // Profile page is public when auth is bypassed for testing
  if (BYPASS_AUTH && pathname.startsWith("/profile")) return true;

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip all auth checks if bypass is enabled
  if (BYPASS_AUTH) {
    return NextResponse.next();
  }

  // Skip auth check for public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const authToken = req.cookies.get("auth_token")?.value;

  if (!authToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";

    // Preserve the original destination so we can send the user back after login
    const from = `${pathname}${search}`;
    loginUrl.searchParams.set("from", from);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Run middleware on all pages except API routes and Next.js assets
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
