"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hook/use-toast";
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
        "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-300 dark:border-purple-800/50",
      std: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-300 dark:border-rose-800/50",
      general:
        "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800/50",
      nutrition:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/50",
      thyroid:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800/50",
      cardiac:
        "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-300 dark:border-red-800/50",
      metabolic:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-300 dark:border-amber-800/50",
    };
    return colors[category] || colors.general;
  };

  return (
    <Link href={`/tests/${test.id}`}>
      <Card className='h-full group hover:shadow-xl hover:shadow-blue-100/40 dark:hover:shadow-cyan-900/30 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden hover:-translate-y-1 gpu-accelerated'>
        {/* Image */}
        {test.image && (
          <div className='relative w-full h-48 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-teal-950/30 overflow-hidden'>
            <Image
              src={test.image}
              alt={test.name}
              fill
              className='object-cover group-hover:scale-110 transition-transform duration-300 gpu-accelerated'
            />
          </div>
        )}

        <CardContent className='p-5 flex flex-col flex-1'>
          {/* Header */}
          <div className='flex items-start justify-between gap-3 mb-3'>
            <div className='flex-1 min-w-0'>
              <Badge
                variant='outline'
                className={`text-xs font-semibold mb-2 border-2 ${getCategoryColor(
                  test.category
                )}`}
              >
                {test.category.charAt(0).toUpperCase() + test.category.slice(1)}
              </Badge>
              <h3 className='font-bold text-base leading-snug line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors'>
                {test.name}
              </h3>
            </div>
            <div className='text-right shrink-0'>
              <div className='text-lg font-bold text-cyan-600 dark:text-cyan-400'>
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
