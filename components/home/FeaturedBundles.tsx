"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import panelsData from "@/data/panels.json";
import testsData from "@/data/tests.json";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Panel {
  id: string;
  name: string;
  description: string;
  testIds: string[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
}

export function FeaturedBundles() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  useEffect(() => {
    setPanels(panelsData as Panel[]);
  }, []);

  const handleAddBundle = (panel: Panel) => {
    // Add all tests in the bundle to cart
    panel.testIds.forEach((testId) => {
      const test = (testsData as any[]).find((t: any) => t.id === testId);
      if (test) {
        addItem({
          testId: test.id,
          testName: test.name,
          price: test.price,
        });
      }
    });

    toast({
      title: "Bundle added to cart",
      description: `${panel.name} with ${panel.testIds.length} tests has been added.`,
    });
  };

  const displayPanels = panels.slice(0, 3);

  return (
    <section className='py-12 sm:py-16 md:py-20 border-t bg-kalles-card relative overflow-hidden'>
      {/* Kalles-style subtle background pattern */}
      <div className='absolute inset-0 bg-kalles-pattern opacity-50' />

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-10 sm:mb-12 md:mb-16'
        >
          <div className='inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4'>
            <Package className='h-3 w-3 sm:h-4 sm:w-4' />
            <span>Special Offers</span>
          </div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4 sm:px-0'>
            Featured Test <span className='text-gradient-cosmic'>Panels</span>
          </h2>
          <p className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0'>
            Save money with our curated test bundles designed for common health
            needs
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8'>
          {displayPanels.map((panel, index) => (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className='h-full'
            >
              <Card className='flex flex-col h-full hover-lift border-2 relative overflow-hidden group'>
                {/* Gradient overlay on hover */}
                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                <CardHeader className='relative p-4 sm:p-5'>
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <div className='p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-lg group-hover:shadow-xl transition-shadow'>
                      <Package className='h-5 w-5 sm:h-6 sm:w-6 text-white' />
                    </div>
                    {panel.savings > 0 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.1 + 0.3,
                          type: "spring",
                        }}
                      >
                        <Badge className='bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2.5 py-0.5 text-xs sm:text-sm'>
                          💰 Save {formatCurrency(panel.savings)}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className='text-lg sm:text-xl mb-1.5 group-hover:text-primary transition-colors'>
                    {panel.name}
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    {panel.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className='flex-1 relative p-4 pt-0 sm:p-5 sm:pt-0'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-2.5 rounded-lg bg-muted/50'>
                      <span className='text-sm text-muted-foreground'>
                        Tests included
                      </span>
                      <span className='font-bold text-base'>
                        {panel.testIds.length}
                      </span>
                    </div>

                    <div className='space-y-1.5'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground line-through'>
                          Regular Price
                        </span>
                        <span className='text-muted-foreground line-through'>
                          {formatCurrency(panel.originalPrice)}
                        </span>
                      </div>
                      <div className='flex justify-between items-center text-base font-bold pt-2 border-t'>
                        <span className='text-gradient-cosmic'>
                          Bundle Price
                        </span>
                        <span className='text-gradient-cosmic'>
                          {formatCurrency(panel.bundlePrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className='relative p-4 pt-0 sm:p-5 sm:pt-0'>
                  <Button
                    onClick={() => handleAddBundle(panel)}
                    className='w-full gradient-blue-purple hover:scale-105 transition-transform shadow-lg group/btn'
                    size='default'
                  >
                    <ShoppingCart className='h-4 w-4 mr-2 group-hover/btn:animate-pulse' />
                    Add Bundle to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className='mt-16 text-center'
        >
          <p className='text-muted-foreground mb-4'>
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Button
            variant='outline'
            size='lg'
            asChild
            className='hover:bg-primary/10'
          >
            <Link href='/tests'>Browse All Tests</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
