"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hook/use-toast";
import { useCartSidebar } from "@/lib/cart-sidebar-context";
import { useCartStore } from "@/lib/store/cart-store";
import { Test } from "@/types/test";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { MoneyBackGuarantee } from "./purchase/MoneyBackGuarantee";
import { PricingDisplay } from "./purchase/PricingDisplay";
import { TrustIndicators } from "./purchase/TrustIndicators";
import { WhatsIncluded } from "./purchase/WhatsIncluded";

interface TestPurchaseCardProps {
  test: Test;
  onCheckout?: () => void;
}

export function TestPurchaseCard({ test, onCheckout }: TestPurchaseCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { openCart } = useCartSidebar();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: `test-${test.id}`,
      itemType: "TEST",
      name: test.testName,
      price: test.price,
      testId: test.id,
    });

    toast({
      title: "✅ Added to cart!",
      description: `${test.testName} is ready for checkout.`,
    });

    openCart();

    if (onCheckout) {
      onCheckout();
    }
  };

  const categoryName =
    typeof test.category === "string" ? test.category : test.category?.name;

  return (
    <Card className='lg:sticky lg:top-6 border border-border shadow-sm rounded-xl bg-card'>
      {/* Popular badge */}
      <div className='flex justify-center pt-5 px-5 sm:px-6'>
        <Badge className='bg-orange-500 hover:bg-orange-500 text-white px-4 py-1.5 text-xs font-semibold rounded-full'>
          <TrendingUp className='h-3.5 w-3.5 mr-1.5' />
          Popular Choice
        </Badge>
      </div>

      <CardHeader className='pb-3 pt-4 space-y-4 px-5 sm:px-6'>
        {/* Pricing */}
        <PricingDisplay test={test} />

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* Primary CTA */}
        <Button
          onClick={handleAddToCart}
          className='w-full h-11 text-base font-semibold shadow-sm'
          size='lg'
        >
          <ShoppingCart className='h-5 w-5 mr-2' />
          Add to Cart
        </Button>
      </CardHeader>

      <CardContent className='space-y-4 px-5 sm:px-6 pb-6'>
        {/* Money-back Guarantee */}
        <MoneyBackGuarantee />

        {/* What's Included */}
        <WhatsIncluded category={categoryName} />
      </CardContent>
    </Card>
  );
}
