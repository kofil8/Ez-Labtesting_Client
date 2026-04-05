import { UserManagement } from "@/components/admin/UserManagement";

export const metadata = {
  title: "User Management | Admin | Ez LabTesting",
  description: "Manage user accounts",
};

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>User Management</h1>
      <UserManagement />
    </div>
  );
}

