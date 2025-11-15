import { ResultsList } from "@/components/results/ResultsList";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata = {
  title: "My Results | Ez LabTesting",
  description: "View your lab test results",
};

export default function ResultsPage() {
  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='py-12'>
            <div className='relative mb-8'>
              {/* Background decoration */}
              <div className='absolute -top-20 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl' />

              <div className='relative'>
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4'>
                  📊 <span>Your Health Data</span>
                </div>
                <h1 className='text-4xl md:text-5xl font-bold mb-3'>
                  My <span className='text-gradient-success'>Results</span>
                </h1>
                <p className='text-lg text-muted-foreground'>
                  View, download, and track your lab test results over time
                </p>
              </div>
            </div>
            <ResultsList />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
