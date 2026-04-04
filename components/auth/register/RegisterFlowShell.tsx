"use client";

import { Shield, ShieldCheck } from "lucide-react";
import { ReactNode } from "react";

interface RegisterFlowShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  badgeText?: string;
}

export function RegisterFlowShell({
  title,
  subtitle,
  children,
  badgeText,
}: RegisterFlowShellProps) {
  return (
    <main
      id='main-content-section'
      className='flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(8,145,178,0.18),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(37,99,235,0.18),transparent_26%),linear-gradient(180deg,#eff6ff_0%,#f8fbff_38%,#f4f7fb_100%)]'
    >
      <div className='mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10'>
        <div className='flex justify-center'>
          <section className='w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/95 shadow-[0_32px_80px_-42px_rgba(15,23,42,0.55)] backdrop-blur-sm'>
            <div className='border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0.88))] px-5 py-5 sm:px-8 sm:py-7'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/90 px-3 py-1.5 text-xs font-semibold text-blue-700'>
                  <ShieldCheck className='h-3.5 w-3.5' />
                  <span>Your information is encrypted and protected</span>
                </div>
                {badgeText ? (
                  <span className='rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800'>
                    {badgeText}
                  </span>
                ) : null}
              </div>

              <div className='mt-6 space-y-3'>
                <h2 className='max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl'>
                  {title}
                </h2>
                <p className='max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]'>
                  {subtitle}
                </p>
              </div>
            </div>

            <div className='px-5 py-6 sm:px-8 sm:py-8'>
              {children}

              <div className='mt-8 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3.5 text-xs text-slate-600'>
                <div className='flex items-start gap-2'>
                  <Shield className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-700' />
                  <p>
                    We only collect data needed to support your testing
                    experience and never sell your health information.
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
