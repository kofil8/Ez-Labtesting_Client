import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { PageContainer } from '@/components/shared/PageContainer'
import { EnhancedCheckoutForm } from '@/components/checkout/EnhancedCheckoutForm'

export const metadata = {
  title: 'Checkout | Kevin Lab Testing',
  description: 'Complete your order',
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Complete Your{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Order
                </span>
              </h1>
              <p className="text-muted-foreground">
                Secure checkout - Your information is protected
              </p>
            </div>
            <EnhancedCheckoutForm />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  )
}

