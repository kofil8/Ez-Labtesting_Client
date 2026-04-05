import { PageSkeleton } from "@/components/shared/PageSkeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const LabPartnerDashboardLazy = dynamic(() =>
  import("@/components/dashboard/LabPartnerDashboard").then(
    (m) => m.LabPartnerDashboard,
  ),
);

export default function DashboardLabPartnerPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <div className='flex min-h-screen flex-col'>
        <main id='main-content-section' className='flex-1'>
          <LabPartnerDashboardLazy />
        </main>
      </div>
    </Suspense>
  );
}
