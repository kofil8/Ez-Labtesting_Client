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
    <section className='py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden'>
      {/* Enhanced background with subtle gradient overlay */}
      <div className='absolute inset-0 bg-kalles-pattern opacity-20' />
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5' />

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-12 sm:mb-14 md:mb-16'
        >
          {/* Section label */}
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4'>
            <span className='w-2 h-2 rounded-full bg-blue-500 animate-pulse' />
            Our Impact
          </div>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4'>
            <span className='text-gray-900 dark:text-white'>Trusted by </span>
            <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Thousands
            </span>
          </h2>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'>
            Real numbers that reflect our commitment to your health journey
          </p>
        </motion.div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
              className='text-center relative group'
            >
              <div className='bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700/50 group-hover:border-blue-200 dark:group-hover:border-blue-800/50 group-hover:shadow-xl group-hover:shadow-blue-100/50 dark:group-hover:shadow-none transition-all duration-300'>
                {/* Number display with improved typography */}
                <div className='text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3'>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                {/* Label with better spacing and sizing */}
                <div className='text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                  {stat.label}
                </div>
                {/* Subtle hover glow */}
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
