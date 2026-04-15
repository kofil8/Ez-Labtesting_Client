import { ShieldCheck } from "lucide-react";
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
      className='flex-1 bg-[linear-gradient(180deg,#f8fbfd_0%,#f3f7fb_100%)]'
    >
      <div className='mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14'>
        <div className='w-full max-w-[30rem]'>
          <section className='overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_60px_-38px_rgba(15,23,42,0.28)]'>
            <header className='border-b border-slate-200/80 px-6 py-7 sm:px-8 sm:py-8'>
              <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800'>
                <ShieldCheck className='h-3.5 w-3.5' />
                <span>{LOGIN_COPY.badge}</span>
              </div>
              <h1 className='mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2rem]'>
                {LOGIN_COPY.title}
              </h1>
              <p className='mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]'>
                {LOGIN_COPY.description}
              </p>
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
