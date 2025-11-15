import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TransactionHistory } from "@/components/transaction/TransactionHistory";

export const metadata = {
  title: "Transaction History | Ez LabTesting",
  description: "View your payment and transaction history",
};

export default function TransactionsPage() {
  // Mock transaction data - in real app, fetch from API
  const mockTransactions = [
    {
      id: "TXN-001",
      type: "payment" as const,
      amount: 299.99,
      status: "completed" as const,
      date: new Date(Date.now() - 86400000).toISOString(),
      description: "Lab Test Order #12345",
      paymentMethod: "card" as const,
      last4: "4242",
    },
    {
      id: "TXN-002",
      type: "payment" as const,
      amount: 149.5,
      status: "completed" as const,
      date: new Date(Date.now() - 172800000).toISOString(),
      description: "Lab Test Order #12344",
      paymentMethod: "ach" as const,
      last4: "6789",
    },
    {
      id: "TXN-003",
      type: "refund" as const,
      amount: 89.99,
      status: "completed" as const,
      date: new Date(Date.now() - 259200000).toISOString(),
      description: "Refund for Order #12340",
      paymentMethod: "card" as const,
      last4: "4242",
    },
    {
      id: "TXN-004",
      type: "payment" as const,
      amount: 199.0,
      status: "pending" as const,
      date: new Date(Date.now() - 3600000).toISOString(),
      description: "Lab Test Order #12346",
      paymentMethod: "ach" as const,
      last4: "6789",
    },
    {
      id: "TXN-005",
      type: "payment" as const,
      amount: 75.0,
      status: "failed" as const,
      date: new Date(Date.now() - 7200000).toISOString(),
      description: "Lab Test Order #12347",
      paymentMethod: "card" as const,
      last4: "0001",
    },
  ];

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='py-8'>
            <div className='mb-8'>
              <h1 className='text-4xl font-bold mb-2'>Transaction History</h1>
              <p className='text-muted-foreground'>
                View and manage all your payment transactions
              </p>
            </div>
            <TransactionHistory transactions={mockTransactions} />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
