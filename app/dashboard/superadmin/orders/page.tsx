import { OrderManagement } from "@/components/admin/OrderManagement";

export const metadata = {
  title: "Orders | Superadmin Dashboard",
  description: "Manage all platform orders",
};

export default function OrdersPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
        <p className='text-muted-foreground mt-2'>View and manage all orders</p>
      </div>
      <OrderManagement />
    </div>
  );
}
