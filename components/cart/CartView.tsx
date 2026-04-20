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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hook/use-toast";
import { validatePromoCode } from "@/lib/api";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { FlaskConical, Lock, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CartView() {
  const router = useRouter();
  const { toast } = useToast();
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

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;

    setValidating(true);
    try {
      const result = await validatePromoCode(promoCodeInput);
      if (result.valid) {
        setPromoCode(promoCodeInput.toUpperCase(), result.discount);
        setPromoCodeInput("");
        toast({
          title: "Promo code applied!",
          description: `You saved ${Math.round(result.discount * 100)}%`,
        });
      } else {
        toast({
          title: "Invalid promo code",
          description: "The promo code you entered is not valid.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Unable to validate promo code. Please check the code and try again.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const handleRemovePromo = () => {
    clearPromoCode();
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
                    onClick={handleApplyPromo}
                    disabled={!promoCodeInput.trim() || validating}
                    variant='secondary'
                    className='text-xs h-9 px-4 shrink-0'
                  >
                    {validating ? "..." : "Apply"}
                  </Button>
                </div>
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
  );
}
