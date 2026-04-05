"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TestDetailSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20'>
      {/* Hero Skeleton */}
      <Card className='overflow-hidden border-2 border-primary/20 mb-12'>
        <div className='relative h-80 bg-muted animate-pulse' />
        <CardHeader className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-6 w-16' />
            </div>
            <Skeleton className='h-10 w-3/4' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-5/6' />
          </div>
          <div className='grid grid-cols-3 gap-3 pt-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='text-center p-4 rounded-lg border'>
                <Skeleton className='h-5 w-5 mx-auto mb-2' />
                <Skeleton className='h-8 w-12 mx-auto mb-1' />
                <Skeleton className='h-4 w-16 mx-auto' />
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Content Grid Skeleton */}
      <div className='container mx-auto px-6'>
        <div className='grid lg:grid-cols-3 gap-12'>
          {/* Left Column */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex gap-2'>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='h-10 w-24' />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-5/6' />
                  <Skeleton className='h-6 w-4/6' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-6'>
              <CardHeader className='space-y-4'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-16 w-full' />
              </CardHeader>
              <CardContent className='space-y-4'>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
