import { AccountSidebar } from "@/components/profile/AccountSidebar";
import { ResultsList } from "@/components/results/ResultsList";

export const dynamic = "force-dynamic";

export default function ProfileOrdersPage() {
  return (
    <main className='min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef7ff_34%,#f8fbfd_100%)]'>
      <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid gap-6 lg:grid-cols-[288px_minmax(0,1fr)]'>
          <AccountSidebar />

          <div className='space-y-6'>
            <section className='rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(14,165,233,0.12)_0%,rgba(255,255,255,0.96)_52%,rgba(16,185,129,0.08)_100%)] px-6 py-7 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] sm:px-8'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-sky-700'>
                Order History
              </p>
              <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950'>
                Track every order in one place
              </h1>
              <p className='mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base'>
                Open requisitions, monitor current status, and return to completed
                reports without jumping between pages.
              </p>
            </section>

            <ResultsList />
          </div>
        </div>
      </div>
    </main>
  );
}
