"use client";

import { Suspense, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect to homepage if already logged in
    if (!isLoading && isAuthenticated) {
      const fromParam = searchParams.get("from");
      const safeFrom =
        fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
          ? fromParam
          : null;
      router.push(safeFrom || "/");
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col'>
        <SiteHeader />
        <main className='flex-1 flex items-center justify-center'>
          <LoadingSpinner />
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='max-w-md mx-auto py-12'>
            <h1 className='text-3xl font-bold text-center mb-8'>
              Welcome Back
            </h1>
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            }>
              <LoginForm />
            </Suspense>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
