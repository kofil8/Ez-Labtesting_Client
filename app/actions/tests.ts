"use server";

import { authenticatedFetch } from "@/lib/api-helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

export type TestPayload = {
  name?: string;
  slug?: string;
  description?: string | null;
  shortDescription?: string | null;
  categoryId?: string;
  specimenType?: string | null;
  cptCode?: string[] | string;
  baseTurnaroundDays?: number | string;
  isPanel?: boolean;
  preparationInstructions?: string | null;
  internalNotes?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  searchKeywords?: string[] | string;
  requiresFasting?: boolean;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
  isPopular?: boolean;
  removeTestImage?: boolean;
  componentTestIds?: string[];
};

export type TestMutationResult<T = any> =
  | { success: true; data: T }
  | { success: false; error: string };

const SCALAR_FIELDS: Array<keyof TestPayload> = [
  "name",
  "slug",
  "description",
  "shortDescription",
  "categoryId",
  "specimenType",
  "baseTurnaroundDays",
  "isPanel",
  "preparationInstructions",
  "internalNotes",
  "seoTitle",
  "seoDescription",
  "requiresFasting",
  "minAge",
  "maxAge",
  "isActive",
  "isPopular",
  "removeTestImage",
];

const ARRAY_FIELDS: Array<keyof TestPayload> = [
  "cptCode",
  "searchKeywords",
  "componentTestIds",
];

function buildTestFormData(payload: TestPayload, image?: File): FormData {
  const formData = new FormData();

  for (const key of SCALAR_FIELDS) {
    const value = payload[key];
    if (value === undefined || value === null) continue;
    formData.append(key, String(value));
  }

  for (const key of ARRAY_FIELDS) {
    const value = payload[key];
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      // backend stringArrayFromUnknown also accepts JSON-string arrays
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }

  if (image) {
    formData.append("testImage", image);
  }

  return formData;
}

export type TestSortBy =
  | "name"
  | "createdAt"
  | "updatedAt"
  | "isPopular"
  | "baseTurnaroundDays"
  | "orderCount";

export type GetTestsOptions = {
  page?: number;
  limit?: number;
  sortBy?: TestSortBy;
  sortOrder?: "asc" | "desc";
  search?: string;
  categoryId?: string;
  isPanel?: boolean;
  requiresFasting?: boolean;
  isPopular?: boolean;
  minAge?: number;
  maxAge?: number;
  // 'true' (default), 'false' (archived only) or 'all' (admin view)
  isActive?: "true" | "false" | "all";
};

export type TestsListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type TestsListResponse<T = any> = {
  data: T[];
  meta: TestsListMeta;
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
    search,
    categoryId,
    isPanel,
    requiresFasting,
    isPopular,
    minAge,
    maxAge,
    isActive,
  } = options;

  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("sortBy", sortBy);
  params.set("sortOrder", sortOrder);
  if (search && search.trim()) params.set("search", search.trim());
  if (categoryId) params.set("categoryId", categoryId);
  if (isPanel !== undefined) params.set("isPanel", String(isPanel));
  if (requiresFasting !== undefined)
    params.set("requiresFasting", String(requiresFasting));
  if (isPopular !== undefined) params.set("isPopular", String(isPopular));
  if (minAge !== undefined) params.set("minAge", String(minAge));
  if (maxAge !== undefined) params.set("maxAge", String(maxAge));
  if (isActive !== undefined) params.set("isActive", isActive);

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
  // Force a plain JSON-serializable shape across the server-action boundary.
  return JSON.parse(
    JSON.stringify({
      data: (data as any)?.data || [],
      meta: (data as any)?.meta || { page, limit, total: 0 },
    }),
  );
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
): Promise<TestMutationResult> {
  try {
    const formData = buildTestFormData(payload, image);

    const res = await authenticatedFetch(`${API_BASE_URL}/tests`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: `Create failed with status ${res.status}` }));
      const message =
        (errorBody as any)?.message ||
        (errorBody as any)?.error ||
        `Create failed with status ${res.status}`;
      console.error("createTest server error:", res.status, errorBody);
      throw new Error(String(message));
    }

    const data = await res.json().catch(() => null);
    return {
      success: true,
      data: JSON.parse(JSON.stringify((data as any)?.data ?? data ?? null)),
    };
  } catch (error: any) {
    console.error("Error creating test:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Failed to create test",
    };
  }
}

export async function updateTest(
  testId: string,
  payload: TestPayload,
  image?: File,
): Promise<TestMutationResult> {
  try {
    if (!testId) {
      throw new Error("Test id is required to update a test");
    }

    const formData = buildTestFormData(payload, image);

    const res = await authenticatedFetch(`${API_BASE_URL}/tests/${testId}`, {
      method: "PATCH",
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ message: `Update failed with status ${res.status}` }));
      const message =
        (errorBody as any)?.message ||
        (errorBody as any)?.error ||
        `Update failed with status ${res.status}`;
      console.error("updateTest server error:", res.status, errorBody);
      // Throw a plain Error so the message survives the server-action boundary.
      throw new Error(String(message));
    }

    const data = await res.json().catch(() => null);
    // Always return a plain JSON-serializable object.
    return {
      success: true,
      data: JSON.parse(JSON.stringify((data as any)?.data ?? data ?? null)),
    };
  } catch (error: any) {
    console.error("Error updating test:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Failed to update test",
    };
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
