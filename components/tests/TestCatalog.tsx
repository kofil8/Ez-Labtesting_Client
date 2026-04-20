"use client";

import { getCategories } from "@/app/actions/get-categories";
import {
  buildPublicTestsQueryString,
  DEFAULT_PUBLIC_TESTS_LIMIT,
  normalizePublicTestsResponse,
  parsePublicCatalogSearchParams,
  type PublicTestPanelMode,
  type PublicTestCatalogQueryState,
  type PublicTestSortKey,
} from "@/lib/tests/public-tests";
import type { PublicCatalogTest, PublicTestsListResponse } from "@/types/public-test";
import { CatalogHeader, SortOption } from "@/components/shared/CatalogHeader";
import { CategoryScroll } from "@/components/shared/CategoryScroll";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { publicFetch } from "@/lib/api-client";
import { AlertTriangle, Beaker, SearchX, ShieldCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TestGrid } from "./TestGrid";

type CategoryItem = {
  id: string;
  name: string;
  testCount?: number;
};

interface TestCatalogProps {
  initialResults?: PublicTestsListResponse;
  initialQuery?: PublicTestCatalogQueryState;
  mode?: PublicTestPanelMode;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "name", label: "Name A-Z" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "turnaround", label: "Fastest Turnaround" },
];

const SEARCH_SUGGESTIONS = [
  "CBC",
  "Thyroid",
  "Vitamin D",
  "Hormone",
  "STD",
];

