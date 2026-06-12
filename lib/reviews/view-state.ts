import type { Review } from "@/app/actions/review";

export function getDisplayReviews(
  reviews: Review[],
  ownReview: Review | null,
): Review[] {
  if (!ownReview) {
    return reviews;
  }

  return reviews.filter((review) => review.id !== ownReview.id);
}

export function shouldShowWriteReviewCta(
  currentUserId?: string,
  ownReview?: Review | null,
): boolean {
  return Boolean(currentUserId && !ownReview);
}

export function shouldShowSignInPrompt(currentUserId?: string): boolean {
  return !currentUserId;
}
