"use client";

import { createReview, updateReview, type Review } from "@/app/actions/review";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hook/use-toast";
import { Loader2, Send, Star } from "lucide-react";
import { useState } from "react";

interface ReviewFormProps {
  testId: string;
  testName: string;
  initialData?: Review;
  onSuccess: () => void;
  onCancel?: () => void;
}

interface FormData {
  rating: number;
  title: string;
  comment: string;
}

export function ReviewForm({
  testId,
  testName,
  initialData,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    rating: initialData?.rating || 0,
    title: initialData?.title || "",
    comment: initialData?.comment || "",
  });

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.rating === 0 ||
      formData.title.trim().length === 0 ||
      formData.comment.trim().length < 10
    ) {
      toast({
        title: "Please complete all fields",
        description:
          "Rating, title, and a comment with at least 10 characters are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (initialData) {
        // Update existing review
        await updateReview(initialData.id, {
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
        });
        toast({
          title: "Review updated!",
          description: "Your review has been successfully updated.",
        });
      } else {
        // Create new review
        await createReview({
          testId,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
        });
        toast({
          title: "Review submitted!",
          description: "Thank you for sharing your experience.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='border-2 border-primary/20'>
      <CardHeader>
        <CardTitle className='text-xl'>
          {initialData ? "Edit Your Review" : "Write a Review"}
        </CardTitle>
        <p className='text-sm text-muted-foreground'>
          Share your experience with {testName}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Rating */}
          <div className='space-y-3'>
            <Label>Your Rating *</Label>
            <div className='flex items-center gap-1'>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type='button'
                  onClick={() => handleRatingClick(rating)}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className='p-1 transition-transform hover:scale-110'
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      (hoveredRating || formData.rating) >= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className='ml-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {formData.rating === 1 && "Poor"}
                  {formData.rating === 2 && "Fair"}
                  {formData.rating === 3 && "Good"}
                  {formData.rating === 4 && "Very Good"}
                  {formData.rating === 5 && "Excellent"}
                </span>
              )}
            </div>
          </div>

          {/* Review Title */}
          <div className='space-y-2'>
            <Label htmlFor='title'>Review Title *</Label>
            <Input
              id='title'
              placeholder='Summarize your experience in a few words'
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              maxLength={200}
              disabled={isSubmitting}
            />
            <p className='text-xs text-muted-foreground'>
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Review Comment */}
          <div className='space-y-2'>
            <Label htmlFor='comment'>Your Review *</Label>
            <Textarea
              id='comment'
              placeholder='Tell others about your experience with this test. Was it easy to use? How were the results? Would you recommend it?'
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              maxLength={1000}
              rows={4}
              disabled={isSubmitting}
            />
            <p className='text-xs text-muted-foreground'>
              {formData.comment.length}/1000 characters (minimum 10)
            </p>
          </div>

          {/* Form Actions */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='submit'
              disabled={
                isSubmitting ||
                formData.rating === 0 ||
                formData.title.trim().length === 0 ||
                formData.comment.trim().length < 10
              }
              className='flex-1'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className='h-4 w-4 mr-2' />
                  {initialData ? "Update Review" : "Submit Review"}
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type='button'
                variant='outline'
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
