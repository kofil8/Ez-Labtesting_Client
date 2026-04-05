"use client";

export function PageSkeleton() {
  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5'>
      <main className='flex-1 w-full'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
          <div className='space-y-6 lg:space-y-8'>
            {/* Title / Welcome */}
            <div className='glass-card p-6 lg:p-8 rounded-xl shadow-sm border border-border/50 animate-pulse'>
              <div className='h-6 w-40 bg-muted rounded mb-3' />
              <div className='h-4 w-64 bg-muted rounded' />
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className='medical-card border border-border/50 shadow-sm rounded-xl p-6 animate-pulse'
                >
                  <div className='flex items-center justify-between mb-4'>
                    <div className='h-4 w-32 bg-muted rounded' />
                    <div className='h-5 w-5 bg-muted rounded' />
                  </div>
                  <div className='h-8 w-20 bg-muted rounded mb-2' />
                  <div className='h-3 w-28 bg-muted rounded' />
                </div>
              ))}
            </div>

            {/* Content Cards */}
            <div className='grid gap-6 lg:gap-8 md:grid-cols-2'>
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className='medical-card border border-border/50 shadow-sm rounded-xl p-6 animate-pulse'
                >
                  <div className='h-5 w-44 bg-muted rounded mb-4' />
                  <div className='space-y-3'>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <div key={j} className='h-10 bg-muted/60 rounded' />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Wide Card */}
            <div className='glass-card border border-border/50 shadow-sm rounded-xl p-6 animate-pulse'>
              <div className='h-5 w-48 bg-muted rounded mb-4' />
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='h-24 bg-muted/60 rounded' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <div className='border-t border-blue-200 dark:border-blue-900/40 bg-slate-50 dark:bg-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-3 animate-pulse'>
              <div className='h-4 w-32 bg-muted rounded' />
              <div className='h-3 w-64 bg-muted rounded' />
              <div className='h-3 w-52 bg-muted rounded' />
            </div>
            <div className='space-y-3 animate-pulse'>
              <div className='h-4 w-28 bg-muted rounded' />
              <div className='h-3 w-56 bg-muted rounded' />
              <div className='h-3 w-44 bg-muted rounded' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
