import { clientFetch, getApiUrl, publicFetch } from "@/lib/api-client";

export interface Review {
  id: string;
  testId: string;
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

export interface CreateReviewData {
  testId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
}

export const reviewService = {
  // Get reviews for a test
  getReviews: async (
    testId: string,
    options: {
      page?: number;
      limit?: number;
      sortBy?: "newest" | "oldest" | "highest" | "lowest" | "helpful";
    } = {},
  ): Promise<ReviewsResponse> => {
    const params = new URLSearchParams({
      page: options.page?.toString() || "1",
      limit: options.limit?.toString() || "10",
      sortBy: options.sortBy || "newest",
    });

    const response = await publicFetch(
      getApiUrl(`/reviews/test/${testId}?${params}`),
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    return response.json();
  },

  // Create a new review
  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await clientFetch(getApiUrl("/reviews"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create review");
    }

    const result = await response.json();
    return result.review;
  },

  // Update a review
  updateReview: async (
    reviewId: string,
    data: UpdateReviewData,
  ): Promise<Review> => {
    const response = await clientFetch(getApiUrl(`/reviews/${reviewId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update review");
    }

    const result = await response.json();
    return result.review;
  },

  // Delete a review
  deleteReview: async (reviewId: string): Promise<void> => {
    const response = await clientFetch(getApiUrl(`/reviews/${reviewId}`), {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete review");
    }
  },

  // Mark review as helpful
  markHelpful: async (reviewId: string): Promise<{ helpful: boolean }> => {
    const response = await clientFetch(
      getApiUrl(`/reviews/${reviewId}/helpful`),
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to mark review helpful");
    }

    return response.json();
  },
};
