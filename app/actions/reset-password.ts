"use server";

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!email || !otp || !newPassword) {
    throw new Error("Email, OTP, and new password are required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1"}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, newPassword }),
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Password reset failed");
  }

  return { success: true };
}

