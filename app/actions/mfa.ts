"use server";

import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.ezlabtesting.com/api/v1";

/**
 * Setup MFA - Generate secret and QR code
 */
export async function setupMFA() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "Authentication required",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/mfa/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to setup MFA",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to setup MFA",
    };
  }
}

/**
 * Verify setup and enable MFA
 */
export async function verifySetup(secret: string, token: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "Authentication required",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/mfa/verify-setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ secret, token }),
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Invalid verification code",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to verify setup",
    };
  }
}

/**
 * Verify MFA during login
 */
export async function verifyMFA(tempToken: string, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/mfa/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tempToken, token }),
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Invalid verification code",
      };
    }

    // Store tokens in cookies
    const cookieStore = await cookies();

    if (data?.data?.accessToken) {
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 minutes
      });
    }

    // Set refreshToken from response body since backend sends it in data
    if (data?.data?.refreshToken) {
      cookieStore.set("refreshToken", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to verify MFA",
    };
  }
}

/**
 * Verify backup code during login
 */
export async function verifyBackupCode(tempToken: string, backupCode: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/mfa/verify-backup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tempToken, backupCode }),
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Invalid backup code",
      };
    }

    // Store tokens in cookies
    const cookieStore = await cookies();

    if (data?.data?.accessToken) {
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 minutes
      });
    }

    // Set refreshToken from response body since backend sends it in data
    if (data?.data?.refreshToken) {
      cookieStore.set("refreshToken", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to verify backup code",
    };
  }
}

/**
 * Disable MFA
 */
export async function disableMFA(token: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "Authentication required",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/mfa/disable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ token }),
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to disable MFA",
      };
    }

    return {
      success: true,
      message: "Two-factor authentication disabled successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to disable MFA",
    };
  }
}

/**
 * Get MFA status
 */
export async function getMFAStatus() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "Authentication required",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/mfa/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to get MFA status",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to get MFA status",
    };
  }
}

/**
 * Regenerate backup codes
 */
export async function regenerateBackupCodes(token: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "Authentication required",
    };
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/auth/mfa/regenerate-backup-codes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token }),
        credentials: "include",
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to regenerate backup codes",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to regenerate backup codes",
    };
  }
}
