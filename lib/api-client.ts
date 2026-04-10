"use client";

import { getApiUrl } from "@/lib/api/config";
import { handleAuthFailure, refreshSession } from "@/lib/auth/client";

export interface AuthenticatedFetchOptions extends RequestInit {
  redirectOnAuthFailure?: boolean;
}

async function performFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  try {
    return await fetch(url, {
      ...options,
      credentials: "include",
      cache: options.cache ?? "no-store",
    });
  } catch (error) {
    console.error("Fetch error:", error);
    throw normalizeNetworkError(error);
  }
}

function normalizeNetworkError(error: unknown): Error {
  if (
    error instanceof Error &&
    (error.message.includes("fetch failed") ||
      error.message.includes("NetworkError"))
  ) {
    return new Error(
      "Unable to connect to server. The server may be down. Please try again later.",
    );
  }

  return error instanceof Error
    ? error
    : new Error(
        "Network error occurred. Please check your connection and try again.",
      );
}

/**
 * Public API helper for endpoints that don't require authentication
 * Use this for public endpoints like /tests/all, /categories/all, etc.
 */
export async function publicFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  return performFetch(getApiUrl(url), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/**
 * Client-side API helper that automatically handles token refresh
 * This is for client-side API calls (not server actions)
 * Use this for authenticated endpoints that may require token refresh
 */
export async function clientFetch(
  url: string,
  options: AuthenticatedFetchOptions = {},
): Promise<Response> {
  const {
    redirectOnAuthFailure = true,
    headers,
    ...requestOptions
  } = options;
  const normalizedUrl = getApiUrl(url);

  let response = await performFetch(normalizedUrl, {
    ...requestOptions,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    await refreshSession();
  } catch (error) {
    if (redirectOnAuthFailure) {
      await handleAuthFailure();
    }

    throw normalizeNetworkError(error);
  }

  response = await performFetch(normalizedUrl, {
    ...requestOptions,
    headers,
  });

  if (response.status === 401) {
    if (redirectOnAuthFailure) {
      await handleAuthFailure();
    }

    throw new Error("Session expired. Please log in again.");
  }

  return response;
}

export { getApiUrl } from "@/lib/api/config";
