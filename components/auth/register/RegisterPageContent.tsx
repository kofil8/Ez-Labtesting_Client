"use client";

import { MedicalSpinner } from "@/components/auth/MedicalSpinner";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { RegisterForm } from "./RegisterForm";
import { RegisterShell } from "./RegisterShell";

function getSafeRedirectTarget(from: string | null) {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return null;
  }

  return from;
}

export function RegisterPageContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const from = getSafeRedirectTarget(searchParams.get("from"));
    router.push(from || "/");
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
    <RegisterShell
      title='Create your secure account'
      subtitle='Start with the required details for secure access. Add address details now only if you want a faster checkout later.'
    >
      <RegisterForm />
    </RegisterShell>
  );
}
