"use client";

import { TestCard } from "@/components/tests/TestCard";
import { publicFetch } from "@/lib/api-client";
import { normalizePublicTestsResponse } from "@/lib/tests/public-tests";
import type { PublicCatalogTest } from "@/types/public-test";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PAGE_SIZE = 6;

export function PopularTestsSection() {
  const [tests, setTests] = useState<PublicCatalogTest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTests = async (pageNum: number, append = false) => {
    try {
      const res = await publicFetch(
        `/tests/all?limit=${PAGE_SIZE}&page=${pageNum}&sortBy=isPopular&sortOrder=desc&isPanel=false&isPopular=true`,
      );
      if (!res.ok) return;
      const json = await res.json();
      const normalized = normalizePublicTestsResponse(json, {
        page: pageNum,
        limit: PAGE_SIZE,
        total: 0,
      });
      const popularOnly = normalized.data.filter((test) => test.isPopular);
      setTests((prev) =>
        append ? [...prev, ...popularOnly] : popularOnly,
      );
      setTotal(normalized.meta.total ?? 0);
    } catch {
      // Leave the section empty if the public tests route is unavailable.
    }
  };

  useEffect(() => {
    fetchTests(1).finally(() => setLoading(false));
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchTests(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const hasMore = tests.length < total;

  return (
    <section
      id='popular-tests'
      className='scroll-mt-24 py-16 sm:py-20 lg:py-24 bg-slate-50'
    >
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mx-auto mb-12 max-w-3xl text-center lg:mb-16'>
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-blue-600'>
            Most Ordered
          </p>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4'>
            Popular Lab Tests
          </h2>
          <p className='text-base sm:text-lg text-slate-600 leading-relaxed'>
            Explore commonly searched tests with clearer specimen,
            preparation, and turnaround details.
          </p>
        </div>

        {loading ? (
          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className='h-72 rounded-3xl bg-white border border-slate-200 animate-pulse'
              />
            ))}
          </div>
        ) : tests.length === 0 ? null : (
          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {tests.map((test, i) => (
              <div key={test.id}>
                <TestCard test={test} variant='compact' index={i} />
              </div>
            ))}
          </div>
        )}

        {!loading && tests.length > 0 && (
          <div className='mt-10 flex flex-col items-center gap-4'>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className='inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm disabled:opacity-60'
              >
                {loadingMore ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Loading...
                  </>
                ) : (
                  "Load More Tests"
                )}
              </button>
            )}
            <p className='text-xs text-slate-500'>
              Showing {tests.length} of {total} tests
            </p>
            <Link
              href='/tests'
              className='inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors'
            >
              View All Tests
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
