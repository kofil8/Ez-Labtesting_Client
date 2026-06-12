import { DashboardSectionHeader } from "@/components/dashboard/customer/DashboardSectionHeader";
import { ResultsList } from "@/components/results/ResultsList";
import { PackageCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardCustomerOrdersPage() {
  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Order history'
        title='Track every order in one place'
        description='Open requisitions, monitor current status, and return to completed reports from your dashboard.'
        icon={PackageCheck}
      />
      <ResultsList />
    </div>
  );
}
