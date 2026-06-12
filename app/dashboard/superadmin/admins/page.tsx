"use client";

import { AdminManagement } from "@/components/superadmin/AdminManagement";

export default function AdminsPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Admin & Lab Partners</h1>
        <p className='text-muted-foreground mt-2'>
          Manage admin and lab partner access. The super admin account is kept
          separate.
        </p>
      </div>
      <AdminManagement />
    </div>
  );
}
