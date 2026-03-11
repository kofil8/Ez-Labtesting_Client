/**
 * JWT Token Utilities
 * Decode and verify tokens without making API calls
 */

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Decode JWT token without verification
 * Used only to extract payload information
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid token format");
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if necessary
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode base64url
    const decoded = atob(padded);

    // Parse JSON
    const parsed = JSON.parse(decoded);

    return parsed as DecodedToken;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  // Consider token expired 1 minute before actual expiration
  return currentTime > expirationTime - 60000;
}

/**
 * Check if token is valid (not expired and has required fields)
 */
export function isTokenValid(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Check required fields
  if (!decoded.id || !decoded.email) return false;

  // Check if expired
  return !isTokenExpired(token);
}

/**
 * Extract user info from token without API call
 */
export function getUserFromToken(
  token: string,
): { id: string; email: string; role: string } | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role || "CUSTOMER",
  };
}
/**
 * Refresh access token using httpOnly cookies
 * Called automatically before token expiration
 */
export async function clientRefreshToken(): Promise<void> {
  try {
    const response = await fetch("/api/v1/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Send cookies to backend
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Token refresh failed:", response.status);
      throw new Error("Token refresh failed");
    }

    // Extract and store new token from response (optional, cookies are auto-updated)
    try {
      const data = await response.json();
      if (data?.data?.accessToken) {
        // Token is stored in httpOnly cookie by backend
        // This is just for logging/debugging
        console.debug("[TOKEN] Access token refreshed successfully");
      }
    } catch (e) {
      console.warn("Failed to parse token refresh response:", e);
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
}
