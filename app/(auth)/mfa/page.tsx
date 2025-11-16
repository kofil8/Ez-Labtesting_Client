import { Suspense } from "react";
import { MFAForm } from "@/components/auth/MFAForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata = {
  title: "Two-Factor Authentication | Ez LabTesting",
  description: "Enter your verification code",
};

export default function MFAPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='max-w-md mx-auto py-12'>
            <h1 className='text-3xl font-bold text-center mb-4'>
              Verify Your Identity
            </h1>
            <p className='text-center text-muted-foreground mb-8'>
              Enter the 6-digit code sent to your device
            </p>
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            }>
              <MFAForm />
            </Suspense>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
