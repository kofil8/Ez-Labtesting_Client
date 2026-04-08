"use client";

import { useEffect } from "react";

export function ClientInit() {
  // Validate token on app initialization
  // If token doesn't exist or is invalid, clear all auth data
  useEffect(() => {
    const validateToken = async () => {
      // Check if user has a valid token in httpOnly cookie
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        }).catch(() => null);

        // If verification fails, clear client-side auth data
        if (!response || !response.ok) {
          // Clear localStorage
          localStorage.removeItem("auth_token");
          sessionStorage.removeItem("otp_email");
        }
      } catch (error) {
        console.debug("Token validation failed:", error);
        // Clear auth data on any validation error
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("otp_email");
      }
    };

    validateToken();
  }, []);

  return null;
}
