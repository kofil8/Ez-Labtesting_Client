"use server";

import { cookies } from "next/headers";

export async function logoutUser(pushToken?: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1"
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
      }
    );
  } catch (error) {
    console.error("Error calling logout API:", error);
  }

  // Clear cookies client-side
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return { success: true };
}
