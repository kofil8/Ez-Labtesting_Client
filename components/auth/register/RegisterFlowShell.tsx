"use client";

import { Shield, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type RegisterStep = 1 | 2;

interface RegisterFlowShellProps {
  step: RegisterStep;
  title: string;
  subtitle: string;
  children: ReactNode;
  badgeText?: string;
}

const steps = [
  { id: 1, label: "Account", description: "Secure account setup" },
  { id: 2, label: "Medical", description: "Optional health details" },
] as const;

export function RegisterFlowShell({
  step,
  title,
  subtitle,
  children,
  badgeText,
}: RegisterFlowShellProps) {
  return (
    <main
      id='main-content-section'
      className='flex-1 bg-[radial-gradient(circle_at_6%_6%,rgba(37,99,235,0.08),transparent_28%),radial-gradient(circle_at_95%_12%,rgba(14,116,144,0.08),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#f3f7fd_100%)]'
    >
      <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10'>
        <div className='grid items-start gap-6 lg:grid-cols-[minmax(300px,360px),1fr]'>
          <aside className='hidden rounded-2xl border border-blue-200/70 bg-[linear-gradient(160deg,#0f4aa3_0%,#0a4f7d_100%)] p-7 text-white shadow-[0_20px_45px_-28px_rgba(15,74,163,0.75)] lg:flex lg:min-h-[620px] lg:flex-col lg:justify-between'>
            <div className='space-y-7'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100'>
                  Ez LabTesting
                </p>
                <h1 className='mt-2 text-3xl font-semibold leading-tight'>
                  Private, accurate, and secure diagnostics.
                </h1>
              </div>

              <div className='space-y-3'>
                <div className='rounded-xl border border-white/20 bg-white/10 p-3.5'>
                  <p className='text-sm font-semibold'>HIPAA-conscious platform</p>
                  <p className='mt-1 text-xs text-blue-100'>
                    We use encrypted storage and strict access controls for your data.
                  </p>
                </div>
                <div className='rounded-xl border border-white/20 bg-white/10 p-3.5'>
                  <p className='text-sm font-semibold'>CLIA-certified lab network</p>
                  <p className='mt-1 text-xs text-blue-100'>
                    Results are processed through accredited partner laboratories.
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-white/20 bg-white/10 p-3.5 text-xs text-blue-100'>
              <p className='font-semibold text-white'>Questions before signing up?</p>
              <p className='mt-1'>
                Review our <Link href='/privacy-policy' className='underline underline-offset-2'>Privacy Policy</Link> and <Link href='/hipaa-notice' className='underline underline-offset-2'>HIPAA Notice</Link>.
              </p>
            </div>
          </aside>

          <section className='rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)]'>
            <div className='border-b border-slate-200 px-5 py-5 sm:px-7'>
              <div className='flex items-center justify-between gap-3'>
                <div className='inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
                  <ShieldCheck className='h-3.5 w-3.5' />
                  <span>Your information is encrypted and protected</span>
                </div>
                {badgeText ? (
                  <span className='rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800'>
                    {badgeText}
                  </span>
                ) : null}
              </div>

              <div className='mt-5 space-y-2'>
                <h2 className='text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl'>
                  {title}
                </h2>
                <p className='text-sm text-slate-600'>{subtitle}</p>
              </div>

              <ol className='mt-5 grid grid-cols-2 gap-3' aria-label='Registration progress'>
                {steps.map((item) => {
                  const isActive = item.id === step;
                  const isComplete = item.id < step;

                  return (
                    <li
                      key={item.id}
                      className={`rounded-xl border px-3 py-2.5 transition-colors ${
                        isActive
                          ? "border-blue-300 bg-blue-50"
                          : isComplete
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <p className='text-xs font-medium text-slate-500'>Step {item.id}</p>
                      <p className='mt-0.5 text-sm font-semibold text-slate-900'>{item.label}</p>
                      <p className='mt-0.5 text-xs text-slate-500'>{item.description}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className='px-5 py-6 sm:px-7 sm:py-7'>
              {children}

              <div className='mt-6 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-600'>
                <div className='flex items-start gap-2'>
                  <Shield className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-700' />
                  <p>
                    We only collect data needed to support your testing experience and never sell your health information.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
