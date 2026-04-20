"use client";

import { getTestDetailConfig } from "@/app/(shop)/tests/data/test-detail-config";
import { formatStartingPriceLabel, getTestStartingLab } from "@/lib/tests/storefront-display";
import type { PublicCatalogTest } from "@/types/public-test";
import { FlaskConical, Layers3, Star } from "lucide-react";

interface TestOverviewProps {
  test: PublicCatalogTest;
}

export function TestOverview({ test }: TestOverviewProps) {
  const config = getTestDetailConfig(test.category?.name);
  const startingLab = getTestStartingLab(test);

  return (
    <div className='space-y-6 sm:space-y-8 animate-in fade-in duration-300'>
      {test.isPanel ? (
        <div className='rounded-xl border border-cyan-200 bg-cyan-50 p-4 sm:p-5'>
          <h3 className='mb-3 flex items-center gap-2 text-base font-semibold text-slate-900 sm:text-lg'>
            <Layers3 className='h-5 w-5 text-cyan-700' />
            Panel Summary
          </h3>
          <div className='grid gap-3 sm:grid-cols-3'>
            <div className='rounded-xl border border-cyan-100 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'>
                Included Tests
              </p>
              <p className='mt-2 text-xl font-semibold text-slate-900'>
                {test.componentCount ?? 0}
              </p>
            </div>
            <div className='rounded-xl border border-cyan-100 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'>
                Starting Price
              </p>
              <p className='mt-2 text-xl font-semibold text-slate-900'>
                {formatStartingPriceLabel(test)}
              </p>
            </div>
            <div className='rounded-xl border border-cyan-100 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'>
                Best Lab
              </p>
              <p className='mt-2 text-xl font-semibold text-slate-900'>
                {startingLab?.code || "Unavailable"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className='bg-primary/5 border border-primary/15 p-4 sm:p-5 rounded-xl'>
        <h3 className='text-base sm:text-lg font-semibold mb-3 flex items-center gap-2'>
          <FlaskConical className='h-5 w-5 text-primary shrink-0' />
          {test.isPanel ? "What This Panel Covers" : "What This Test Measures"}
        </h3>
        <p className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
          {test.description}
        </p>
      </div>

      <div>
        <h3 className='text-sm sm:text-base font-semibold mb-4 text-foreground'>
          {test.isPanel ? "Why Choose This Panel" : "Why Choose This Test"}
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {config.features.map((feature, index) => (
            <div
              key={index}
              className='p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors'
            >
              <div className='flex items-start gap-3'>
                <span className='text-2xl shrink-0'>{feature.icon}</span>
                <div>
                  <div className='font-semibold text-sm text-foreground mb-1'>
                    {feature.title}
                  </div>
                  <div className='text-xs sm:text-sm text-muted-foreground'>
                    {feature.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-muted/50 border border-border p-4 sm:p-5 rounded-xl'>
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0'>
            {config.testimonials[0]?.initials || "SM"}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-0.5 mb-2'>
              {[...Array(config.testimonials[0]?.rating || 5)].map((_, i) => (
                <Star
                  key={i}
                  className='h-4 w-4 fill-amber-400 text-amber-400'
                />
              ))}
            </div>
            <blockquote className='text-sm text-muted-foreground italic mb-1.5'>
              "{config.testimonials[0]?.text}"
            </blockquote>
            <div className='text-xs text-muted-foreground'>
              - {config.testimonials[0]?.name || "Verified Customer"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
