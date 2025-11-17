"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
          description: `You'll save ${Math.round(result.discount * 100)}% on your order`,
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

  const handleQuickApply = (code: string) => {
    handleApplyCode(code);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary/5 dark:from-gray-900 dark:to-primary/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Percent className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Special Offers
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Exclusive Promo Codes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Save on your lab testing with our special discount codes. Apply at
            checkout for instant savings.
          </p>
        </motion.div>

        {/* Featured Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    isApplied
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {isApplied && (
                        <div className="flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                          <Check className="h-3 w-3" />
                          Applied
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-primary">
                          {promo.discount}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          OFF
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {promo.description}
                      </p>
                      <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                        <code className="font-mono font-semibold text-sm">
                          {promo.code}
                        </code>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleQuickApply(promo.code)}
                      disabled={isApplied || validating}
                      className="w-full"
                      variant={isApplied ? "outline" : "default"}
                    >
                      {isApplied ? "Already Applied" : "Apply Code"}
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
          className="max-w-md mx-auto"
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold mb-2">Have a different code?</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your promo code below to apply it to your cart
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  disabled={validating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleApplyCode(inputCode);
                    }
                  }}
                  className="font-mono"
                />
                <Button
                  onClick={() => handleApplyCode(inputCode)}
                  disabled={!inputCode.trim() || validating}
                >
                  {validating ? "Checking..." : "Apply"}
                </Button>
              </div>
              {appliedPromoCode && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-semibold">
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

