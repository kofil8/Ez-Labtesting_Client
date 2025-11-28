"use client";

import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Check if auth bypass is enabled for testing
const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

export default function ChangePasswordPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Skip auth check if bypass is enabled
    if (!BYPASS_AUTH && !isLoading && !isAuthenticated) {
      router.push("/login?from=/change-password");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading && !BYPASS_AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Allow rendering without auth when bypass is enabled
  if (!BYPASS_AUTH && (!isAuthenticated || !user)) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="py-12 px-4">
            {/* Header Section */}
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Change Your <span className="text-gradient-success">Password</span>
              </h1>
              <p className="text-muted-foreground text-base">
                Update your password to keep your account secure. Make sure to choose a strong, unique password.
              </p>
            </div>

            {/* Change Password Form */}
            <div className="max-w-md mx-auto">
              <ChangePasswordForm />
            </div>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
