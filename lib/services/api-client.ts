/**
 * Generic API Client
 *
 * Typed fetch wrapper for making HTTP requests.
 * Handles JSON serialization/deserialization.
 * Throws typed errors on failure.
 * No business logic - pure HTTP layer.
 */

import {
  ApiErrorResponse,
  ErrorCode,
} from "@/lib/api-contracts/error.contract";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode | string,
    public message: string,
    public details?: Record<string, unknown>,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic API client options
 */
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Generic API client for making typed requests
 */
export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number = 30000; // 30 seconds

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || "";
  }

  /**
   * Make a typed GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * Make a typed POST request
   */
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body,
    });
  }

  /**
   * Make a typed PUT request
   */
  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body,
    });
  }

  /**
   * Make a typed DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Generic request method with type safety
   * Throws ApiError on failure
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || "GET";
    const timeout = options.timeout || this.defaultTimeout;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      // Check for error response
      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        throw new ApiError(
          errorData?.code || "UNKNOWN_ERROR",
          errorData?.message || `HTTP ${response.status}`,
          errorData?.details,
          response.status,
        );
      }

      // Return successful response
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Re-throw if already an ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle abort (timeout)
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiError(
          "REQUEST_TIMEOUT",
          `Request timeout after ${timeout}ms`,
          undefined,
          408,
        );
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError(
          "NETWORK_ERROR",
          "Failed to connect to server. Please check your connection.",
          undefined,
          0,
        );
      }

      // Handle unknown errors
      throw new ApiError(
        "UNKNOWN_ERROR",
        error instanceof Error ? error.message : "An unknown error occurred",
        undefined,
        undefined,
      );
    }
  }
}

/**
 * Singleton instance for use throughout the app
 */
export const apiClient = new ApiClient();
