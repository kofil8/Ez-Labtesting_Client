"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteMetrics } from "@/components/shared/SiteMetrics";
import { usePublicCatalog } from "@/hook/usePublicCatalog";
import {
  homepageDefaultTestContext,
  homepageTestContextFallbacks,
  physicianTrustCopy,
} from "@/lib/copyContent";
import {
  formatStartingPriceLabel,
  getCatalogTurnaroundDays,
} from "@/lib/tests/storefront-display";
import type { PublicCatalogTest } from "@/types/public-test";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Loader2,
  Stethoscope,
  TestTube2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_SIZE = 6;
const SOLD_COUNT_VISIBILITY_THRESHOLD = 100;

const filters = [
  { label: "Popular", search: "" },
  { label: "Annual checkup", search: "annual cbc cmp lipid" },
  { label: "Heart", search: "heart lipid cholesterol" },
  { label: "Hormones", search: "hormone testosterone cortisol" },
  { label: "Diabetes", search: "diabetes a1c glucose" },
  { label: "Thyroid", search: "thyroid tsh" },
  { label: "Vitamins", search: "vitamin d b12" },
  { label: "STD", search: "std sti" },
];

function timingLabel(test: PublicCatalogTest) {
  const days = getCatalogTurnaroundDays(test);
  if (!days || days <= 0) return "Timing varies";
  if (days <= 3) return "Most results 24-72 hrs";
  return `Most results in ${days} days`;
}

