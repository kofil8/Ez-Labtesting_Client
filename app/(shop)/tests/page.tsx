import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { PageContainer } from '@/components/shared/PageContainer'
import { TestCatalog } from '@/components/tests/TestCatalog'
import { LocationSelector } from '@/components/shared/LocationSelector'

export const metadata = {
  title: 'Browse Lab Tests | Kevin Lab Testing',
  description: 'Find and order the lab tests you need',
}

export default function TestsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="py-12 space-y-8">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -top-20 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                  🔬 <span>All Tests</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  Browse{' '}
                  <span className="text-gradient-cosmic">Lab Tests</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                  Choose from our comprehensive catalog of laboratory tests
                </p>
                <div className="max-w-md">
                  <LocationSelector />
                </div>
              </div>
            </div>
            <TestCatalog />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  )
}

