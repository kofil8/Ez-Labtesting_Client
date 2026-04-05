"use client";

import { getTestReviews, Review, ReviewsResponse } from "@/app/actions/review";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hook/use-toast";
import { ChevronDown, Plus, RefreshCw } from "lucide-react";
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
  const [loading, setLoading] = useState(!initialData);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "helpful"
  >("newest");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const loadReviews = async (resetPage = false) => {
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const response = await getTestReviews(testId, {
        page: currentPage,
        limit: 10,
        sortBy,
      });
      setData(response);
      if (resetPage) setPage(1);
    } catch (error) {
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
    if (!initialData) {
      loadReviews();
    }
  }, [testId, sortBy]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    loadReviews(true); // Reload from page 1
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (data) {
      const updatedReviews = data.reviews.filter((r) => r.id !== reviewId);
      setData({
        ...data,
        reviews: updatedReviews,
        meta: {
          ...data.meta,
          total: data.meta.total - 1,
          totalReviews: data.meta.totalReviews - 1,
        },
      });
    }
  };

  const handleHelpfulUpdate = (reviewId: string, helpful: boolean) => {
    if (data) {
      const updatedReviews = data.reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpfulCount: review.helpfulCount + (helpful ? 1 : -1),
            }
          : review,
      );
      setData({ ...data, reviews: updatedReviews });
    }
  };

  const loadMoreReviews = async () => {
    if (!data || page >= data.meta.totalPages) return;

    try {
      const response = await getTestReviews(testId, {
        page: page + 1,
        limit: 10,
        sortBy,
      });

      setData({
        ...response,
        reviews: [...data.reviews, ...response.reviews],
      });
      setPage(page + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more reviews",
        variant: "destructive",
      });
    }
  };

  const userHasReviewed =
    data?.reviews?.some((review) => review.user.name === currentUserId) ||
    false;

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
      {/* Review Stats */}
      {data && <ReviewStats meta={data.meta} />}

      {/* Write Review Button */}
      {currentUserId && !userHasReviewed && !showReviewForm && (
        <div className='text-center'>
          <Button
            onClick={() => setShowReviewForm(true)}
            size='lg'
            className='gap-2'
          >
            <Plus className='h-4 w-4' />
            Write a Review
          </Button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          testId={testId}
          testName={testName}
          initialData={editingReview || undefined}
          onSuccess={handleReviewSubmitted}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
        />
      )}

      {/* Reviews Section */}
      {data && data.reviews.length > 0 && (
        <div className='space-y-4'>
          {/* Sort Controls */}
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>
              {data.meta.total} {data.meta.total === 1 ? "Review" : "Reviews"}
            </h3>
            <Select
              value={sortBy}
              onValueChange={(value: typeof sortBy) => setSortBy(value)}
            >
              <SelectTrigger className='w-48'>
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

          {/* Reviews List */}
          <ReviewList
            reviews={data.reviews}
            currentUserId={currentUserId}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            onHelpfulUpdate={handleHelpfulUpdate}
          />

          {/* Load More Button */}
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

      {/* No Reviews State */}
      {data && data.reviews.length === 0 && !showReviewForm && (
        <div className='text-center py-12'>
          <div className='text-6xl mb-4'>⭐</div>
          <h3 className='text-lg font-semibold mb-2'>No reviews yet</h3>
          <p className='text-muted-foreground mb-4'>
            Be the first to share your experience with this test!
          </p>
          {currentUserId && (
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
