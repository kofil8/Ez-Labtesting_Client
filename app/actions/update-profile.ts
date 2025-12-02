"use server";

import { authenticatedFetch } from "@/lib/api-helpers";

export async function updateProfile(formData: FormData) {
  try {
    // Extract form fields
    const firstName = formData.get("firstName") as string | null;
    const lastName = formData.get("lastName") as string | null;
    const bio = formData.get("bio") as string | null;
    const phone = formData.get("phone") as string | null;
    const dateOfBirth = formData.get("dateOfBirth") as string | null;
    const file = formData.get("file") as File | null;

    // Build data object with only provided fields
    const dataObj: Record<string, any> = {};
    if (firstName !== null) dataObj.firstName = firstName;
    if (lastName !== null) dataObj.lastName = lastName;
    if (bio !== null) dataObj.bio = bio;
    if (phone !== null) dataObj.phone = phone;
    if (dateOfBirth !== null) dataObj.dateOfBirth = dateOfBirth;

    // Create FormData for multipart/form-data request
    const requestFormData = new FormData();
    requestFormData.append("data", JSON.stringify(dataObj));

    if (file && file.size > 0) {
      requestFormData.append("file", file);
    }

    const res = await authenticatedFetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://ezlabtesting-api.com/api/v1"
      }/profile`,
      {
        method: "PATCH",
        body: requestFormData,
      }
    );

    if (!res.ok) {
      let errorMessage = "Failed to update profile";
      try {
        const error = await res.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status-based error messages
        if (res.status === 401) {
          errorMessage = "Your session has expired. Please log in again.";
        } else if (res.status === 413) {
          errorMessage =
            "File size too large. Please select an image smaller than 5MB.";
        } else if (res.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();

    return { success: true, profile: data?.data || data };
  } catch (error: any) {
    // Re-throw with a user-friendly message
    if (error.message.includes("Session expired")) {
      throw new Error("Your session has expired. Please log in again.");
    }
    throw error;
  }
}
