"use client";

import { getPanels } from "@/app/actions/panels";
import { CatalogHeader, SortOption } from "@/components/shared/CatalogHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Panel } from "@/types/panel";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface FeaturedPanelGridProps {
  initialLimit?: number;
}

type SortKey = "savings" | "price-asc" | "price-desc" | "name";

type QueryState = {
  page: number;
  limit: number;
  searchTerm: string;
  sort: SortKey;
};

const SORT_OPTIONS: SortOption[] = [
  { value: "savings", label: "💸 Best Savings" },
  { value: "price-asc", label: "💰 Price: Low to High" },
  { value: "price-desc", label: "💎 Price: High to Low" },
  { value: "name", label: "📝 Name A-Z" },
];

const SEARCH_SUGGESTIONS = [
  "Comprehensive",
  "Cardiac",
  "Hormone",
  "Thyroid",
  "Metabolic",
];

const parseSearchParams = (
  searchParams: URLSearchParams,
  fallbackLimit: number,
): QueryState => {
  const page = Number(searchParams.get("page") || "1") || 1;
  const limit =
    Number(searchParams.get("limit") || String(fallbackLimit)) || fallbackLimit;
  const searchTerm = searchParams.get("searchTerm") || "";
  const sort = (searchParams.get("sort") as SortKey) || "savings";
  return { page, limit, searchTerm, sort };
};

