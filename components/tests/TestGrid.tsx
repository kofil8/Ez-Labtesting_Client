import { Test } from '@/types/test'
import { TestCard } from './TestCard'

interface TestGridProps {
  tests: Test[]
}

export function TestGrid({ tests }: TestGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  )
}

