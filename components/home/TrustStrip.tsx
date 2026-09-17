import { homepageTrustClaims } from "@/lib/copyContent";
import { BadgeCheck, Clock3, LockKeyhole, WalletCards } from "lucide-react";

const icons = [Clock3, LockKeyhole, WalletCards, BadgeCheck];

export function TrustStrip() {
  return (
    <section className='border-b border-sky-100/80 bg-white py-4 shadow-xs dark:border-slate-800 dark:bg-slate-950'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {homepageTrustClaims.map((label, index) => {
            const Icon = icons[index] || BadgeCheck;
            return (
              <div
                key={label}
                className='flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition-all hover:bg-sky-50/50 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-200'
              >
                <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100/70 text-sky-700 shadow-2xs dark:bg-sky-950 dark:text-sky-300'>
                  <Icon className='h-4 w-4' />
                </span>
                <span className='leading-tight font-medium'>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
