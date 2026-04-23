import { ResultsList } from "@/components/results/ResultsList";
import { PageContainer } from "@/components/shared/PageContainer";

export const metadata = {
  title: "My Results | Ez LabTesting",
  description: "View your lab test results",
};

export default function ResultsPage() {
  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef7ff_34%,#f8fbfd_100%)]'>
      <main id='main-content-section' className='py-10 sm:py-12'>
        <PageContainer>
          <div className='space-y-8'>
            <section className='rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(14,165,233,0.12)_0%,rgba(255,255,255,0.96)_52%,rgba(16,185,129,0.08)_100%)] px-6 py-7 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)] sm:px-8'>
              <div className='max-w-3xl'>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-sky-700'>
                  Orders and Results
                </p>
                <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl'>
                  Track your lab orders
                </h1>
                <p className='mt-3 text-sm leading-7 text-slate-600 sm:text-base'>
                  Review active orders, open requisitions, and return here when
                  final reports are ready.
                </p>
              </div>
            </section>

            <ResultsList />
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
