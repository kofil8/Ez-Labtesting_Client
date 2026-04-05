"use server";

import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ezlabtesting-api.com/api/v1";

export async function refreshToken() {
  const cookieStore = await cookies();
  const refreshTokenValue = cookieStore.get("refreshToken")?.value;

  if (!refreshTokenValue) {
    throw new Error("No refresh token found");
  }

  // Backend reads refreshToken from cookies automatically via credentials: "include"
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // This sends cookies automatically
      cache: "no-store",
    });
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

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Token refresh failed" }));

    // If refresh token is also expired, clear both cookies
    if (res.status === 401) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
    }

    throw new Error(error.message || "Token refresh failed");
  }

  const data = await res.json();

  // Update the accessToken in cookie (returned in response body)
  if (data?.data?.accessToken) {
    cookieStore.set("accessToken", data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });
  }

  // Extract refreshToken from Set-Cookie header since server-side fetch doesn't auto-handle it
  if (data?.data?.refreshToken) {
    cookieStore.set("refreshToken", data.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return { success: true, accessToken: data?.data?.accessToken };
}
