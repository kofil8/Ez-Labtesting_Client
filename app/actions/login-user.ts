"use server";

import { cookies } from "next/headers";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const pushToken = formData.get("pushToken") as string | null;
  const platform = formData.get("platform") as string | null;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1"
    }/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        pushToken: pushToken || null,
        platform: platform || "web",
      }),
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    const errorMessage = error.message || "Login failed";

    if (
      errorMessage.toLowerCase().includes("verify") ||
      errorMessage.toLowerCase().includes("verification")
    ) {
      return {
        success: false,
        requiresVerification: true,
        email: email,
        message: errorMessage,
      };
    }

    throw new Error(errorMessage);
  }

  const data = await res.json();
  const cookieStore = await cookies();

  if (data?.data?.accessToken) {
    cookieStore.set("accessToken", data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });
  }

  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const refreshTokenMatch = setCookieHeader.match(/refreshToken=([^;]+)/);
    if (refreshTokenMatch) {
      cookieStore.set("refreshToken", refreshTokenMatch[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  }

  return { success: true };
}
