"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { MedicalSpinner } from "@/components/auth/MedicalSpinner";
import { useAuth } from "@/lib/auth-context";
import { Clock3, FlaskConical, Lock, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export function LoginPageContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const fromParam = searchParams.get("from");
      const safeFrom =
        fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
          ? fromParam
          : null;

      if (safeFrom) {
        router.push(safeFrom);
        return;
      }

      const role = user?.role;
      const roleRedirect =
        role === "admin"
          ? "/admin"
          : role === "lab_partner"
            ? "/dashboard/lab-partner"
            : "/dashboard/customer";

      router.push(roleRedirect);
    }
  }, [isAuthenticated, isLoading, router, searchParams, user?.role]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50'>
        <MedicalSpinner size='lg' />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-[calc(100vh-4.25rem)] bg-gradient-to-b from-[#eef2f7] to-[#e4eaf3] overflow-x-hidden'>
      <div className='mx-auto w-full max-w-[1280px] px-3 pb-8 pt-4 sm:px-5 sm:pt-6 md:pt-8 lg:px-8 lg:pt-10'>
        {/* ---- Main Card ---- */}
        <div
          className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl transition-all duration-700 ease-out md:rounded-3xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className='grid lg:grid-cols-[1.05fr_1fr]'>
            {/* ======= LEFT PANEL — Brand / Trust ======= */}

            {/* Mobile: compact blue banner */}
            <div className='flex flex-col gap-3 bg-gradient-to-r from-[#2845a7] to-[#1d327f] px-5 py-5 text-white sm:flex-row sm:items-center sm:gap-5 sm:px-7 sm:py-6 lg:hidden'>
              <div className='flex items-center gap-3'>
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15'>
                  <FlaskConical className='h-5 w-5 text-blue-100' />
                </span>
                <div>
                  <h1 className='text-lg font-bold leading-tight sm:text-xl'>
                    Order tests, view results, stay informed
                  </h1>
                  <p className='mt-0.5 text-xs text-blue-100/90 sm:text-sm'>
                    CLIA-certified · HIPAA-compliant · Nationwide
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop: full aside */}
            <aside className='relative hidden overflow-hidden bg-gradient-to-b from-[#2845a7] via-[#213f9e] to-[#1d327f] p-10 text-white xl:p-12 lg:flex'>
              {/* Decorative circles */}
              <div className='pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/[0.04]' />
              <div className='pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-white/[0.03]' />

              <div className='relative z-10 flex h-full flex-col justify-between gap-10'>
                <div className='space-y-7'>
                  <div className='flex items-center gap-2'>
                    <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-white/15'>
                      <FlaskConical className='h-5 w-5 text-blue-100' />
                    </span>
                    <span className='text-xs font-bold uppercase tracking-[0.16em] text-blue-200'>
                      EzLabTesting
                    </span>
                  </div>

                  <h1 className='max-w-[14ch] text-[40px] font-bold leading-[1.08] xl:text-[46px]'>
                    Order tests, view results, stay informed
                  </h1>

                  <p className='max-w-[42ch] text-[15px] leading-relaxed text-blue-50/90'>
                    Secure, physician-reviewed reports from CLIA-certified
                    partner labs, with fast digital access for patients,
                    clinicians, and lab partners.
                  </p>

                  <div className='space-y-2.5'>
                    {[
                      {
                        icon: ShieldCheck,
                        label: "HIPAA-compliant data protection",
                      },
                      { icon: Lock, label: "Bank-grade encryption" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className='flex items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.08] px-4 py-3 backdrop-blur-sm transition-colors hover:bg-white/[0.12]'
                      >
                        <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3b78ef]/80'>
                          <item.icon className='h-4 w-4' />
                        </span>
                        <span className='text-sm font-medium text-blue-50'>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-xl border border-white/[0.12] bg-white/[0.07] px-4 py-3.5'>
                    <div className='mb-1.5 flex items-center gap-2'>
                      <Clock3 className='h-4 w-4 text-blue-200' />
                      <p className='text-2xl font-bold leading-none xl:text-3xl'>
                        24–72 h
                      </p>
                    </div>
                    <p className='text-[11px] text-blue-200/80'>
                      Typical results window*
                    </p>
                  </div>
                  <div className='rounded-xl border border-white/[0.12] bg-white/[0.07] px-4 py-3.5'>
                    <div className='mb-1.5 flex items-center gap-2'>
                      <MapPin className='h-4 w-4 text-blue-200' />
                      <p className='text-2xl font-bold leading-none xl:text-3xl'>
                        Nationwide
                      </p>
                    </div>
                    <p className='text-[11px] text-blue-200/80'>
                      Partner lab network
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* ======= RIGHT PANEL — Login Form ======= */}
            <section className='flex items-center justify-center bg-[#f8fafc] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-0'>
              <div className='w-full max-w-[440px]'>
                <div className='rounded-2xl border border-slate-100 bg-white px-5 pb-7 pt-7 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)] sm:rounded-3xl sm:px-8 sm:pb-9 sm:pt-9'>
                  {/* Form header */}
                  <div className='mb-6 text-center sm:mb-7'>
                    <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-[#2156d4]'>
                      EZLABTESTING
                    </p>
                    <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'>
                      Sign in to your account
                    </h2>
                    <p className='mt-2 text-sm leading-relaxed text-slate-500'>
                      Patients &amp; providers — access lab testing, orders, and
                      results in one place.
                    </p>
                  </div>

                  <Suspense
                    fallback={
                      <div className='flex items-center justify-center py-10'>
                        <MedicalSpinner size='md' />
                      </div>
                    }
                  >
                    <LoginForm />
                  </Suspense>
                </div>

                {/* HIPAA badge below card */}
                <p className='mt-5 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400'>
                  <Lock className='h-3.5 w-3.5 text-emerald-500' />
                  HIPAA-compliant · your health data is encrypted
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* ---- Footer strip ---- */}
        <footer className='mt-6 flex flex-col items-center gap-2 border-t border-slate-300/60 pt-4 text-[10px] uppercase tracking-[0.14em] text-slate-400 sm:flex-row sm:justify-between sm:text-[11px]'>
          <p>© 2026 EzLabTesting. All rights reserved.</p>
          <nav className='flex items-center gap-5'>
            <Link
              href='/privacy-policy'
              className='transition-colors hover:text-slate-600'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms-of-service'
              className='transition-colors hover:text-slate-600'
            >
              Terms of Service
            </Link>
            <Link
              href='/hipaa-notice'
              className='transition-colors hover:text-slate-600'
            >
              Compliance
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
