"use client";

import {
  isRateLimitBlockedError,
  RATE_LIMIT_BLOCKED_MESSAGE,
} from "@/lib/errors/api-errors";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang='en'>
      <body>
        <main className='flex min-h-screen flex-col items-center justify-center p-4'>
          <div className='max-w-md text-center'>
            <AlertCircle className='mx-auto mb-4 h-16 w-16 text-red-600' />
            <h1 className='mb-2 text-2xl font-bold'>
              {isRateLimited ? "Request blocked" : "We encountered an issue"}
            </h1>
            <p
              className={
                isRateLimited
                  ? "mb-6 font-semibold text-red-600"
                  : "mb-6 text-slate-600"
              }
            >
              {isRateLimited
                ? RATE_LIMIT_BLOCKED_MESSAGE
                : "An error occurred while processing your request."}
            </p>
            <button
              type='button'
              onClick={reset}
              className='rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white'
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
