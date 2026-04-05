import { CategoryManagement } from "@/components/admin/CategoryManagement";

export const metadata = {
  title: "Categories | Superadmin Dashboard",
  description: "Manage test categories",
};

export default function CategoriesPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Categories</h1>
        <p className='mt-2 text-muted-foreground'>Manage all test categories</p>
      </div>
      <CategoryManagement />
    </div>
  );
}
