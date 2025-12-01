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
import { useToast } from "@/hook/use-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<number | null>(null);
  const pauseRef = useRef(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  // Responsive items per slide (simple approach)
  const itemsPerSlide = useMemo(() => {
    if (typeof window === "undefined") return 3;
    const width = window.innerWidth;
    if (width < 640) return 1; // sm
    if (width < 1024) return 2; // md
    return 3; // lg+
  }, []);

  useEffect(() => {
    setPanels(panelsData as Panel[]);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(panels.length / itemsPerSlide));

  // Ensure currentIndex is valid when panels change
  useEffect(() => {
    if (currentIndex >= totalSlides) setCurrentIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSlides]);

  // Autoplay logic (uses refs to avoid stale closures)
  useEffect(() => {
    // Clear any previous interval
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }

    if (!isAutoplay || panels.length === 0 || totalSlides <= 1) return;

    autoplayRef.current = window.setInterval(() => {
      if (pauseRef.current) return; // paused by user interaction
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isAutoplay, panels.length, totalSlides]);

  const displayPanels = panels.slice(
    currentIndex * itemsPerSlide,
    currentIndex * itemsPerSlide + itemsPerSlide
  );

  const handleAddBundle = (panel: Panel) => {
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

  const goTo = (index: number) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
    // resume autoplay after a bit
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  const previous = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  const next = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  // Small internal card component for readability
  function BundleCard({ panel, index }: { panel: Panel; index: number }) {
    return (
      <motion.div
        key={panel.id}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className='h-full gpu-accelerated'
      >
        <Card className='flex flex-col h-full hover-lift border-2 relative overflow-hidden group'>
          <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          <CardHeader className='relative p-4 sm:p-5'>
            <div className='flex items-start justify-between gap-2 mb-2'>
              <div className='p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-lg group-hover:shadow-xl transition-shadow'>
                <Package className='h-5 w-5 sm:h-6 sm:w-6 text-white' />
              </div>
              {panel.savings > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -25 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 + 0.18, type: "spring" }}
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
                  <span className='text-gradient-cosmic'>Bundle Price</span>
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
    );
  }

  return (
    <section className='py-12 sm:py-16 md:py-20 border-t bg-kalles-card relative overflow-hidden'>
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

        {/* Carousel */}
        <div
          className='relative'
          onMouseEnter={() => {
            pauseRef.current = true;
            setIsAutoplay(false);
          }}
          onMouseLeave={() => {
            pauseRef.current = false;
            setIsAutoplay(true);
          }}
        >
          <div className='overflow-hidden'>
            <AnimatePresence mode='wait'>
              {/* single child: slide wrapper */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className='gpu-accelerated'
              >
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
                  {displayPanels.length > 0
                    ? displayPanels.map((panel, idx) => (
                        <BundleCard key={panel.id} panel={panel} index={idx} />
                      ))
                    : // fallback: show placeholders so layout doesn't collapse
                      Array.from({ length: itemsPerSlide }).map((_, i) => (
                        <div
                          key={`ph-${i}`}
                          className='h-40 rounded-lg bg-muted/30 animate-pulse'
                        />
                      ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Buttons */}
          {totalSlides > 1 && (
            <>
              <motion.button
                onClick={previous}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className='absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 md:p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-700 gpu-accelerated'
                aria-label='Previous slide'
              >
                <ChevronLeft className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6' />
              </motion.button>

              <motion.button
                onClick={next}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className='absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 md:p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-700 gpu-accelerated'
                aria-label='Next slide'
              >
                <ChevronRight className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6' />
              </motion.button>
            </>
          )}

          {/* Indicators */}
          {totalSlides > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='flex justify-center gap-2 mt-8 sm:mt-10'
            >
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`transition-all duration-200 ${
                    idx === currentIndex
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-2.5 sm:w-10 sm:h-3"
                      : "bg-gray-300 dark:bg-gray-600 w-2.5 h-2.5 sm:w-3 sm:h-3"
                  } rounded-full gpu-accelerated`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-pressed={idx === currentIndex}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* CTA */}
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
            <Link href='/panels'>Explore More Discounts</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
