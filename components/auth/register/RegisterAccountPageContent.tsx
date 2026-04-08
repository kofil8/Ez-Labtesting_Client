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
      title='Create your secure account'
      subtitle='Set up secure access in minutes, add a profile photo if you want, and save optional details only when they improve future orders, delivery, and results access.'
      badgeText='Medical checkout ready'
    >
      <RegisterAccountForm />
    </RegisterFlowShell>
  );
}
