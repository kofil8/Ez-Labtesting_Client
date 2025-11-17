import { Test } from '@/types/test'
import { TestCard } from './TestCard'
import { motion } from 'framer-motion'

interface TestGridProps {
  tests: Test[]
  fullWidth?: boolean
}

export function TestGrid({ tests, fullWidth = false }: TestGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 ${
      fullWidth ? 'xl:grid-cols-3' : 'xl:grid-cols-3'
    }`}>
      {tests.map((test, index) => (
        <motion.div
          key={test.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          <TestCard test={test} />
        </motion.div>
      ))}
    </div>
  )
}

