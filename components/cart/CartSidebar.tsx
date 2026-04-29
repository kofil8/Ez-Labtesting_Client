"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  applyBackendPromoCode,
  removeBackendPromoCode,
} from "@/lib/services/promo-code.service";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NEW_USER_PROMO_CODE = "NEW10";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close sidebar when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const subtotal = getSubtotal();
  const discountAmount = getDiscount();
  const total = getTotal();
  const isNewVisitor = !isLoading && !isAuthenticated;

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

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm'
            transition={{ duration: 0.2 }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className='fixed right-0 top-0 z-[9999] h-screen w-full sm:w-[90vw] md:max-w-md bg-background border-l border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
              <h2 className='text-lg sm:text-xl md:text-2xl font-bold'>
                Your Cart
              </h2>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='hover:bg-gray-100 dark:hover:bg-gray-800 h-8 w-8 sm:h-9 sm:w-9'
              >
                <X className='h-4 w-4 sm:h-5 sm:w-5' />
              </Button>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4'>
              {items.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center px-4'>
                  <ShoppingBag className='h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4' />
                  <h3 className='font-semibold text-base sm:text-lg mb-2'>
                    Your cart is empty
                  </h3>
                  <p className='text-xs sm:text-sm text-muted-foreground mb-4'>
                    Add some tests to get started
                  </p>
                  <Button
                    onClick={() => {
                      onClose();
                      router.push("/tests");
                    }}
                    className='mt-4 text-sm sm:text-base'
                    size='sm'
                  >
                    Browse Tests
                  </Button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className='space-y-2 sm:space-y-3'>
                    {items.map((item, index) => {
                      const legacyItem = item as {
                        id?: string;
                        itemType?: "TEST" | "PANEL";
                        name?: string;
                        testName?: string;
                        testId?: string;
                        panelId?: string;
                        isPanel?: boolean;
                      };
                      const itemKey =
                        legacyItem.id ||
                        legacyItem.testId ||
                        legacyItem.panelId ||
                        `cart-item-${index}`;
                      const itemIdToRemove =
                        legacyItem.id ||
                        legacyItem.testId ||
                        legacyItem.panelId ||
                        "";
                      const itemName =
                        legacyItem.name || legacyItem.testName || "Lab Item";
                      const itemTypeLabel =
                        legacyItem.itemType === "PANEL"
                          ? "Panel"
                          : legacyItem.isPanel
                            ? "Panel Test"
                            : "Lab Test";

                      return (
                      <div
                        key={itemKey}
                        className='flex items-start justify-between gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700'
                      >
                        <div className='flex-1 min-w-0 pr-2'>
                          <h4 className='font-semibold text-xs sm:text-sm break-words leading-tight'>
                            {itemName}
                          </h4>
                          <p className='text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1'>
                            {itemTypeLabel}
                          </p>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <p className='font-semibold text-xs sm:text-sm'>
                            {formatCurrency(item.price)}
                          </p>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              if (itemIdToRemove) {
                                removeItem(itemIdToRemove);
                              }
                              toast({
                                title: "Removed from cart",
                                description: `${itemName} has been removed.`,
                              });
                            }}
                            className='mt-1.5 sm:mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-[10px] sm:text-xs h-6 sm:h-7 px-2'
                          >
                            <Trash2 className='h-3 w-3 sm:mr-1' />
                            <span className='hidden sm:inline'>Remove</span>
                          </Button>
                        </div>
                      </div>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className='border-t border-gray-200 dark:border-gray-700 my-4' />

                  {/* Promo Code Section */}
                  <div className='space-y-2 sm:space-y-3'>
                    <label className='text-xs sm:text-sm font-semibold'>
                      Promo Code
                    </label>
                    {appliedPromoCode ? (
                      <div className='flex items-center justify-between p-2.5 sm:p-3 bg-green-500/10 border border-green-500/20 rounded-lg gap-2'>
                        <div className='flex-1 min-w-0'>
                          <p className='text-[10px] sm:text-xs font-semibold text-green-600 truncate'>
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
                          className='text-[10px] sm:text-xs h-6 sm:h-7 px-2 flex-shrink-0'
                        >
                          <span className='hidden sm:inline'>Remove</span>
                          <span className='sm:hidden'>×</span>
                        </Button>
                      </div>
                    ) : (
                      <>
                        {isNewVisitor ? (
                          <div className='rounded-lg border border-amber-200 bg-amber-50 px-3 py-2'>
                            <div className='flex items-start gap-2'>
                              <Tag className='mt-0.5 h-4 w-4 shrink-0 text-amber-700' />
                              <button
                                type='button'
                                onClick={() =>
                                  handleApplyPromo(NEW_USER_PROMO_CODE)
                                }
                                disabled={validating}
                                className='text-left text-[11px] font-medium leading-5 text-amber-900 underline-offset-2 hover:underline disabled:opacity-60 sm:text-xs'
                              >
                                New customer? Use {NEW_USER_PROMO_CODE} for 10%
                                off your first lab test.
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type='button'
                            onClick={() =>
                              setPromoCodeInput(NEW_USER_PROMO_CODE)
                            }
                            className='text-left text-[11px] font-medium text-blue-700 underline-offset-2 hover:underline sm:text-xs'
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
                            className='text-xs sm:text-sm h-9 sm:h-10 flex-1'
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleApplyPromo();
                              }
                            }}
                          />
                          <Button
                            onClick={() => handleApplyPromo()}
                            disabled={!promoCodeInput.trim() || validating}
                            variant='secondary'
                            size='sm'
                            className='text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 flex-shrink-0'
                          >
                            {validating ? "..." : "Apply"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer - Only show if cart has items */}
            {items.length > 0 && (
              <div className='border-t border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0'>
                {/* Enhanced Pricing Breakdown */}
                <div className='space-y-1.5 sm:space-y-2'>
                  <div className='flex justify-between text-xs sm:text-sm'>
                    <span className='text-muted-foreground'>
                      Subtotal ({items.length}{" "}
                      {items.length === 1 ? "test" : "tests"})
                    </span>
                    <span className='font-medium'>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {storeDiscount > 0 && (
                    <div className='flex justify-between text-xs sm:text-sm text-green-600'>
                      <span className='truncate pr-2'>
                        Discount ({Math.round(storeDiscount * 100)}%)
                      </span>
                      <span className='font-medium flex-shrink-0'>
                        -{formatCurrency(discountAmount)}
                      </span>
                    </div>
                  )}
                  {/* Processing Fee */}
                  <div className='flex justify-between text-xs sm:text-sm'>
                    <span className='text-muted-foreground flex items-center gap-1'>
                      Processing Fee
                      <span className='text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded'>
                        Secure
                      </span>
                    </span>
                    <span className='font-medium'>{formatCurrency(2.5)}</span>
                  </div>
                  {/* Tax (if applicable) */}
                  <div className='flex justify-between text-xs sm:text-sm'>
                    <span className='text-muted-foreground'>Tax</span>
                    <span className='font-medium'>{formatCurrency(0)}</span>
                  </div>
                  <div className='flex justify-between text-sm sm:text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700'>
                    <span>Total Due</span>
                    <span className='text-base sm:text-lg text-primary'>
                      {formatCurrency(total + 2.5)}
                    </span>
                  </div>
                  <p className='text-[10px] sm:text-xs text-muted-foreground text-center pt-1'>
                    ✓ Includes lab processing, secure report delivery
                  </p>
                </div>

                {/* Buttons */}
                <div className='space-y-2'>
                  <Button
                    onClick={handleReviewCheckout}
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm sm:text-base h-10 sm:h-11'
                  >
                    Review Checkout
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      onClose();
                      router.push("/tests");
                    }}
                    className='w-full text-sm sm:text-base h-10 sm:h-11'
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
