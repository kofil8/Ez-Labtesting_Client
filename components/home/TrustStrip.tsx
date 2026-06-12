import { homepageTrustClaims } from "@/lib/copyContent";
import { BadgeCheck, Clock3, LockKeyhole, WalletCards } from "lucide-react";

const icons = [Clock3, LockKeyhole, WalletCards, BadgeCheck];

export function TrustStrip() {
  return (
    <section className='border-b border-sky-100 bg-white py-5 dark:border-slate-800 dark:bg-slate-950'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {homepageTrustClaims.map((label, index) => {
            const Icon = icons[index] || BadgeCheck;
            return (
              <div
                key={label}
                className='flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200'
              >
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm dark:bg-slate-950 dark:text-sky-300'>
                  <Icon className='h-4 w-4' />
                </span>
                <span className='leading-snug'>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
