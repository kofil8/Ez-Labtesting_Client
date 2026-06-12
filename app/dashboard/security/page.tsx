import { MFASetupForm } from "@/components/auth/MFASetupForm";
import { getCustomerDashboardViewer } from "@/lib/dashboard/customer.server";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function DashboardSecurityPage() {
  const viewer = await getCustomerDashboardViewer();

  if (!viewer) {
    redirect("/login?from=/dashboard/security");
  }

  return (
    <main className='mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='space-y-2'>
        <div className='flex items-center gap-2 text-sm font-medium text-blue-700'>
          <ShieldCheck className='h-4 w-4' />
          Security
        </div>
        <h1 className='text-3xl font-bold tracking-tight text-slate-950'>
          Account protection
        </h1>
        <p className='text-muted-foreground'>
          Set up two-factor authentication to protect account access and
          sensitive lab information.
        </p>
      </div>

      <Suspense
        fallback={
          <div className='rounded-2xl border border-blue-100 bg-white p-6 text-sm text-slate-500 shadow-sm'>
            Loading security settings...
          </div>
        }
      >
        <MFASetupForm />
      </Suspense>
    </main>
  );
}
