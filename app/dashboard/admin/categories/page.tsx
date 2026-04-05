import { CategoryManagement } from "@/components/admin/CategoryManagement";

export const metadata = {
  title: "Category Management | Admin | Ez LabTesting",
  description: "Manage test categories",
};

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className='mb-8 text-3xl font-bold'>Category Management</h1>
      <CategoryManagement />
    </div>
  );
}
