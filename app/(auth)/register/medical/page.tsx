import { RegisterMedicalPageContent } from "@/components/auth/register/RegisterMedicalPageContent";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Suspense } from "react";

export default function RegisterMedicalPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <LoadingSpinner />
        </div>
      }
    >
      <RegisterMedicalPageContent />
    </Suspense>
  );
}
