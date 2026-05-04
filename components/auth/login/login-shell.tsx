import { ReactNode } from "react";

import { LOGIN_COPY } from "./constants";
import { Header } from "./header";
import { SecureBadge } from "./secure-badge";
import { TrustChips } from "./trust-chips";

interface LoginShellProps {
  children: ReactNode;
}

export function LoginShell({ children }: LoginShellProps) {
  return (
    <main id='main-content-section' className='relative flex-1 bg-slate-50'>
      <Header />

      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl' />
        <div className='absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl' />
        <div className='absolute bottom-[-6rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/20 blur-3xl' />
        <div className='absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,_rgb(37_99_235)_1px,_transparent_0)] [background-size:28px_28px]' />
      </div>

      <section className='relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8'>
        <div className='w-full max-w-[440px]'>
          <section className='rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 sm:p-8'>
            <SecureBadge label={LOGIN_COPY.badge} />
            <h1 className='mt-4 text-[30px] font-bold tracking-tight text-slate-900 sm:text-[34px]'>
              {LOGIN_COPY.title}
            </h1>
            <p className='mt-2 text-sm leading-6 text-slate-500 sm:text-[15px]'>
              {LOGIN_COPY.description}
            </p>

            <div className='mt-6'>{children}</div>
            <TrustChips />
          </section>
        </div>
      </section>
    </main>
  );
}
