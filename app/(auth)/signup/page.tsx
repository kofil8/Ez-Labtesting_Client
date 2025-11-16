import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata = {
  title: "Sign Up | Ez LabTesting",
  description: "Create your account",
};

export default function SignupPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='max-w-md mx-auto py-12'>
            <h1 className='text-3xl font-bold text-center mb-8'>
              Create Account
            </h1>
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            }>
              <SignupForm />
            </Suspense>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
