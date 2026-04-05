import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | Ez LabTesting",
  description: "Manage your lab testing platform",
};

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className='text-4xl font-bold tracking-tight'>Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your lab testing platform</p>
      </div>
      <AdminDashboard />
    </div>
  );
}
