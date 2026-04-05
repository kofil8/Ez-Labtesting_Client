"use client";

import { TestCard } from "@/components/tests/TestCard";
import { publicFetch } from "@/lib/api-client";
import type { Test } from "@/types/test";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PAGE_SIZE = 6;

export function PopularTestsSection() {
  const [tests, setTests] = useState<Test[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTests = async (pageNum: number, append = false) => {
    try {
      const res = await publicFetch(
        `/api/v1/tests/all?isActive=true&limit=${PAGE_SIZE}&page=${pageNum}&sortBy=createdAt&sortOrder=desc`,
      );
      if (!res.ok) return;
      const json = await res.json();
      const newTests: Test[] = json.data || [];
      const newTotal: number = json.meta?.total ?? 0;
      setTests((prev) => (append ? [...prev, ...newTests] : newTests));
      setTotal(newTotal);
    } catch {
      // silently fail — tests section just stays empty
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
    <section id='popular-tests' className='py-16 sm:py-20 lg:py-24 bg-slate-50'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className='mx-auto max-w-3xl text-center mb-12 lg:mb-16'
        >
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-blue-600'>
            Most Ordered
          </p>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4'>
            Popular Lab Tests
          </h2>
          <p className='text-base sm:text-lg text-slate-600 leading-relaxed'>
            Our most-ordered tests at prices well below typical retail and
            insurance costs.
          </p>
        </motion.div>

        {/* Tests Grid */}
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
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: (i % 3) * 0.08 }}
              >
                <TestCard test={test} variant='compact' index={i} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination & Actions */}
        {!loading && tests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className='mt-10 flex flex-col items-center gap-4'
          >
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className='inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm disabled:opacity-60'
              >
                {loadingMore ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Loading…
                  </>
                ) : (
                  "Load More Tests →"
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
          </motion.div>
        )}
      </div>
    </section>
  );
}
