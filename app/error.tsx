"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4'>
      <div className='text-center max-w-md'>
        <AlertCircle className='h-16 w-16 mx-auto text-destructive mb-4' />
        <h1 className='text-2xl font-bold mb-2'>We encountered an issue</h1>
        <p className='text-muted-foreground mb-6'>
          We apologize for the inconvenience. An error occurred while processing
          your request.
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
