"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Tag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PromoCodeTopBannerClientProps {
  code: string;
}

export function PromoCodeTopBannerClient({
  code,
}: PromoCodeTopBannerClientProps) {
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  if (hidden) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className='sticky top-0 z-40 border-b border-yellow-400/70 bg-[#ffd84d] text-slate-950 shadow-sm'>
      <div className='mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2 sm:min-h-12 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-0 lg:px-8'>
        <div className='flex min-w-0 flex-1 items-center gap-2 text-sm font-black sm:justify-start sm:gap-3'>
          <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-orange-600 shadow-sm'>
            <Tag className='h-4 w-4' />
          </span>
          <span className='truncate text-[13px] sm:text-sm'>
            First order: <span className='font-black'>{code}</span>
          </span>
        </div>

        <div className='flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto'>
          <Button
            type='button'
            onClick={handleCopy}
            className='h-8 rounded-lg bg-slate-950 px-2.5 text-xs font-black text-white hover:bg-slate-800 sm:px-3'
          >
            {copied ? (
              <Check className='h-4 w-4' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
            <span className='hidden sm:inline'>
              {copied ? "Copied" : "Copy Code"}
            </span>
          </Button>
          <Button
            asChild
            variant='outline'
            className='h-8 rounded-lg border-yellow-600/20 bg-white/85 px-2.5 text-xs font-bold text-slate-950 shadow-sm hover:bg-white sm:px-3'
          >
            <Link href='/cart'>Go to cart</Link>
          </Button>
          <button
            type='button'
            onClick={() => setHidden(true)}
            className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-slate-950/30'
            aria-label='Dismiss promo code banner'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
