import type { Review } from "@/app/actions/review";
import { describe, expect, it } from "vitest";
import {
  getDisplayReviews,
  shouldShowSignInPrompt,
  shouldShowWriteReviewCta,
} from "./view-state";

function buildReview(id: string, userId: string): Review {
  return {
    id,
    testId: "test-1",
    userId,
    rating: 5,
    title: `Review ${id}`,
    comment: "Very helpful experience overall.",
    isVerifiedPurchase: false,
    helpfulCount: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    user: {
      id: userId,
      name: `User ${userId}`,
    },
  };
}

describe("reviews/view-state", () => {
  it("filters the current user's review out of the public list copy", () => {
    const ownReview = buildReview("review-1", "user-1");
    const otherReview = buildReview("review-2", "user-2");

    expect(getDisplayReviews([ownReview, otherReview], ownReview)).toEqual([
      otherReview,
    ]);
  });

  it("shows the write CTA only for signed-in users without a review", () => {
    expect(shouldShowWriteReviewCta("user-1", null)).toBe(true);
    expect(shouldShowWriteReviewCta("user-1", buildReview("review-1", "user-1"))).toBe(false);
    expect(shouldShowWriteReviewCta(undefined, null)).toBe(false);
  });

  it("shows the sign-in prompt only for logged-out users", () => {
    expect(shouldShowSignInPrompt(undefined)).toBe(true);
    expect(shouldShowSignInPrompt("user-1")).toBe(false);
  });
});
