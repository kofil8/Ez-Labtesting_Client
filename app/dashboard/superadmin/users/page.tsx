import { UserManagement } from "@/components/admin/UserManagement";

export const metadata = {
  title: "Users | Superadmin Dashboard",
  description: "Manage all platform users",
};

export default function UsersPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
        <p className='text-muted-foreground mt-2'>
          Manage all customer and partner accounts
        </p>
      </div>
      <UserManagement />
    </div>
  );
}
