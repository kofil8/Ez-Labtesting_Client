/**
 * Skeleton loader for lab card animation
 * Uses Tailwind CSS pulse animation for smooth loading state
 */
export function LabCardSkeleton() {
  return (
    <div className='border-b p-3 space-y-3 animate-pulse'>
      {/* Header with name and distance */}
      <div className='flex justify-between items-start gap-2'>
        <div className='flex-1'>
          <div className='h-4 bg-muted rounded w-3/4' />
          <div className='h-3 bg-muted rounded w-1/2 mt-2' />
        </div>
        <div className='h-3 bg-muted rounded w-12' />
      </div>

      {/* Address */}
      <div className='space-y-1'>
        <div className='h-3 bg-muted rounded w-full' />
        <div className='h-3 bg-muted rounded w-5/6' />
      </div>

      {/* Phone and status */}
      <div className='flex justify-between items-center'>
        <div className='h-3 bg-muted rounded w-32' />
        <div className='h-6 bg-muted rounded w-16' />
      </div>

      {/* Buttons */}
      <div className='flex gap-2'>
        <div className='flex-1 h-8 bg-muted rounded' />
        <div className='flex-1 h-8 bg-muted rounded' />
      </div>
    </div>
  );
}

interface LabListSkeletonProps {
  count?: number;
}

/**
 * Skeleton loader for lab list - shows multiple skeleton cards
 */
export function LabListSkeleton({ count = 8 }: LabListSkeletonProps) {
  return (
    <div className='divide-y'>
      {[...Array(count)].map((_, i) => (
        <LabCardSkeleton key={i} />
      ))}
    </div>
  );
}
