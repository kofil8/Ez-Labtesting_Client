"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/store/cart-store";
import { Check, Copy, Tag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const NEW_USER_PROMO_CODE = "NEW10";
const DISMISSED_KEY = "ez-new-user-promo-dismissed";

export function NewUserWelcomeOffer() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const appliedPromoCode = useCartStore((state) => state.promoCode);
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (isLoading || isAuthenticated || appliedPromoCode) return;
    if (localStorage.getItem(DISMISSED_KEY) === "true") return;

    const showTimer = window.setTimeout(() => setVisible(true), 0);
    const compactTimer = window.setTimeout(() => setCompact(true), 5000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(compactTimer);
    };
  }, [appliedPromoCode, isAuthenticated, isLoading]);

  async function copyOfferCode() {
    try {
      await navigator.clipboard?.writeText(NEW_USER_PROMO_CODE);
      setCompact(true);
      toast({
        title: "Code copied",
        description: `Use ${NEW_USER_PROMO_CODE} in cart after sign-in.`,
      });
    } catch (error) {
      toast({
        title: "Code ready",
        description: `Enter ${NEW_USER_PROMO_CODE} in your cart to validate it.`,
      });
    }
  }

  function dismissOffer() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className='sticky top-0 z-[60] border-b border-amber-200 bg-amber-300 text-slate-950 shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8'>
        <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
          <span className='grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/75 text-amber-700'>
            {appliedPromoCode === NEW_USER_PROMO_CODE ? (
              <Check className='h-4 w-4' />
            ) : (
              <Tag className='h-4 w-4' />
            )}
          </span>
          <div className='min-w-0'>
            <p className='truncate text-sm font-bold'>
              {compact
                ? `First order: ${NEW_USER_PROMO_CODE}`
                : "Welcome to Ez LabTesting! Get 10% off your first lab test."}
            </p>
            {!compact ? (
              <p className='hidden text-xs font-medium text-slate-700 sm:block'>
                Use code {NEW_USER_PROMO_CODE} at cart checkout.
              </p>
            ) : null}
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <Button
            type='button'
            size='sm'
            onClick={copyOfferCode}
            disabled={appliedPromoCode === NEW_USER_PROMO_CODE}
            className='h-8 bg-slate-950 px-3 text-xs text-white hover:bg-slate-800'
          >
            <Copy className='h-3.5 w-3.5' />
            {appliedPromoCode === NEW_USER_PROMO_CODE
              ? "Applied"
              : "Copy Code"}
          </Button>
          <Button
            asChild
            size='sm'
            variant='outline'
            className='hidden h-8 border-slate-900/20 bg-white/70 px-3 text-xs hover:bg-white sm:inline-flex'
          >
            <Link href='/cart'>Go to cart</Link>
          </Button>
          <button
            type='button'
            onClick={dismissOffer}
            aria-label='Dismiss welcome offer'
            className='grid h-8 w-8 place-items-center rounded-full text-slate-700 transition hover:bg-slate-950/10 hover:text-slate-950'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}

export { NEW_USER_PROMO_CODE };
