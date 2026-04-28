import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail } from "lucide-react";
import Link from "next/link";

export function SupportCard() {
  return (
    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <div className='flex flex-col gap-4 xs:flex-row xs:items-start'>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200'>
          <LifeBuoy className='h-5 w-5' />
        </span>
        <div className='min-w-0 flex-1'>
          <h2 className='text-lg font-semibold text-slate-950'>Need help?</h2>
          <p className='mt-1 text-sm leading-6 text-slate-600'>
            Get support with orders, billing, lab visits, or result access.
          </p>
          <div className='mt-4 flex flex-col gap-3 sm:flex-row 2xl:flex-col'>
            <Button asChild className='w-full bg-sky-700 hover:bg-sky-800 sm:w-auto 2xl:w-full'>
              <Link href='/help-center'>Contact Support</Link>
            </Button>
            <Button asChild variant='outline' className='w-full sm:w-auto 2xl:w-full'>
              <a href='mailto:support@ezlabtesting.com'>
                <Mail className='h-4 w-4' />
                Email Support
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
