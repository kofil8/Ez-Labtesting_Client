import { Suspense } from "react";
import { SignupPageContent } from "@/components/auth/SignupPageContent";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function SignupPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <Suspense
          fallback={
            <div className='flex items-center justify-center py-12'>
              <LoadingSpinner />
            </div>
          }
        >
          <SignupPageContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
