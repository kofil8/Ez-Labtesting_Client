"use client";

import { formatStartingPriceLabel, getCatalogTurnaroundDays, getTestStartingLab } from "@/lib/tests/storefront-display";
import { getTurnaroundDays } from "@/lib/test-utils";
import type { PublicCatalogTest } from "@/types/public-test";
import { Beaker, Clock, Layers3, Wallet } from "lucide-react";

interface TestDetailsGridProps {
  test: PublicCatalogTest;
}

export function TestDetailsGrid({ test }: TestDetailsGridProps) {
  const turnaroundDays =
    getCatalogTurnaroundDays(test) ??
    (test.turnaround > 0 ? getTurnaroundDays(test.turnaround) : null);
  const startingLab = getTestStartingLab(test);

  const details = [
    {
      label: "Sample Type",
      value: test.specimenType,
      icon: Beaker,
    },
    {
      label: "Turnaround Time",
      value: turnaroundDays
        ? `${turnaroundDays} ${turnaroundDays === 1 ? "day" : "days"}`
        : "Varies",
      icon: Clock,
    },
    {
      label: "Category",
      value: test.category?.name || "General Health",
      icon: null,
    },
    {
      label: "Best Price",
      value: formatStartingPriceLabel(test),
      icon: Wallet,
    },
    {
      label: "Best Lab",
      value: startingLab?.name || "Currently unavailable",
      icon: null,
    },
    ...(test.isPanel
      ? [
          {
            label: "Panel Components",
            value: String(test.componentCount ?? 0),
            icon: Layers3,
          },
        ]
      : []),
    ...(test.cptCode
      ? [
          {
            label: "CPT Code",
            value: test.cptCode,
            icon: null,
          },
        ]
      : []),
  ];

  return (
    <div className='space-y-4 sm:space-y-6 animate-in fade-in duration-300'>
      <div>
        <h3 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4'>
          Test Details
        </h3>
        <dl className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
          {details.map((detail) => (
            <div
              key={detail.label}
              className='p-3 sm:p-4 rounded-lg border border-border bg-card'
            >
              <dt className='text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                {detail.icon && (
                  <detail.icon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                )}
                {detail.label}
              </dt>
              <dd className='font-semibold text-base sm:text-lg break-words'>
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {(test.isPanel ||
        test.requiresFasting ||
        typeof test.minAge === "number" ||
        typeof test.maxAge === "number") && (
        <div className='p-3 sm:p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'>
          <h4 className='font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-amber-900 dark:text-amber-100'>
            {test.isPanel ? "Panel Notes" : "Medical Information"}
          </h4>
          <ul className='space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-amber-800 dark:text-amber-200'>
            {test.isPanel && (
              <li>
                Panel component order is controlled by the backend catalog and
                shown in the Included Tests tab.
              </li>
            )}
            {test.requiresFasting && (
              <li>Fasting required before specimen collection.</li>
            )}
            {(typeof test.minAge === "number" ||
              typeof test.maxAge === "number") && (
              <li>
                Recommended age range: {test.minAge ?? 0} to{" "}
                {test.maxAge ?? "adult"} years.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
