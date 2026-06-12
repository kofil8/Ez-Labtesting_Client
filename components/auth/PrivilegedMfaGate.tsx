"use client";

import { useAuth } from "@/lib/auth-context";
import {
  getSafeRedirectTarget,
  normalizeUserRole,
} from "@/lib/auth/shared";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export function PrivilegedMfaGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = normalizeUserRole(user?.role);
  const requiresMfa = role === "admin" || role === "lab_partner";
  const isBlocked = requiresMfa && user?.mfaEnabled !== true;
  const currentPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isLoading || !isBlocked) {
      return;
    }

    const safeFrom = getSafeRedirectTarget(currentPath);
    const query = new URLSearchParams({
      setup: "required",
      mandatory: "true",
    });

    if (safeFrom) {
      query.set("from", safeFrom);
    }

    router.replace(`/dashboard/security?${query.toString()}`);
  }, [currentPath, isBlocked, isLoading, router]);

  if (isLoading || isBlocked) {
    return (
      <div className='flex min-h-screen items-center justify-center text-muted-foreground'>
        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
        Checking account security...
      </div>
    );
  }

  return <>{children}</>;
}
