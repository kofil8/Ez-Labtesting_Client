"use server";

import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ezlabtesting-api.com/api/v1";

function isConnectionError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("fetch failed") ||
      error.message.includes("NetworkError"))
  );
}

function normalizeNetworkError(error: unknown): Error {
  if (isConnectionError(error)) {
    return new Error(
      "Unable to connect to server. Please check your connection and try again.",
    );
  }

  return error instanceof Error
    ? error
    : new Error("Network error occurred. Please try again.");
}

function getCookieHeader() {
  return cookies().then((cookieStore) =>
    cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; "),
  );
}

function getSetCookieHeaders(response: Response): string[] {
  const headers = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const combined = response.headers.get("set-cookie");
  if (!combined) {
    return [];
  }

  const cookiesList: string[] = [];
  let current = "";
  let inExpires = false;

  for (const char of combined) {
    if (char === "," && !inExpires) {
      cookiesList.push(current.trim());
      current = "";
      continue;
    }

    current += char;

    if (current.toLowerCase().endsWith("expires=")) {
      inExpires = true;
    } else if (inExpires && char === ";") {
      inExpires = false;
    }
  }

  if (current.trim()) {
    cookiesList.push(current.trim());
  }

  return cookiesList;
}

async function applyResponseCookies(response: Response) {
  const cookieStore = await cookies();

  for (const header of getSetCookieHeaders(response)) {
    const [cookiePair, ...attributes] = header.split(";").map((part) => part.trim());
    const separatorIndex = cookiePair.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = cookiePair.slice(0, separatorIndex);
    const value = cookiePair.slice(separatorIndex + 1);
    const options: Record<string, unknown> = {};

    for (const attribute of attributes) {
      const [rawKey, ...rawValueParts] = attribute.split("=");
      const key = rawKey.toLowerCase();
      const attributeValue = rawValueParts.join("=");

      if (key === "httponly") {
        options.httpOnly = true;
      } else if (key === "secure") {
        options.secure = true;
      } else if (key === "path" && attributeValue) {
        options.path = attributeValue;
      } else if (key === "domain" && attributeValue) {
        options.domain = attributeValue;
      } else if (key === "max-age" && attributeValue) {
        const maxAge = Number(attributeValue);
        if (Number.isFinite(maxAge)) {
          options.maxAge = maxAge;
        }
      } else if (key === "expires" && attributeValue) {
        const expires = new Date(attributeValue);
        if (!Number.isNaN(expires.getTime())) {
          options.expires = expires;
        }
      } else if (key === "samesite" && attributeValue) {
        const sameSite = attributeValue.toLowerCase();
        if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
          options.sameSite = sameSite;
        }
      }
    }

    cookieStore.set(name, value, options as any);
  }
}

async function refreshAccessToken(): Promise<void> {
  const cookieHeader = await getCookieHeader();

  if (!cookieHeader) {
    throw new Error("No authenticated session found");
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/refreshtoken`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
  } catch (error) {
    throw normalizeNetworkError(error);
  }

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => ({ message: "Token refresh failed" }));
    throw new Error(payload.message || "Token refresh failed");
  }

  await applyResponseCookies(response);
}

/**
 * Helper function to make authenticated API calls with automatic token refresh
 * If a 401 error occurs, it will attempt to refresh the token and retry the request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let cookieHeader = await getCookieHeader();
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });
  } catch (error) {
    throw normalizeNetworkError(error);
  }

  if (response.status !== 401) {
    return response;
  }

  await refreshAccessToken();

  cookieHeader = await getCookieHeader();

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });
  } catch (error) {
    throw normalizeNetworkError(error);
  }

  if (response.status === 401) {
    throw new Error("Session expired. Please log in again.");
  }

  return response;
}
