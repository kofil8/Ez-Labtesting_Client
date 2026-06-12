import { LoginPage as LoginPageView } from "@/components/auth/login/login-page";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <LoadingSpinner />
        </div>
      }
    >
      <LoginPageView />
    </Suspense>
  );
}
