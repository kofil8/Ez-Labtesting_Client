"use client";

import { ShieldCheck } from "lucide-react";

interface MoneyBackGuaranteeProps {
  days?: number;
  message?: string;
}

export function MoneyBackGuarantee({
  days = 30,
  message,
}: MoneyBackGuaranteeProps) {
  return (
    <div className='p-3 sm:p-4 rounded-lg bg-secondary/5 border border-secondary/20'>
      <div className='flex items-start gap-3'>
        <ShieldCheck className='h-5 w-5 text-secondary shrink-0 mt-0.5' />
        <div className='flex-1 min-w-0'>
          <div className='font-semibold text-sm text-foreground'>
            {days}-Day Money-Back Guarantee
          </div>
          <div className='text-xs text-muted-foreground mt-0.5'>
            {message ||
              `Not satisfied? Full refund within ${days} days, no questions asked.`}
          </div>
        </div>
      </div>
    </div>
  );
}
