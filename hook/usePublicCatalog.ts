"use client";

import { publicFetch } from "@/lib/api-client";
import { normalizePublicTestsResponse } from "@/lib/tests/public-tests";
import type { PublicCatalogTest } from "@/types/public-test";
import { useCallback, useEffect, useState } from "react";

type UsePublicCatalogOptions = {
  pageSize?: number;
  popularOnly?: boolean;
};

export function usePublicCatalog({
  pageSize = 6,
  popularOnly = true,
}: UsePublicCatalogOptions = {}) {
  const [tests, setTests] = useState<PublicCatalogTest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTests = useCallback(
    async (pageNum: number, append = false) => {
      try {
        const popularParam = popularOnly ? "&isPopular=true" : "";
        const res = await publicFetch(
          `/tests/all?limit=${pageSize}&page=${pageNum}&sortBy=orderCount&sortOrder=desc${popularParam}`,
        );
        if (!res.ok) return;
        const json = await res.json();
        const normalized = normalizePublicTestsResponse(json, {
          page: pageNum,
          limit: pageSize,
          total: 0,
        });
        const nextTests = popularOnly
          ? normalized.data.filter((test) => test.isPopular)
          : normalized.data;
        setTests((prev) => (append ? [...prev, ...nextTests] : nextTests));
        setTotal(normalized.meta.total ?? 0);
      } catch {
        // Leave callers with an empty catalog if the public route is unavailable.
      }
    },
    [pageSize, popularOnly],
  );

  useEffect(() => {
    // Existing catalog loading sets component state after an async fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTests(1).finally(() => setLoading(false));
  }, [fetchTests]);

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchTests(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  return {
    tests,
    total,
    loading,
    loadingMore,
    hasMore: tests.length < total,
    loadMore,
  };
}
