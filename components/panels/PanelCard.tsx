"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, Package } from "lucide-react";

interface Panel {
  id: string;
  name: string;
  description: string;
  testIds: string[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
}

interface PanelCardProps {
  panel: Panel;
  index?: number;
}

export function PanelCard({ panel, index = 0 }: PanelCardProps) {
  const savingsPercentage = Math.round(
    (panel.savings / panel.originalPrice) * 100
  );

  return (
    <Link href={`/panels/${panel.id}`} className='group'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8 }}
      >
        <Card className='h-full hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all duration-300 border-2 hover:border-purple-400 dark:hover:border-purple-600 overflow-hidden flex flex-col'>
          {/* Header Background */}
          <div className='relative h-28 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 overflow-hidden'>
            {/* Animated background pattern */}
            <div className='absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity'>
              <svg className='w-full h-full' viewBox='0 0 400 200'>
                <defs>
                  <pattern
                    id={`grid-${panel.id}`}
                    width='40'
                    height='40'
                    patternUnits='userSpaceOnUse'
                  >
                    <path
                      d='M 40 0 L 0 0 0 40'
                      fill='none'
                      stroke='white'
                      strokeWidth='0.5'
                    />
                  </pattern>
                </defs>
                <rect
                  width='400'
                  height='200'
                  fill={`url(#grid-${panel.id})`}
                />
              </svg>
            </div>

            {/* Icon Badge */}
            <div className='absolute top-3 left-3 p-2.5 rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all'>
              <Package className='h-5 w-5 text-white' />
            </div>

            {/* Savings Badge */}
            {panel.savings > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className='absolute top-3 right-3'
              >
                <Badge className='bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2.5 py-1 text-xs font-bold'>
                  Save {savingsPercentage}%
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <CardContent className='p-4 pb-0 flex-1'>
            <div className='space-y-2'>
              <h3 className='font-semibold text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2'>
                {panel.name}
              </h3>
              <p className='text-sm text-muted-foreground line-clamp-2'>
                {panel.description}
              </p>
            </div>

            {/* Tests Count */}
            <div className='mt-3 p-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800'>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground'>Tests</span>
                <span className='font-bold text-purple-600 dark:text-purple-400'>
                  {panel.testIds.length}
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className='mt-3 space-y-1'>
              <div className='flex justify-between text-xs'>
                <span className='text-muted-foreground'>Regular</span>
                <span className='line-through text-gray-500 text-xs'>
                  {formatCurrency(panel.originalPrice)}
                </span>
              </div>
              <div className='flex justify-between pt-2 border-t'>
                <span className='font-semibold text-sm'>Price</span>
                <span className='text-base font-bold text-gradient-cosmic'>
                  {formatCurrency(panel.bundlePrice)}
                </span>
              </div>
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className='p-4 pt-4 mt-auto'>
            <Button
              className='w-full gradient-blue-purple group-hover:scale-105 transition-transform text-sm'
              size='sm'
              asChild
            >
              <span className='flex items-center gap-1'>
                View
                <ArrowRight className='h-3 w-3 group-hover:translate-x-1 transition-transform' />
              </span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}

