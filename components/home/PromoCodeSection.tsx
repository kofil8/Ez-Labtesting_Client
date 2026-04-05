"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hook/use-toast";
import { validatePromoCode } from "@/lib/api";
import { useCartStore } from "@/lib/store/cart-store";
import { motion } from "framer-motion";
import { Check, Heart, Shield, Stethoscope, Tag } from "lucide-react";
import { useState } from "react";

const FEATURED_PROMO_CODES = [
  {
    code: "HEALTH10",
    discount: 10,
    description: "Wellness checkup discount",
    icon: Heart,
  },
  {
    code: "FIRSTTEST20",
    discount: 20,
    description: "First-time patient savings",
    icon: Stethoscope,
  },
  {
    code: "PREVENTIVE25",
    discount: 25,
    description: "Preventive care package",
    icon: Shield,
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
    <section className='py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-white via-teal-50/20 to-white dark:from-slate-950 dark:via-teal-950/10 dark:to-slate-950 relative overflow-hidden'>
      {/* Medical background elements */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-100/20 via-transparent to-transparent dark:from-teal-900/5' />
      <div className='absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl' />

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12 sm:mb-16'
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 text-sm font-bold mb-6 border border-teal-200/50 dark:border-teal-800/50 shadow-lg shadow-teal-500/10'
          >
            <Tag className='h-4 w-4' />
            <span>Patient Savings</span>
          </motion.div>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 sm:mb-6'>
            <span className='text-gray-900 dark:text-white'>Affordable </span>
            <span className='bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent'>
              Healthcare
            </span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium'>
            Quality lab testing shouldn't break the bank. Use our discount codes
            for instant savings on preventive care
          </p>
        </motion.div>

        {/* Featured Promo Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12'>
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
                  className={`relative overflow-hidden transition-all duration-300 bg-white dark:bg-slate-800 backdrop-blur-sm border-2 shadow-lg shadow-gray-100/50 dark:shadow-none hover:shadow-xl ${
                    isApplied
                      ? "border-teal-300 dark:border-teal-700 ring-2 ring-teal-500/20 bg-teal-50/50 dark:bg-teal-950/20"
                      : "border-gray-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800/50"
                  }`}
                >
                  <CardContent className='p-5 sm:p-6 md:p-7'>
                    <div className='flex items-start justify-between mb-5'>
                      <div
                        className={`p-3 rounded-xl ${
                          isApplied
                            ? "bg-teal-100 dark:bg-teal-900/30"
                            : "bg-cyan-100 dark:bg-cyan-900/30"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            isApplied
                              ? "text-teal-600 dark:text-teal-400"
                              : "text-cyan-600 dark:text-cyan-400"
                          }`}
                        />
                      </div>
                      {isApplied && (
                        <div className='flex items-center gap-1.5 bg-teal-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm'>
                          <Check className='h-3.5 w-3.5' />
                          Active
                        </div>
                      )}
                    </div>

                    <div className='mb-5'>
                      <div className='flex items-baseline gap-2 mb-3'>
                        <span
                          className={`text-4xl sm:text-5xl font-black ${
                            isApplied
                              ? "text-teal-600 dark:text-teal-400"
                              : "bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent"
                          }`}
                        >
                          {promo.discount}%
                        </span>
                        <span className='text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                          OFF
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed font-medium'>
                        {promo.description}
                      </p>
                      <div className='flex items-center gap-2 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/50 dark:to-slate-800/50 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700/50'>
                        <code className='font-mono font-bold text-sm text-gray-800 dark:text-gray-200 tracking-wider'>
                          {promo.code}
                        </code>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleQuickApply(promo.code)}
                      disabled={isApplied || validating}
                      className={`w-full h-12 font-bold transition-all ${
                        isApplied
                          ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-2 border-teal-200 dark:border-teal-800 hover:bg-teal-100"
                          : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
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
