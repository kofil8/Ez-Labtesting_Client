import { redirect } from "next/navigation";

export default function CheckoutSuccessPage() {
  redirect("/checkout/visit-lab");
}
