import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
        <div className='h-24 bg-slate-50' />
        <div className='px-5 pb-6 sm:px-6'>
          <div className='-mt-10 flex items-start justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <Skeleton className='h-20 w-20 rounded-full' />
              <div className='space-y-2 pt-4'>
                <Skeleton className='h-8 w-56' />
                <Skeleton className='h-5 w-36' />
              </div>
            </div>
            <Skeleton className='mt-2 h-10 w-32' />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='rounded-2xl border border-slate-200 p-4'>
            <Skeleton className='h-5 w-5 mb-2' />
            <Skeleton className='mb-3 h-3 w-20' />
            <Skeleton className='h-7 w-16' />
          </div>
        ))}
      </div>

      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className='space-y-4 rounded-2xl border border-slate-200 p-6'
        >
          <Skeleton className='h-6 w-44' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {[...Array(i === 1 ? 3 : 2)].map((_, j) => (
              <Skeleton key={j} className='h-12 rounded-md' />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
