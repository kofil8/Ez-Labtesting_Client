"use server";

import { authenticatedFetch } from "@/lib/api-helpers";
import { cookies } from "next/headers";

export async function getProfile() {
  try {
    // Check if access token exists
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new Error("Not authenticated. Please log in again.");
    }

    const res = await authenticatedFetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1"
      }/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({ 
        message: "Failed to fetch profile" 
      }));
      
      // If 401 after refresh attempt, session is expired
      if (res.status === 401) {
        // Clear cookies
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        throw new Error("Session expired. Please log in again.");
      }
      
      throw new Error(error.message || "Failed to fetch profile");
    }

    const data = await res.json();

    return { success: true, profile: data?.data || data };
  } catch (error: any) {
    // Re-throw with a user-friendly message
    if (error.message.includes("Session expired") || 
        error.message.includes("Not authenticated")) {
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
}
