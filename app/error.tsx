"use client";

import { Button } from "@/components/ui/button";
import {
  isRateLimitBlockedError,
  RATE_LIMIT_BLOCKED_MESSAGE,
} from "@/lib/errors/api-errors";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isRateLimited = isRateLimitBlockedError(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4'>
      <div className='text-center max-w-md'>
        <AlertCircle className='h-16 w-16 mx-auto text-destructive mb-4' />
        <h1 className='text-2xl font-bold mb-2'>
          {isRateLimited ? "Request blocked" : "We encountered an issue"}
        </h1>
        <p
          className={
            isRateLimited
              ? "mb-6 font-semibold text-red-600"
              : "text-muted-foreground mb-6"
          }
        >
          {isRateLimited
            ? RATE_LIMIT_BLOCKED_MESSAGE
            : "We apologize for the inconvenience. An error occurred while processing your request."}
        </p>
        <div className='flex gap-4 justify-center'>
          <Button onClick={() => reset()}>Try again</Button>
          <Button
            variant='outline'
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
