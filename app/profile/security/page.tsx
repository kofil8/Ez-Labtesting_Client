import { MFASetupForm } from "@/components/auth/MFASetupForm";
import { AccountSidebar } from "@/components/profile/AccountSidebar";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function SecurityContent() {
  return (
    <div className='space-y-6'>
      <section className='rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(14,165,233,0.12)_0%,rgba(255,255,255,0.96)_52%,rgba(16,185,129,0.08)_100%)] px-6 py-7 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] sm:px-8'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700'>
            <ShieldCheck className='h-5 w-5' />
          </div>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-sky-700'>
              Security
            </p>
            <h1 className='mt-1 text-3xl font-semibold tracking-tight text-slate-950'>
              Account protection
            </h1>
          </div>
        </div>
        <p className='mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base'>
          Set up two-factor authentication to better protect account access and
          sensitive lab information.
        </p>
      </section>

      <MFASetupForm />
    </div>
  );
}

export default function SecurityPage() {
  return (
    <main className='min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef7ff_34%,#f8fbfd_100%)]'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid gap-6 lg:grid-cols-[288px_minmax(0,1fr)]'>
          <AccountSidebar />
          <Suspense fallback={<div className='text-sm text-slate-500'>Loading security settings...</div>}>
            <SecurityContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
