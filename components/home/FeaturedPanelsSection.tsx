"use client";

import { TestCard } from "@/components/tests/TestCard";
import { publicFetch } from "@/lib/api-client";
import { normalizePublicTestsResponse } from "@/lib/tests/public-tests";
import type { PublicCatalogTest } from "@/types/public-test";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const HOMEPAGE_PANEL_COUNT = 3;

export function FeaturedPanelsSection() {
  const [panels, setPanels] = useState<PublicCatalogTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const response = await publicFetch(
          `/tests/all?limit=6&page=1&sortBy=isPopular&sortOrder=desc&isPanel=true&isPopular=true`,
        );

        if (!response.ok) {
          return;
        }

        const payload = await response.json().catch(() => null);
        const normalized = normalizePublicTestsResponse(payload, {
          page: 1,
          limit: 6,
          total: 0,
        });

        setPanels(normalized.data.slice(0, HOMEPAGE_PANEL_COUNT));
      } catch {
        setPanels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPanels();
  }, []);

  if (!loading && panels.length === 0) {
    return null;
  }

  return (
    <section
      id='popular-panels'
      className='scroll-mt-24 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbff_100%)] py-16 sm:py-20'
    >
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='mx-auto mb-12 max-w-3xl text-center'>
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-cyan-700'>
            Bundled Screening
          </p>
          <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            Popular Test Panels
          </h2>
          <p className='mt-4 text-base leading-7 text-slate-600 sm:text-lg'>
            Explore grouped health panels with included component tests, best
            available pricing, and faster comparison before you open the full
            details page.
          </p>
        </div>

        {loading ? (
          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: HOMEPAGE_PANEL_COUNT }).map((_, index) => (
              <div
                key={index}
                className='h-80 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white'
              />
            ))}
          </div>
        ) : (
          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {panels.map((panel, index) => (
              <TestCard key={panel.id} test={panel} variant='compact' index={index} />
            ))}
          </div>
        )}

        {!loading && panels.length > 0 && (
          <div className='mt-10 flex justify-center'>
            <Link
              href='/panels'
              className='inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-cyan-300 hover:text-cyan-700'
            >
              Show More Panels
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
