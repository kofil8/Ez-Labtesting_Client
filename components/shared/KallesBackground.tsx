"use client";

export function KallesBackground() {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
      {/* Base cosmic gradient background */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 via-pink-50 to-blue-50 dark:from-slate-950 dark:via-purple-950/30 dark:via-blue-950/40 dark:to-slate-950' />
      
      {/* Animated gradient overlay - cosmic theme */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-500/10 via-pink-500/10 to-blue-400/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:via-pink-600/15 dark:to-blue-600/20 animate-gradient' 
           style={{
             backgroundSize: '200% 200%',
             animation: 'gradient-shift 15s ease infinite'
           }} />
      
      {/* Animated blob 1 - subtle movement */}
      <div 
        className='absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob'
        aria-hidden='true'
      />
      
      {/* Animated blob 2 - purple */}
      <div 
        className='absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000'
        aria-hidden='true'
      />
      
      {/* Animated blob 3 - pink */}
      <div 
        className='absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000'
        aria-hidden='true'
      />

      {/* Subtle grid pattern overlay - maintains texture */}
      <div
        className='absolute inset-0 bg-kalles-pattern opacity-[0.02] dark:opacity-[0.04]'
        aria-hidden='true'
      />

      {/* Subtle dot pattern for texture */}
      <div
        className='absolute inset-0 bg-kalles-dots opacity-[0.015] dark:opacity-[0.03]'
        aria-hidden='true'
      />

      {/* Light radial gradient for depth */}
      <div className='absolute inset-0 bg-gradient-radial from-white/40 via-white/10 to-transparent dark:from-white/[0.02] dark:via-transparent dark:to-transparent' 
           style={{
             background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
           }} />
    </div>
  );
}
