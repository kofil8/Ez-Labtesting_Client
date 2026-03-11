import { PageSkeleton } from "@/components/shared/PageSkeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CustomerDashboardLazy = dynamic(() =>
  import("@/components/dashboard/CustomerDashboard").then(
    (m) => m.CustomerDashboard,
  ),
);

export default function DashboardCustomerPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <div className='flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5'>
        <main id='main-content-section' className='flex-1 w-full'>
          <CustomerDashboardLazy />
        </main>
      </div>
    </Suspense>
  );
}
