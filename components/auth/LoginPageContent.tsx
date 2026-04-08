"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { MedicalSpinner } from "@/components/auth/MedicalSpinner";
import { useAuth } from "@/lib/auth-context";
import {
  CheckCircle2,
  Clock3,
  FileText,
  FlaskConical,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const trustHighlights = [
  {
    icon: ShoppingBag,
    title: "Order tests with confidence",
    description:
      "Shop physician-reviewed diagnostics online with transparent access to your account, orders, and results.",
  },
  {
    icon: FileText,
    title: "Results in one secure portal",
    description:
      "Track orders, review reports, and keep your testing history organized in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Built for protected health data",
    description:
      "HIPAA-conscious access patterns, encrypted sessions, and CLIA-certified partner lab workflows.",
  },
];

const trustStats = [
  {
    icon: Clock3,
    label: "Typical results window",
    value: "24-72 h",
  },
  {
    icon: MapPin,
    label: "Partner lab reach",
    value: "Nationwide",
  },
  {
    icon: Lock,
    label: "Account access",
    value: "Encrypted",
  },
];

export function LoginPageContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

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
      <div className='flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f9fc_0%,#eef3f8_100%)]'>
        <MedicalSpinner size='lg' />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,rgba(20,124,184,0.08),transparent_28%),linear-gradient(180deg,#f7f9fc_0%,#eef3f8_100%)]'>
      <div className='mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10 xl:py-12'>
        <div className='grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,30rem)] lg:items-stretch xl:gap-6'>
          <section className='order-2 overflow-hidden rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,#10283f_0%,#14324c_100%)] text-white shadow-[0_28px_70px_-42px_rgba(15,23,42,0.8)] sm:rounded-[28px] lg:order-1 lg:rounded-[32px]'>
            <div className='border-b border-white/10 px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:px-8 xl:px-10'>
              <div className='inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-100 sm:text-[11px]'>
                <FlaskConical className='h-3.5 w-3.5 shrink-0' />
                <span className='truncate'>EzLabTesting account access</span>
              </div>

              <h1 className='mt-4 max-w-[13ch] text-[2rem] font-semibold tracking-[-0.03em] text-white xs:text-[2.25rem] sm:text-[2.7rem] lg:text-[3rem] xl:text-[3.35rem]'>
                Modern access to lab testing and results
              </h1>

              <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:mt-4 sm:text-[15px] sm:leading-7'>
                Sign in to manage orders, review reports, and move through your
                testing journey with the confidence of a medical-grade
                experience designed for online care.
              </p>

              <div className='mt-5 flex flex-col gap-2.5 xs:flex-row xs:flex-wrap sm:gap-3'>
                <Link
                  href='/tests'
                  className='inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 xs:w-auto'
                >
                  Browse tests
                </Link>
                <Link
                  href='/find-lab-center'
                  className='inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 xs:w-auto'
                >
                  Find a lab center
                </Link>
              </div>
            </div>

            <div className='px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:px-8 lg:py-8 xl:px-10'>
              <div className='grid gap-3 sm:gap-4'>
                {trustHighlights.map((item) => (
                  <div
                    key={item.title}
                    className='rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm sm:rounded-3xl'
                  >
                    <div className='flex items-start gap-3 sm:gap-4'>
                      <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-100 sm:h-10 sm:w-10 sm:rounded-2xl'>
                        <item.icon className='h-4 w-4 sm:h-5 sm:w-5' />
                      </span>
                      <div className='min-w-0'>
                        <h2 className='text-[15px] font-semibold text-white sm:text-base'>
                          {item.title}
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-slate-200'>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-5 grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'>
                {trustStats.map((item) => (
                  <div
                    key={item.label}
                    className='rounded-[22px] border border-white/10 bg-[#173854] px-4 py-4 sm:rounded-3xl'
                  >
                    <div className='flex min-w-0 items-center gap-2 text-sky-100'>
                      <item.icon className='h-4 w-4 shrink-0' />
                      <span className='text-[11px] font-medium uppercase tracking-[0.12em] text-slate-300 sm:text-xs sm:tracking-[0.14em]'>
                        {item.label}
                      </span>
                    </div>
                    <p className='mt-2 text-[1.65rem] font-semibold tracking-[-0.02em] text-white sm:mt-3 sm:text-2xl'>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className='mt-5 flex items-start gap-3 rounded-[22px] border border-emerald-300/15 bg-emerald-400/8 px-4 py-4 text-sm text-emerald-50 sm:rounded-3xl'>
                <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-emerald-300' />
                <p className='leading-6'>
                  Your sign-in gives you access to test orders, digital reports,
                  and secure account tools without leaving the storefront
                  experience.
                </p>
              </div>
            </div>
          </section>

          <section className='order-1 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_24px_56px_-38px_rgba(15,23,42,0.35)] sm:rounded-[28px] lg:order-2 lg:rounded-[32px]'>
            <div className='border-b border-slate-200/80 px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:px-8 lg:py-7'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700 sm:text-[11px] sm:tracking-[0.22em]'>
                Patient and provider sign in
              </p>
              <h2 className='mt-2 text-[1.9rem] font-semibold tracking-[-0.03em] text-slate-950 sm:mt-3 sm:text-[2rem]'>
                Sign in securely
              </h2>
              <p className='mt-2 max-w-md text-sm leading-6 text-slate-600 sm:mt-3'>
                Access your account to view orders, monitor testing progress,
                and download reports from a professional, privacy-conscious
                portal.
              </p>
            </div>

            <div className='px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:px-8 lg:py-8'>
              <Suspense
                fallback={
                  <div className='flex items-center justify-center py-10'>
                    <MedicalSpinner size='md' />
                  </div>
                }
              >
                <LoginForm />
              </Suspense>

              <div className='mt-5 rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-600 sm:mt-6 sm:rounded-3xl'>
                <div className='flex items-start gap-3'>
                  <Lock className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' />
                  <p className='leading-6'>
                    Session access is encrypted to help protect personal health
                    information and testing activity.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className='mt-6 flex flex-col gap-3 border-t border-slate-300/70 px-1 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between'>
          <p>© 2026 EzLabTesting. All rights reserved.</p>
          <nav className='flex flex-wrap items-center gap-x-4 gap-y-2'>
            <Link
              href='/privacy-policy'
              className='transition-colors hover:text-slate-700'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms-of-service'
              className='transition-colors hover:text-slate-700'
            >
              Terms of Service
            </Link>
            <Link
              href='/hipaa-notice'
              className='transition-colors hover:text-slate-700'
            >
              HIPAA Notice
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
