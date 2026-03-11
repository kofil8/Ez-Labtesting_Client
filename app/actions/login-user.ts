"use server";

import { cookies } from "next/headers";

// Helper function to detect if input is email or phone
function detectInputType(input: string): "email" | "phone" {
  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone regex pattern (handles various formats, digits only, +1234567890, etc)
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  if (emailRegex.test(input)) {
    return "email";
  }
  if (phoneRegex.test(input)) {
    return "phone";
  }

  // Default to email if can't determine
  return "email";
}

export async function loginUser(formData: FormData) {
  const emailOrPhoneRaw = formData.get("email") as string;
  const emailOrPhone = emailOrPhoneRaw?.trim();
  const password = formData.get("password") as string;
  const pushToken = formData.get("pushToken") as string | null;
  const platform = (formData.get("platform") as string | null) || "web";

  if (!emailOrPhone || !password) {
    return {
      success: false,
      requiresVerification: false,
      message: "Email/Phone and password are required",
    };
  }

  // Detect input type and prepare payload
  const inputType = detectInputType(emailOrPhone);
  const payload: any = {
    password,
    platform,
  };

  if (pushToken) {
    payload.pushToken = pushToken;
  }

  if (inputType === "email") {
    payload.email = emailOrPhone;
  } else {
    payload.phoneNumber = emailOrPhone;
  }

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.ezlabtesting.com/api/v1"
      }/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}) as any);
      const backendErrorMessage =
        Array.isArray(error?.errorMessages) && error.errorMessages.length > 0
          ? error.errorMessages[0]?.message
          : null;
      const errorMessage =
        backendErrorMessage || error?.message || "Login failed";

      if (
        errorMessage.toLowerCase().includes("verify") ||
        errorMessage.toLowerCase().includes("verification")
      ) {
        return {
          success: false,
          requiresVerification: true,
          email: emailOrPhone,
          message: errorMessage,
        };
      }

      return {
        success: false,
        requiresVerification: false,
        message: errorMessage,
      };
    }

    const data = await res.json();
    const cookieStore = await cookies();

    // Check if MFA is required
    if (data?.data?.mfaRequired && data?.data?.tempToken) {
      return {
        success: false,
        mfaRequired: true,
        tempToken: data.data.tempToken,
        message: "MFA verification required",
      };
    }

    if (data?.data?.accessToken) {
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 minutes
      });
    }

    // Set refreshToken from response body since backend sends it in data
    if (data?.data?.refreshToken) {
      cookieStore.set("refreshToken", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return {
      success: true,
      requiresVerification: false,
      isFirstLogin: Boolean(data?.data?.isFirstLogin),
    };
  } catch (error: any) {
    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      return {
        success: false,
        requiresVerification: false,
        message:
          "Unable to connect to server. The server may be down. Please try again later.",
      };
    }

    return {
      success: false,
      requiresVerification: false,
      message:
        error?.message ||
        "Network error occurred. Please check your connection and try again.",
    };
  }
}
