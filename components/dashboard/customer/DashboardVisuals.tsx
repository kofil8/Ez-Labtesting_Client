import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { OrderActivityChart } from "./OrderActivityChart";
import { OrderStatusDonut } from "./OrderStatusDonut";

export function DashboardVisuals({
  orders,
}: {
  orders: CustomerDashboardOrder[];
}) {
  return (
    <div className='grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]'>
      <OrderActivityChart orders={orders} />
      <OrderStatusDonut orders={orders} />
      <AppointmentCalendar orders={orders} />
    </div>
  );
}
