"use server";

import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ezlabtesting-api.com/api/v1";

/**
 * Helper function to refresh the access token using the refresh token cookie
 */
async function refreshAccessToken(): Promise<string> {
  const cookieStore = await cookies();
  const refreshTokenValue = cookieStore.get("refreshToken")?.value;

  if (!refreshTokenValue) {
    throw new Error("No refresh token found");
  }

  // Call refresh-token endpoint - backend reads refreshToken from cookies automatically
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // This sends cookies automatically
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Token refresh failed" }));
    const cookieStore = await cookies();

    // If refresh token is also expired, clear both cookies
    if (res.status === 401) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
    }

    throw new Error(error.message || "Token refresh failed");
  }

  const data = await res.json();
  const newAccessToken = data?.data?.accessToken;

  if (!newAccessToken) {
    throw new Error("No access token received from refresh");
  }

  // Update the accessToken cookie
  cookieStore.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15, // 15 minutes (matching JWT expiration)
  });

  // Backend sets new refreshToken in cookie automatically via Set-Cookie header
  // Extract it from Set-Cookie header and set it manually for Next.js
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const refreshTokenMatch = setCookieHeader.match(/refreshToken=([^;]+)/);
    if (refreshTokenMatch) {
      const newRefreshToken = refreshTokenMatch[1];
      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
  }

  return newAccessToken;
}

/**
 * Helper function to make authenticated API calls with automatic token refresh
 * If a 401 error occurs, it will attempt to refresh the token and retry the request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    // Clear any stale cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    throw new Error("Not authenticated. Please log in again.");
  }

  // Make the initial request with access token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include", // Include cookies for refresh token
    cache: "no-store",
  });

  // If we get a 401 (Unauthorized), try to refresh the token and retry
  if (response.status === 401) {
    try {
      // Attempt to refresh the token
      const newAccessToken = await refreshAccessToken();

      // Retry the original request with the new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
        credentials: "include",
        cache: "no-store",
      });

      // If retry also fails with 401, the refresh token is also expired
      if (response.status === 401) {
        cookieStore = await cookies();
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        throw new Error("Session expired. Please log in again.");
      }
    } catch (refreshError: any) {
      // If refresh fails, clear cookies and throw error
      cookieStore = await cookies();
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      const errorMessage =
        refreshError.message || "Session expired. Please log in again.";
      throw new Error(errorMessage);
    }
  }

  return response;
}
