import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";

export const metadata = {
  title: "Dashboard | Ez LabTesting",
  description: "View your health journey and test results",
};

export default function CustomerDashboardPage() {
  return (
    <div className='container mx-auto p-6 max-w-7xl'>
      <CustomerDashboard />
    </div>
  );
}
