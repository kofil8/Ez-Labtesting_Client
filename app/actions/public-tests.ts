"use server";

import {
  buildPublicTestsQueryString,
  DEFAULT_PUBLIC_TESTS_LIMIT,
  normalizePublicTest,
  normalizePublicTestsResponse,
  type PublicTestCatalogQueryState,
} from "@/lib/tests/public-tests";
import type { PublicCatalogTest, PublicTestsListResponse } from "@/types/public-test";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

async function fetchJson(url: string) {
  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
    if (
      error?.cause?.code === "ECONNREFUSED" ||
      error?.message?.includes("fetch failed")
    ) {
      throw new Error(
        "Unable to connect to server. The server may be down. Please try again later.",
      );
    }

    throw new Error(
      "Network error occurred. Please check your connection and try again.",
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    const error = await response
      .json()
      .catch(() => ({ message: "Failed to fetch public tests" }));
    throw new Error(error.message || "Failed to fetch public tests");
  }

  return response.json().catch(() => null);
}

export async function getPublicTests(
  queryState: Partial<PublicTestCatalogQueryState> = {},
): Promise<PublicTestsListResponse> {
  const resolvedQuery: PublicTestCatalogQueryState = {
    page: queryState.page ?? 1,
    limit: queryState.limit ?? DEFAULT_PUBLIC_TESTS_LIMIT,
    search: queryState.search ?? "",
    category: queryState.category ?? "all",
    sort: queryState.sort ?? "name",
    panelMode: queryState.panelMode ?? "single",
  };

  const query = buildPublicTestsQueryString(resolvedQuery);
  const payload = await fetchJson(
    `${API_BASE_URL}/tests/all${query ? `?${query}` : ""}`,
  );

  return normalizePublicTestsResponse(payload, {
    page: resolvedQuery.page,
    limit: resolvedQuery.limit,
    total: 0,
  });
}

export async function getPublicTestById(
  testId: string,
): Promise<PublicCatalogTest | null> {
  const payload = await fetchJson(`${API_BASE_URL}/tests/${testId}`);

  if (!payload?.data && !payload) {
    return null;
  }

  return normalizePublicTest(payload?.data || payload);
}
