"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ezlabtesting-api.com/api/v1";

/**
 * Client-side API helper that automatically handles token refresh
 * This is for client-side API calls (not server actions)
 */
export async function clientFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Make the initial request
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
    credentials: "include", // Include cookies (accessToken and refreshToken)
    cache: "no-store",
  });

  // If we get a 401 (Unauthorized), try to refresh the token and retry
  if (response.status === 401) {
    try {
      // Call the refresh-token server action
      const { refreshToken } = await import("@/app/actions/refresh-token");
      await refreshToken();

      // Retry the original request
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
        credentials: "include",
        cache: "no-store",
      });

      // If retry also fails with 401, the refresh token is also expired
      if (response.status === 401) {
        // Redirect to login or clear auth state
        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=true";
        }
        throw new Error("Session expired. Please log in again.");
      }
    } catch (refreshError: any) {
      // If refresh fails, redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=true";
      }
      const errorMessage =
        refreshError.message || "Session expired. Please log in again.";
      throw new Error(errorMessage);
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
