"use server";

import { authenticatedFetch } from "@/lib/api-helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type GetCategoriesOptions = Record<string, never>;

export type CategoriesListResponse = {
  data: Category[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};

export async function getCategories(
  _options: GetCategoriesOptions = {},
): Promise<CategoriesListResponse> {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/categories/all`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
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
      .catch(() => ({ message: "Failed to fetch categories" }));

    throw new Error(error.message || "Failed to fetch categories");
  }

  const data = await res.json().catch(() => null);
  return {
    data: (data as any)?.data || [],
    meta: (data as any)?.meta,
  };
}

export async function getCategoryById(categoryId: string): Promise<Category> {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
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
      .catch(() => ({ message: "Failed to fetch category" }));

    if (res.status === 404) {
      throw new Error("Category not found");
    }

    throw new Error(error.message || "Failed to fetch category");
  }

  const data = await res.json().catch(() => null);
  return (data as any)?.data || data;
}

export type CategoryPayload = {
  name: string;
};

export async function createCategory(
  payload: CategoryPayload,
): Promise<Category> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Failed to create category" }));
      throw new Error(error.message || "Failed to create category");
    }

    const data = await res.json().catch(() => null);
    return (data as any)?.data || data;
  } catch (error: any) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(
  categoryId: string,
  payload: Partial<CategoryPayload>,
): Promise<Category> {
  try {
    const res = await authenticatedFetch(
      `${API_BASE_URL}/categories/${categoryId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Failed to update category" }));
      throw new Error(error.message || "Failed to update category");
    }

    const data = await res.json().catch(() => null);
    return (data as any)?.data || data;
  } catch (error: any) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const res = await authenticatedFetch(
      `${API_BASE_URL}/categories/${categoryId}`,
      {
        method: "DELETE",
      },
    );

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Failed to delete category" }));
      throw new Error(error.message || "Failed to delete category");
    }
  } catch (error: any) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
