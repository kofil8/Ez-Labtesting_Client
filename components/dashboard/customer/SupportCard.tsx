import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export function SupportCard() {
  return (
    <section className='rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6'>
      <div className='flex items-start gap-3'>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600'>
          <LifeBuoy className='h-5 w-5' />
        </span>
        <div className='min-w-0'>
          <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>
            Care support
          </p>
          <h2 className='mt-1 text-lg font-semibold text-slate-950'>
            Need help?
          </h2>
          <p className='mt-2 text-sm leading-6 text-slate-600'>
            Get help with orders, billing, lab visits, requisitions, or result
            access.
          </p>
        </div>
      </div>

      <div className='mt-5 grid gap-2'>
        <Button asChild className='w-full bg-blue-600 hover:bg-blue-700'>
          <Link href='/dashboard/customer/support'>
            <MessageCircle className='h-4 w-4' />
            Contact Support
          </Link>
        </Button>
        <Button asChild variant='outline' className='w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700'>
          <a href='mailto:support@ezlabtesting.com'>
            <Mail className='h-4 w-4' />
            Email Support
          </a>
        </Button>
      </div>
    </section>
  );
}
