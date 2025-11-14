'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutProgressProps {
  currentStep: number
  steps: string[]
}

export function CheckoutProgress({ currentStep, steps }: CheckoutProgressProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2",
                  index < currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : index === currentStep
                    ? "bg-primary/10 text-primary border-primary animate-pulse"
                    : "bg-muted text-muted-foreground border-muted"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <p className={cn(
                "mt-2 text-xs font-medium text-center",
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              )}>
                {step}
              </p>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative">
                <div className="absolute inset-0 bg-muted" />
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: index < currentStep ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-primary"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

