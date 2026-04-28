import { DashboardSectionHeader } from "@/components/dashboard/customer/DashboardSectionHeader";
import { ResultsList } from "@/components/results/ResultsList";
import { FileCheck2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardCustomerResultsPage() {
  return (
    <div className='space-y-6'>
      <DashboardSectionHeader
        eyebrow='Orders and results'
        title='Track your lab orders'
        description='Review active orders, open requisitions, and return here when final reports are ready.'
        icon={FileCheck2}
      />
      <ResultsList />
    </div>
  );
}
