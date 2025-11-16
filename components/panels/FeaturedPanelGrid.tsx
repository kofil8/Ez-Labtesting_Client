"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Filter, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import panelsData from "@/data/panels.json";
import { formatCurrency } from "@/lib/utils";

interface Panel {
  id: string;
  name: string;
  description: string;
  testIds: string[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
}

export function FeaturedPanelGrid() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [filteredPanels, setFilteredPanels] = useState<Panel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"savings" | "price" | "name">("savings");

  useEffect(() => {
    setPanels(panelsData as Panel[]);
    setFilteredPanels(panelsData as Panel[]);
  }, []);

  // Handle sorting and filtering
  useEffect(() => {
    let result = [...panels];

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "savings":
          return b.savings - a.savings;
        case "price":
          return a.bundlePrice - b.bundlePrice;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredPanels(result);
  }, [panels, sortBy]);

  const savingsPercentage = (panel: Panel) => {
    return Math.round((panel.savings / panel.originalPrice) * 100);
  };

  return (
    <div className='space-y-8'>
      {/* Header with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b'
      >
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold flex items-center gap-2'>
            <Package className='h-7 w-7 text-purple-600 dark:text-purple-400' />
            All Featured Panels
          </h2>
          <p className='text-muted-foreground mt-1'>
            {filteredPanels.length} panel{filteredPanels.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Sort Controls */}
        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <Filter className='h-4 w-4 text-muted-foreground' />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "savings" | "price" | "name")}
            className='px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium'
          >
            <option value='savings'>Sort by Savings</option>
            <option value='price'>Sort by Price</option>
            <option value='name'>Sort by Name</option>
          </select>
        </div>
      </motion.div>

      {/* Panels Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
        <AnimatePresence mode='wait'>
          {filteredPanels.map((panel, index) => (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -8 }}
            >
              <Link href={`/panels/${panel.id}`} className='group'>
                <Card className='h-full hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all duration-300 border-2 hover:border-purple-400 dark:hover:border-purple-600 overflow-hidden flex flex-col'>
                  {/* Header Background */}
                  <div className='relative h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 overflow-hidden'>
                    {/* Animated background pattern */}
                    <div className='absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity'>
                      <svg className='w-full h-full' viewBox='0 0 400 200'>
                        <defs>
                          <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
                            <path d='M 40 0 L 0 0 0 40' fill='none' stroke='white' strokeWidth='0.5' />
                          </pattern>
                        </defs>
                        <rect width='400' height='200' fill='url(#grid)' />
                      </svg>
                    </div>

                    {/* Icon Badge */}
                    <div className='absolute top-4 left-4 p-3 rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all'>
                      <Package className='h-6 w-6 text-white' />
                    </div>

                    {/* Savings Badge */}
                    {panel.savings > 0 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        className='absolute top-4 right-4'
                      >
                        <Badge className='bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-3 py-1.5 text-xs font-bold'>
                          🎉 Save {savingsPercentage(panel)}%
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  <CardHeader className='p-5 pb-3'>
                    <div className='space-y-2'>
                      <CardTitle className='text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2'>
                        {panel.name}
                      </CardTitle>
                      <CardDescription className='line-clamp-2'>
                        {panel.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className='flex-1 p-5 pt-0 space-y-4'>
                    {/* Tests Count */}
                    <div className='p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-muted-foreground'>Tests Included</span>
                        <span className='text-2xl font-bold text-gradient-cosmic'>
                          {panel.testIds.length}
                        </span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className='space-y-2 pt-2'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-muted-foreground'>Regular Price</span>
                        <span className='text-sm font-semibold line-through text-gray-500'>
                          {formatCurrency(panel.originalPrice)}
                        </span>
                      </div>
                      <div className='flex justify-between items-center pt-2 border-t'>
                        <span className='font-semibold text-gradient-cosmic'>Bundle Price</span>
                        <span className='text-2xl font-bold text-gradient-cosmic'>
                          {formatCurrency(panel.bundlePrice)}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className='p-5 pt-0'>
                    <Button
                      className='w-full gradient-blue-purple group-hover:scale-105 transition-transform shadow-md'
                      size='default'
                      asChild
                    >
                      <span className='flex items-center gap-2'>
                        View Details
                        <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPanels.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center py-12'
        >
          <Package className='h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50' />
          <p className='text-muted-foreground text-lg'>No panels found</p>
        </motion.div>
      )}
    </div>
  );
}

