import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export default function DashboardCustomerPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main id='main-content' className='flex-1'>
        <CustomerDashboard />
      </main>
      <SiteFooter />
    </div>
  );
}
