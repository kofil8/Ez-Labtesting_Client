import { FlaskConical, ShieldCheck } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/tests", label: "Browse Tests" },
  { href: "/panels", label: "Test Panels" },
  { href: "/find-lab-center", label: "Find Lab Center" },
  { href: "/help-center", label: "Support" },
] as const;

export function Header() {
  return (
    <header className='sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md'>
      <div className='mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='flex min-w-0 items-center gap-2.5 rounded-lg outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-300'
        >
          <span className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-500/30'>
            <FlaskConical className='h-5 w-5' />
          </span>
          <span className='min-w-0'>
            <span className='block truncate text-sm font-semibold text-slate-900 sm:text-base'>
              Ez LabTesting
            </span>
            <span className='hidden text-[11px] text-slate-500 sm:block'>
              Empowering your health journey
            </span>
          </span>
        </Link>

        <nav className='hidden items-center gap-1 md:flex' aria-label='Primary'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='flex items-center gap-2 sm:gap-3'>
          <span className='hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:inline-flex'>
            <ShieldCheck className='h-3.5 w-3.5' />
            Secure access
          </span>
          <Link
            href='/register'
            className='inline-flex h-10 items-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition-all hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'
          >
            Create Account
          </Link>
        </div>
      </div>
    </header>
  );
}
