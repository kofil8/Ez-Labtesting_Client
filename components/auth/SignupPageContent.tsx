"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PageContainer } from "@/components/shared/PageContainer";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export function SignupPageContent() {
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
      <div className='flex items-center justify-center py-12'>
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render signup form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <PageContainer>
      <div className='max-w-md mx-auto py-12'>
        <h1 className='text-3xl font-bold text-center mb-8'>Create Account</h1>
        <Suspense
          fallback={
            <div className='flex items-center justify-center py-12'>
              <LoadingSpinner />
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </PageContainer>
  );
}
