"use client";

import { ErrorState } from "@/components/profile/ErrorState";
import { Button } from "@/components/ui/button";

export default function ProfileRouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className='w-full bg-white'>
      <div className='mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8'>
        <ErrorState
          title='Unable to load profile'
          description='We could not load your profile right now. Please try again.'
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
