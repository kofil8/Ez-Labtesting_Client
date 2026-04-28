import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ErrorStateProps {
  title: string;
  description: string;
  sessionExpired?: boolean;
  action?: ReactNode;
}

export function ErrorState({
  title,
  description,
  sessionExpired = false,
  action,
}: ErrorStateProps) {
  return (
    <section className='rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-sm'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex items-start gap-3'>
          <AlertCircle className='mt-0.5 h-5 w-5 text-rose-600' />
          <div className='space-y-1'>
            <h2 className='text-base font-semibold text-slate-900'>{title}</h2>
            <p className='text-sm text-slate-600'>{description}</p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {action}
          {!action && sessionExpired && (
            <Button asChild aria-label='Sign in to continue'>
              <Link href='/login?from=/dashboard/customer/profile'>Sign In</Link>
            </Button>
          )}
          {!action && !sessionExpired && (
            <Button
              asChild
              variant='outline'
              aria-label='Retry loading profile'
            >
              <Link href='/dashboard/customer/profile'>Retry</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
