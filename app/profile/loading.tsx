import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";

export default function LoadingProfilePage() {
  return (
    <main className='w-full bg-white'>
      <div className='mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
        <ProfileSkeleton />
      </div>
    </main>
  );
}