export function TestCatalog({
  initialResults,
  initialQuery,
  mode = "single",
}: TestCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const skippedInitialFetchRef = useRef(false);

  const queryState = useMemo(
    () => parsePublicCatalogSearchParams(searchParams, { panelMode: mode }),
    [mode, searchParams],
  );

  const [tests, setTests] = useState<PublicCatalogTest[]>(
    initialResults?.data || [],
  );
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [meta, setMeta] = useState(
    initialResults?.meta || {
      page: queryState.page,
      limit: DEFAULT_PUBLIC_TESTS_LIMIT,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  );
  const [loading, setLoading] = useState(!initialResults);
  const [searchInput, setSearchInput] = useState(queryState.search);
  const [apiError, setApiError] = useState<string | null>(null);

  const initialQueryKey = useMemo(
    () => JSON.stringify(initialQuery || null),
    [initialQuery],
  );
  const currentQueryKey = useMemo(
    () => JSON.stringify(queryState),
    [queryState],
  );

  const pushQueryState = useCallback(
    (next: Partial<PublicTestCatalogQueryState>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.page !== undefined) params.set("page", String(next.page));
      if (next.search !== undefined) {
        if (next.search) {
          params.set("search", next.search);
        } else {
          params.delete("search");
        }
      }
      if (next.category !== undefined) params.set("category", next.category);
      if (next.sort !== undefined) params.set("sort", next.sort);

      if (params.get("page") === "1") params.delete("page");
      if (!params.get("search")) params.delete("search");
      if ((params.get("category") || "all") === "all") params.delete("category");
      if ((params.get("sort") || "name") === "name") params.delete("sort");

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const loadTests = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    try {
      const queryString = buildPublicTestsQueryString(queryState);
      const res = await publicFetch(`/tests/all?${queryString}`);

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Failed to load tests" }));
        throw new Error(error.message || "Failed to load tests");
      }

      const payload = await res.json().catch(() => null);
      const normalized = normalizePublicTestsResponse(payload, {
        page: queryState.page,
        limit: DEFAULT_PUBLIC_TESTS_LIMIT,
        total: 0,
      });

      setTests(normalized.data);
      setMeta(normalized.meta);
    } catch (error: any) {
      setApiError(
        error?.message || "Failed to load tests. Please try again later.",
      );
      setTests([]);
      setMeta((prev) => ({
        ...prev,
        page: queryState.page,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }));
    } finally {
      setLoading(false);
    }
  }, [queryState]);

  useEffect(() => {
    setSearchInput(queryState.search);
  }, [queryState.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== queryState.search) {
        pushQueryState({ search: searchInput.trim(), page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pushQueryState, queryState.search, searchInput]);

  useEffect(() => {
    if (
      initialResults &&
      !skippedInitialFetchRef.current &&
      initialQueryKey === currentQueryKey
    ) {
      skippedInitialFetchRef.current = true;
      return;
    }

    loadTests();
  }, [currentQueryKey, initialQueryKey, initialResults, loadTests]);

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);

      try {
        const cats = await getCategories();
        setCategories([
          { id: "all", name: mode === "panel" ? "All Panels" : "All Tests" },
          ...cats.map((category: any) => ({
            id: category.id,
            name: category.name,
            testCount:
              typeof category?._count?.tests === "number" &&
              category._count.tests > 0
                ? category._count.tests
                : undefined,
          })),
        ]);
      } catch {
        setCategories([
          { id: "all", name: mode === "panel" ? "All Panels" : "All Tests" },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [mode]);

  const totalPages = Math.max(
    1,
    meta.totalPages || Math.ceil((meta.total || 0) / (meta.limit || 1)),
  );
  const isPanelCatalog = mode === "panel";
  const catalogName = isPanelCatalog ? "Test Panels" : "Browse Tests";
  const pageTitle = isPanelCatalog
    ? "Browse Health Test Panels"
    : "Laboratory Test Catalog";
  const pageDescription = isPanelCatalog
    ? "Compare bundled panels, included component tests, and the current best available storefront price before opening panel details."
    : "Explore clinical test descriptions, preparation notes, specimen details, and the current best available storefront price.";
  const subtitle = isPanelCatalog
    ? "Search bundled panels by screening goal, included markers, or health concern. Open any panel to review included tests and current lab pricing."
    : "Search by test name, condition, or CPT-related keywords. Open any test to review preparation, specimen, and storefront pricing details.";
  const searchSuggestions = isPanelCatalog
    ? ["Thyroid Panel", "CMP", "Hormone Panel", "Lipid Panel", "STD Panel"]
    : SEARCH_SUGGESTIONS;
  const emptyTitle = isPanelCatalog
    ? "No matching panels found"
    : "No matching tests found";
  const emptyDescription = isPanelCatalog
    ? "Try a broader search term or clear the category filter to browse all active test panels."
    : "Try a broader search term or clear the category filter to browse the full catalog.";
  const complianceTitle = isPanelCatalog
    ? "Panel products from the live test catalog"
    : "CLIA-aligned catalog browsing";
  const complianceDescription = isPanelCatalog
    ? "Each panel routes into the same shared detail page used by individual tests."
    : "View preparation guidance and specimen requirements on each test page.";

  const handlePageChange = (page: number) => {
    pushQueryState({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchInput("");
    setApiError(null);
    pushQueryState({
      search: "",
      category: "all",
      page: 1,
      sort: "name",
    });
  };

  return (
    <div className='space-y-6 sm:space-y-8'>
      <CatalogHeader
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        sortValue={queryState.sort}
        onSortChange={(value) =>
          pushQueryState({ sort: value as PublicTestSortKey, page: 1 })
        }
        sortOptions={SORT_OPTIONS}
        resultCount={meta.total}
        searchSuggestions={searchSuggestions}
        onSuggestionClick={(suggestion) => setSearchInput(suggestion)}
        showSuggestions={true}
        subtitle={subtitle}
      />

      <CategoryScroll
        categories={categories}
        selectedCategory={queryState.category}
        onCategorySelect={(categoryId) =>
          pushQueryState({ category: categoryId, page: 1 })
        }
        isLoading={categoriesLoading}
      />

      <div className='rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-50px_rgba(14,165,233,0.35)] overflow-hidden dark:border-slate-800 dark:bg-slate-950'>
        <div className='border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-cyan-50 px-6 py-5 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-blue-600'>
                {catalogName}
              </p>
              <h3 className='mt-2 text-2xl font-bold text-slate-900 dark:text-white'>
                {pageTitle}
              </h3>
              <p className='mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400'>
                {pageDescription}
              </p>
            </div>

            {!loading && !apiError && (
              <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'>
                <div className='flex items-center gap-2 font-medium'>
                  <ShieldCheck className='h-4 w-4' />
                  {complianceTitle}
                </div>
                <p className='mt-1 text-xs'>
                  {complianceDescription}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='p-6'>
          {loading ? (
            <div className='space-y-6'>
              <div className='flex items-center gap-3 text-slate-600 dark:text-slate-400'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent' />
                <div>
                  <p className='font-semibold text-slate-900 dark:text-white'>
                    Loading {isPanelCatalog ? "panels" : "tests"}
                  </p>
                  <p className='text-sm'>
                    Fetching the latest catalog entries from the backend.
                  </p>
                </div>
              </div>
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className='h-72 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse dark:border-slate-800 dark:bg-slate-900'
                  />
                ))}
              </div>
            </div>
          ) : apiError ? (
            <div className='rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-950 dark:bg-red-950/20'>
              <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-600 shadow-sm dark:bg-slate-950'>
                <AlertTriangle className='h-6 w-6' />
              </div>
              <h4 className='mt-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Unable to load the test catalog
              </h4>
              <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                {apiError}
              </p>
              <Button onClick={clearFilters} variant='outline' className='mt-5'>
                Reset filters
              </Button>
            </div>
          ) : tests.length === 0 ? (
            <div className='rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40'>
              <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm dark:bg-slate-950'>
                <SearchX className='h-6 w-6' />
              </div>
              <h4 className='mt-4 text-lg font-semibold text-slate-900 dark:text-white'>
                {emptyTitle}
              </h4>
              <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                {emptyDescription}
              </p>
              <Button onClick={clearFilters} variant='outline' className='mt-5'>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className='space-y-6'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                    Showing {meta.total} {isPanelCatalog ? "panel" : "catalog"} result
                    {meta.total === 1 ? "" : "s"}
                  </p>
                  <div className='mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                    <Beaker className='h-4 w-4 text-blue-600' />
                    <span>
                      Page {queryState.page} of {totalPages}
                    </span>
                  </div>
                </div>
              </div>

              <TestGrid tests={tests} fullWidth={true} />

              <Pagination
                currentPage={queryState.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                resultCount={meta.total}
                isLoading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
