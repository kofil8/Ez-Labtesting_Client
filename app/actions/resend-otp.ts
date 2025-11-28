"use server";

export async function resendOtp(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1"}/auth/resend-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to resend OTP");
  }

  return { success: true };
}

