"use client";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { getDashboardRouteForRole } from "@/lib/auth/shared";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { LoginForm } from "./login-form";
import { LoginShell } from "./login-shell";

function getSafeRedirectTarget(from: string | null) {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return null;
  }

  return from;
}

export function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const safeFrom = getSafeRedirectTarget(searchParams.get("from"));
    router.push(safeFrom || getDashboardRouteForRole(user?.role));
  }, [isAuthenticated, isLoading, router, searchParams, user?.role]);

  if (isLoading) {
    return (
      <main
        id='main-content-section'
        className='flex flex-1 items-center justify-center bg-[linear-gradient(180deg,#f8fbfd_0%,#f3f7fb_100%)] px-4'
      >
        <LoadingSpinner size='lg' text='Loading secure access...' />
      </main>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <LoginShell>
      <LoginForm />
    </LoginShell>
  );
}
