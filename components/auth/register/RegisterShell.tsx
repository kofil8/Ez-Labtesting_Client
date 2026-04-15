"use client";

import { ReactNode } from "react";

interface RegisterShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function RegisterShell({
  title,
  subtitle,
  children,
}: RegisterShellProps) {
  return (
    <main
      id='main-content-section'
      className='flex-1 overflow-x-hidden bg-slate-50'
    >
      <div className='mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12'>
        <section className='overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <header className='border-b border-slate-100 px-6 py-8 sm:px-10'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
                {title}
              </h1>
              <p className='text-base text-slate-500'>{subtitle}</p>
            </div>
          </header>

          <div className='px-6 py-8 sm:px-10'>{children}</div>
        </section>
      </div>
    </main>
  );
}
