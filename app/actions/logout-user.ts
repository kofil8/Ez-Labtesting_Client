"use server";

import { cookies } from "next/headers";

export async function logoutUser(pushToken?: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://ezlabtesting-api.com/api/v1"
      }/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          pushToken: pushToken || null, // 🔥 unregister token on backend
        }),
        credentials: "include",
      },
    );
  } catch (error: any) {
    // Log but don't fail - we still clear cookies locally
    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      console.error("Server unavailable during logout:", error);
    } else {
      console.error("Error calling logout API:", error);
    }
  }

  // Clear cookies client-side
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return { success: true };
}
