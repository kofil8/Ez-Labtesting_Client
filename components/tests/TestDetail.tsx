"use client";

import type { PublicCatalogTest } from "@/types/public-test";
import { TestHero } from "./TestHero";
import { TestLabAvailability } from "./TestLabAvailability";
import { TestPurchaseCard } from "./TestPurchaseCard";
import { TestTabs } from "./TestTabs";

interface TestDetailProps {
  test: PublicCatalogTest;
  currentUserId?: string;
}

export function TestDetail({ test, currentUserId }: TestDetailProps) {
  return (
    <div className='min-h-screen bg-background'>
      <TestHero test={test} />

      <div className='mt-6 sm:mt-8 space-y-6 lg:space-y-8'>
        <TestLabAvailability test={test} />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
          <div className='lg:col-span-2 order-2 lg:order-1'>
            <TestTabs test={test} currentUserId={currentUserId} />
          </div>

          <div className='lg:col-span-1 order-1 lg:order-2'>
            <TestPurchaseCard test={test} />
          </div>
        </div>
      </div>
    </div>
  );
}
