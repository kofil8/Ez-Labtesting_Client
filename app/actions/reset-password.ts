"use server";

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!email || !otp || !newPassword) {
    throw new Error("Email, OTP, and new password are required");
  }

  let res;
  try {
    res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://ezlabtesting-api.com/api/v1"
      }/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
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
    throw new Error(error.message || "Password reset failed");
  }

  return { success: true };
}
