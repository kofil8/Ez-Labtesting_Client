"use server";

import { cookies } from "next/headers";

export async function verifyOtp(formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  let res;
  try {
    res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://ezlabtesting-api.com/api/v1"
      }/auth/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
        cache: "no-store",
      },
    );
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
    const error = await res.json();
    throw new Error(error.message || "OTP verification failed");
  }

  const data = await res.json();
  const cookieStore = await cookies();

  // If accessToken is returned, set it in cookie (matching login-user.ts settings)
  if (data?.data?.accessToken) {
    cookieStore.set("accessToken", data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes (matching JWT expiration)
    });
  }

  // Extract refreshToken from Set-Cookie header if present (matching login-user.ts)
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const refreshTokenMatch = setCookieHeader.match(/refreshToken=([^;]+)/);
    if (refreshTokenMatch) {
      cookieStore.set("refreshToken", refreshTokenMatch[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
  }

  return { success: true };
}
