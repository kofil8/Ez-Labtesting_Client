"use client";

import { TestDetailErrorBoundary } from "@/components/tests/TestDetailErrorBoundary";

export default function TestDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <TestDetailErrorBoundary error={error} reset={reset} />;
}
