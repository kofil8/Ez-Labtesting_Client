import { LabPartnerDashboard } from "@/components/dashboard/LabPartnerDashboard";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export default function DashboardLabPartnerPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main id='main-content' className='flex-1'>
        <LabPartnerDashboard />
      </main>
      <SiteFooter />
    </div>
  );
}
