"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  isRateLimitBlockedError,
  RATE_LIMIT_BLOCKED_MESSAGE,
} from "@/lib/errors/api-errors";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface TestDetailErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function TestDetailErrorBoundary({
  error,
  reset,
}: TestDetailErrorBoundaryProps) {
  const isRateLimited = isRateLimitBlockedError(error);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Test Detail Error:", error);
  }, [error]);

  return (
    <div className='min-h-[400px] flex items-center justify-center p-6'>
      <Card className='max-w-md w-full border-red-200 dark:border-red-800'>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-100 dark:bg-red-900/30 rounded-full'>
              <AlertCircle className='h-6 w-6 text-red-600 dark:text-red-400' />
            </div>
            <CardTitle className='text-xl'>
              {isRateLimited ? "Request blocked" : "Unable to Load Test Details"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p
            className={
              isRateLimited
                ? "font-semibold text-red-600"
                : "text-muted-foreground"
            }
          >
            {isRateLimited
              ? RATE_LIMIT_BLOCKED_MESSAGE
              : "We encountered an issue loading this test. This may be temporary."}
          </p>
          <div className='flex gap-3'>
            <Button onClick={reset} variant='default'>
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = "/tests")}
              variant='outline'
            >
              Browse Tests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