export function FeaturedPanelGrid({
  initialLimit = 9,
}: FeaturedPanelGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryState = useMemo(
    () => parseSearchParams(searchParams, initialLimit),
    [initialLimit, searchParams],
  );

  const [panels, setPanels] = useState<Panel[]>([]);
  const [meta, setMeta] = useState({
    page: queryState.page,
    limit: queryState.limit,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(queryState.searchTerm);
  const [error, setError] = useState<string | null>(null);

  const pushQueryState = useCallback(
    (next: Partial<QueryState>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.page !== undefined) params.set("page", String(next.page));
      if (next.limit !== undefined) params.set("limit", String(next.limit));
      if (next.sort !== undefined) params.set("sort", next.sort);
      if (next.searchTerm !== undefined) {
        if (next.searchTerm) {
          params.set("searchTerm", next.searchTerm);
        } else {
          params.delete("searchTerm");
        }
      }

      if ((params.get("page") || "1") === "1") params.delete("page");
      if ((params.get("sort") || "savings") === "savings")
        params.delete("sort");
      if (!params.get("searchTerm")) params.delete("searchTerm");
      if (
        (params.get("limit") || String(initialLimit)) === String(initialLimit)
      ) {
        params.delete("limit");
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [initialLimit, pathname, router, searchParams],
  );

  useEffect(() => {
    setSearchInput(queryState.searchTerm);
  }, [queryState.searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== queryState.searchTerm) {
        pushQueryState({ searchTerm: searchInput.trim(), page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pushQueryState, queryState.searchTerm, searchInput]);

  const loadPanels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const sortMap: Record<
        SortKey,
        {
          sortBy: string;
          sortOrder: "asc" | "desc";
        }
      > = {
        savings: { sortBy: "discountPercent", sortOrder: "desc" },
        "price-asc": { sortBy: "basePrice", sortOrder: "asc" },
        "price-desc": { sortBy: "basePrice", sortOrder: "desc" },
        name: { sortBy: "name", sortOrder: "asc" },
      };

      const sortConfig = sortMap[queryState.sort];
      const response = await getPanels({
        page: queryState.page,
        limit: queryState.limit,
        searchTerm: queryState.searchTerm || undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
        isActive: true,
      });

      setPanels(response.data || []);
      setMeta({
        page: response.meta?.page || queryState.page,
        limit: response.meta?.limit || queryState.limit,
        total: response.meta?.total || 0,
      });
    } catch (err: any) {
      console.error("Failed to fetch panels:", err);
      setError(
        err?.message || "Failed to load panels. Please refresh and try again.",
      );
      setPanels([]);
      setMeta((prev) => ({ ...prev, total: 0 }));
    } finally {
      setIsLoading(false);
    }
  }, [
    queryState.limit,
    queryState.page,
    queryState.searchTerm,
    queryState.sort,
  ]);

  useEffect(() => {
    loadPanels();
  }, [loadPanels]);

  const savingsPercentage = (panel: Panel) => {
    const savings = panel.basePrice - panel.bundlePrice;
    return Math.round((savings / panel.basePrice) * 100);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(meta.total / (meta.limit || initialLimit)),
  );

  return (
    <div className='space-y-4 sm:space-y-6 md:space-y-8'>
      <CatalogHeader
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        sortValue={queryState.sort}
        onSortChange={(value) =>
          pushQueryState({ sort: value as SortKey, page: 1 })
        }
        sortOptions={SORT_OPTIONS}
        resultCount={meta.total}
        searchSuggestions={SEARCH_SUGGESTIONS}
        onSuggestionClick={(suggestion) => setSearchInput(suggestion)}
        showSuggestions
        subtitle='Compare panel bundles by savings and tests included'
      />

      <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800'>
        <div className='border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 dark:border-slate-600 dark:from-slate-700 dark:to-slate-700'>
          <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
            Featured Panel Results
          </h3>
          <p className='mt-1 text-sm font-medium text-slate-600 dark:text-slate-300'>
            {meta.total} panel{meta.total !== 1 ? "s" : ""} available
            {meta.total > 0
              ? ` • Page ${queryState.page} of ${totalPages}`
              : ""}
          </p>
        </div>

        <div className='p-6'>
          {isLoading ? (
            <div className='py-10 text-center'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-r-transparent' />
              <p className='mt-4 text-sm font-medium text-slate-500 dark:text-slate-400'>
                Loading panels...
              </p>
            </div>
          ) : error ? (
            <div className='py-10 text-center'>
              <p className='text-sm font-semibold text-red-600 dark:text-red-400'>
                {error}
              </p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => {
                  setError(null);
                  loadPanels();
                }}
              >
                Retry
              </Button>
            </div>
          ) : panels.length === 0 ? (
            <div className='py-10 text-center'>
              <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                <Package className='h-6 w-6 text-muted-foreground' />
              </div>
              <p className='text-sm font-semibold text-slate-900 dark:text-white'>
                No panels found
              </p>
              <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                Try changing your search query or reset filters.
              </p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() =>
                  pushQueryState({ page: 1, searchTerm: "", sort: "savings" })
                }
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {panels.map((panel) => (
                  <Link
                    key={panel.id}
                    href={`/panels/${panel.id}`}
                    className='group'
                  >
                    <Card className='flex h-full flex-col border border-slate-200 transition-shadow hover:shadow-md dark:border-slate-700'>
                      {/* Panel image or gradient placeholder */}
                      {panel.panelImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={panel.panelImage}
                          alt={panel.name}
                          className='h-36 w-full object-cover rounded-t-lg'
                        />
                      ) : (
                        <div className='h-36 w-full rounded-t-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500' />
                      )}
                      <CardHeader>
                        <div className='mb-3 flex items-start justify-between gap-2'>
                          <Badge variant='secondary' className='text-xs'>
                            {panel.testsCount} tests
                          </Badge>
                          {panel.basePrice > panel.bundlePrice && (
                            <Badge className='bg-emerald-600 text-white'>
                              Save {savingsPercentage(panel)}%
                            </Badge>
                          )}
                        </div>
                        <CardTitle className='line-clamp-2 text-lg group-hover:text-cyan-700 dark:group-hover:text-cyan-400'>
                          {panel.name}
                        </CardTitle>
                        <CardDescription className='line-clamp-2'>
                          {panel.description || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='flex-1 space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            Regular Price
                          </span>
                          <span className='line-through'>
                            {formatCurrency(panel.basePrice)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between border-t pt-2'>
                          <span className='font-semibold'>Bundle Price</span>
                          <span className='text-lg font-bold text-cyan-700 dark:text-cyan-400'>
                            {formatCurrency(panel.bundlePrice)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className='w-full'>
                          <span>
                            View Details
                            <ArrowRight className='ml-2 h-4 w-4' />
                          </span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>

              <Pagination
                currentPage={queryState.page}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                  pushQueryState({ page: nextPage });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                resultCount={meta.total}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
