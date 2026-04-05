import { Test } from "@/types/test";
import { TestCard } from "./TestCard";

interface TestGridProps {
  tests: Test[];
  fullWidth?: boolean;
  animated?: boolean;
}

export function TestGrid({
  tests,
  fullWidth = false,
  animated = false,
}: TestGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 ${
        fullWidth
          ? "lg:grid-cols-2 xl:grid-cols-3"
          : "lg:grid-cols-2 xl:grid-cols-3"
      }`}
    >
      {tests.map((test, index) => (
        <TestCard
          key={test.id}
          test={test}
          variant={animated ? "animated" : "compact"}
          index={index}
        />
      ))}
    </div>
  );
}
