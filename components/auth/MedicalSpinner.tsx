"use client";

import { useEffect, useState } from "react";

interface MedicalSpinnerProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  text?: string;
}

/**
 * MedicalSpinner - Healthcare-appropriate loading indicator
 * Features:
 * - Shield-inspired design for medical credibility
 * - Smooth 2-second rotation cycle
 * - Respects prefers-reduced-motion
 * - Accessible with aria labels
 */
export function MedicalSpinner({
  size = "md",
  showText = true,
  text = "Authenticating...",
}: MedicalSpinnerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      {/* Shield-based spinner */}
      <div className='relative' role='status' aria-label='Loading'>
        {/* Outer rotating ring */}
        <svg
          className={`${sizeClasses[size]} spinner-loading text-blue-600`}
          viewBox='0 0 100 100'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden='true'
        >
          {/* Outer circle with gradient */}
          <defs>
            <linearGradient
              id='spinnerGradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='rgb(37, 99, 235)' stopOpacity='1' />
              <stop
                offset='100%'
                stopColor='rgb(6, 182, 212)'
                stopOpacity='0.3'
              />
            </linearGradient>
          </defs>
          <circle
            cx='50'
            cy='50'
            r='45'
            stroke='url(#spinnerGradient)'
            strokeWidth='4'
            strokeLinecap='round'
            strokeDasharray='70 200'
          />
        </svg>

        {/* Center shield icon - static */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <svg
            className='h-6 w-6 text-blue-600'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
          >
            <path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      {showText && (
        <div className='text-center'>
          <p className={`${textSizeClasses[size]} font-medium text-gray-700`}>
            {text}
          </p>
          {/* Subtle dot animation */}
          <div className='flex justify-center gap-1 mt-2'>
            <span
              className='h-1 w-1 bg-blue-600 rounded-full'
              style={{
                animation: "pulse-subtle 1.4s infinite",
                animationDelay: "0s",
              }}
            />
            <span
              className='h-1 w-1 bg-blue-600 rounded-full'
              style={{
                animation: "pulse-subtle 1.4s infinite",
                animationDelay: "0.2s",
              }}
            />
            <span
              className='h-1 w-1 bg-blue-600 rounded-full'
              style={{
                animation: "pulse-subtle 1.4s infinite",
                animationDelay: "0.4s",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
