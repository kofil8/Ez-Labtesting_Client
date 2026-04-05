import { SuperAdminDashboard } from "@/components/superadmin/SuperAdminDashboard";

export const metadata = {
  title: "Superadmin Dashboard | Ez LabTesting",
  description: "Superadmin panel with full system access",
};

export default function SuperAdminPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold tracking-tight'>
          Superadmin Dashboard
        </h1>
        <p className='text-muted-foreground mt-2'>
          Full system overview and management
        </p>
      </div>
      <SuperAdminDashboard />
    </div>
  );
}
