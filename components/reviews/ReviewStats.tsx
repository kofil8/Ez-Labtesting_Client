"use client";

import { type ReviewMeta } from "@/app/actions/review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Users } from "lucide-react";

interface ReviewStatsProps {
  meta: ReviewMeta;
}

export function ReviewStats({ meta }: ReviewStatsProps) {
  const { averageRating, totalReviews, distribution } = meta;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Star className='h-5 w-5 text-yellow-500' />
          Customer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Overall Rating */}
        <div className='text-center'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <span className='text-4xl font-bold text-gray-900 dark:text-gray-100'>
              {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
            </span>
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className='flex items-center justify-center gap-1 text-sm text-muted-foreground'>
            <Users className='h-4 w-4' />
            <span>
              Based on {totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        {/* Rating Distribution */}
        {totalReviews > 0 && (
          <div className='space-y-3'>
            <h4 className='font-semibold text-sm text-gray-900 dark:text-gray-100'>
              Rating Breakdown
            </h4>
            {distribution.map((item) => (
              <div key={item.rating} className='flex items-center gap-3'>
                <div className='flex items-center gap-1 w-16'>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {item.rating}
                  </span>
                  <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                </div>
                <Progress value={item.percentage} className='flex-1 h-2' />
                <span className='text-sm text-muted-foreground w-12 text-right'>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Rating Summary */}
        {totalReviews > 0 && (
          <div className='bg-muted/30 rounded-lg p-4'>
            <div className='grid grid-cols-2 gap-4 text-center'>
              <div>
                <div className='text-lg font-bold text-green-600'>
                  {Math.round(
                    (((distribution[0]?.count || 0) +
                      (distribution[1]?.count || 0)) /
                      totalReviews) *
                      100,
                  )}
                  %
                </div>
                <div className='text-xs text-muted-foreground'>Recommend</div>
              </div>
              <div>
                <div className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                  {averageRating > 4
                    ? "Excellent"
                    : averageRating > 3
                      ? "Good"
                      : "Fair"}
                </div>
                <div className='text-xs text-muted-foreground'>Overall</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
