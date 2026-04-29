"use server";

import { authenticatedFetch } from "@/lib/api-helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ezlabtesting-api.com/api/v1";

export async function deleteProfile() {
  const res = await authenticatedFetch(`${API_BASE_URL}/profile`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Unable to delete your profile." }));

    throw new Error(error.message || "Unable to delete your profile.");
  }

  return { success: true };
}
