import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | Ez LabTesting",
  description: "Manage your lab testing platform",
};

export default function AdminPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
