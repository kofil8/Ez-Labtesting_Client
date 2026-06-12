"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatStartingPriceLabel,
  formatTurnaroundDaysLabel,
  getCatalogTurnaroundDays,
  getTestStartingLab,
} from "@/lib/tests/storefront-display";
import { getTurnaroundDays } from "@/lib/test-utils";
import type { PublicCatalogTest } from "@/types/public-test";
import {
  Award,
  Beaker,
  Clock,
  Droplets,
  Layers3,
  Scale,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { ShareButton } from "./ShareButton";

interface TestHeroProps {
  test: PublicCatalogTest;
}

export function TestHero({ test }: TestHeroProps) {
  const days =
    getCatalogTurnaroundDays(test) ??
    (test.turnaround > 0 ? getTurnaroundDays(test.turnaround) : null);
  const ageRange =
    typeof test.minAge === "number" || typeof test.maxAge === "number"
      ? `${test.minAge ?? 0}-${test.maxAge ?? "adult"} yrs`
      : "General";
  const startingLab = getTestStartingLab(test);
  const priceLabel = formatStartingPriceLabel(test);
  const turnaroundLabel = formatTurnaroundDaysLabel(days);
  const statCards = [
    {
      label: "Best price",
      value: priceLabel,
      icon: Wallet,
    },
    {
      label: test.isPanel ? "Panel type" : "Sample",
      value: test.isPanel
        ? test.componentCount
          ? `${test.componentCount} included tests`
          : "Panel product"
        : test.specimenType,
      icon: test.isPanel ? Layers3 : Droplets,
    },
    {
      label: "Turnaround",
      value: turnaroundLabel,
      icon: Clock,
    },
    {
      label: "Best lab",
      value: startingLab?.code || "Unavailable",
      icon: ShieldCheck,
    },
  ];

  return (
    <Card className='overflow-hidden border border-slate-200 rounded-3xl shadow-sm bg-white dark:border-slate-800 dark:bg-slate-950'>
      <div className='relative h-56 sm:h-64 md:h-80 overflow-hidden bg-muted'>
        {test.testImage ? (
          <Image
            src={test.testImage}
            alt={test.testName}
            fill
            className='object-cover'
            priority
          />
        ) : (
          <div className='relative flex h-full items-center justify-center'>
            <Beaker className='h-16 w-16 text-muted-foreground/20' />
            {test.isPopular ? (
              <Badge className='absolute left-4 top-4 rounded-full border-0 bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-amber-500/25'>
                Popular
              </Badge>
            ) : null}
          </div>
        )}
        {test.testImage && test.isPopular ? (
          <Badge className='absolute left-4 top-4 rounded-full border-0 bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-amber-500/25'>
            Popular
          </Badge>
        ) : null}
        <div className='absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-900/10 to-transparent' />
        <div className='absolute bottom-4 left-4 right-4 flex flex-wrap gap-2'>
          {days ? (
            <Badge className='bg-white/95 text-slate-900 backdrop-blur-sm text-xs px-3 py-1 border border-white/60'>
              <Clock className='h-3 w-3 mr-1.5' />
              About {days} {days === 1 ? "day" : "days"}
            </Badge>
          ) : null}
          {test.isPanel ? (
            <Badge className='bg-cyan-600/95 text-white backdrop-blur-sm text-xs px-3 py-1 border-0'>
              <Layers3 className='mr-1.5 h-3 w-3' />
              Panel test
            </Badge>
          ) : null}
          <Badge className='bg-blue-600/95 text-white backdrop-blur-sm text-xs px-3 py-1 border-0'>
            <ShieldCheck className='h-3 w-3 mr-1.5' />
            Clinical catalog entry
          </Badge>
        </div>
      </div>

      <CardHeader className='space-y-4 p-5 sm:p-6'>
        <div className='flex items-center justify-between gap-2 flex-wrap'>
          <div className='flex items-center gap-2 flex-wrap'>
            <Badge
              variant='secondary'
              className='capitalize font-medium bg-cyan-50 text-cyan-700 border border-cyan-200'
            >
              {test.category?.name || "General Health"}
            </Badge>
            {test.isPanel ? (
              <Badge
                variant='outline'
                className='text-cyan-700 border-cyan-200 bg-cyan-50'
              >
                <Layers3 className='mr-1 h-3 w-3' />
                {test.componentCount ?? 0} included
              </Badge>
            ) : null}
            <Badge
              variant='outline'
              className='text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-950/30'
            >
              <Award className='h-3 w-3 mr-1' />
              CLIA Certified
            </Badge>
            {test.requiresFasting && (
              <Badge
                variant='outline'
                className='text-amber-700 border-amber-300 bg-amber-50'
              >
                Requires fasting
              </Badge>
            )}
          </div>
          <ShareButton
            testName={test.testName}
            testSlug={test.slug}
            description={test.description}
          />
        </div>

        <div className='space-y-2'>
          <CardTitle className='text-xl sm:text-2xl md:text-3xl font-bold leading-snug'>
            {test.testName}
          </CardTitle>
          <p className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
            {test.shortDescription || test.description}
          </p>
        </div>

        <div className='grid gap-3 pt-1 sm:grid-cols-2 xl:grid-cols-4'>
          {statCards.map((card) => (
            <div
              key={card.label}
              className='rounded-lg border border-primary/15 bg-primary/5 p-3 text-center'
            >
              <card.icon className='mx-auto mb-1.5 h-4 w-4 text-primary' />
              <div className='truncate px-1 text-xs font-bold text-foreground sm:text-sm'>
                {card.value}
              </div>
              <div className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs'>
                {card.label}
              </div>
            </div>
          ))}
          <div className='rounded-lg border border-primary/15 bg-primary/5 p-3 text-center'>
            <Scale className='mx-auto mb-1.5 h-4 w-4 text-primary' />
            <div className='truncate px-1 text-xs font-bold text-foreground sm:text-sm'>
              {ageRange}
            </div>
            <div className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs'>
              Age guide
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium pt-1'>
          <ShieldCheck className='h-4 w-4 shrink-0 text-blue-600' />
          <span>
            {test.isPanel
              ? "Use this page to compare the bundled component tests and the current storefront lab offers."
              : "Use this page to review details before selecting a lab and final offer."}
          </span>
        </div>
      </CardHeader>
    </Card>
  );
}
