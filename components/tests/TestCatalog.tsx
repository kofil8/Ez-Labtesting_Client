"use client";

import { getCategories } from "@/app/actions/get-categories";
import { CatalogHeader, SortOption } from "@/components/shared/CatalogHeader";
import { CategoryScroll } from "@/components/shared/CategoryScroll";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { getApiUrl, publicFetch } from "@/lib/api-client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TestGrid } from "./TestGrid";

const DEFAULT_LIMIT = 9;

type TestsResponse = {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

type SortKey = "name" | "price-asc" | "price-desc" | "turnaround";

type QueryState = {
  page: number;
  limit: number;
  searchTerm: string;
  category: string;
  sort: SortKey;
};

const parseSearchParams = (sp: URLSearchParams): QueryState => {
  const page = Number(sp.get("page") || "1") || 1;
  const limit = DEFAULT_LIMIT;
  const searchTerm = sp.get("searchTerm") || "";
  const category = sp.get("category") || "all";
  const sort = (sp.get("sort") as SortKey) || "name";
  return { page, limit, searchTerm, category, sort };
};

const SORT_OPTIONS: SortOption[] = [
  { value: "name", label: "📝 Name A-Z" },
  { value: "price-asc", label: "💰 Price: Low to High" },
  { value: "price-desc", label: "💎 Price: High to Low" },
  { value: "turnaround", label: "⚡ Newest Tests" },
];

const SEARCH_SUGGESTIONS = [
  "Complete Health Panel",
  "STD Screening",
  "Thyroid Function",
  "Vitamin D",
  "Diabetes Check",
];

export function TestCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryState = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams],
  );

  const [tests, setTests] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: queryState.page,
    limit: queryState.limit,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(queryState.searchTerm);
  const [apiError, setApiError] = useState<string | null>(null);

  // Push query state to URL
  const pushQueryState = useCallback(
    (next: Partial<QueryState>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.page !== undefined) params.set("page", String(next.page));
      if (next.searchTerm !== undefined) {
        if (next.searchTerm) {
          params.set("searchTerm", next.searchTerm);
        } else {
          params.delete("searchTerm");
        }
      }
      if (next.category !== undefined) params.set("category", next.category);
      if (next.sort !== undefined) params.set("sort", next.sort);

      params.delete("limit");

      // Clean up defaults
      if (params.get("page") === "1") params.delete("page");
      if (!params.get("searchTerm")) params.delete("searchTerm");
      if ((params.get("category") || "all") === "all")
        params.delete("category");
      if ((params.get("sort") || "name") === "name") params.delete("sort");

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Load tests from API
  const loadTests = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams();
    query.set("page", String(queryState.page));
    query.set("limit", String(DEFAULT_LIMIT));

    const sortMap: Record<
      SortKey,
      { sortBy: string; sortOrder: "asc" | "desc" }
    > = {
      name: { sortBy: "testName", sortOrder: "asc" },
      "price-asc": { sortBy: "price", sortOrder: "asc" },
      "price-desc": { sortBy: "price", sortOrder: "desc" },
      turnaround: { sortBy: "createdAt", sortOrder: "desc" },
    };
    const { sortBy: backendSortBy, sortOrder } = sortMap[queryState.sort];
    query.set("sortBy", backendSortBy);
    query.set("sortOrder", sortOrder);

    if (queryState.category && queryState.category !== "all") {
      query.set("categoryId", queryState.category);
    }

    if (queryState.searchTerm.trim()) {
      query.set("searchTerm", queryState.searchTerm.trim());
    }

    const url = getApiUrl(`/tests/all?${query.toString()}`);
    setApiError(null);
    try {
      const res = await publicFetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          // API endpoint not available - handle gracefully
          console.warn("Tests API not available (404)");
          setTests([]);
          setMeta({ page: queryState.page, limit: queryState.limit, total: 0 });
          return;
        }
        const error = await res
          .json()
          .catch(() => ({ message: "Failed to load tests" }));
        console.error("Backend error response:", error);
        throw new Error(
          error.message || `Failed to load tests (${res.status})`,
        );
      }
      const data = (await res.json().catch(() => null)) as TestsResponse | null;
      console.log("Tests loaded successfully:", {
        count: data?.data?.length,
        total: data?.meta?.total,
      });
      setTests(data?.data || []);
      setMeta(
        data?.meta || {
          page: queryState.page,
          limit: queryState.limit,
          total: 0,
        },
      );
    } catch (error: any) {
      console.error("Error loading tests:", error);
      const errorMsg =
        error?.message || "Failed to load tests. Please try again later.";
      setApiError(errorMsg);
      setTests([]);
      setMeta({ page: queryState.page, limit: queryState.limit, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [
    queryState.category,
    queryState.page,
    queryState.searchTerm,
    queryState.limit,
    queryState.sort,
  ]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(queryState.searchTerm);
  }, [queryState.searchTerm]);

  // Debounce search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== queryState.searchTerm) {
        pushQueryState({ searchTerm: searchInput, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, queryState.searchTerm, pushQueryState]);

  // Load tests when query params change
  useEffect(() => {
    loadTests();
  }, [loadTests]);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const cats = await getCategories();
        setCategories([
          { id: "all", name: "All Tests", testCount: undefined },
          ...cats.map((c: any) => ({
            id: c.id,
            name: c.name,
            testCount: c._count?.tests ?? undefined,
          })),
        ]);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([{ id: "all", name: "All Tests" }]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil((meta.total || 0) / (meta.limit || DEFAULT_LIMIT)),
  );

  const handlePageChange = (page: number) => {
    pushQueryState({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className='space-y-4 sm:space-y-6 md:space-y-8'>
      {/* Enhanced Catalog Header */}
      <CatalogHeader
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        sortValue={queryState.sort}
        onSortChange={(val) =>
          pushQueryState({ sort: val as SortKey, page: 1 })
        }
        sortOptions={SORT_OPTIONS}
        resultCount={meta.total}
        searchSuggestions={SEARCH_SUGGESTIONS}
        onSuggestionClick={(suggestion) => setSearchInput(suggestion)}
        showSuggestions={true}
        subtitle='Search from 300+ CLIA-certified tests • Results in 24-72 hours • No doctor visit required'
      />

      {/* Category Navigation */}
      <CategoryScroll
        categories={categories}
        selectedCategory={queryState.category}
        onCategorySelect={(slug) => pushQueryState({ category: slug, page: 1 })}
        isLoading={categoriesLoading}
      />

      {/* Results Section */}
      <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden'>
        {/* Header with gradient */}
        <div className='bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-700 dark:to-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600'>
          {loading ? (
            <div className='text-center py-8'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' />
              <p className='text-slate-500 dark:text-slate-400 mt-4 text-sm font-medium'>
                Finding your perfect lab tests...
              </p>
            </div>
          ) : apiError ? (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>⚠️</div>
              <h3 className='text-lg font-semibold text-red-600 dark:text-red-400 mb-2'>
                {apiError}
              </h3>
              <p className='text-slate-500 dark:text-slate-400 text-sm mb-4'>
                Please check your connection or try again later.
              </p>
              <Button
                onClick={() => {
                  setSearchInput("");
                  pushQueryState({ searchTerm: "", category: "all", page: 1 });
                  setApiError(null);
                }}
                variant='outline'
                size='sm'
              >
                Retry
              </Button>
            </div>
          ) : tests.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-2'>
                No tests found
              </h3>
              <p className='text-slate-500 dark:text-slate-400 text-sm mb-4'>
                Try adjusting your search terms or browse by category
              </p>
              <Button
                onClick={() => {
                  setSearchInput("");
                  pushQueryState({ searchTerm: "", category: "all", page: 1 });
                }}
                variant='outline'
                size='sm'
              >
                Clear filters and show all tests
              </Button>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className='mb-4'>
                <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                  Lab Test Results
                </h3>
                <p className='text-sm text-slate-600 dark:text-slate-300 font-medium mt-1'>
                  💊 {meta.total ?? 0}{" "}
                  {(meta.total ?? 0) === 1 ? "test" : "tests"} found
                  {meta.total > 0 &&
                    ` • Page ${queryState.page} of ${totalPages}`}
                </p>
              </div>

              {/* Value Proposition Banner */}
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3'>
                <div className='flex items-center justify-center gap-4 text-xs sm:text-sm flex-wrap'>
                  <span className='flex items-center gap-2 text-green-700 dark:text-green-400'>
                    ✅ <strong>All tests include:</strong>
                  </span>
                  <span className='text-green-600 dark:text-green-300'>
                    Board-certified physician review
                  </span>
                  <span className='text-green-600 dark:text-green-300'>•</span>
                  <span className='text-green-600 dark:text-green-300'>
                    Free shipping
                  </span>
                  <span className='text-green-600 dark:text-green-300'>•</span>
                  <span className='text-green-600 dark:text-green-300'>
                    Confidential results
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Test Grid */}
        {!loading && tests.length > 0 && (
          <div className='p-6'>
            <TestGrid tests={tests as any} fullWidth={true} />

            {/* Pagination */}
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
  );
}
