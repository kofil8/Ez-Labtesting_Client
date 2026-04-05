"use client";

import { Badge } from "@/components/ui/badge";
import { calculateDiscountPercent } from "@/lib/test-utils";
import { formatCurrency } from "@/lib/utils";
import { Test } from "@/types/test";

interface PricingDisplayProps {
  test: Test;
  markupMultiplier?: number;
}

export function PricingDisplay({
  test,
  markupMultiplier = 2.5,
}: PricingDisplayProps) {
  const retailPrice = test.price * markupMultiplier;
  const discountPercent = calculateDiscountPercent(
    test.price,
    markupMultiplier,
  );

  return (
    <div className='space-y-1.5'>
      <div className='flex items-baseline gap-2 flex-wrap'>
        <span className='text-sm text-muted-foreground line-through'>
          ${retailPrice.toFixed(0)}
        </span>
        <span className='text-4xl font-bold text-primary'>
          {formatCurrency(test.price)}
        </span>
        <Badge className='bg-red-500 hover:bg-red-500 text-white text-xs px-2 py-0.5'>
          {discountPercent}% OFF
        </Badge>
      </div>
      <p className='text-xs text-muted-foreground'>
        One-time payment · No hidden fees · Free shipping included
      </p>
    </div>
  );
}
