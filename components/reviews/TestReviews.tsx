"use client";

import {
  getCurrentUserReviewForTest,
  getTestReviews,
  type Review,
  type ReviewsResponse,
} from "@/app/actions/review";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hook/use-toast";
import {
  getDisplayReviews,
  shouldShowSignInPrompt,
  shouldShowWriteReviewCta,
} from "@/lib/reviews/view-state";
import { ChevronDown, LogIn, MessageSquarePlus, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { ReviewStats } from "./ReviewStats";

interface TestReviewsProps {
  testId: string;
  testName: string;
  currentUserId?: string;
  initialData?: ReviewsResponse;
}

export function TestReviews({
  testId,
  testName,
  currentUserId,
  initialData,
}: TestReviewsProps) {
  const [data, setData] = useState<ReviewsResponse | null>(initialData || null);
  const [ownReview, setOwnReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(!initialData);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "helpful"
  >("newest");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const refreshReviews = async () => {
    setLoading(true);
    try {
      const [reviews, currentUserReview] = await Promise.all([
        getTestReviews(testId, {
          page: 1,
          limit: 10,
          sortBy,
        }),
        currentUserId ? getCurrentUserReviewForTest(testId) : Promise.resolve(null),
      ]);

      setData(reviews);
      setOwnReview(currentUserReview);
      setPage(1);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshReviews();
  }, [testId, sortBy, currentUserId]);

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    setEditingReview(null);
    await refreshReviews();
  };

  const handleReviewDeleted = async () => {
    setShowReviewForm(false);
    setEditingReview(null);
    await refreshReviews();
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleHelpfulUpdate = (updatedReview: Review) => {
    setOwnReview((current) =>
      current?.id === updatedReview.id ? updatedReview : current,
    );
    setData((current) =>
      current
        ? {
            ...current,
            reviews: current.reviews.map((review) =>
              review.id === updatedReview.id ? updatedReview : review,
            ),
          }
        : current,
    );
  };

  const loadMoreReviews = async () => {
    if (!data || page >= data.meta.totalPages) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await getTestReviews(testId, {
        page: nextPage,
        limit: 10,
        sortBy,
      });

      setData({
        ...response,
        reviews: [...data.reviews, ...response.reviews],
      });
      setPage(nextPage);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load more reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const effectiveOwnReview = currentUserId ? ownReview : null;
  const visibleReviews = getDisplayReviews(data?.reviews ?? [], effectiveOwnReview);
  const showWriteReviewButton = shouldShowWriteReviewCta(
    currentUserId,
    effectiveOwnReview,
  );
  const showLoginPrompt = shouldShowSignInPrompt(currentUserId);
  const otherReviewsCount = Math.max(
    0,
    (data?.meta.total || 0) - (effectiveOwnReview ? 1 : 0),
  );
  const hasOtherReviews = otherReviewsCount > 0;

  if (loading && !data) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-center py-8'>
          <RefreshCw className='h-6 w-6 animate-spin text-muted-foreground' />
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {data && <ReviewStats meta={data.meta} />}

      {showLoginPrompt && !showReviewForm && (
        <Card className='border-primary/15 bg-primary/5'>
          <CardContent className='flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between'>
            <div className='space-y-1'>
              <p className='font-semibold text-foreground'>
                Sign in to share your experience
              </p>
              <p className='text-sm text-muted-foreground'>
                Reviews stay public, but posting and marking reviews helpful
                requires a logged-in account.
              </p>
            </div>
            <Button asChild variant='outline'>
              <Link href={`/login?from=${encodeURIComponent(`/tests/${testId}`)}`}>
                <LogIn className='h-4 w-4' />
                Sign In
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {showWriteReviewButton && !showReviewForm && (
        <div className='text-center'>
          <Button
            onClick={() => {
              setEditingReview(null);
              setShowReviewForm(true);
            }}
            size='lg'
            className='gap-2'
          >
            <Plus className='h-4 w-4' />
            Write a Review
          </Button>
        </div>
      )}

      {showReviewForm && (
        <ReviewForm
          testId={testId}
          testName={testName}
          initialData={editingReview || undefined}
          onSuccess={() => {
            void handleReviewSubmitted();
          }}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
        />
      )}

      {effectiveOwnReview && !showReviewForm && (
        <Card className='border-primary/20'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <MessageSquarePlus className='h-4 w-4 text-primary' />
              Your Review
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <ReviewList
              reviews={[effectiveOwnReview]}
              currentUserId={currentUserId}
              onEdit={handleEditReview}
              onDelete={() => {
                void handleReviewDeleted();
              }}
              onHelpfulUpdate={handleHelpfulUpdate}
            />
          </CardContent>
        </Card>
      )}

      {data && hasOtherReviews && (
        <div className='space-y-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h3 className='text-lg font-semibold'>
              {effectiveOwnReview
                ? "Customer Reviews"
                : `${data.meta.total} ${data.meta.total === 1 ? "Review" : "Reviews"}`}
            </h3>
            <Select
              value={sortBy}
              onValueChange={(value: typeof sortBy) => setSortBy(value)}
            >
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>Newest First</SelectItem>
                <SelectItem value='oldest'>Oldest First</SelectItem>
                <SelectItem value='highest'>Highest Rated</SelectItem>
                <SelectItem value='lowest'>Lowest Rated</SelectItem>
                <SelectItem value='helpful'>Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visibleReviews.length > 0 ? (
            <ReviewList
              reviews={visibleReviews}
              currentUserId={currentUserId}
              onEdit={handleEditReview}
              onDelete={() => {
                void handleReviewDeleted();
              }}
              onHelpfulUpdate={handleHelpfulUpdate}
            />
          ) : (
            <Card className='border-dashed'>
              <CardContent className='py-8 text-center text-sm text-muted-foreground'>
                No other reviews are visible on this page yet. Load more to see
                additional customer feedback.
              </CardContent>
            </Card>
          )}

          {data.meta.totalPages > page && (
            <div className='text-center'>
              <Button
                onClick={loadMoreReviews}
                variant='outline'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className='h-4 w-4 mr-2' />
                    Load More Reviews
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {data &&
        data.reviews.length === 0 &&
        !effectiveOwnReview &&
        !showReviewForm && (
        <div className='text-center py-12'>
          <MessageSquarePlus className='mx-auto mb-4 h-12 w-12 text-amber-400' />
          <h3 className='text-lg font-semibold mb-2'>No reviews yet</h3>
          <p className='text-muted-foreground mb-4'>
            Be the first to share your experience with this test.
          </p>
          {showWriteReviewButton && (
            <Button onClick={() => setShowReviewForm(true)}>
              <Plus className='h-4 w-4 mr-2' />
              Write the First Review
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
