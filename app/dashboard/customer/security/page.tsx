import { MFASetupForm } from "@/components/auth/MFASetupForm";
import { DashboardSectionHeader } from "@/components/dashboard/customer/DashboardSectionHeader";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function DashboardCustomerSecurityPage() {
  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Security'
        title='Account protection'
        description='Set up two-factor authentication to better protect account access and sensitive lab information.'
        icon={ShieldCheck}
      />
      <Suspense
        fallback={
          <div className='rounded-2xl border border-blue-100 bg-white p-6 text-sm text-slate-500 shadow-sm'>
            Loading security settings...
          </div>
        }
      >
        <MFASetupForm />
      </Suspense>
    </div>
  );
}
