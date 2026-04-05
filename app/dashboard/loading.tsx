import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardLoading() {
  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-background via-background to-primary/5'>
      <div className='flex flex-col items-center gap-4'>
        <LoadingSpinner size='lg' text='Loading dashboard...' />
        <p className='text-sm text-muted-foreground animate-pulse'>
          Preparing your dashboard...
        </p>
      </div>
    </div>
  );
}
