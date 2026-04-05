"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getTurnaroundDays } from "@/lib/test-utils";
import { Test } from "@/types/test";
import { Award, Beaker, CheckCircle2, Clock, Star } from "lucide-react";
import Image from "next/image";
import { ShareButton } from "./ShareButton";

interface TestHeroProps {
  test: Test;
}

export function TestHero({ test }: TestHeroProps) {
  const days = getTurnaroundDays(test.turnaround);

  return (
    <Card className='overflow-hidden border border-border rounded-xl shadow-sm'>
      {/* Hero Image */}
      <div className='relative h-48 sm:h-60 md:h-72 overflow-hidden bg-muted'>
        {test.testImage ? (
          <Image
            src={test.testImage}
            alt={test.testName}
            fill
            className='object-cover'
            priority
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <Beaker className='h-16 w-16 text-muted-foreground/20' />
          </div>
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/25 to-transparent' />
        {/* Turnaround badge */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2'>
          <Badge className='bg-primary/90 text-primary-foreground backdrop-blur-sm text-xs px-3 py-1'>
            <Clock className='h-3 w-3 mr-1.5' />
            {days}-Day Results
          </Badge>
        </div>
      </div>

      {/* Info Section */}
      <CardHeader className='space-y-4 p-5 sm:p-6'>
        {/* Badges + share */}
        <div className='flex items-center justify-between gap-2 flex-wrap'>
          <div className='flex items-center gap-2 flex-wrap'>
            <Badge variant='secondary' className='capitalize font-medium'>
              {typeof test.category === "string"
                ? test.category
                : test.category?.name || "General"}
            </Badge>
            <Badge
              variant='outline'
              className='text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-950/30'
            >
              <Award className='h-3 w-3 mr-1' />
              CLIA Certified
            </Badge>
            {test.labName && (
              <Badge variant='outline' className='text-muted-foreground'>
                {test.labName}
              </Badge>
            )}
          </div>
          <ShareButton
            testName={test.testName}
            testId={test.id}
            description={test.description}
          />
        </div>

        {/* Title + description */}
        <div className='space-y-2'>
          <CardTitle className='text-xl sm:text-2xl md:text-3xl font-bold leading-snug'>
            {test.testName}
          </CardTitle>
          <p className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
            {test.description}
          </p>
        </div>

        {/* Key Indicators */}
        <div className='grid grid-cols-3 gap-3 pt-1'>
          <div className='text-center p-3 rounded-lg bg-primary/5 border border-primary/15'>
            <Clock className='h-4 w-4 mx-auto mb-1.5 text-primary' />
            <div className='text-lg sm:text-xl font-bold text-foreground'>
              {days}
            </div>
            <div className='text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide'>
              Days
            </div>
          </div>

          <div className='text-center p-3 rounded-lg bg-primary/5 border border-primary/15'>
            <Beaker className='h-4 w-4 mx-auto mb-1.5 text-primary' />
            <div className='text-xs sm:text-sm font-bold text-foreground truncate px-1'>
              {test.specimenType}
            </div>
            <div className='text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide'>
              Sample
            </div>
          </div>

          <div className='text-center p-3 rounded-lg bg-primary/5 border border-primary/15'>
            <Star className='h-4 w-4 mx-auto mb-1.5 text-primary fill-primary' />
            <div className='text-lg sm:text-xl font-bold text-foreground'>
              4.9
            </div>
            <div className='text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide'>
              Rating
            </div>
          </div>
        </div>

        {/* In-stock status */}
        <div className='flex items-center gap-2 text-sm text-secondary font-medium pt-1'>
          <CheckCircle2 className='h-4 w-4 shrink-0' />
          <span>In stock · Ready to ship</span>
        </div>
      </CardHeader>
    </Card>
  );
}
