"use client";

import { getApiUrl } from "@/lib/api/config";
import { cleanupPushOnLogout } from "@/lib/logoutPushCleanup";
import {
  clearPushRegistrationAttempts,
  clearRegisteredPushTokenMarker,
} from "@/lib/push";
import { useNotificationsStore } from "@/lib/store/notifications-store";

export const AUTH_SESSION_EXPIRED_EVENT = "ezlab:auth-session-expired";
const SESSION_EXPIRED_MESSAGE = "Session expired. Please log in again.";

type ApiEnvelope<T = unknown> = {
  data?: T;
  message?: string;
  error?: string;
  errorMessages?: Array<{ message?: string }>;
};

type LoginResponseData = {
  mfaRequired?: boolean;
  tempToken?: string;
  isFirstLogin?: boolean;
};

type VerifyMfaResponseData = {
  user?: {
    role?: string;
  };
  remainingBackupCodes?: number;
};

type SetupMfaResponseData = {
  secret: string;
  qrCode: string;
};

type VerifySetupResponseData = {
  backupCodes?: string[];
};

type MfaStatusResponseData = {
  mfaEnabled: boolean;
  mfaSetupAt: string | null;
  backupCodesCount: number;
};

let refreshPromise: Promise<void> | null = null;
let authFailurePromise: Promise<void> | null = null;

function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("fetch failed") ||
    error.message.includes("NetworkError")
  );
}

function normalizeNetworkError(error: unknown): Error {
  if (isConnectionError(error)) {
    return new Error(
      "Unable to connect to server. The server may be down. Please try again later.",
    );
  }

  return error instanceof Error
    ? error
    : new Error("Network error occurred. Please try again.");
}

async function parseJson<T>(response: Response): Promise<ApiEnvelope<T>> {
  return response.json().catch(() => ({}));
}

function extractMessage(payload: ApiEnvelope, fallback: string): string {
  const nestedMessage =
    Array.isArray(payload.errorMessages) && payload.errorMessages.length > 0
      ? payload.errorMessages[0]?.message
      : undefined;

  return payload.message || payload.error || nestedMessage || fallback;
}

function clearClientAuthState() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("auth_token");
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("otp_email");
  clearRegisteredPushTokenMarker();
  clearPushRegistrationAttempts();
  useNotificationsStore.getState().resetNotifications();
}

async function dispatchSessionExpired(redirectTo = "/login?expired=true") {
  if (typeof window === "undefined") {
    return;
  }

  clearClientAuthState();
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

  const currentPath = `${window.location.pathname}${window.location.search}`;
  if (currentPath !== redirectTo) {
    window.location.assign(redirectTo);
  }
}

export async function handleAuthFailure(redirectTo = "/login?expired=true") {
  if (authFailurePromise) {
    return authFailurePromise;
  }

  authFailurePromise = dispatchSessionExpired(redirectTo).finally(() => {
    authFailurePromise = null;
  });

  return authFailurePromise;
}

