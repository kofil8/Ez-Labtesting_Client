"use client";

import {
  deleteReview,
  markReviewHelpful,
  type Review,
} from "@/app/actions/review";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hook/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Edit,
  Flag,
  Loader2,
  MoreVertical,
  Star,
  ThumbsUp,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

interface ReviewItemProps {
  review: Review;
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onHelpfulUpdate?: (reviewId: string, helpful: boolean) => void;
}

function ReviewItem({
  review,
  currentUserId,
  onEdit,
  onDelete,
  onHelpfulUpdate,
}: ReviewItemProps) {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);

  const isOwnReview = currentUserId === review.user.name; // Note: This is a simplified check

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);
      toast({
        title: "Review deleted",
        description: "Your review has been removed successfully.",
      });
      onDelete?.(review.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };

  const handleMarkHelpful = async () => {
    if (isOwnReview) return;

    setIsMarkingHelpful(true);
    try {
      const result = await markReviewHelpful(review.id);
      onHelpfulUpdate?.(review.id, result.helpful);
      toast({
        title: result.helpful ? "Marked as helpful" : "Removed helpful mark",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update helpful status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMarkingHelpful(false);
    }
  };

  return (
    <>
      <Card className='hover:shadow-md transition-shadow'>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            {/* Header */}
            <div className='flex items-start justify-between'>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                  {review.user.profileImage ? (
                    <img
                      src={review.user.profileImage}
                      alt={review.user.name}
                      className='w-10 h-10 rounded-full'
                    />
                  ) : (
                    <User className='h-5 w-5' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-medium text-gray-900 dark:text-gray-100'>
                      {review.user.name}
                    </span>
                    {review.isVerifiedPurchase && (
                      <Badge variant='secondary' className='text-xs'>
                        <CheckCircle2 className='h-3 w-3 mr-1' />
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-sm text-muted-foreground'>
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {isOwnReview ? (
                    <>
                      <DropdownMenuItem onClick={() => onEdit?.(review)}>
                        <Edit className='h-4 w-4 mr-2' />
                        Edit Review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Delete Review
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem>
                      <Flag className='h-4 w-4 mr-2' />
                      Report Review
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Review Content */}
            <div className='space-y-2'>
              <h4 className='font-semibold text-gray-900 dark:text-gray-100'>
                {review.title}
              </h4>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                {review.comment}
              </p>
            </div>

            {/* Footer */}
            <div className='flex items-center justify-between pt-2 border-t'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleMarkHelpful}
                disabled={isMarkingHelpful || isOwnReview}
                className='flex items-center gap-2 text-muted-foreground hover:text-foreground'
              >
                {isMarkingHelpful ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <ThumbsUp className='h-4 w-4' />
                )}
                Helpful ({review.helpfulCount})
              </Button>

              {review.updatedAt !== review.createdAt && (
                <span className='text-xs text-muted-foreground'>
                  Updated{" "}
                  {formatDistanceToNow(new Date(review.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onHelpfulUpdate?: (reviewId: string, helpful: boolean) => void;
}

export function ReviewList({
  reviews,
  currentUserId,
  onEdit,
  onDelete,
  onHelpfulUpdate,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-6xl mb-4'>⭐</div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
          No reviews yet
        </h3>
        <p className='text-muted-foreground'>
          Be the first to share your experience with this test!
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onHelpfulUpdate={onHelpfulUpdate}
        />
      ))}
    </div>
  );
}
