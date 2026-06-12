"use client";

import type { PublicCatalogTest } from "@/types/public-test";
import { FileText, Info, Layers3, MessageSquare, Star, Zap } from "lucide-react";
import { useState } from "react";
import { TestComponentsList } from "./tabs/TestComponentsList";
import { TestDetailsGrid } from "./tabs/TestDetailsGrid";
import { TestFAQ } from "./tabs/TestFAQ";
import { TestOverview } from "./tabs/TestOverview";
import { TestPreparation } from "./tabs/TestPreparation";
import { TestReviewsSection } from "./tabs/TestReviewsSection";

interface TestTabsProps {
  test: PublicCatalogTest;
  currentUserId?: string;
}

export function TestTabs({ test, currentUserId }: TestTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "details", label: "Test Details", icon: FileText },
    ...(test.isPanel
      ? [{ id: "components", label: "Included Tests", icon: Layers3 }]
      : [{ id: "preparation", label: "Preparation", icon: Zap }]),
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "faq", label: "FAQ", icon: MessageSquare },
  ];

  return (
    <div className='border border-border rounded-xl bg-card shadow-sm overflow-hidden'>
      <div className='border-b border-border overflow-x-auto scrollbar-hide'>
        <div className='flex min-w-max px-4 sm:px-6'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-3.5 px-3 sm:px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className='p-4 sm:p-6'>
        {activeTab === "overview" && <TestOverview test={test} />}
        {activeTab === "details" && <TestDetailsGrid test={test} />}
        {activeTab === "preparation" && <TestPreparation test={test} />}
        {activeTab === "components" && <TestComponentsList test={test} />}
        {activeTab === "reviews" && (
          <TestReviewsSection test={test} currentUserId={currentUserId} />
        )}
        {activeTab === "faq" && <TestFAQ test={test} />}
      </div>
    </div>
  );
}
