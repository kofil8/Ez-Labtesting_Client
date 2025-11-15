import { PaymentConfirmation } from "@/components/checkout/PaymentConfirmation";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata = {
  title: "Payment Successful | Ez LabTesting",
  description: "Your order has been confirmed",
};

export default function PaymentSuccessPage() {
  // In a real app, this would come from URL params or API
  const mockOrderData = {
    orderId: "ORD-" + Date.now(),
    amount: 299.99,
    date: new Date().toISOString(),
    email: "customer@example.com",
    tests: [
      { name: "Comprehensive Metabolic Panel", price: 49.99 },
      { name: "Lipid Panel", price: 89.99 },
      { name: "Testosterone Total & Free", price: 160.0 },
    ],
    paymentMethod: "card" as const,
    last4: "4242",
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-green-950'>
        <PageContainer>
          <div className='py-16'>
            <PaymentConfirmation {...mockOrderData} />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
