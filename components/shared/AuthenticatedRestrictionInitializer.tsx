"use client";

import { useAuth } from "@/lib/auth-context";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import { isRestrictionBlocked } from "@/lib/restrictions/presentation";
import { useEffect } from "react";

export function AuthenticatedRestrictionInitializer() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { publishStatus, refreshStatus } = useRestrictionStatus();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      publishStatus(null, { showBanner: true });
    }
  }, [isAuthenticated, isLoading, publishStatus]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user?.id) {
      return;
    }

    let cancelled = false;

    const checkAuthenticatedIpRestriction = async () => {
      const status = await refreshStatus(
        { laboratoryCode: "ACCESS" },
        { force: true },
      );

      if (cancelled) {
        return;
      }

      publishStatus(status, {
        showBanner: isRestrictionBlocked(status),
      });
    };

    void checkAuthenticatedIpRestriction();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkAuthenticatedIpRestriction();
      }
    };

    window.addEventListener("focus", checkAuthenticatedIpRestriction);
    window.addEventListener("online", checkAuthenticatedIpRestriction);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", checkAuthenticatedIpRestriction);
      window.removeEventListener("online", checkAuthenticatedIpRestriction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    isAuthenticated,
    isLoading,
    publishStatus,
    refreshStatus,
    user?.id,
  ]);

  return null;
}
