"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hook/use-toast";
import { validatePromoCode } from "@/lib/api";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CartView() {
  const router = useRouter();
  const { toast } = useToast();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscount = useCartStore((state) => state.getDiscount);
  const appliedPromoCode = useCartStore((state) => state.promoCode);
  const storeDiscount = useCartStore((state) => state.discount);
  const setStorePromoCode = useCartStore((state) => state.setPromoCode);
  const clearPromoCode = useCartStore((state) => state.clearPromoCode);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [validating, setValidating] = useState(false);

  const subtotal = getSubtotal();
  const discountAmount = getDiscount();
  const total = getTotal();

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;

    setValidating(true);
    try {
      const result = await validatePromoCode(promoCodeInput);
      if (result.valid) {
        setStorePromoCode(promoCodeInput.toUpperCase(), result.discount);
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
        description: "Failed to validate promo code.",
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
      <Card>
        <CardContent className='pt-6 pb-6 text-center'>
          <ShoppingBag className='h-16 w-16 mx-auto text-muted-foreground mb-4' />
          <h2 className='text-2xl font-semibold mb-2'>Your cart is empty</h2>
          <p className='text-muted-foreground mb-6'>
            Add some tests to your cart to get started
          </p>
          <Button asChild>
            <Link href='/tests'>Browse Tests</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
      {/* Cart Items */}
      <div className='lg:col-span-2 space-y-3 sm:space-y-4'>
        {items.map((item) => (
          <Card key={item.testId}>
            <CardContent className='pt-4 sm:pt-6 p-4 sm:p-6'>
              <div className='flex items-start justify-between gap-3 sm:gap-4'>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-sm sm:text-base'>
                    {item.testName}
                  </h3>
                  <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
                    Lab Test
                  </p>
                </div>
                <div className='text-right flex-shrink-0'>
                  <p className='font-semibold text-sm sm:text-base'>
                    {formatCurrency(item.price)}
                  </p>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      removeItem(item.testId);
                      toast({
                        title: "Removed from cart",
                        description: `${item.testName} has been removed.`,
                      });
                    }}
                    className='mt-2 text-destructive hover:text-destructive text-xs sm:text-sm h-7 sm:h-8'
                  >
                    <Trash2 className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
                    <span className='hidden sm:inline'>Remove</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div className='lg:col-span-1'>
        <Card className='sticky top-20'>
          <CardHeader className='p-4 sm:p-6'>
            <CardTitle className='text-lg sm:text-xl'>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 sm:space-y-4 p-4 sm:p-6'>
            {/* Promo Code */}
            <div className='space-y-2'>
              <label className='text-xs sm:text-sm font-medium'>
                Promo Code
              </label>
              {appliedPromoCode ? (
                <div className='flex items-center justify-between p-2 sm:p-3 bg-green-500/10 border border-green-500/20 rounded-lg gap-2'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs sm:text-sm font-semibold text-green-600'>
                      ✓ {appliedPromoCode} Applied
                    </p>
                    <p className='text-[10px] sm:text-xs text-muted-foreground'>
                      {Math.round(storeDiscount * 100)}% discount
                    </p>
                  </div>
                  <Button
                    onClick={handleRemovePromo}
                    variant='ghost'
                    size='sm'
                    className='text-xs h-7 sm:h-8 flex-shrink-0'
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <div className='flex gap-2'>
                    <Input
                      value={promoCodeInput}
                      onChange={(e) =>
                        setPromoCodeInput(e.target.value.toUpperCase())
                      }
                      placeholder='Enter code'
                      disabled={validating}
                      className='text-xs sm:text-sm h-9 sm:h-10'
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleApplyPromo();
                        }
                      }}
                    />
                    <Button
                      onClick={handleApplyPromo}
                      disabled={!promoCodeInput.trim() || validating}
                      variant='secondary'
                      className='text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 flex-shrink-0'
                    >
                      {validating ? "Checking..." : "Apply"}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Totals */}
            <div className='space-y-2 pt-3 sm:pt-4 border-t'>
              <div className='flex justify-between text-xs sm:text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {storeDiscount > 0 && (
                <div className='flex justify-between text-xs sm:text-sm text-green-600'>
                  <span>Discount ({Math.round(storeDiscount * 100)}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className='flex justify-between text-base sm:text-lg font-semibold pt-2 border-t'>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-2 p-4 sm:p-6'>
            <Button
              onClick={() => router.push("/checkout")}
              className='w-full text-sm sm:text-base'
              size='lg'
            >
              Proceed to Checkout
            </Button>
            <Button
              variant='outline'
              asChild
              className='w-full text-sm sm:text-base'
            >
              <Link href='/tests'>Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
