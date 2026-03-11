"use client";

import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Beaker } from "lucide-react";
import { ReactNode } from "react";

interface CheckoutShellProps {
  currentStep: number;
  children: ReactNode;
  showSummary?: boolean;
  summaryTotal?: number;
  summarySubtotal?: number;
  summaryProcessingFee?: number;
}

export default function CheckoutShell({
  currentStep,
  children,
  showSummary = true,
  summaryTotal,
  summarySubtotal,
  summaryProcessingFee,
}: CheckoutShellProps) {
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotal = useCartStore((state) => state.getTotal);

  const subtotal = summarySubtotal ?? getSubtotal();
  const processingFee = summaryProcessingFee ?? 2.5;
  const total = summaryTotal ?? getTotal() + processingFee;

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
      <div className='container mx-auto px-4 py-8 sm:py-12 md:py-16'>
        <div className='mb-10 sm:mb-12'>
          <CheckoutStepper currentStep={currentStep} />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
          <div className='lg:col-span-2'>{children}</div>

          {showSummary && (
            <div className='lg:col-span-1'>
              <div className='border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/20 bg-white dark:bg-slate-900 sticky top-24 overflow-hidden border'>
                <div className='bg-secondary/10 dark:bg-secondary/20 p-8 border-b border-slate-100 dark:border-slate-800'>
                  <h3 className='text-xl font-bold flex items-center gap-3 text-secondary'>
                    <Beaker className='h-6 w-6' />
                    Order Summary
                  </h3>
                </div>

                <div className='p-8 space-y-6'>
                  <div className='space-y-4'>
                    {items.map((item, index) => {
                      const legacyItem = item as {
                        id?: string;
                        name?: string;
                        testName?: string;
                        testId?: string;
                        panelId?: string;
                      };
                      const itemKey =
                        legacyItem.id ||
                        legacyItem.testId ||
                        legacyItem.panelId ||
                        `checkout-item-${index}`;
                      const displayName =
                        legacyItem.name || legacyItem.testName || "Lab Item";
                      const refValue =
                        legacyItem.testId ||
                        legacyItem.panelId ||
                        legacyItem.id ||
                        "N/A";

                      return (
                        <div
                          key={itemKey}
                          className='flex justify-between items-start gap-4'
                        >
                          <div className='flex-1'>
                            <p className='text-sm font-bold text-slate-900 dark:text-white line-clamp-2'>
                              {displayName}
                            </p>
                            <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1'>
                              Ref: {String(refValue).slice(0, 8)}
                            </p>
                          </div>
                          <span className='text-sm font-black text-slate-900 dark:text-white'>
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      );
                    })}

                    <div className='border-t border-slate-50 dark:border-slate-800 pt-6 space-y-3'>
                      <div className='flex justify-between text-sm items-center'>
                        <span className='text-slate-500 font-medium'>Subtotal Items</span>
                        <span className='font-bold text-slate-900 dark:text-white'>
                          {formatCurrency(subtotal)}
                        </span>
                      </div>

                      <div className='flex justify-between text-sm items-center'>
                        <span className='text-slate-500 font-medium'>Processing & Review</span>
                        <span className='font-bold text-slate-900 dark:text-white'>
                          {formatCurrency(processingFee)}
                        </span>
                      </div>

                      <div className='border-t-2 border-slate-900/5 dark:border-white/5 pt-4 mt-2 flex justify-between items-center'>
                        <span className='text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter'>
                          Total
                        </span>
                        <span className='font-black text-3xl text-primary'>
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
