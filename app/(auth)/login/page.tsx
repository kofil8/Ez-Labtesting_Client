import { Suspense } from "react";
import { LoginPageContent } from "@/components/auth/LoginPageContent";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function LoginPage() {
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
          <LoginPageContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
