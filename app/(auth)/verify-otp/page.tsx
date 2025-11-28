import { Suspense } from "react";
import { VerifyOTPForm } from "@/components/auth/VerifyOTPForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata = {
  title: "Verify Email | Ez LabTesting",
  description: "Verify your email address",
};

export default function VerifyOTPPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='max-w-md mx-auto py-12'>
            <h1 className='text-3xl font-bold text-center mb-8'>
              Verify Your Email
            </h1>
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            }>
              <VerifyOTPForm />
            </Suspense>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}






