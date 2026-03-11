import { redirect } from "next/navigation";

export const metadata = {
  title: "Payment Successful | Ez LabTesting",
  description: "Your order has been confirmed",
};

export default function PaymentSuccessPage() {
  redirect("/checkout/visit-lab");
}
