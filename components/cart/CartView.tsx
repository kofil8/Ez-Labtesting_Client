"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  applyBackendPromoCode,
  removeBackendPromoCode,
} from "@/lib/services/promo-code.service";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { FlaskConical, Gift, Lock, ShieldCheck, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NEW_USER_PROMO_CODE = "NEW10";
const CART_EXIT_OFFER_KEY = "ez-cart-exit-offer-seen";

export function CartView() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscount = useCartStore((state) => state.getDiscount);
  const getTotal = useCartStore((state) => state.getTotal);
  const appliedPromoCode = useCartStore((state) => state.promoCode);
  const setPromoCode = useCartStore((state) => state.setPromoCode);
  const clearPromoCode = useCartStore((state) => state.clearPromoCode);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [validating, setValidating] = useState(false);
  const [showExitOffer, setShowExitOffer] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const isNewVisitor = !isLoading && !isAuthenticated;

  useEffect(() => {
    if (!isNewVisitor || appliedPromoCode || items.length === 0) return;
    if (sessionStorage.getItem(CART_EXIT_OFFER_KEY) === "true") return;

    const handleMouseOut = (event: MouseEvent) => {
      if (event.clientY > 12 || event.relatedTarget) return;
      sessionStorage.setItem(CART_EXIT_OFFER_KEY, "true");
      setShowExitOffer(true);
    };

    document.addEventListener("mouseout", handleMouseOut);

    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, [appliedPromoCode, isNewVisitor, items.length]);

  const handleApplyPromo = async (code = promoCodeInput) => {
    if (!code.trim()) return;

    if (!isAuthenticated) {
      setPromoCodeInput(code.toUpperCase());
      toast({
        title: "Sign in to apply this code",
        description: "Promo codes are validated at checkout after sign-in.",
      });
      return;
    }

    setValidating(true);
    try {
      const normalizedCode = code.toUpperCase();
      const result = await applyBackendPromoCode(normalizedCode);

      setPromoCode(result.code, result.discountRate);
      setPromoCodeInput("");
      setShowExitOffer(false);
      toast({
        title: "Promo code applied!",
        description:
          result.discountAmount > 0
            ? `You saved ${formatCurrency(result.discountAmount)}`
            : "Code accepted. Discount will update when eligible cart items are available.",
      });
    } catch (error) {
      toast({
        title: "Promo code not applied",
        description:
          error instanceof Error
            ? error.message
            : "Unable to validate promo code. Please check the code and try again.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleRemovePromo = () => {
    clearPromoCode();

    if (isAuthenticated) {
      void removeBackendPromoCode().catch((error) => {
        toast({
          title: "Promo removed locally",
          description:
            error instanceof Error
              ? error.message
              : "Server promo state could not be refreshed.",
          variant: "destructive",
        });
      });
    }

    toast({
      title: "Promo code removed",
      description: "The discount has been removed from your order.",
    });
  };

  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center border border-border rounded-xl bg-card'>
        <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
          <FlaskConical className='h-8 w-8 text-primary' />
        </div>
        <h2 className='text-xl font-semibold text-foreground mb-2'>
          Your cart is empty
        </h2>
        <p className='text-sm text-muted-foreground mb-6 max-w-xs'>
          Browse our lab tests and add them to your cart to get started
        </p>
        <Button asChild>
          <Link href='/tests'>Browse Tests</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* Cart Items */}
      <div className='lg:col-span-2 space-y-3'>
        {items.map((item) => (
          <div
            key={item.id}
            className='flex items-start justify-between gap-4 p-4 sm:p-5 rounded-xl border border-border bg-card'
          >
            {/* Left: icon + info */}
            <div className='flex items-start gap-3 flex-1 min-w-0'>
              <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                <FlaskConical className='h-4 w-4 text-primary' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-sm sm:text-base text-foreground leading-snug'>
                  {item.name}
                </p>
                <div className='flex items-center gap-2 mt-1.5 flex-wrap'>
                  <Badge
                    variant='secondary'
                    className='text-[10px] px-2 py-0.5 rounded-md font-medium'
                  >
                    {item.itemType === "PANEL"
                      ? "Panel"
                      : item.isPanel
                        ? "Panel Test"
                        : "Lab Test"}
                  </Badge>
                  {(item.itemType === "PANEL" || item.isPanel) && (
                    <span className='text-[10px] text-muted-foreground'>
                      {item.itemType === "PANEL"
                        ? `${item.testIds.length} tests included`
                        : "Sellable panel product"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: price + remove */}
            <div className='flex flex-col items-end gap-2 shrink-0'>
              <span className='font-bold text-sm sm:text-base text-foreground'>
                {formatCurrency(item.price)}
              </span>
              <button
                onClick={() => {
                  removeItem(item.id);
                  toast({
                    title: "Removed from cart",
                    description: `${item.name} has been removed.`,
                  });
                }}
                className='flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors'
              >
                <Trash2 className='h-3.5 w-3.5' />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className='lg:col-span-1'>
        <Card className='sticky top-20 border border-border rounded-xl shadow-sm'>
          <CardHeader className='px-5 sm:px-6 pt-5 pb-4'>
            <CardTitle className='text-base sm:text-lg font-semibold'>
              Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className='px-5 sm:px-6 space-y-4'>
            {/* Promo Code */}
            <div className='space-y-2'>
              <label className='text-xs font-medium text-foreground'>
                Promo Code
              </label>
              {appliedPromoCode ? (
                <div className='flex items-center justify-between p-2.5 bg-secondary/5 border border-secondary/20 rounded-lg gap-2'>
                  <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <ShieldCheck className='h-4 w-4 text-secondary shrink-0' />
                    <div>
                      <p className='text-xs font-semibold text-secondary'>
                        {appliedPromoCode} Applied
                      </p>
                      <p className='text-[10px] text-muted-foreground'>
                        {Math.round((discount / subtotal) * 100)}% discount
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleRemovePromo}
                    variant='ghost'
                    size='sm'
                    className='text-xs h-7 shrink-0 text-muted-foreground hover:text-destructive'
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  {isNewVisitor ? (
                    <div className='rounded-lg border border-amber-200 bg-amber-50 px-3 py-2'>
                      <div className='flex items-start gap-2'>
                        <Tag className='mt-0.5 h-4 w-4 shrink-0 text-amber-700' />
                        <div className='min-w-0'>
                          <p className='text-xs font-semibold text-amber-950'>
                            Are you a new customer?
                          </p>
                          <button
                            type='button'
                            onClick={() => handleApplyPromo(NEW_USER_PROMO_CODE)}
                            disabled={validating}
                            className='mt-0.5 text-left text-xs font-medium text-amber-800 underline-offset-2 hover:underline disabled:opacity-60'
                          >
                            Use {NEW_USER_PROMO_CODE} for 10% off your first
                            lab test.
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type='button'
                      onClick={() => setPromoCodeInput(NEW_USER_PROMO_CODE)}
                      className='text-left text-xs font-medium text-blue-700 underline-offset-2 hover:underline'
                    >
                      Check for available coupons
                    </button>
                  )}

                  <div className='flex gap-2'>
                    <Input
                      value={promoCodeInput}
                      onChange={(e) =>
                        setPromoCodeInput(e.target.value.toUpperCase())
                      }
                      placeholder='Enter code'
                      disabled={validating}
                      className='text-xs h-9 flex-1'
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleApplyPromo();
                      }}
                    />
                    <Button
                      onClick={() => handleApplyPromo()}
                      disabled={!promoCodeInput.trim() || validating}
                      variant='secondary'
                      className='text-xs h-9 px-4 shrink-0'
                    >
                      {validating ? "..." : "Apply"}
                    </Button>
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Totals */}
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span className='text-foreground'>
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className='flex justify-between text-sm text-secondary'>
                  <span>
                    Discount ({Math.round((discount / subtotal) * 100)}%)
                  </span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className='flex justify-between font-semibold text-base pt-2 border-t border-border mt-2'>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-2 px-5 sm:px-6 pb-5'>
            <Button
              onClick={() => router.push("/checkout")}
              className='w-full h-11 font-semibold'
              size='lg'
            >
              Proceed to Checkout
            </Button>
            <Button variant='outline' asChild className='w-full h-10'>
              <Link href='/tests'>Continue Shopping</Link>
            </Button>
            {/* Security note */}
            <div className='flex items-center justify-center gap-2 pt-1'>
              <Lock className='h-3 w-3 text-muted-foreground' />
              <span className='text-[10px] text-muted-foreground'>
                Secure checkout · HIPAA compliant
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
    <Dialog open={showExitOffer} onOpenChange={setShowExitOffer}>
      <DialogContent className='max-w-md rounded-2xl border-amber-200 p-0'>
        <div className='rounded-t-2xl bg-amber-300 px-6 py-5 text-slate-950'>
          <DialogHeader>
            <div className='mb-3 grid h-11 w-11 place-items-center rounded-full bg-white/75 text-amber-700'>
              <Gift className='h-5 w-5' />
            </div>
            <DialogTitle className='text-xl'>
              Wait, save 10% on your first order
            </DialogTitle>
            <DialogDescription className='text-slate-700'>
              Apply {NEW_USER_PROMO_CODE} before you leave and keep your cart
              discount ready for checkout.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className='space-y-4 px-6 pb-6 pt-5'>
          <div className='flex items-center justify-between rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3'>
            <span className='text-sm font-medium text-slate-700'>
              First-order code
            </span>
            <code className='rounded-md bg-white px-2.5 py-1 text-sm font-bold tracking-wider text-slate-950'>
              {NEW_USER_PROMO_CODE}
            </code>
          </div>
          <div className='grid gap-2 sm:grid-cols-2'>
            <Button
              type='button'
              onClick={() => handleApplyPromo(NEW_USER_PROMO_CODE)}
              disabled={validating}
              className='bg-slate-950 text-white hover:bg-slate-800'
            >
              {validating ? "Applying..." : "Apply Discount"}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => setShowExitOffer(false)}
            >
              Continue browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
