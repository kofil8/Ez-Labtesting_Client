import { RegisterPageContent } from "@/components/auth/register/RegisterPageContent";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <LoadingSpinner />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
