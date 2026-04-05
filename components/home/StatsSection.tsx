"use client";

import { motion } from "framer-motion";
import { Award, Heart, Microscope, Timer } from "lucide-react";
import { useEffect, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: any;
  color: string;
}

const stats: Stat[] = [
  {
    value: 50000,
    suffix: "+",
    label: "Patients Served",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
  },
  {
    value: 99,
    suffix: "%",
    label: "Accuracy Rate",
    icon: Award,
    color: "from-emerald-500 to-teal-600",
  },
  {
    value: 24,
    suffix: "hrs",
    label: "Fast Results",
    icon: Timer,
    color: "from-cyan-500 to-blue-600",
  },
  {
    value: 150,
    suffix: "+",
    label: "Lab Tests",
    icon: Microscope,
    color: "from-cyan-500 to-teal-600",
  },
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
    <section className='py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-white via-cyan-50/30 to-white dark:from-slate-950 dark:via-cyan-950/20 dark:to-slate-950 relative overflow-hidden'>
      {/* Enhanced background with medical pattern */}
      <div className='absolute inset-0 bg-kalles-pattern opacity-[0.03]' />
      <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent' />
      <div className='absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl' />
      <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl' />

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-10 sm:mb-12 md:mb-14'
        >
          {/* Section label */}
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-bold mb-6 border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg shadow-cyan-500/10'
          >
            <Award className='w-4 h-4' />
            <span>Proven Excellence</span>
          </motion.div>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 sm:mb-5'>
            <span className='text-gray-900 dark:text-white'>
              Healthcare You Can{" "}
            </span>
            <span className='bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent'>
              Trust
            </span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium'>
            Join thousands who trust us for accurate, fast, and confidential lab
            testing
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: index * 0.12,
                duration: 0.6,
                type: "spring",
                stiffness: 120,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
              className='relative group'
            >
              {/* Animated gradient background */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500`}
              />

              <div className='relative bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 md:p-8 shadow-xl shadow-gray-200/80 dark:shadow-none border-2 border-gray-100 dark:border-slate-700/50 group-hover:border-cyan-200 dark:group-hover:border-cyan-800/50 transition-all duration-300 h-full flex flex-col items-center justify-center min-h-[240px] sm:min-h-[260px]'>
                {/* Icon badge */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mb-4 sm:mb-5`}
                >
                  <stat.icon className='w-7 h-7 sm:w-8 sm:h-8 text-white' />
                </div>

                {/* Number display - larger and bolder */}
                <div className='text-4xl sm:text-5xl md:text-5xl font-black mb-3 text-center leading-none'>
                  <span
                    className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent whitespace-nowrap`}
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                </div>

                {/* Label - clearer and bolder */}
                <div className='text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 text-center'>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
