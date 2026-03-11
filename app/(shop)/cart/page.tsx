import { CartView } from "@/components/cart/CartView";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata = {
  title: "Shopping Cart | Ez LabTesting",
  description: "Review your selected tests",
};

export default function CartPage() {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <main id='main-content-section' className='flex-1'>
        <PageContainer>
          <div className='pt-8 pb-12'>
            {/* Page header */}
            <div className='mb-8 pb-6 border-b border-border'>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2'>
                Shopping Cart
              </p>
              <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                Your Cart
              </h1>
              <p className='text-sm sm:text-base text-muted-foreground mt-1'>
                Review your selected tests before checkout
              </p>
            </div>
            <CartView />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
