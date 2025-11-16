"use client";

import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/panels/PanelCard";
import panelsData from "@/data/panels.json";

interface Panel {
  id: string;
  name: string;
  description: string;
  testIds: string[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
}

export function FeaturedPanelsHome() {
  const [featuredPanels, setFeaturedPanels] = useState<Panel[]>([]);

  useEffect(() => {
    // Show first 3 panels as featured on home page
    setFeaturedPanels((panelsData as Panel[]).slice(0, 3));
  }, []);

  return (
    <section className='py-12 sm:py-16 md:py-20 border-t bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 dark:bg-blue-900/20 rounded-full blur-3xl' />
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-10 sm:mb-12 md:mb-16'
        >
          <div className='inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4'>
            <Package className='h-3 w-3 sm:h-4 sm:w-4' />
            <span>Test Bundles</span>
          </div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4 sm:px-0'>
            Featured Test <span className='text-gradient-cosmic'>Panels</span>
          </h2>
          <p className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0'>
            Comprehensive test bundles tailored for specific health needs with
            exclusive savings
          </p>
        </motion.div>

        {/* Panels Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12'>
          {featuredPanels.map((panel, index) => (
            <PanelCard key={panel.id} panel={panel} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className='flex flex-col items-center justify-center gap-4'
        >
          <p className='text-muted-foreground text-center max-w-2xl'>
            Want to explore more test panels? Browse our complete collection to
            find the perfect panel for your health goals.
          </p>
          <Button
            size='lg'
            className='gradient-blue-purple'
            asChild
          >
            <Link href='/panels' className='flex items-center gap-2'>
              Browse All Panels
              <ArrowRight className='h-5 w-5' />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

