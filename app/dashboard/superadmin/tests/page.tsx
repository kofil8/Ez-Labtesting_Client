import { TestManagement } from "@/components/admin/TestManagement";

export const metadata = {
  title: "Tests | Superadmin Dashboard",
  description: "Manage lab tests",
};

export default function TestsPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Tests</h1>
        <p className='text-muted-foreground mt-2'>Manage all lab tests</p>
      </div>
      <TestManagement />
    </div>
  );
}
