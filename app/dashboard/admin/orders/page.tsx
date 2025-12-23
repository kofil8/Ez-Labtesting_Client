import { OrderManagement } from "@/components/admin/OrderManagement";

export const metadata = {
  title: "Order Management | Admin | Ez LabTesting",
  description: "Manage customer orders",
};

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>Order Management</h1>
      <OrderManagement />
    </div>
  );
}

