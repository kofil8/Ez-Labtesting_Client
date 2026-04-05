import { MFASetupForm } from "@/components/auth/MFASetupForm";
import { AccountSidebar } from "@/components/profile/AccountSidebar";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function SecurityContent() {
  return (
    <div className='flex-1'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Security Settings</h1>
        <p className='mt-1 text-muted-foreground'>
          Manage your account security and two-factor authentication
        </p>
      </div>
      <MFASetupForm />
    </div>
  );
}

export default function SecurityPage() {
  return (
    <div className='min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col gap-6 md:flex-row md:gap-8'>
          <AccountSidebar />
          <Suspense fallback={<div>Loading...</div>}>
            <SecurityContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
