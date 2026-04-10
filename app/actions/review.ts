"use server";

import { authenticatedFetch } from "@/lib/api-helpers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7001/api/v1";

export interface Review {
  id: string;
  testId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    profileImage?: string;
  };
}

export interface ReviewMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  averageRating: number;
  totalReviews: number;
  distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

export interface ReviewsResponse {
  reviews: Review[];
  meta: ReviewMeta;
}

export interface CreateReviewInput {
  testId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
}

/**
 * Get reviews for a specific test
 */
export async function getTestReviews(
  testId: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: "newest" | "oldest" | "highest" | "lowest" | "helpful";
  } = {},
): Promise<ReviewsResponse> {
  const params = new URLSearchParams({
    page: options.page?.toString() || "1",
    limit: options.limit?.toString() || "10",
    sortBy: options.sortBy || "newest",
  });

  const response = await fetch(
    `${API_BASE_URL}/reviews/test/${testId}?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Create a new review
 */
export async function createReview(data: CreateReviewInput): Promise<Review> {
  const response = await authenticatedFetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create review");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update an existing review
 */
export async function updateReview(
  reviewId: string,
  data: UpdateReviewInput,
): Promise<Review> {
  const response = await authenticatedFetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update review");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete review");
  }
}

/**
 * Mark a review as helpful
 */
export async function markReviewHelpful(
  reviewId: string,
): Promise<{ helpful: boolean }> {
  const response = await authenticatedFetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to mark review helpful");
  }

  const result = await response.json();
  return { helpful: result.data.helpful };
}

/**
 * Get a single review by ID
 */
export async function getReviewById(reviewId: string): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch review");
  }

  const result = await response.json();
  return result.data;
}
