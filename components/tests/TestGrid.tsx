import { Test } from '@/types/test'
import { TestCard } from './TestCard'

interface TestGridProps {
  tests: Test[]
  fullWidth?: boolean
}

export function TestGrid({ tests, fullWidth = false }: TestGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 ${
      fullWidth ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
    }`}>
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  )
}

