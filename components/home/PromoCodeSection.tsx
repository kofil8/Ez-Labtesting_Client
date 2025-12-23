"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hook/use-toast";
import { validatePromoCode } from "@/lib/api";
import { useCartStore } from "@/lib/store/cart-store";
import { motion } from "framer-motion";
import { Check, Gift, Percent, Sparkles, Tag } from "lucide-react";
import { useState } from "react";

const FEATURED_PROMO_CODES = [
  {
    code: "SAVE10",
    discount: 10,
    description: "Save 10% on your first order",
    icon: Tag,
  },
  {
    code: "WELCOME20",
    discount: 20,
    description: "New customer special - 20% off",
    icon: Gift,
  },
  {
    code: "HEALTH25",
    discount: 25,
    description: "Premium health panel discount",
    icon: Sparkles,
  },
];

export function PromoCodeSection() {
  const { toast } = useToast();
  const { promoCode: appliedPromoCode, setPromoCode } = useCartStore();
  const [inputCode, setInputCode] = useState("");
  const [validating, setValidating] = useState(false);

  const handleApplyCode = async (code: string) => {
    if (!code.trim()) return;

    setValidating(true);
    try {
      const result = await validatePromoCode(code);
      if (result.valid) {
        setPromoCode(code.toUpperCase(), result.discount);
        setInputCode("");
        toast({
          title: "Promo code applied! 🎉",
          description: `You'll save ${Math.round(
            result.discount * 100
          )}% on your order`,
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

  const handleQuickApply = (code: string) => {
    handleApplyCode(code);
  };

  return (
    <section className='py-16 sm:py-20 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent dark:from-orange-900/10' />

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12 sm:mb-14'
        >
          <div className='inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full mb-4'>
            <Percent className='h-4 w-4 text-orange-600 dark:text-orange-400' />
            <span className='text-sm font-semibold text-orange-700 dark:text-orange-300'>
              Limited Time Offers
            </span>
          </div>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4'>
            Exclusive{" "}
            <span className='bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent'>
              Promo Codes
            </span>
          </h2>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'>
            Save on your lab testing with our special discount codes. Apply at
            checkout for instant savings.
          </p>
        </motion.div>

        {/* Featured Promo Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          {FEATURED_PROMO_CODES.map((promo, index) => {
            const Icon = promo.icon;
            const isApplied = appliedPromoCode === promo.code;

            return (
              <motion.div
                key={promo.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`relative overflow-hidden transition-all duration-300 bg-white dark:bg-slate-800/90 backdrop-blur-sm border shadow-lg shadow-gray-100/50 dark:shadow-none hover:shadow-xl ${
                    isApplied
                      ? "border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-gray-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800/50"
                  }`}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-5'>
                      <div
                        className={`p-3 rounded-xl ${
                          isApplied
                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                            : "bg-orange-100 dark:bg-orange-900/30"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            isApplied
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-orange-600 dark:text-orange-400"
                          }`}
                        />
                      </div>
                      {isApplied && (
                        <div className='flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm'>
                          <Check className='h-3.5 w-3.5' />
                          Active
                        </div>
                      )}
                    </div>

                    <div className='mb-5'>
                      <div className='flex items-baseline gap-2 mb-3'>
                        <span
                          className={`text-4xl font-extrabold ${
                            isApplied
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                          }`}
                        >
                          {promo.discount}%
                        </span>
                        <span className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                          OFF
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed'>
                        {promo.description}
                      </p>
                      <div className='flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700/50'>
                        <code className='font-mono font-bold text-sm text-gray-800 dark:text-gray-200 tracking-wider'>
                          {promo.code}
                        </code>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleQuickApply(promo.code)}
                      disabled={isApplied || validating}
                      className={`w-full h-11 font-semibold transition-all ${
                        isApplied
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                          : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg"
                      }`}
                      variant={isApplied ? "outline" : "default"}
                    >
                      {isApplied ? "✓ Code Applied" : "Apply Code"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Promo Code Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='max-w-md mx-auto'
        >
          <Card>
            <CardContent className='p-6'>
              <div className='text-center mb-4'>
                <h3 className='font-semibold mb-2'>Have a different code?</h3>
                <p className='text-sm text-muted-foreground'>
                  Enter your promo code below to apply it to your cart
                </p>
              </div>
              <div className='flex gap-2'>
                <Input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder='Enter promo code'
                  disabled={validating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleApplyCode(inputCode);
                    }
                  }}
                  className='font-mono'
                />
                <Button
                  onClick={() => handleApplyCode(inputCode)}
                  disabled={!inputCode.trim() || validating}
                >
                  {validating ? "Checking..." : "Apply"}
                </Button>
              </div>
              {appliedPromoCode && (
                <div className='mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg'>
                  <div className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                    <Check className='h-4 w-4' />
                    <span className='text-sm font-semibold'>
                      Active Code: {appliedPromoCode}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
