import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata = {
  title: "Reset Password | Ez LabTesting",
  description: "Create a new password for your Ez LabTesting account",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
            <div className="w-full max-w-md">
              {/* Header Section */}
              <div className="mb-8 text-center">
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
                  Reset Your <span className="text-gradient-success">Password</span>
                </h1>
                <p className="text-muted-foreground text-base">
                  Enter the OTP code sent to your email and create a new password.
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                  </div>
                }
              >
                <ResetPasswordForm />
              </Suspense>
            </div>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}

