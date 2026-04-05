"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/store/cart-store";
import { formatTurnaroundDisplay } from "@/lib/test-utils";
import { formatCurrency } from "@/lib/utils";
import { Test } from "@/types/test";
import { motion } from "framer-motion";
import {
  Beaker,
  Clock,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TestCardProps {
  test: Test;
  variant?: "compact" | "detailed" | "animated";
  index?: number;
  onCheckout?: () => void;
}

export function TestCard({
  test,
  variant = "compact",
  index = 0,
  onCheckout,
}: TestCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to book a test.",
        variant: "destructive",
      });
      router.push(`/login?from=/tests`);
      return;
    }

    addToCart({
      id: `test-${test.id}`,
      itemType: "TEST",
      name: test.testName,
      price: test.price,
      testId: test.id,
    });

    toast({
      title: "✅ Test added to cart!",
      description: `${test.testName} has been added to your cart.`,
    });

    if (onCheckout) {
      onCheckout();
    }
  };

  const getCategoryColor = () => {
    return "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800/50";
  };

  const getCategoryName = () => {
    if (typeof test.category === "string") {
      return test.category.charAt(0).toUpperCase() + test.category.slice(1);
    }
    return test.category?.name || "General";
  };

  const isPopular =
    test.price < 150 || test.testName.toLowerCase().includes("panel");
  const isFastTrack = Math.ceil(test.turnaround / 24) <= 2;
  const retailPrice = test.price * 1.67;

  const cardContent = (
    <Card
      className={`h-full flex flex-col overflow-hidden border transition-all duration-300 ${
        variant === "animated"
          ? "group hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 relative"
          : "group hover:shadow-lg hover:border-primary/30"
      } border-slate-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900`}
    >
      {/* Top Accent Line */}
      {variant === "animated" && (
        <div className='absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-400 to-secondary opacity-80' />
      )}

      {/* Image Section */}
      {test.testImage && (
        <div className='relative w-full h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden'>
          <Image
            src={test.testImage}
            alt={test.testName}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className={`object-cover ${
              variant === "animated"
                ? "group-hover:scale-110 transition-transform duration-700"
                : "transition-transform duration-500"
            }`}
          />
          {/* Badges - Compact only */}
          {variant === "compact" && (
            <>
              {isPopular && (
                <div className='absolute top-3 left-3 z-10'>
                  <Badge className='bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg border-0 px-3 py-1'>
                    <TrendingUp className='h-3 w-3 mr-1' />
                    Popular
                  </Badge>
                </div>
              )}
              {isFastTrack && (
                <div className='absolute top-3 right-3 z-10'>
                  <Badge className='bg-primary text-white font-bold shadow-lg border-0 px-3 py-1'>
                    <Zap className='h-3 w-3 mr-1' />
                    24-48hr
                  </Badge>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <CardContent className='p-5 flex flex-col flex-1'>
        {/* Category & Certification */}
        <div className='mb-3 flex items-center gap-2 flex-wrap'>
          <Badge
            variant='outline'
            className={`text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor()}`}
          >
            {getCategoryName()}
          </Badge>
          {variant !== "detailed" && (
            <Badge
              variant='outline'
              className='text-[10px] font-bold uppercase tracking-wider border bg-emerald-500/5 text-emerald-600 border-emerald-200 dark:border-emerald-800'
            >
              <ShieldCheck className='h-3 w-3 mr-1' />
              CLIA
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className='font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2 text-slate-900 dark:text-white'>
          {test.testName}
        </h3>

        {/* Description */}
        {variant === "animated" && (
          <p className='text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1 italic leading-relaxed'>
            &quot;{test.description}&quot;
          </p>
        )}

        {/* Pricing */}
        <div className='mb-3 flex items-baseline gap-2'>
          <div className='text-2xl font-bold text-slate-900 dark:text-white'>
            {formatCurrency(test.price)}
          </div>
          {variant === "compact" && (
            <>
              <div className='text-xs text-slate-400 line-through font-medium'>
                {formatCurrency(retailPrice)}
              </div>
              <Badge
                variant='outline'
                className='text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-800 font-bold ml-auto'
              >
                Save{" "}
                {Math.round(((retailPrice - test.price) / retailPrice) * 100)}%
              </Badge>
            </>
          )}
        </div>

        {/* Features */}
        <div className='grid grid-cols-2 gap-2 mb-4 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl'>
          <div className='flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-400'>
            <Clock className='h-3.5 w-3.5 text-primary' />
            <span>
              {formatTurnaroundDisplay(test.turnaround, { style: "compact" })}
            </span>
          </div>
          <div className='flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-400'>
            <Beaker className='h-3.5 w-3.5 text-secondary' />
            <span className='truncate'>{test.specimenType}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleAddToCart}
          className='w-full bg-primary hover:bg-blue-600 text-white font-bold rounded-full h-10 shadow-lg shadow-blue-500/10 transition-all active:scale-95 text-sm'
        >
          <ShoppingCart className='h-4 w-4 mr-1.5' />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );

  // Wrap with motion div for animated variant
  if (variant === "animated") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className='h-full'
      >
        {cardContent}
      </motion.div>
    );
  }

  return <Link href={`/tests/${test.id}`}>{cardContent}</Link>;
}