function matchesFilter(test: PublicCatalogTest, search: string) {
  if (!search) return true;
  const haystack = [
    test.testName,
    test.shortDescription,
    test.description,
    test.category?.name,
    ...(test.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return search
    .toLowerCase()
    .split(" ")
    .some((token) => haystack.includes(token));
}

function getTestContext(test: PublicCatalogTest) {
  const haystack = [
    test.testName,
    test.shortDescription,
    test.description,
    test.category?.name,
    ...(test.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return (
    homepageTestContextFallbacks.find((fallback) =>
      fallback.match.some((token) => haystack.includes(token)),
    )?.text ?? homepageDefaultTestContext
  );
}

export function PopularTestsSection() {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const { tests, total, loading, loadingMore, hasMore, loadMore } =
    usePublicCatalog({ pageSize: PAGE_SIZE, popularOnly: true });

  const visibleTests = useMemo(
    () => tests.filter((test) => matchesFilter(test, activeFilter.search)),
    [activeFilter, tests],
  );

  return (
    <section
      id='popular-tests'
      className='scroll-mt-24 bg-[linear-gradient(180deg,#f4faff_0%,#ffffff_100%)] py-14 dark:bg-slate-950 sm:py-20'
    >
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mx-auto mb-8 max-w-3xl text-center'>
          <p className='mb-3 inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm dark:border-sky-900/60 dark:bg-slate-900 dark:text-sky-300'>
              Trending this week
            </p>
          <h2 className='text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
            Browse commonly checked lab tests
          </h2>
          <p className='mt-3 text-base leading-7 text-slate-600 dark:text-slate-300'>
            Start with common labs, compare essentials, then confirm local
            availability before checkout.
          </p>
        </div>

        <div className='rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-50px_rgba(14,165,233,0.35)] dark:border-slate-800 dark:bg-slate-950'>
          <div className='border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-cyan-50 px-5 py-5 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-sky-300'>
                  Featured catalog
                </p>
                <h3 className='mt-2 text-2xl font-bold text-slate-900 dark:text-white'>
                  Popular tests
                </h3>
                <p className='mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400'>
                  Filter by common health goals and open each test to review
                  preparation, specimen, and current storefront pricing.
                </p>
              </div>

              <Button
                asChild
                variant='outline'
                className='w-full rounded-full bg-white font-semibold shadow-sm dark:bg-slate-950 sm:w-auto'
              >
                <Link href='/tests'>
                  View all tests
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>

          <div className='p-5 sm:p-6'>
            <div className='mb-6'>
              <SiteMetrics variant='panel' />
            </div>

            <div className='mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-1.5 [scrollbar-width:none] dark:border-slate-800 dark:bg-slate-900'>
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  type='button'
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors sm:px-4 ${
                    activeFilter.label === filter.label
                      ? "border-sky-700 bg-sky-700 text-white shadow-sm"
                      : "border-transparent bg-transparent text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
            >
                  {filter.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900'
                  />
                ))}
              </div>
            ) : tests.length === 0 ? null : (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {(visibleTests.length > 0 ? visibleTests : tests)
                  .slice(0, 6)
                  .map((test) => (
                    <Card
                      key={test.id}
                      className='group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800'
                    >
                      <CardContent className='flex h-full flex-col p-5'>
                    <div className='mb-4 flex flex-wrap items-center gap-2'>
                      <Badge className='rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 shadow-none hover:bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300'>
                        {test.category?.name || "General Health"}
                      </Badge>
                      <Badge
                        variant='outline'
                        className='rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
                      >
                        <BadgeCheck className='mr-1 h-3 w-3' />
                        ACCESS
                      </Badge>
                      {test.isPhysicianReviewed ? (
                        <Badge
                          variant='outline'
                          className='rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                        >
                          <Stethoscope className='mr-1 h-3 w-3' />
                          {physicianTrustCopy.badgeText}
                        </Badge>
                      ) : null}
                    </div>
                    <h3 className='line-clamp-2 text-lg font-bold leading-snug text-slate-950 dark:text-white'>
                      {test.testName}
                    </h3>
                    <p className='mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                      {getTestContext(test)}
                    </p>

                    {test.testImage ? (
                      <div className='relative mt-4 h-24 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800'>
                        <Image
                          src={test.testImage}
                          alt={test.testName}
                          fill
                          sizes='(max-width: 768px) 100vw, 33vw'
                          className='object-cover'
                        />
                        <div className='absolute inset-0 bg-slate-950/20' />
                      </div>
                    ) : null}

                    <div className='mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <span className='text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                            Starting price
                          </span>
                          <p className='mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>
                            {formatStartingPriceLabel(test)}
                          </p>
                        </div>
                        {test.isPopular ? (
                          <span className='rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'>
                            Popular
                          </span>
                        ) : null}
                      </div>

                      <div className='mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300'>
                        <div className='flex items-center gap-2'>
                          <TestTube2 className='h-4 w-4 text-sky-700 dark:text-sky-300' />
                          <span>{test.specimenType || "Blood draw"}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Clock3 className='h-4 w-4 text-sky-700 dark:text-sky-300' />
                          <span>{timingLabel(test)}</span>
                        </div>
                        {(() => {
                          const count =
                            typeof test.soldCount === "number"
                              ? test.soldCount
                              : typeof test.totalOrders === "number"
                                ? test.totalOrders
                                : null;
                          return count !== null &&
                            count >= SOLD_COUNT_VISIBILITY_THRESHOLD ? (
                            <p className='text-xs font-medium text-slate-500 dark:text-slate-400'>
                              {Intl.NumberFormat("en-US", {
                                notation: count >= 1000 ? "compact" : "standard",
                                maximumFractionDigits: count >= 1000 ? 1 : 0,
                              }).format(count)}{" "}
                              ordered
                            </p>
                          ) : null;
                        })()}
                      </div>
                    </div>

                    <div className='mt-auto grid gap-2 pt-5 sm:grid-cols-[1fr_auto]'>
                      <Button
                        asChild
                        className='w-full rounded-xl bg-sky-700 font-semibold text-white shadow-sm hover:bg-sky-800'
                      >
                        <Link href={`/tests/${test.slug}`}>
                          Check Availability
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant='outline'
                        className='w-full rounded-xl bg-white font-semibold dark:bg-slate-950 sm:w-auto'
                      >
                        <Link href={`/tests/${test.slug}`}>
                          View Details
                          <ArrowRight className='h-4 w-4' />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {!loading && tests.length > 0 && (
              <div className='mt-8 flex flex-col items-center gap-4'>
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className='inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Loading...
                      </>
                    ) : (
                      "Load more tests"
                    )}
                  </button>
                )}
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  Showing{" "}
                  {Math.min(
                    (visibleTests.length > 0 ? visibleTests : tests).length,
                    6,
                  )}{" "}
                  of {total} tests
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
