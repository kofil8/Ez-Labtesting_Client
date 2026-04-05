"use client";

import { ReactNode } from "react";
import { PageContainer } from "./PageContainer";

interface StandardListingPageProps {
  title: string;
  description?: string;
  filters?: ReactNode;
  content: ReactNode;
  additionalContent?: ReactNode;
  gridCols?: "2" | "3" | "4";
}

export function StandardListingPage({
  title,
  description,
  filters,
  content,
  additionalContent,
}: StandardListingPageProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/10'>
      {/* Page Header */}
      <div className='border-b border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm'>
        <PageContainer>
          <div className='py-8 sm:py-10 md:py-12'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight'>
              {title}
            </h1>
            {description && (
              <p className='text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed'>
                {description}
              </p>
            )}
          </div>
        </PageContainer>
      </div>

      {/* Main Content */}
      <PageContainer>
        <div className='py-8 sm:py-10 md:py-12'>
          <div className='grid grid-cols-1 gap-6 lg:gap-8'>
            {/* Filters Sidebar */}
            {filters && (
              <div className='lg:col-span-1'>
                <div className='space-y-4'>{filters}</div>
              </div>
            )}

            {/* Content Grid */}
            <div className={filters ? "lg:col-span-3" : "lg:col-span-4"}>
              {content}
            </div>
          </div>
        </div>

        {/* Additional Content Section */}
        {additionalContent && <div className='mb-8'>{additionalContent}</div>}
      </PageContainer>
    </div>
  );
}
