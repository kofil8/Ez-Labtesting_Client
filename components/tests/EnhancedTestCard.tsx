"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hook/use-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Test } from "@/types/test";
import { motion } from "framer-motion";
import { Beaker, Clock, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface EnhancedTestCardProps {
  test: Test;
  index?: number;
}

export function EnhancedTestCard({ test, index = 0 }: EnhancedTestCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addItem({
      testId: test.id,
      testName: test.name,
      price: test.price,
    });
    toast({
      title: "Added to cart",
      description: `${test.name} has been added to your cart.`,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hormone:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      std: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      general: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      nutrition:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      thyroid:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      cardiac: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      metabolic:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[category] || colors.general;
  };

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      hormone: "awsmd-gradient-purple-pink",
      std: "bg-gradient-to-br from-red-500 via-pink-500 to-orange-500",
      general: "awsmd-gradient-blue-purple",
      nutrition: "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
      thyroid: "bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500",
      cardiac: "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500",
      metabolic: "awsmd-gradient-cosmic",
    };
    return gradients[category] || gradients.general;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className='h-full'
    >
      <Card className='h-full awsmd-hover-lift border-2 border-gray-200 dark:border-gray-700 overflow-hidden relative group awsmd-rounded-xl'>
        {/* Sparkle effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className='absolute top-6 right-6 z-10'
          >
            <Sparkles className='h-7 w-7 text-yellow-400 animate-pulse drop-shadow-lg' />
          </motion.div>
        )}

        {/* Gradient background glow on hover */}
        <div
          className={`absolute inset-0 ${getCategoryGradient(
            test.category
          )} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}
        />

        {/* Top gradient accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${getCategoryGradient(
            test.category
          )}`}
        />

        <CardContent className='p-6 relative'>
          <div className='flex items-start justify-between mb-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-3'>
                <Badge className={getCategoryColor(test.category)}>
                  {test.category.charAt(0).toUpperCase() +
                    test.category.slice(1)}
                </Badge>
                {test.turnaroundDays <= 2 && (
                  <Badge variant='secondary' className='gap-1'>
                    <Sparkles className='h-3 w-3' />
                    Fast
                  </Badge>
                )}
              </div>

              <Link href={`/tests/${test.id}`}>
                <h3 className='font-black text-xl mb-3 hover:text-primary transition-colors line-clamp-2 group-hover:underline'>
                  {test.name}
                </h3>
              </Link>

              <p className='text-base text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed'>
                {test.description}
              </p>

              <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  <span>{test.turnaroundDays} days</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Beaker className='h-4 w-4' />
                  <span>{test.sampleType}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
            <div>
              <p className='text-3xl font-black awsmd-gradient-text'>
                {formatCurrency(test.price)}
              </p>
              <p className='text-xs text-muted-foreground font-semibold uppercase tracking-wider'>
                One-time payment
              </p>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!test.enabled}
              className={`gap-2 ${getCategoryGradient(
                test.category
              )} text-white hover:scale-110 transition-all shadow-lg hover:shadow-xl awsmd-rounded font-bold px-6`}
            >
              <ShoppingCart className='h-4 w-4' />
              Add
            </Button>
          </div>

          {!test.enabled && (
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg'>
              <Badge variant='destructive' className='text-lg px-4 py-2'>
                Temporarily Unavailable
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
