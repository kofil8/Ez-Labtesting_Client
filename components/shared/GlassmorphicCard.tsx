"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassmorphicCard({
  children,
  className,
  delay = 0,
}: GlassmorphicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4 }}
      className={cn(
        "awsmd-glass-card awsmd-rounded-xl shadow-2xl hover:shadow-3xl awsmd-hover-lift border-2",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Awsmd-style card variant with gradient border
export function AwsmdCard({
  children,
  className,
  delay = 0,
  gradient = "awsmd-gradient-cosmic",
}: GlassmorphicCardProps & { gradient?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120, damping: 15 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      {/* Gradient glow effect */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-500 awsmd-rounded-xl`} />
      
      {/* Card content */}
      <div className={cn(
        "relative awsmd-glass-card awsmd-rounded-xl p-6 border-2 border-white/40 dark:border-gray-700/40 group-hover:border-white/60 dark:group-hover:border-gray-600/60 shadow-xl hover:shadow-2xl transition-all duration-500",
        className
      )}>
        {children}
      </div>
    </motion.div>
  );
}

export function GlassmorphicHero({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Animated background gradients */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob' />
        <div className='absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000' />
      </div>

      <div className='relative backdrop-blur-sm'>{children}</div>
    </div>
  );
}
