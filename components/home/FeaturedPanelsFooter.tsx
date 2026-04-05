"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import panelsData from "@/data/panels.json";
import { useToast } from "@/hook/use-toast";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ExternalLink, Package } from "lucide-react";
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
  enabled?: boolean;
}

const FEATURED_PANEL_IDS = ["panel-001", "panel-002", "panel-003"];

export function FeaturedPanelsFooter() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const all = panelsData as Panel[];
    const featured = all.filter(
      (p) => FEATURED_PANEL_IDS.includes(p.id) && p.enabled !== false,
    );
    setPanels(featured);
  }, []);

  const handleAddBundle = (panel: Panel) => {
    toast({
      title: "Bundle Added",
      description: `${panel.name} added to your cart.`,
      variant: "default",
    });
  };

  if (panels.length === 0) return null;

  return (
    <div className='mb-8 xs:mb-10 pb-8 xs:pb-10 border-b border-slate-700'>
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 xs:gap-5 mb-4 xs:mb-6'>
        <div>
          <h3 className='text-xl sm:text-2xl font-bold text-white mb-1'>
            Featured Test Panels
          </h3>
          <p className='text-sm text-slate-400'>
            Our most popular health screenings chosen by thousands.
          </p>
        </div>
        <Link
          href='/panels'
          className='inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors shrink-0'
        >
          View All Panels
          <ExternalLink className='h-4 w-4' />
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        {panels.map((panel, idx) => {
          const features = [
            `${panel.testIds.length} Clinical Tests Included`,
            "Physician Reviewed Results",
            "Digital Results in 24-48h",
          ];

          return (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className='h-full'
            >
              <Card className='flex flex-col h-full overflow-hidden border border-slate-600 bg-slate-800/80 hover:border-slate-500 hover:shadow-xl transition-all duration-300 group'>
                <div className='h-24 sm:h-28 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 relative overflow-hidden'>
                  <div
                    className='absolute inset-0 opacity-20'
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className='absolute -right-3 -bottom-4 opacity-30 transform rotate-12'>
                    <Package className='w-20 h-20 text-white' />
                  </div>
                </div>

                <CardContent className='flex-1 p-4 sm:p-5'>
                  <div className='mb-3'>
                    <h4 className='text-base sm:text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors'>
                      {panel.name}
                    </h4>
                    <p className='text-xs text-slate-400 line-clamp-2'>
                      {panel.description}
                    </p>
                  </div>

                  <ul className='space-y-2'>
                    {features.map((feature, i) => (
                      <li
                        key={i}
                        className='flex items-start gap-2 text-xs text-slate-300'
                      >
                        <div className='mt-0.5 w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0'>
                          <Check className='w-2.5 h-2.5 text-green-400 stroke-[3]' />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className='p-4 sm:p-5 pt-0 flex flex-col gap-3'>
                  <div className='flex items-end justify-between'>
                    {panel.savings > 0 ? (
                      <>
                        <span className='text-xs text-slate-500 line-through'>
                          {formatCurrency(panel.originalPrice)}
                        </span>
                        <span className='text-lg sm:text-xl font-bold text-blue-400'>
                          {formatCurrency(panel.bundlePrice)}
                        </span>
                      </>
                    ) : (
                      <span className='text-lg sm:text-xl font-bold text-blue-400'>
                        {formatCurrency(panel.bundlePrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddBundle(panel)}
                    className='w-full h-10 sm:h-11 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors'
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
