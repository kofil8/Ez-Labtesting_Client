"use client";

import { useAuth } from "@/lib/auth-context";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import { isRestrictionBlocked } from "@/lib/restrictions/presentation";
import { useEffect, useRef } from "react";

function isCustomerRole(role: unknown) {
  return String(role || "").toLowerCase() === "customer";
}

export function AuthenticatedRestrictionInitializer() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { publishStatus, refreshStatus } = useRestrictionStatus();
  const checkedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !isCustomerRole(user?.role)) {
      checkedUserIdRef.current = null;
      publishStatus(null, { showBanner: true });
      return;
    }

    if (!user?.id || checkedUserIdRef.current === user.id) {
      return;
    }

    let cancelled = false;
    checkedUserIdRef.current = user.id;

    const checkAuthenticatedIpRestriction = async () => {
      const status = await refreshStatus({}, { force: true });

      if (cancelled) {
        return;
      }

      publishStatus(status, {
        showBanner: isRestrictionBlocked(status),
      });
    };

    void checkAuthenticatedIpRestriction();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    isLoading,
    publishStatus,
    refreshStatus,
    user?.id,
    user?.role,
  ]);

  return null;
}
