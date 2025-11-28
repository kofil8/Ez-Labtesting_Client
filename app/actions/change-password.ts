"use server";

import { authenticatedFetch } from "@/lib/api-helpers";

export async function changePassword(formData: FormData) {
  try {
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!oldPassword || !newPassword) {
      throw new Error("Old password and new password are required");
    }

    const res = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1"}/profile/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to change password");
    }

    return { success: true };
  } catch (error: any) {
    // Re-throw with a user-friendly message
    if (error.message.includes("Session expired")) {
      throw new Error("Your session has expired. Please log in again.");
    }
    throw error;
  }
}

