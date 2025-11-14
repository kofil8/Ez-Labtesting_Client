"use client";

export function KallesBackground() {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {/* Base background color - Kalles style */}
      <div className='absolute inset-0 bg-[#fafafa] dark:bg-[#0a0a0a]' />

      {/* Subtle grid pattern overlay - Kalles signature pattern */}
      <div
        className='absolute inset-0 bg-kalles-pattern opacity-100'
        aria-hidden='true'
      />

      {/* Subtle dot pattern for texture */}
      <div
        className='absolute inset-0 bg-kalles-dots opacity-100'
        aria-hidden='true'
      />

      {/* Light gradient overlay for depth and warmth */}
      <div className='absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent dark:from-white/[0.015] dark:via-transparent dark:to-transparent' />
    </div>
  );
}
