import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata = {
  title: "Forgot Password | Ez LabTesting",
  description: "Reset your Ez LabTesting password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
            <div className="w-full max-w-md">
              {/* Header Section */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Forgot Your <span className="text-gradient-primary">Password?</span>
                </h1>
                <p className="text-muted-foreground text-base">
                  Enter your email address and we&apos;ll send you an OTP code to reset your password.
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                  </div>
                }
              >
                <ForgotPasswordForm />
              </Suspense>
            </div>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}

