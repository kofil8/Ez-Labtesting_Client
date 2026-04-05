import { LoginPageContent } from "@/components/auth/LoginPageContent";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main id='main-content-section' className='flex-none w-full'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center h-screen'>
            <LoadingSpinner />
          </div>
        }
      >
        <LoginPageContent />
      </Suspense>
    </main>
  );
}
