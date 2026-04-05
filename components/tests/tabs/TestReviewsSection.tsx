"use client";

import { TestReviews } from "@/components/reviews/TestReviews";
import { Test } from "@/types/test";

interface TestReviewsSectionProps {
  test: Test;
  currentUserId?: string;
}

export function TestReviewsSection({
  test,
  currentUserId,
}: TestReviewsSectionProps) {
  return (
    <div className='animate-in fade-in duration-300'>
      <TestReviews
        testId={test.id}
        testName={test.testName}
        currentUserId={currentUserId}
      />
    </div>
  );
}
