"use client";

import { getTestDetailConfig } from "@/app/(shop)/tests/data/test-detail-config";
import { CheckCircle2 } from "lucide-react";

interface WhatsIncludedProps {
  category?: string;
}

export function WhatsIncluded({ category }: WhatsIncludedProps) {
  const config = getTestDetailConfig(category);

  return (
    <div className='space-y-3'>
      <p className='font-semibold text-sm text-center text-foreground'>
        Everything Included (No Extra Fees)
      </p>
      <div className='grid gap-1.5'>
        {config.whatsIncluded.map((item, index) => (
          <div
            key={index}
            className='flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/50'
          >
            <CheckCircle2 className='h-4 w-4 text-secondary shrink-0 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <div className='font-medium text-xs text-foreground'>
                {item.title}
              </div>
              <div className='text-xs text-muted-foreground'>
                {item.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
