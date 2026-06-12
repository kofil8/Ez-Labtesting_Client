"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  applyBackendPromoCode,
  removeBackendPromoCode,
} from "@/lib/services/promo-code.service";
import { useCartStore, type CartItem } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NEW_USER_PROMO_CODE = "NEW10";
const PROCESSING_FEE = 2.5;

function getCartItemMeta(item: CartItem, index: number) {
  const legacyItem = item as CartItem & {
    testName?: string;
    isPanel?: boolean;
  };

  return {
    key:
      legacyItem.id ||
      ("testId" in legacyItem ? legacyItem.testId : undefined) ||
      ("panelId" in legacyItem ? legacyItem.panelId : undefined) ||
      `cart-item-${index}`,
    removeId:
      legacyItem.id ||
      ("testId" in legacyItem ? legacyItem.testId : undefined) ||
      ("panelId" in legacyItem ? legacyItem.panelId : undefined) ||
      "",
    name: legacyItem.name || legacyItem.testName || "Lab Item",
    typeLabel:
      legacyItem.itemType === "PANEL"
        ? "Panel"
        : legacyItem.isPanel
          ? "Panel Test"
          : "Lab Test",
  };
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const itemCount = items.length;
  const subtotal = getSubtotal();
  const discountAmount = getDiscount();
  const processingFee = itemCount > 0 ? PROCESSING_FEE : 0;
  const totalDue = useMemo(
    () => getTotal() + processingFee,
    [getTotal, processingFee],
  );
  const isNewVisitor = !isLoading && !isAuthenticated;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleApplyPromo = async (code = promoCodeInput) => {
    if (!code.trim()) return;

    const normalizedCode = code.toUpperCase();

    if (!isAuthenticated) {
      setPromoCodeInput(normalizedCode);
      toast({
        title: "Sign in to apply this code",
        description: "Promo codes are validated at checkout after sign-in.",
      });
      return;
    }

    setValidating(true);
    try {
      const result = await applyBackendPromoCode(normalizedCode);

      setStorePromoCode(result.code, result.discountRate);
      setPromoCodeInput("");
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

  const handleReviewCheckout = () => {
    onClose();
    router.push("/cart");
  };

  const handleContinueShopping = () => {
    onClose();
    router.push("/tests");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type='button'
            aria-label='Close cart'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 z-[9998] bg-slate-950/50 backdrop-blur-sm'
            transition={{ duration: 0.18 }}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            role='dialog'
            aria-modal='true'
            aria-label='Shopping cart'
            className='fixed inset-y-0 right-0 z-[9999] flex h-[100svh] w-full flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:w-[min(92vw,30rem)] dark:border-gray-700 dark:bg-background'
          >
            <div className='flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5 sm:py-5 dark:border-gray-700'>
              <div className='min-w-0'>
                <h2 className='text-xl font-bold leading-tight text-slate-900 sm:text-2xl dark:text-slate-50'>
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <p className='mt-1 text-xs text-slate-500'>
                    {itemCount} {itemCount === 1 ? "item" : "items"} ready for
                    checkout
                  </p>
                )}
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='h-10 w-10 shrink-0 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-gray-800'
                aria-label='Close cart'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            <div className='flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5'>
              {itemCount === 0 ? (
                <div className='flex min-h-full flex-col items-center justify-center px-4 text-center'>
                  <ShoppingBag className='mb-4 h-12 w-12 text-slate-400' />
                  <h3 className='mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50'>
                    Your cart is empty
                  </h3>
                  <p className='mb-5 max-w-xs text-sm text-slate-500'>
                    Add some tests to get started
                  </p>
                  <Button
                    onClick={handleContinueShopping}
                    className='h-10 rounded-xl px-5 text-sm font-semibold'
                  >
                    Browse Tests
                  </Button>
                </div>
              ) : (
                <div className='space-y-5'>
                  <div className='space-y-3'>
                    {items.map((item, index) => {
                      const itemMeta = getCartItemMeta(item, index);

                      return (
                        <div
                          key={itemMeta.key}
                          className='rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-900/50 sm:p-4'
                        >
                          <div className='flex items-start gap-3'>
                            <div className='min-w-0 flex-1'>
                              <h4 className='break-words text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100'>
                                {itemMeta.name}
                              </h4>
                              <p className='mt-1 text-xs text-slate-500'>
                                {itemMeta.typeLabel}
                              </p>
                            </div>
                            <p className='shrink-0 text-right text-sm font-semibold text-slate-800 dark:text-slate-100'>
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className='mt-3 flex justify-end'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                if (itemMeta.removeId) {
                                  removeItem(itemMeta.removeId);
                                }
                                toast({
                                  title: "Removed from cart",
                                  description: `${itemMeta.name} has been removed.`,
                                });
                              }}
                              className='h-8 rounded-lg px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive'
                            >
                              <Trash2 className='mr-1.5 h-3.5 w-3.5' />
                              Remove
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className='space-y-3 border-t border-slate-200 pt-5 dark:border-gray-700'>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <label className='text-sm font-semibold text-slate-800 dark:text-slate-100'>
                        Promo Code
                      </label>
                      {!appliedPromoCode && !isNewVisitor && (
                        <button
                          type='button'
                          onClick={() => setPromoCodeInput(NEW_USER_PROMO_CODE)}
                          className='text-xs font-medium text-blue-700 underline-offset-2 hover:underline'
                        >
                          Check available coupons
                        </button>
                      )}
                    </div>

                    {appliedPromoCode ? (
                      <div className='flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-3'>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-xs font-semibold text-green-700'>
                            {appliedPromoCode} applied
                          </p>
                          <p className='text-xs text-slate-500'>
                            {Math.round(storeDiscount * 100)}% discount
                          </p>
                        </div>
                        <Button
                          onClick={handleRemovePromo}
                          variant='ghost'
                          size='sm'
                          className='h-8 shrink-0 rounded-lg px-2.5 text-xs font-semibold'
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        {isNewVisitor && (
                          <div className='rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5'>
                            <div className='flex items-start gap-2'>
                              <Tag className='mt-0.5 h-4 w-4 shrink-0 text-amber-700' />
                              <button
                                type='button'
                                onClick={() =>
                                  handleApplyPromo(NEW_USER_PROMO_CODE)
                                }
                                disabled={validating}
                                className='text-left text-xs font-medium leading-5 text-amber-900 underline-offset-2 hover:underline disabled:opacity-60'
                              >
                                New customer? Use {NEW_USER_PROMO_CODE} for 10%
                                off your first lab test.
                              </button>
                            </div>
                          </div>
                        )}

                        <div className='grid grid-cols-[minmax(0,1fr)_auto] gap-2'>
                          <Input
                            value={promoCodeInput}
                            onChange={(event) =>
                              setPromoCodeInput(event.target.value.toUpperCase())
                            }
                            placeholder='Enter code'
                            disabled={validating}
                            className='h-10 min-w-0 rounded-xl text-sm'
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                handleApplyPromo();
                              }
                            }}
                          />
                          <Button
                            onClick={() => handleApplyPromo()}
                            disabled={!promoCodeInput.trim() || validating}
                            variant='secondary'
                            size='sm'
                            className='h-10 shrink-0 rounded-xl px-4 text-sm font-semibold'
                          >
                            {validating ? (
                              <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {itemCount > 0 && (
              <div className='shrink-0 space-y-4 border-t border-slate-200 bg-slate-50 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-gray-700 dark:bg-gray-900/50 sm:px-5'>
                <div className='space-y-2'>
                  <div className='flex justify-between gap-4 text-sm'>
                    <span className='text-slate-600'>
                      Subtotal ({itemCount} {itemCount === 1 ? "test" : "tests"})
                    </span>
                    <span className='shrink-0 font-medium text-slate-900 dark:text-slate-100'>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {storeDiscount > 0 && (
                    <div className='flex justify-between gap-4 text-sm text-green-700'>
                      <span className='min-w-0 truncate pr-2'>
                        Discount ({Math.round(storeDiscount * 100)}%)
                      </span>
                      <span className='shrink-0 font-medium'>
                        -{formatCurrency(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between gap-4 text-sm'>
                    <span className='flex min-w-0 items-center gap-1.5 text-slate-600'>
                      Processing Fee
                      <span className='rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
                        Secure
                      </span>
                    </span>
                    <span className='shrink-0 font-medium text-slate-900 dark:text-slate-100'>
                      {formatCurrency(processingFee)}
                    </span>
                  </div>
                  <div className='flex justify-between gap-4 text-sm'>
                    <span className='text-slate-600'>Tax</span>
                    <span className='shrink-0 font-medium text-slate-900 dark:text-slate-100'>
                      {formatCurrency(0)}
                    </span>
                  </div>
                  <div className='flex justify-between gap-4 border-t border-slate-200 pt-3 text-base font-bold dark:border-gray-700'>
                    <span>Total Due</span>
                    <span className='shrink-0 text-lg text-primary'>
                      {formatCurrency(totalDue)}
                    </span>
                  </div>
                  <p className='pt-1 text-center text-xs text-slate-500'>
                    Includes lab processing and secure report delivery
                  </p>
                </div>

                <div className='space-y-2'>
                  <Button
                    onClick={handleReviewCheckout}
                    className='h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 sm:text-base'
                  >
                    Review Checkout
                  </Button>
                  <Button
                    variant='outline'
                    onClick={handleContinueShopping}
                    className='h-11 w-full rounded-xl text-sm font-semibold sm:text-base'
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
