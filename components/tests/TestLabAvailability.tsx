"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildStorefrontLabCards,
  formatTurnaroundDaysLabel,
  getTestStartingLab,
} from "@/lib/tests/storefront-display";
import { formatCurrency } from "@/lib/utils";
import type { PublicCatalogTest } from "@/types/public-test";
import { Clock3, ShieldCheck, Wallet } from "lucide-react";

export function TestLabAvailability({ test }: { test: PublicCatalogTest }) {
  const labCards = buildStorefrontLabCards(test);
  const startingLab = getTestStartingLab(test);

  return (
    <Card className='border border-slate-200 rounded-3xl bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950'>
      <CardHeader className='border-b border-slate-200 bg-[linear-gradient(135deg,#f8fdff_0%,#ffffff_54%,#eef8ff_100%)] dark:border-slate-800 dark:bg-none'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <CardTitle className='text-xl font-bold text-slate-900 dark:text-white'>
              Storefront Lab Availability
            </CardTitle>
            <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
              Compare the current public storefront offers for this product. ACCESS
              is expected to be the active option for now, while other labs stay
              visible as unavailable until a public offer is exposed.
            </p>
          </div>

          <div className='rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <div className='flex items-center gap-2 font-semibold text-slate-900 dark:text-white'>
              <ShieldCheck className='h-4 w-4 text-sky-700' />
              Best current lab
            </div>
            <p className='mt-1 text-xs uppercase tracking-[0.18em] text-sky-700'>
              {startingLab?.code || "Unavailable"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-5 sm:p-6'>
        <div className='grid gap-4 xl:grid-cols-2'>
          {labCards.map((lab) => (
            <div
              key={lab.code}
              className={`rounded-2xl border p-4 transition-colors ${
                lab.isAvailable
                  ? "border-emerald-200 bg-emerald-50/80"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='text-base font-semibold text-slate-900 dark:text-white'>
                      {lab.name}
                    </p>
                    <Badge
                      variant='outline'
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        lab.isAvailable
                          ? "border-emerald-200 bg-white text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {lab.code}
                    </Badge>
                    {lab.isAvailable ? (
                      <Badge className='rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] text-white'>
                        Available now
                      </Badge>
                    ) : (
                      <Badge
                        variant='outline'
                        className='rounded-full border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-500'
                      >
                        Currently unavailable
                      </Badge>
                    )}
                  </div>
                  <p className='mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400'>
                    {lab.isAvailable && lab.labTestCode
                      ? `Offer code: ${lab.labTestCode}`
                      : "No public storefront offer is currently shown for this lab."}
                  </p>
                </div>

                <div className='rounded-2xl bg-white p-2 text-sky-700 shadow-sm'>
                  <Wallet className='h-5 w-5' />
                </div>
              </div>

              <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-xl border border-slate-200 bg-white p-3'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
                    Price
                  </p>
                  <p className='mt-1 text-sm font-semibold text-slate-900 dark:text-white'>
                    {lab.retailPrice !== null
                      ? formatCurrency(lab.retailPrice)
                      : "Unavailable"}
                  </p>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-3'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
                    Turnaround
                  </p>
                  <p className='mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white'>
                    <Clock3 className='h-3.5 w-3.5 text-sky-700' />
                    {formatTurnaroundDaysLabel(lab.turnaroundDays)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
