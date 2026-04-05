import { LabPartnerDashboard } from "@/components/dashboard/LabPartnerDashboard";

export const metadata = {
  title: "Lab Partner Dashboard | Ez LabTesting",
  description: "Manage your lab operations and sample processing",
};

export default function LabPartnerDashboardPage() {
  return (
    <div className='container mx-auto p-6 max-w-7xl'>
      <div className='mb-6'>
        <h1 className='text-h1 text-foreground'>Lab Partner Dashboard</h1>
        <p className='text-muted-foreground mt-2'>
          Monitor and manage your laboratory operations
        </p>
      </div>
      <LabPartnerDashboard />
    </div>
  );
}
