"use client";

import { refreshToken } from "@/app/actions/refresh-token";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useRef } from "react";

/**
 * TokenRefreshManager
 *
 * Automatically refreshes JWT access tokens before they expire.
 *
 * How it works:
 * - Checks token expiration every minute
 * - If token expires in less than 2 minutes, triggers refresh
 * - Uses server action to refresh tokens via httpOnly cookies
 * - Refreshes auth context after successful token refresh
 *
 * The access token is valid for 15 minutes
 * The refresh token is valid for 7 days
 */
export function TokenRefreshManager() {
  const { isAuthenticated, refreshAuth, logout } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    // Only run if user is authenticated
    if (!isAuthenticated) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkAndRefreshToken = async () => {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshingRef.current) {
        return;
      }

      try {
        // Get token from server action to check expiration
        const { getAccessTokenFromServer } =
          await import("@/app/actions/get-token");
        const tokenResult = await getAccessTokenFromServer();

        if (!tokenResult?.token) {
          console.debug(
            "[TokenRefresh] No access token found, attempting refresh",
          );
          if (!isRefreshingRef.current) {
            isRefreshingRef.current = true;
            try {
              const result = await refreshToken();
              if (result.success) {
                console.debug("[TokenRefresh] Token refreshed successfully");
                await refreshAuth();
              } else {
                console.error("[TokenRefresh] Token refresh failed");
              }
            } catch (error: any) {
              console.error(
                "[TokenRefresh] Error refreshing token:",
                error?.message,
              );
              if (
                error?.message?.includes("Refresh token missing") ||
                error?.message?.includes("Token refresh failed") ||
                error?.message?.includes("Unauthorized") ||
                error?.message?.includes("No refresh token found")
              ) {
                console.debug(
                  "[TokenRefresh] Refresh token expired, logging out",
                );
                await logout();
              }
            } finally {
              isRefreshingRef.current = false;
            }
          }
          return;
        }

        // Check if token is about to expire (within 2 minutes)
        const { isTokenExpired, decodeToken } =
          await import("@/lib/token-utils");
        const decoded = decodeToken(tokenResult.token);

        if (!decoded) {
          console.debug("[TokenRefresh] Failed to decode token");
          return;
        }

        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        // Refresh if token expires in less than 2 minutes (120000ms)
        if (timeUntilExpiry < 120000) {
          console.debug("[TokenRefresh] Token expires soon, refreshing...");
          isRefreshingRef.current = true;

          try {
            const result = await refreshToken();

            if (result.success) {
              console.debug("[TokenRefresh] Token refreshed successfully");
              // Refresh auth context to update user state
              await refreshAuth();
            } else {
              console.error("[TokenRefresh] Token refresh failed");
            }
          } catch (error: any) {
            console.error(
              "[TokenRefresh] Error refreshing token:",
              error?.message,
            );

            // If refresh fails with unauthorized, logout user
            if (
              error?.message?.includes("Refresh token missing") ||
              error?.message?.includes("Token refresh failed") ||
              error?.message?.includes("Unauthorized")
            ) {
              console.debug(
                "[TokenRefresh] Refresh token expired, logging out",
              );
              await logout();
            }
          } finally {
            isRefreshingRef.current = false;
          }
        } else {
          const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
          console.debug(
            `[TokenRefresh] Token valid for ${minutesUntilExpiry} more minutes`,
          );
        }
      } catch (error: any) {
        console.error("[TokenRefresh] Error checking token:", error?.message);
        isRefreshingRef.current = false;
      }
    };

    // Check immediately on mount
    checkAndRefreshToken();

    // Then check every 60 seconds
    intervalRef.current = setInterval(checkAndRefreshToken, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, refreshAuth, logout]);

  // This component doesn't render anything
  return null;
}
