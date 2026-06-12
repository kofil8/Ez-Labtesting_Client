"use client";

import { publicFetch } from "@/lib/api-client";
import { siteMetricsFallback } from "@/lib/copyContent";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface SiteMetricsSummary {
  averageRating: number;
  reviewCount: number;
  testsProcessed: number;
}

interface SiteMetricsProps {
  variant?: "inline" | "panel";
  className?: string;
  initialSummary?: SiteMetricsSummary;
}

function formatCompactNumber(value: number) {
  return Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function hasPublishableSocialProof(summary: SiteMetricsSummary) {
  return summary.testsProcessed >= 100 && summary.reviewCount >= 10;
}

export function SiteMetrics({
  variant = "inline",
  className,
  initialSummary = siteMetricsFallback,
}: SiteMetricsProps) {
  const [summary, setSummary] = useState<SiteMetricsSummary>(initialSummary);

  useEffect(() => {
    let isMounted = true;

    publicFetch("/reviews/summary")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load site metrics");
        }
        return response.json();
      })
      .then((payload) => {
        const data = payload?.data;
        if (!isMounted || !data) return;
        setSummary({
          testsProcessed:
            typeof data.testsProcessed === "number"
              ? data.testsProcessed
              : siteMetricsFallback.testsProcessed,
          averageRating:
            typeof data.averageRating === "number"
              ? data.averageRating
              : siteMetricsFallback.averageRating,
          reviewCount:
            typeof data.reviewCount === "number"
              ? data.reviewCount
              : siteMetricsFallback.reviewCount,
        });
      })
      .catch(() => {
        // Keep the conservative fallback visible when metrics are unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const content = hasPublishableSocialProof(summary) ? (
    <>
      <span className='font-black text-slate-950 dark:text-white'>
        {formatCompactNumber(summary.testsProcessed)}+ tests processed
      </span>
      <span className='hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:inline-block' />
      <span className='inline-flex items-center gap-1 font-black text-slate-950 dark:text-white'>
        <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
        {summary.averageRating.toFixed(1)}/5 average
      </span>
      <span className='text-slate-500 dark:text-slate-400'>
        from {formatCompactNumber(summary.reviewCount)} reviews
      </span>
    </>
  ) : (
    <>
      <span className='font-black text-slate-950 dark:text-white'>
        ZIP-checked availability
      </span>
      <span className='hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:inline-block' />
      <span className='font-black text-slate-950 dark:text-white'>
        CLIA-certified partner labs
      </span>
      <span className='text-slate-500 dark:text-slate-400'>
        Metrics publish after review volume is established
      </span>
    </>
  );

  if (variant === "panel") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900",
          className,
        )}
        aria-label='Site review and processing metrics'
      >
        {content}
      </div>
    );
  }

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300",
        className,
      )}
      aria-label='Site review and processing metrics'
    >
      {content}
    </p>
  );
}
