import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { PageContainer } from '@/components/shared/PageContainer'
import { ResultViewer } from '@/components/results/ResultViewer'
import { getResultByOrderId } from '@/lib/api'

export const metadata = {
  title: 'Test Results | Kevin Lab Testing',
  description: 'View your test results',
}

export default async function ResultViewerPage({ params }: { params: { orderId: string } }) {
  const result = await getResultByOrderId(params.orderId)
  
  if (!result) {
    notFound()
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageContainer>
          <div className="py-8">
            <ResultViewer result={result} />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  )
}

