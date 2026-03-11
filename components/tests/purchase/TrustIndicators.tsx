"use client";

import { CheckCircle2, Star } from "lucide-react";

interface TrustIndicatorsProps {
  rating?: number;
  reviewCount?: number;
}

export function TrustIndicators({
  rating = 4.9,
  reviewCount = 2847,
}: TrustIndicatorsProps) {
  return (
    <div className='grid grid-cols-2 gap-2'>
      <div className='flex items-center gap-1.5 p-2.5 rounded-lg bg-muted/50 border border-border'>
        <CheckCircle2 className='h-4 w-4 text-secondary shrink-0' />
        <span className='text-xs font-medium text-foreground'>In Stock</span>
      </div>
      <div className='flex items-center gap-1.5 p-2.5 rounded-lg bg-muted/50 border border-border'>
        <Star className='h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400' />
        <span className='text-xs font-medium text-foreground'>
          {rating}/5 ({reviewCount.toLocaleString()})
        </span>
      </div>
    </div>
  );
}
