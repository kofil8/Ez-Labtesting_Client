"use server";

import {
  CreatePanelInput,
  Panel,
  PanelsListResponse,
  UpdatePanelInput,
} from "@/types/panel";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

/**
 * Get all panels with filtering, pagination, and sorting
 */
export async function getPanels(options?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}): Promise<PanelsListResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    // Public endpoint: proceed without token if not present

    // Build query string
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.sortBy) params.append("sortBy", options.sortBy);
    if (options?.sortOrder) params.append("sortOrder", options.sortOrder);
    if (options?.searchTerm) params.append("searchTerm", options.searchTerm);
    if (options?.isActive !== undefined)
      params.append("isActive", options.isActive.toString());
    if (options?.minPrice)
      params.append("minPrice", options.minPrice.toString());
    if (options?.maxPrice)
      params.append("maxPrice", options.maxPrice.toString());

    const queryString = params.toString();
    const url = `${API_BASE_URL}/panels${queryString ? "?" + queryString : ""}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    let res;
    try {
      res = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
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
      const error = await res.json().catch(() => ({
        message: "Failed to fetch panels",
      }));

      if (res.status === 401) {
        const store = await cookies();
        store.delete("accessToken");
        store.delete("refreshToken");
        throw new Error("Session expired. Please log in again.");
      }

      throw new Error(error.message || "Failed to fetch panels");
    }

    const data = await res.json();
    return {
      data: data?.data || [],
      meta: data?.meta || { page: 1, limit: 10, total: 0 },
    };
  } catch (error: any) {
    console.error("Error fetching panels:", error);
    throw error;
  }
}

/**
 * Get a single panel by ID
 */
export async function getPanelById(panelId: string): Promise<Panel> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    // Public endpoint: proceed without token if not present

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    let res;
    try {
      res = await fetch(`${API_BASE_URL}/panels/${panelId}`, {
        method: "GET",
        headers,
        credentials: "include",
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
      const error = await res.json().catch(() => ({
        message: "Panel not found",
      }));

      if (res.status === 401) {
        const store = await cookies();
        store.delete("accessToken");
        store.delete("refreshToken");
        throw new Error("Session expired. Please log in again.");
      }

      if (res.status === 404) {
        throw new Error("Panel not found");
      }

      throw new Error(error.message || "Failed to fetch panel");
    }

    const data = await res.json();
    return data?.data || data;
  } catch (error: any) {
    console.error("Error fetching panel:", error);
    throw error;
  }
}

/**
 * Create a new panel (Admin only)
 */
export async function createPanel(
  input: CreatePanelInput,
  imageFile?: File,
): Promise<Panel> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new Error("Not authenticated. Please log in again.");
    }

    // Build multipart FormData
    const formData = new FormData();
    const PANEL_FIELDS: Array<keyof CreatePanelInput> = [
      "name",
      "description",
      "basePrice",
      "discountPercent",
      "isActive",
      "startsAt",
      "endsAt",
      "testIds",
    ];
    for (const key of PANEL_FIELDS) {
      const value = input[key];
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, String(v)));
      } else {
        formData.append(key, String(value));
      }
    }
    if (imageFile) formData.append("panelImage", imageFile);

    let res;
    try {
      res = await fetch(`${API_BASE_URL}/panels`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
        credentials: "include",
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
      const error = await res.json().catch(() => ({
        message: "Failed to create panel",
      }));

      if (res.status === 401) {
        const store = await cookies();
        store.delete("accessToken");
        store.delete("refreshToken");
        throw new Error("Session expired. Please log in again.");
      }

      if (res.status === 403) {
        throw new Error("You do not have permission to create panels");
      }

      throw new Error(error.message || "Failed to create panel");
    }

    const data = await res.json();
    return data?.data || data;
  } catch (error: any) {
    console.error("Error creating panel:", error);
    throw error;
  }
}

/**
 * Update an existing panel (Admin only)
 */
export async function updatePanel(
  panelId: string,
  input: UpdatePanelInput,
  imageFile?: File,
): Promise<Panel> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new Error("Not authenticated. Please log in again.");
    }

    // Build multipart FormData
    const formData = new FormData();
    const PANEL_FIELDS: Array<keyof UpdatePanelInput> = [
      "name",
      "description",
      "basePrice",
      "discountPercent",
      "isActive",
      "startsAt",
      "endsAt",
      "testIds",
    ];
    for (const key of PANEL_FIELDS) {
      const value = input[key];
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, String(v)));
      } else {
        formData.append(key, String(value));
      }
    }
    if (imageFile) formData.append("panelImage", imageFile);

    let res;
    try {
      res = await fetch(`${API_BASE_URL}/panels/${panelId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
        credentials: "include",
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
      const error = await res.json().catch(() => ({
        message: "Failed to update panel",
      }));

      if (res.status === 401) {
        const store = await cookies();
        store.delete("accessToken");
        store.delete("refreshToken");
        throw new Error("Session expired. Please log in again.");
      }

      if (res.status === 403) {
        throw new Error("You do not have permission to update panels");
      }

      if (res.status === 404) {
        throw new Error("Panel not found");
      }

      throw new Error(error.message || "Failed to update panel");
    }

    const data = await res.json();
    return data?.data || data;
  } catch (error: any) {
    console.error("Error updating panel:", error);
    throw error;
  }
}

/**
 * Delete a panel (Admin only)
 */
export async function deletePanel(panelId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new Error("Not authenticated. Please log in again.");
    }

    let res;
    try {
      res = await fetch(`${API_BASE_URL}/panels/${panelId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
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
      const error = await res.json().catch(() => ({
        message: "Failed to delete panel",
      }));

      if (res.status === 401) {
        const store = await cookies();
        store.delete("accessToken");
        store.delete("refreshToken");
        throw new Error("Session expired. Please log in again.");
      }

      if (res.status === 403) {
        throw new Error("You do not have permission to delete panels");
      }

      if (res.status === 404) {
        throw new Error("Panel not found");
      }

      throw new Error(error.message || "Failed to delete panel");
    }
  } catch (error: any) {
    console.error("Error deleting panel:", error);
    throw error;
  }
}

/**
 * Helper: Search panels by term
 */
export async function searchPanels(searchTerm: string): Promise<Panel[]> {
  const result = await getPanels({
    searchTerm,
    isActive: true,
    page: 1,
    limit: 50,
  });
  return result.data;
}

/**
 * Helper: Get only active panels
 */
export async function getActivePanels(options?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PanelsListResponse> {
  return getPanels({
    ...options,
    isActive: true,
  });
}

/**
 * Helper: Get panels within a price range
 */
export async function getPanelsByPriceRange(
  minPrice: number,
  maxPrice: number,
  options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
): Promise<PanelsListResponse> {
  return getPanels({
    ...options,
    minPrice,
    maxPrice,
    isActive: true,
  });
}

/**
 * Helper: Get panels sorted by savings
 */
export async function getPanelsBySavings(options?: {
  page?: number;
  limit?: number;
}): Promise<PanelsListResponse> {
  return getPanels({
    ...options,
    sortBy: "discountPercent",
    sortOrder: "desc",
    isActive: true,
  });
}
