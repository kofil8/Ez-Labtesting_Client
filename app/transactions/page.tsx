import { LazyFooter } from "@/components/shared/LazyFooter";
import { PageContainer } from "@/components/shared/PageContainer";
import { CustomerTransactionHistory } from "@/components/transaction/CustomerTransactionHistory";

export const metadata = {
  title: "Transaction History | Ez LabTesting",
  description: "View your payment and transaction history",
};

export default function TransactionsPage() {
  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <main id='main-content-section' className='flex-1'>
          <PageContainer>
            <div className='py-8'>
              <div className='mb-8'>
                <h1 className='text-4xl font-bold mb-2'>Transaction History</h1>
                <p className='text-muted-foreground'>
                  View and manage all your payment transactions
                </p>
              </div>
              <CustomerTransactionHistory />
            </div>
          </PageContainer>
        </main>
      </div>
      <LazyFooter />
    </>
  );
}
