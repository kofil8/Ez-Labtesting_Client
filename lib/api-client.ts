"use client";

// Use relative URL to go through Next.js proxy (configured in next.config.ts)
// This ensures API calls work with ngrok and in production
const API_BASE_URL = "/api/v1";

/**
 * Public API helper for endpoints that don't require authentication
 * Use this for public endpoints like /tests/all, /categories/all, etc.
 */
export async function publicFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });

    return response;
  } catch (error: any) {
    console.error("Fetch error:", error);

    // Check for connection errors
    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      throw new Error(
        "Unable to connect to server. The server may be down. Please try again later.",
      );
    }

    throw new Error(
      error.message ||
        "Network error occurred. Please check your connection and try again.",
    );
  }
}

/**
 * Client-side API helper that automatically handles token refresh
 * This is for client-side API calls (not server actions)
 * Use this for authenticated endpoints that may require token refresh
 */
export async function clientFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  // Make the initial request
  let response;
  try {
    console.debug(`[API] Making ${options.method || "GET"} request to: ${url}`);
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
      credentials: "include", // Include cookies (accessToken and refreshToken)
      cache: "no-store",
    });
    console.debug(`[API] Response status: ${response.status}`);
  } catch (error: any) {
    // Handle connection errors (ECONNREFUSED, network failures, etc.)
    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      throw new Error(
        "Unable to connect to server. The server may be down. Please try again later.",
      );
    }
    throw new Error(
      "Network error occurred. Please check your connection and try again.",
    );
  }

  // If we get a 401 (Unauthorized), try to refresh the token and retry
  if (response.status === 401) {
    try {
      // Perform refresh directly against the backend so browser cookies are sent
      const refreshUrl = getApiUrl("/auth/refresh-token");
      let refreshRes: Response;
      try {
        refreshRes = await fetch(refreshUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
        });
      } catch (refreshNetworkError: any) {
        if (
          refreshNetworkError.cause?.code === "ECONNREFUSED" ||
          refreshNetworkError.message?.includes("fetch failed")
        ) {
          throw new Error(
            "Unable to connect to server. The server may be down. Please try again later.",
          );
        }
        throw new Error(
          "Network error occurred. Please check your connection and try again.",
        );
      }

      if (!refreshRes.ok) {
        // Refresh failed: redirect to login and surface proper error
        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=true";
        }
        const text = await refreshRes.text().catch(() => "");
        let message = "Session expired. Please log in again.";
        try {
          const json = text ? JSON.parse(text) : null;
          message = json?.message || message;
        } catch {
          // ignore JSON parse issues
        }
        throw new Error(message);
      }

      // Extract new access token from refresh response body
      let newAccessToken: string | null = null;
      try {
        const refreshData = await refreshRes.json();
        newAccessToken = refreshData?.data?.accessToken;
      } catch (jsonError) {
        console.warn("Failed to parse refresh token response:", jsonError);
      }

      // Retry the original request after successful refresh
      // Attach the new access token as Authorization header
      try {
        const retryHeaders: Record<string, string> = {
          ...(options.headers as Record<string, string>),
        };

        // Add Authorization header with new access token
        if (newAccessToken) {
          retryHeaders["Authorization"] = `Bearer ${newAccessToken}`;
        }

        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: "include",
          cache: "no-store",
        });
      } catch (retryError: any) {
        if (
          retryError.cause?.code === "ECONNREFUSED" ||
          retryError.message?.includes("fetch failed")
        ) {
          throw new Error(
            "Unable to connect to server. The server may be down. Please try again later.",
          );
        }
        throw new Error(
          "Network error occurred. Please check your connection and try again.",
        );
      }

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=true";
        }
        throw new Error("Session expired. Please log in again.");
      }
    } catch (err) {
      // Any error during refresh should result in logout
      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=true";
      }
      const message =
        (err as any)?.message || "Session expired. Please log in again.";
      throw new Error(message);
    }
  }

  return response;
}

/**
 * Helper to build full API URL
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
}
