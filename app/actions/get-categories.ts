"use server";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  _count: {
    tests: number;
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";
    const url = `${API_BASE_URL}/categories/all`;

    let response;
    try {
      response = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error: any) {
      if (
        error.cause?.code === "ECONNREFUSED" ||
        error.message?.includes("fetch failed")
      ) {
        console.error("Server connection error:", error);
        return [];
      }
      console.error("Network error:", error);
      return [];
    }

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/categories/slug/${slug}`, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error: any) {
      // Handle connection errors
      if (
        error.cause?.code === "ECONNREFUSED" ||
        error.message?.includes("fetch failed")
      ) {
        console.error("Server connection error:", error);
        return null;
      }
      throw error;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error: any) {
      // Handle connection errors
      if (
        error.cause?.code === "ECONNREFUSED" ||
        error.message?.includes("fetch failed")
      ) {
        console.error("Server connection error:", error);
        return null;
      }
      throw error;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}
