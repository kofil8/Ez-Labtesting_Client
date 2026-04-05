import { MFAVerificationForm } from "@/components/auth/MFAVerificationForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Suspense } from "react";

export const metadata = {
  title: "Two-Factor Authentication | Ez LabTesting",
  description: "Enter your verification code",
};

export default function MFAPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <PageContainer>
          <div className='max-w-md mx-auto py-12'>
            <Suspense
              fallback={
                <div className='flex items-center justify-center py-12'>
                  <LoadingSpinner />
                </div>
              }
            >
              <MFAVerificationForm />
            </Suspense>
          </div>
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}
