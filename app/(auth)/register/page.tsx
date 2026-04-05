import { RegisterAccountPageContent } from "@/components/auth/register/RegisterAccountPageContent";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Suspense } from "react";

export default function RegisterRootPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <LoadingSpinner />
        </div>
      }
    >
      <RegisterAccountPageContent />
    </Suspense>
  );
}
