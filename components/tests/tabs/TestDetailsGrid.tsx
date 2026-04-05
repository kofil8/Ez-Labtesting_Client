"use client";

import { getTurnaroundDays } from "@/lib/test-utils";
import { Test } from "@/types/test";
import { Beaker, Clock } from "lucide-react";

interface TestDetailsGridProps {
  test: Test;
}

export function TestDetailsGrid({ test }: TestDetailsGridProps) {
  const turnaroundDays = getTurnaroundDays(test.turnaround);

  const details = [
    {
      label: "Sample Type",
      value: test.specimenType,
      icon: Beaker,
    },
    {
      label: "Turnaround Time",
      value: `${turnaroundDays} ${turnaroundDays === 1 ? "day" : "days"}`,
      icon: Clock,
    },
    {
      label: "Laboratory",
      value: test.labName || "Certified Lab",
      icon: null,
    },
    ...(test.labCode
      ? [
          {
            label: "Lab Code",
            value: test.labCode,
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

      {/* Additional medical context */}
      {(test.fastingRequired ||
        test.ageRequirement ||
        test.sampleVolume ||
        test.tubeType) && (
        <div className='p-3 sm:p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'>
          <h4 className='font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-amber-900 dark:text-amber-100'>
            Medical Information
          </h4>
          <ul className='space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-amber-800 dark:text-amber-200'>
            {test.fastingRequired && (
              <li>
                • Fasting required: {test.fastingHours || 8} hours recommended
              </li>
            )}
            {test.ageRequirement && (
              <li>• Age requirement: {test.ageRequirement}</li>
            )}
            {test.sampleVolume && <li>• Sample volume: {test.sampleVolume}</li>}
            {test.tubeType && <li>• Collection tube: {test.tubeType}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
