"use server";

import { authenticatedFetch } from "@/lib/api-helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

type TestDetailInput = {
  turnaround?: number | string;
  component?: string;
  method?: string;
  collectionNotes?: string | null;
  clinicalUtility?: string | null;
  cptCode?: string;
  testingLocatiion?: string;
  temperatures?: unknown;
  collectionMethod?: string | null;
  resultsDelivery?: string | null;
};

type TestPayload = {
  testCode?: string;
  testName?: string;
  categoryId?: string;
  price?: number | string;
  turnaround?: number | string;
  specimenType?: string;
  description?: string | null;
  testDetails?: TestDetailInput | TestDetailInput[];
  isPublished?: boolean;
  isActive?: boolean;
};

const FORM_DATA_FIELDS: Array<keyof TestPayload> = [
  "testCode",
  "testName",
  "categoryId",
  "price",
  "turnaround",
  "specimenType",
  "description",
  "testDetails",
  "isPublished",
  "isActive",
];

function buildTestFormData(payload: TestPayload, image?: File): FormData {
  const formData = new FormData();

  for (const key of FORM_DATA_FIELDS) {
    const value = payload[key];
    if (value === undefined || value === null) continue;

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    formData.append(key, String(value));
  }

  if (image) {
    formData.append("testImage", image);
  }

  return formData;
}

export type GetTestsOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  testCode?: string;
  testName?: string;
  description?: string;
  categoryId?: string;
  categorySlug?: string;
  isPublished?: boolean;
  isActive?: boolean;
  adminView?: boolean;
};

export type TestsListResponse<T = any> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export async function getTests(
  options: GetTestsOptions = {},
): Promise<TestsListResponse> {
  const params = new URLSearchParams();

  const {
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc",
    searchTerm,
    minPrice,
    maxPrice,
    testCode,
    testName,
    description,
    categoryId,
    categorySlug,
    isPublished,
    isActive,
    adminView,
  } = options;

  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("sortBy", sortBy);
  params.set("sortOrder", sortOrder);
  if (searchTerm) params.set("searchTerm", searchTerm);
  if (minPrice !== undefined) params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
  if (testCode) params.set("testCode", testCode);
  if (testName) params.set("testName", testName);
  if (description) params.set("description", description);
  if (categoryId) params.set("categoryId", categoryId);
  if (categorySlug) params.set("categorySlug", categorySlug);
  if (isPublished !== undefined) params.set("isPublished", String(isPublished));
  if (isActive !== undefined) params.set("isActive", String(isActive));
  if (adminView !== undefined) params.set("adminView", String(adminView));

  const query = params.toString();

  let res;
  try {
    res = await fetch(`${API_BASE_URL}/tests/all${query ? `?${query}` : ""}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
    // Handle connection errors
    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      throw new Error(
        "Unable to connect to server. The server may be down. Please try again later.",
      );
    }
    throw new Error(
      "Network error occurred. Please check your connection and try again.",
    );
  }

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Failed to fetch tests" }));

    throw new Error(error.message || "Failed to fetch tests");
  }

  const data = await res.json().catch(() => null);
  return {
    data: (data as any)?.data || [],
    meta: (data as any)?.meta || { page, limit, total: 0 },
  };
}

export async function getTestById(testId: string): Promise<any> {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/tests/${testId}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
    // Handle connection errors
    if (
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      throw new Error(
        "Unable to connect to server. The server may be down. Please try again later.",
      );
    }
    throw new Error(
      "Network error occurred. Please check your connection and try again.",
    );
  }

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Failed to fetch test" }));

    if (res.status === 404) {
      throw new Error("Test not found");
    }

    throw new Error(error.message || "Failed to fetch test");
  }

  const data = await res.json().catch(() => null);
  return (data as any)?.data || data;
}

export async function createTest(
  payload: TestPayload,
  image?: File,
): Promise<any> {
  try {
    const formData = buildTestFormData(payload, image);

    const res = await authenticatedFetch(`${API_BASE_URL}/tests`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Failed to create test" }));
      throw new Error(error.message || "Failed to create test");
    }

    const data = await res.json().catch(() => null);
    return (data as any)?.data || data;
  } catch (error: any) {
    console.error("Error creating test:", error);
    throw error;
  }
}

export async function updateTest(
  testId: string,
  payload: TestPayload,
  image?: File,
): Promise<any> {
  try {
    const formData = buildTestFormData(payload, image);

    const res = await authenticatedFetch(`${API_BASE_URL}/tests/${testId}`, {
      method: "PATCH",
      body: formData,
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Failed to update test" }));
      throw new Error(error.message || "Failed to update test");
    }

    const data = await res.json().catch(() => null);
    return (data as any)?.data || data;
  } catch (error: any) {
    console.error("Error updating test:", error);
    throw error;
  }
}

export async function deleteTest(testId: string): Promise<void> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/tests/${testId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Failed to delete test" }));
      throw new Error(error.message || "Failed to delete test");
    }
  } catch (error: any) {
    console.error("Error deleting test:", error);
    throw error;
  }
}