export async function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      let response: Response;

      try {
        response = await fetch(getApiUrl("/auth/refreshtoken"), {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });
      } catch (error) {
        throw normalizeNetworkError(error);
      }

      if (!response.ok) {
        const payload = await parseJson(response);
        throw new Error(extractMessage(payload, SESSION_EXPIRED_MESSAGE));
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function requestAuthEndpoint<T>(
  endpoint: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<ApiEnvelope<T>> {
  let response: Response;

  try {
    response = await fetch(getApiUrl(endpoint), {
      ...init,
      credentials: "include",
      cache: "no-store",
    });
  } catch (error) {
    throw normalizeNetworkError(error);
  }

  const payload = await parseJson<T>(response);

  if (!response.ok) {
    throw new Error(extractMessage(payload, fallbackMessage));
  }

  return payload;
}

function detectInputType(input: string): "email" | "phone" {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  if (emailRegex.test(input)) {
    return "email";
  }

  if (phoneRegex.test(input)) {
    return "phone";
  }

  return "email";
}

export async function loginUser(formData: FormData) {
  const emailOrPhoneRaw = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const pushToken = formData.get("pushToken");
  const platform = String(formData.get("platform") || "web");

  if (!emailOrPhoneRaw || !password) {
    return {
      success: false,
      requiresVerification: false,
      message: "Email/Phone and password are required",
    };
  }

  const inputType = detectInputType(emailOrPhoneRaw);
  const payload: Record<string, unknown> = {
    password,
    platform,
  };

  if (pushToken) {
    payload.pushToken = String(pushToken);
  }

  if (inputType === "email") {
    payload.email = emailOrPhoneRaw;
  } else {
    payload.phoneNumber = emailOrPhoneRaw;
  }

  try {
    const response = await requestAuthEndpoint<LoginResponseData>(
      "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
      "Login failed",
    );

    if (response.data?.mfaRequired && response.data?.tempToken) {
      return {
        success: false,
        mfaRequired: true,
        tempToken: response.data.tempToken,
        message: "MFA verification required",
      };
    }

    return {
      success: true,
      requiresVerification: false,
      isFirstLogin: Boolean(response.data?.isFirstLogin),
    };
  } catch (error) {
    const message = normalizeNetworkError(error).message;

    if (message.toLowerCase().includes("verify")) {
      return {
        success: false,
        requiresVerification: true,
        email: emailOrPhoneRaw,
        message,
      };
    }

    return {
      success: false,
      requiresVerification: false,
      message,
    };
  }
}

export async function verifyOtp(formData: FormData) {
  const email = String(formData.get("email") || "");
  const otp = String(formData.get("otp") || "");

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  await requestAuthEndpoint(
    "/auth/verify-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    },
    "OTP verification failed",
  );

  return { success: true };
}

export async function verifyMFA(tempToken: string, token: string) {
  try {
    const response = await requestAuthEndpoint<VerifyMfaResponseData>(
      "/auth/mfa/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempToken, token }),
      },
      "Invalid verification code",
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: normalizeNetworkError(error).message,
    };
  }
}

export async function verifyBackupCode(tempToken: string, backupCode: string) {
  try {
    const response = await requestAuthEndpoint<VerifyMfaResponseData>(
      "/auth/mfa/verify-backup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempToken, backupCode }),
      },
      "Invalid backup code",
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: normalizeNetworkError(error).message,
    };
  }
}

export async function setupMFA() {
  try {
    const response = await requestAuthEndpoint<SetupMfaResponseData>(
      "/auth/mfa/setup",
      {
        method: "POST",
      },
      "Failed to setup MFA",
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: normalizeNetworkError(error).message,
    };
  }
}

export async function verifySetup(secret: string, token: string) {
  try {
    const response = await requestAuthEndpoint<VerifySetupResponseData>(
      "/auth/mfa/verify-setup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret, token }),
      },
      "Invalid verification code",
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: normalizeNetworkError(error).message,
    };
  }
}

export async function disableMFA(token: string) {
  try {
    await requestAuthEndpoint(
      "/auth/mfa/disable",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      },
      "Failed to disable MFA",
    );

    return {
      success: true,
      message: "Two-factor authentication disabled successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: normalizeNetworkError(error).message,
    };
  }
}

export async function getMFAStatus() {
  try {
    const response = await requestAuthEndpoint<MfaStatusResponseData>(
      "/auth/mfa/status",
      {
        method: "GET",
      },
      "Failed to get MFA status",
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: normalizeNetworkError(error).message,
    };
  }
}

export async function logoutUser(pushToken?: string) {
  try {
    await requestAuthEndpoint(
      "/auth/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pushToken: pushToken || null,
        }),
      },
      "Logout failed",
    );
  } catch (error) {
    console.error("Logout request failed", error);
  }

  return { success: true };
}

export async function logoutSession(options?: {
  redirectTo?: string;
  shouldRedirect?: boolean;
}) {
  try {
    await cleanupPushOnLogout();
  } catch (error) {
    console.error("Push cleanup failed during logout", error);
  }

  await logoutUser();
  clearClientAuthState();

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

    if (options?.shouldRedirect !== false) {
      window.location.assign(options?.redirectTo || "/login");
    }
  }
}
