"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Test } from "@/types/test";
import { Beaker, Clock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TestCardProps {
  test: Test;
}

export function TestCard({ test }: TestCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
        "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      std: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800",
      general:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      nutrition:
        "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800",
      thyroid:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      cardiac:
        "bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400 border-pink-200 dark:border-pink-800",
      metabolic:
        "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    };
    return colors[category] || colors.general;
  };

  return (
    <Link href={`/tests/${test.id}`}>
      <Card className='h-full group hover:shadow-md hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300 border-border/50 hover:border-border cursor-pointer flex flex-col overflow-hidden'>
        {/* Image */}
        {test.image && (
          <div className='relative w-full h-48 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden'>
            <Image
              src={test.image}
              alt={test.name}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-300'
            />
          </div>
        )}

        <CardContent className='p-5 flex flex-col flex-1'>
          {/* Header */}
          <div className='flex items-start justify-between gap-3 mb-3'>
            <div className='flex-1 min-w-0'>
              <Badge
                variant='outline'
                className={`text-xs font-medium mb-2 ${getCategoryColor(
                  test.category
                )}`}
              >
                {test.category.charAt(0).toUpperCase() + test.category.slice(1)}
              </Badge>
              <h3 className='font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors'>
                {test.name}
              </h3>
            </div>
            <div className='text-right shrink-0'>
              <div className='text-lg font-semibold'>
                {formatCurrency(test.price)}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className='text-sm text-muted-foreground line-clamp-2 mb-4 flex-1'>
            {test.description}
          </p>

          {/* Details */}
          <div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4'>
            <div className='flex items-center gap-1.5'>
              <Clock className='h-3.5 w-3.5' />
              <span>{test.turnaroundDays}d</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Beaker className='h-3.5 w-3.5' />
              <span className='truncate max-w-[100px]'>{test.sampleType}</span>
            </div>
          </div>

          {/* Footer */}
          <Button
            onClick={handleAddToCart}
            className='w-full mt-auto'
            size='sm'
            variant='default'
          >
            <ShoppingCart className='h-3.5 w-3.5 mr-2' />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
