"use client";

import { AdminManagement } from "@/components/superadmin/AdminManagement";

export default function AdminsPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Admin Users</h1>
        <p className='text-muted-foreground mt-2'>
          Create and manage admin accounts
        </p>
      </div>
      <AdminManagement />
    </div>
  );
}
