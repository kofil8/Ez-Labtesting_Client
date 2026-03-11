"use client";

import { MedicalSpinner } from "@/components/auth/MedicalSpinner";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { RegisterFlowShell } from "./RegisterFlowShell";
import { RegisterMedicalForm } from "./RegisterMedicalForm";

export function RegisterMedicalPageContent() {
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
      step={2}
      title='Tell us about your health history'
      subtitle='This step is optional and designed to personalize your care experience.'
      badgeText='Optional'
    >
      <RegisterMedicalForm />
    </RegisterFlowShell>
  );
}
