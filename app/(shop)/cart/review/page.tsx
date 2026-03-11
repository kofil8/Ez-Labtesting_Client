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
import { Separator } from "@/components/ui/separator";
import { useCheckout } from "@/lib/context/CheckoutContext";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Beaker,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReviewCheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotal = useCartStore((state) => state.getTotal);
  const promoCode = useCartStore((state) => state.promoCode);
  const getDiscount = useCartStore((state) => state.getDiscount);
  const { goToStep } = useCheckout();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const processingFee = 2.5;
  const total = getTotal() + processingFee;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleProceedToCheckout = () => {
    // Navigate to checkout and set step to PATIENT
    goToStep("PATIENT");
    router.push("/checkout");
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30'>
      <div className='container mx-auto px-4 py-6 sm:py-8 md:py-12'>
        {/* Back Button */}
        <Link
          href='/cart'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Cart
        </Link>

        {/* Header */}
        <div className='text-center mb-6 sm:mb-8 md:mb-10'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-2'>
            Review Your{" "}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Order
            </span>
          </h1>
          <p className='text-sm sm:text-base text-muted-foreground'>
            Please review your items before proceeding to checkout
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto'>
          {/* Left Column - Items List */}
          <div className='lg:col-span-2 space-y-4'>
            {/* Items Card */}
            <Card className='border-2'>
              <CardHeader className='bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30'>
                <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                  <Beaker className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  Your Lab Tests ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='space-y-4'>
                  {items.map((item, index) => (
                    <div key={item.id}>
                      {index > 0 && <Separator className='my-4' />}
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start gap-3'>
                            <div className='mt-1'>
                              <Beaker className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h3 className='font-semibold text-base mb-1'>
                                {item.name}
                              </h3>
                              <Badge
                                variant='secondary'
                                className='text-xs mb-2'
                              >
                                {item.itemType}
                              </Badge>
                              {item.itemType === "PANEL" && (
                                <Badge
                                  variant='secondary'
                                  className='text-xs mb-2'
                                >
                                  Includes {item.testIds.length} tests
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <p className='font-semibold text-base'>
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className='border-2 bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/20'>
              <CardContent className='pt-6'>
                <div className='flex items-start gap-3'>
                  <ShieldCheck className='h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5' />
                  <div className='space-y-2'>
                    <h4 className='font-semibold text-sm'>
                      Secure & Confidential
                    </h4>
                    <ul className='text-xs text-muted-foreground space-y-1'>
                      <li className='flex items-center gap-2'>
                        <CheckCircle2 className='h-3 w-3 text-green-600 dark:text-green-400' />
                        256-bit SSL encryption
                      </li>
                      <li className='flex items-center gap-2'>
                        <CheckCircle2 className='h-3 w-3 text-green-600 dark:text-green-400' />
                        HIPAA compliant processing
                      </li>
                      <li className='flex items-center gap-2'>
                        <CheckCircle2 className='h-3 w-3 text-green-600 dark:text-green-400' />
                        Secure results delivery
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className='lg:col-span-1'>
            <Card className='border-2 sticky top-4'>
              <CardHeader className='bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30'>
                <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                  <CreditCard className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-6 space-y-4'>
                {/* Pricing Details */}
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Subtotal ({items.length}{" "}
                      {items.length === 1 ? "test" : "tests"})
                    </span>
                    <span className='font-medium'>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {promoCode && discount > 0 && (
                    <div className='flex justify-between text-sm'>
                      <span className='text-green-600 dark:text-green-400'>
                        Promo Code ({promoCode})
                      </span>
                      <span className='font-medium text-green-600 dark:text-green-400'>
                        -{formatCurrency(discount)}
                      </span>
                    </div>
                  )}

                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Processing Fee{" "}
                      <Badge
                        variant='secondary'
                        className='ml-1 text-[10px] px-1 py-0'
                      >
                        Secure
                      </Badge>
                    </span>
                    <span className='font-medium'>
                      {formatCurrency(processingFee)}
                    </span>
                  </div>

                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Tax</span>
                    <span className='font-medium'>{formatCurrency(0)}</span>
                  </div>

                  <Separator />

                  <div className='flex justify-between items-baseline'>
                    <div>
                      <p className='text-sm text-muted-foreground'>Total Due</p>
                      <p className='text-2xl font-bold text-primary'>
                        {formatCurrency(total)}
                      </p>
                    </div>
                  </div>

                  <p className='text-xs text-muted-foreground text-center pt-2'>
                    ✓ Includes lab processing & secure report delivery
                  </p>
                </div>
              </CardContent>
              <CardFooter className='flex flex-col gap-3 pb-6'>
                <Button
                  onClick={handleProceedToCheckout}
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold'
                  size='lg'
                >
                  Proceed to Checkout
                </Button>
                <Button variant='outline' asChild className='w-full' size='lg'>
                  <Link href='/cart'>Edit Cart</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
