import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Verify if the user has a valid token
 * This endpoint checks if the httpOnly accessToken cookie exists
 * Used by ClientInit to validate auth state
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // If token exists, it's valid (token validation happens on server-side requests)
    if (accessToken) {
      return NextResponse.json(
        { valid: true, message: "Token is valid" },
        { status: 200 },
      );
    }

    // No token found
    return NextResponse.json(
      { valid: false, message: "No token found" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { valid: false, message: "Token verification failed" },
      { status: 401 },
    );
  }
}
