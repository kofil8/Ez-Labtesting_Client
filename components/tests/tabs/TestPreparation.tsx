"use client";

import { Test } from "@/types/test";
import { Info, Zap } from "lucide-react";

interface TestPreparationProps {
  test: Test;
}

export function TestPreparation({ test }: TestPreparationProps) {
  const guidelines = [
    {
      title: "Follow Collection Instructions",
      description:
        test.preparation ||
        "Follow the instructions provided with your test kit",
    },
    {
      title: "Stay Hydrated",
      description:
        "Drink plenty of water before your test to ensure adequate sample collection",
    },
    {
      title: "Bring Valid ID",
      description:
        "Government-issued photo ID required at lab collection centers",
    },
    ...(test.fastingRequired
      ? [
          {
            title: `Fasting Required (${test.fastingHours || 8} hours)`,
            description: `Avoid food and beverages (except water) for ${
              test.fastingHours || 8
            } hours before collection`,
          },
        ]
      : []),
  ];

  return (
    <div className='space-y-5 animate-in fade-in duration-300'>
      {/* Instructions box */}
      <div className='p-4 sm:p-5 rounded-xl border border-primary/20 bg-primary/5'>
        <h3 className='text-sm sm:text-base font-semibold mb-2 flex items-center gap-2'>
          <Zap className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
          Preparation Instructions
        </h3>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {test.preparation ||
            "No special preparation needed for this test. Simply follow the instructions in your collection kit."}
        </p>
      </div>

      {/* Step guide */}
      <div>
        <h3 className='text-sm sm:text-base font-semibold mb-3'>
          Step-by-Step Guide
        </h3>
        <ul className='space-y-2'>
          {guidelines.map((guideline, index) => (
            <li
              key={index}
              className='flex items-start gap-3 p-3 rounded-lg border border-border bg-card'
            >
              <div className='h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-xs'>
                {index + 1}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='font-semibold text-sm text-foreground'>
                  {guideline.title}
                </div>
                <div className='text-xs text-muted-foreground mt-0.5'>
                  {guideline.description}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Tip box */}
      <div className='flex gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 border border-border'>
        <Info className='h-4 w-4 text-primary shrink-0 mt-0.5' />
        <p className='text-xs sm:text-sm text-muted-foreground'>
          {test.collectionMethod ||
            "Sample collection is quick and easy. Follow the instructions provided with your kit for best results."}
        </p>
      </div>
    </div>
  );
}
