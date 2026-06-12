"use client";

import { ErrorState } from "@/components/profile/ErrorState";
import { Button } from "@/components/ui/button";
import {
  isRateLimitBlockedError,
  RATE_LIMIT_BLOCKED_MESSAGE,
} from "@/lib/errors/api-errors";

export default function ProfileRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isRateLimited = isRateLimitBlockedError(error);

  return (
    <main className='w-full bg-white'>
      <div className='mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8'>
        <ErrorState
          title={isRateLimited ? "Request blocked" : "Unable to load profile"}
          description={
            isRateLimited
              ? RATE_LIMIT_BLOCKED_MESSAGE
              : "We could not load your profile right now. Please try again."
          }
          descriptionClassName={
            isRateLimited ? "font-semibold text-red-600" : undefined
          }
          action={
            <Button
              variant='outline'
              aria-label='Retry loading profile'
              onClick={reset}
            >
              Retry
            </Button>
          }
        />
      </div>
    </main>
  );
}
