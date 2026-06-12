import { redirect } from "next/navigation";

export default function ProfileTransactionsPage() {
  redirect("/dashboard/customer/transactions");
}
