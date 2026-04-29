import { redirect } from "next/navigation";

export default function ProfileOrdersPage() {
  redirect("/dashboard/customer/orders");
}
