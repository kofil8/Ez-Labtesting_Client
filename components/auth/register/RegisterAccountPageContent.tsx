"use client";

import { MedicalSpinner } from "@/components/auth/MedicalSpinner";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { RegisterAccountForm } from "./RegisterAccountForm";
import { RegisterFlowShell } from "./RegisterFlowShell";

export function RegisterAccountPageContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const fromParam = searchParams.get("from");
      const safeFrom =
        fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
          ? fromParam
          : null;
      router.push(safeFrom || "/");
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50'>
        <MedicalSpinner size='lg' text='Loading registration...' />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <RegisterFlowShell
      step={1}
      title='Create your secure account'
      subtitle='Start with your core account details. You can add optional health history in the next step.'
    >
      <RegisterAccountForm />
    </RegisterFlowShell>
  );
}
