"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, Check, Package } from "lucide-react";

interface OrderSummaryProps {
  items: Array<{
    testId: string;
    testName: string;
    price: number;
    cptCode?: string;
    labCode?: string;
    labName?: string;
  }>;
  subtotal: number;
  discount: number;
  discountAmount: number;
  promoCode?: string | null;
  processingFee?: number;
  tax?: number;
  total: number;
}

export function OrderSummary({
  items,
  subtotal,
  discount,
  discountAmount,
  promoCode,
  processingFee = 2.5,
  tax = 0,
  total,
}: OrderSummaryProps) {
  const finalTotal = total + processingFee + tax;

  return (
    <Card className='medical-card sticky top-6'>
      <CardHeader className='bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'>
        <CardTitle className='flex items-center gap-2 text-h3'>
          <Package className='h-5 w-5 text-primary' />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 sm:p-6 space-y-4'>
        {/* Items List */}
        <div className='space-y-3'>
          <p className='text-sm font-semibold text-muted-foreground'>
            Tests ({items.length})
          </p>
          <div className='space-y-2'>
            {items.map((item) => (
              <div
                key={item.testId}
                className='flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'
              >
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium leading-tight break-words'>
                    {item.testName}
                  </p>
                  <div className='text-xs text-muted-foreground mt-0.5 space-y-0.5'>
                    <div>
                      {item.cptCode && (
                        <span className='mr-2'>
                          CPT:{" "}
                          <span className='font-medium'>{item.cptCode}</span>
                        </span>
                      )}
                      {item.labName && (
                        <span>
                          Lab:{" "}
                          <span className='font-medium'>{item.labName}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className='text-sm font-semibold flex-shrink-0'>
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className='space-y-2.5'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span className='font-medium'>{formatCurrency(subtotal)}</span>
          </div>

          {discount > 0 && promoCode && (
            <div className='flex justify-between text-sm items-center'>
              <span className='text-muted-foreground flex items-center gap-2'>
                Promo Code
                <Badge
                  variant='outline'
                  className='text-xs bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-300 dark:border-green-800/50'
                >
                  {promoCode}
                </Badge>
              </span>
              <span className='font-medium text-green-600'>
                -{formatCurrency(discountAmount)}
              </span>
            </div>
          )}

          <div className='flex justify-between text-sm items-center'>
            <span className='text-muted-foreground flex items-center gap-1'>
              Processing Fee
              <span className='text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded'>
                Secure
              </span>
            </span>
            <span className='font-medium'>{formatCurrency(processingFee)}</span>
          </div>

          {tax > 0 && (
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Tax</span>
              <span className='font-medium'>{formatCurrency(tax)}</span>
            </div>
          )}

          <Separator />

          <div className='flex justify-between text-base font-bold pt-1'>
            <span>Total Due</span>
            <span className='text-lg text-primary'>
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>

        {/* What's Included */}
        <div className='rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 p-3'>
          <div className='flex items-start gap-2'>
            <Check className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
            <div className='space-y-1 text-xs text-blue-900 dark:text-blue-100'>
              <p className='font-semibold'>Included in your order:</p>
              <ul className='space-y-0.5 text-blue-700 dark:text-blue-300'>
                <li>• Lab processing & analysis</li>
                <li>• Secure digital report delivery</li>
                <li>• Results typically within 24-48 hours</li>
                <li>• CLIA-certified laboratory testing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className='rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-3'>
          <div className='flex items-start gap-2'>
            <AlertCircle className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
            <div className='text-xs text-green-900 dark:text-green-100'>
              <p className='font-semibold'>Secure Checkout</p>
              <p className='text-green-700 dark:text-green-300 mt-0.5'>
                Your payment and health data are encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
