import { Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { LOGIN_COPY, LOGIN_LEGAL_LINKS } from "./constants";

interface LoginShellProps {
  children: ReactNode;
}

export function LoginShell({ children }: LoginShellProps) {
  return (
    <main
      id='main-content-section'
      className='relative flex-1 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40'
    >
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute -top-20 right-[10%] h-64 w-64 rounded-full bg-sky-100/70 blur-3xl' />
        <div className='absolute bottom-[-5rem] left-[12%] h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl' />
      </div>

      <div className='mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12'>
        <div className='w-full max-w-[32rem] lg:max-w-[38rem]'>
          <section className='overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur'>
            <header className='border-b border-slate-200/80 px-6 py-6 sm:px-8 sm:py-7'>
              <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800'>
                <ShieldCheck className='h-3.5 w-3.5' />
                <span>{LOGIN_COPY.badge}</span>
              </div>
              <h1 className='mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.05rem]'>
                {LOGIN_COPY.title}
              </h1>
              <p className='mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]'>
                {LOGIN_COPY.description}
              </p>

              <div className='mt-4 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-3'>
                <div className='inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 px-2.5 py-1.5'>
                  <Clock3 className='h-3.5 w-3.5 text-primary-700' />
                  <span>Fast account access</span>
                </div>
                <div className='inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 px-2.5 py-1.5'>
                  <FileCheck2 className='h-3.5 w-3.5 text-primary-700' />
                  <span>Track every order</span>
                </div>
                <div className='inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 px-2.5 py-1.5'>
                  <ShieldCheck className='h-3.5 w-3.5 text-primary-700' />
                  <span>Protected health data</span>
                </div>
              </div>
            </header>

            <div className='px-6 py-6 sm:px-8 sm:py-8'>{children}</div>
          </section>

          <footer className='mt-4 px-1 text-center text-xs text-slate-500'>
            <p>{LOGIN_COPY.legalNote}</p>
            <nav className='mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2'>
              {LOGIN_LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </footer>
        </div>
      </div>
    </main>
  );
}
