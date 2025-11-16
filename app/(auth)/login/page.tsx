import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata = {
  title: "Login | Ez LabTesting",
  description: "Sign in to your account",
};

export default function LoginPage() {
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
