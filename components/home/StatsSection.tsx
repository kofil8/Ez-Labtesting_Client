"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 50000, suffix: "+", label: "Happy Customers" },
  { value: 99, suffix: "%", label: "Satisfaction Rate" },
  { value: 24, suffix: "hrs", label: "Average Turnaround" },
  { value: 150, suffix: "+", label: "Available Tests" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className='py-12 sm:py-16 md:py-20 lg:py-32 bg-kalles-card relative overflow-hidden'>
      {/* Kalles-style subtle background pattern */}
      <div className='absolute inset-0 bg-kalles-pattern opacity-30' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20'
        >
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6'>
            <span className='text-gray-900 dark:text-white'>Some </span>
            <span className='awsmd-gradient-text'>Numbers</span>
            <span className='text-gray-900 dark:text-white'> About Us</span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0'>
            Numbers don&apos;t lie, so we use data science to drive calculated
            growth
          </p>
        </motion.div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.8,
                type: "spring",
                stiffness: 80,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className='text-center relative group'
            >
              <div className='awsmd-glass-card p-4 sm:p-6 md:p-8 lg:p-10 awsmd-hover-lift border-2 border-gray-200/50 dark:border-gray-700/50 group-hover:border-purple-300/50 dark:group-hover:border-purple-600/50'>
                {/* Number display - Awsmd style */}
                <div className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4'>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                {/* Label */}
                <div className='text-[10px] sm:text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide'>
                  {stat.label}
                </div>
                {/* Icon or decorative element */}
                <div className='absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 awsmd-gradient-cosmic awsmd-rounded opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl' />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
