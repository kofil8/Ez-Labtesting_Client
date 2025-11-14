'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Stat {
  value: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { value: 50000, suffix: '+', label: 'Happy Customers' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate' },
  { value: 24, suffix: 'hrs', label: 'Average Turnaround' },
  { value: 150, suffix: '+', label: 'Available Tests' }
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="awsmd-section bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Subtle background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 awsmd-gradient-blue-purple rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 awsmd-gradient-purple-pink rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="awsmd-heading-md mb-6">
            <span className="text-gray-900 dark:text-white">Some </span>
            <span className="awsmd-gradient-text">Numbers</span>
            <span className="text-gray-900 dark:text-white"> About Us</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Numbers don't lie, so we use data science to drive calculated growth
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.8,
                type: 'spring',
                stiffness: 80
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="text-center relative group"
            >
              <div className="awsmd-glass-card p-8 md:p-10 awsmd-hover-lift border-2 border-gray-200/50 dark:border-gray-700/50 group-hover:border-purple-300/50 dark:group-hover:border-purple-600/50">
                {/* Number display - Awsmd style */}
                <div className="awsmd-number mb-4">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                {/* Label */}
                <div className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {stat.label}
                </div>
                {/* Icon or decorative element */}
                <div className="absolute -top-3 -right-3 w-12 h-12 awsmd-gradient-cosmic awsmd-rounded opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

