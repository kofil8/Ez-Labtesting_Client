import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className='rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-4 py-8 text-center sm:px-5'>
      <div className='mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm'>
        <Icon className='h-5 w-5' />
      </div>
      <h3 className='mt-4 text-base font-semibold text-slate-950'>{title}</h3>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600'>
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Button asChild className='mt-5 w-full bg-blue-600 hover:bg-blue-700 sm:w-auto'>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
