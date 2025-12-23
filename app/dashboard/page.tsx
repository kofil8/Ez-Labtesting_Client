import { redirect } from "next/navigation";

export default function DashboardIndexPage() {
  // Default dashboard landing -> send to customer dashboard
  redirect("/dashboard/customer");
}
