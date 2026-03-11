"use client";

import { Test } from "@/types/test";
import { TestHero } from "./TestHero";
import { TestPurchaseCard } from "./TestPurchaseCard";
import { TestTabs } from "./TestTabs";

interface TestDetailProps {
  test: Test;
  currentUserId?: string; // Add currentUserId for review system
}

export function TestDetail({ test, currentUserId }: TestDetailProps) {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <TestHero test={test} />

      {/* Main Content Grid */}
      <div className='mt-6 sm:mt-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
          {/* Left Column - Content Tabs */}
          <div className='lg:col-span-2 order-2 lg:order-1'>
            <TestTabs test={test} currentUserId={currentUserId} />
          </div>

          {/* Right Column - Purchase Card */}
          <div className='lg:col-span-1 order-1 lg:order-2'>
            <TestPurchaseCard test={test} />
          </div>
        </div>
      </div>
    </div>
  );
}
