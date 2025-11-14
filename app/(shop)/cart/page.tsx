import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { PageContainer } from '@/components/shared/PageContainer'
import { CartView } from '@/components/cart/CartView'

export const metadata = {
  title: 'Shopping Cart | Kevin Lab Testing',
  description: 'Review your selected tests',
}

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="py-12">
            <div className="relative mb-8">
              {/* Background decoration */}
              <div className="absolute -top-20 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
                  🛒 <span>Shopping Cart</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  Your{' '}
                  <span className="text-gradient-cosmic">Cart</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Review your selected tests before checkout
                </p>
              </div>
            </div>
            <CartView />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  )
}

