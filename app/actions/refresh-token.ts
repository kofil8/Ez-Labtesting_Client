"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

export async function refreshToken() {
  const cookieStore = await cookies();
  const refreshTokenValue = cookieStore.get("refreshToken")?.value;

  if (!refreshTokenValue) {
    throw new Error("No refresh token found");
  }

  // Backend reads refreshToken from cookies automatically via credentials: "include"
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // This sends cookies automatically
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Token refresh failed" }));
    
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Match backend setting
      path: "/",
      maxAge: 60 * 15, // 15 minutes (matching JWT expiration)
    });
  }

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
        sameSite: "strict", // Match backend setting
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
  }

  return { success: true, accessToken: data?.data?.accessToken };
}

