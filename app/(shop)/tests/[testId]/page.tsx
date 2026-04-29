import { getCurrentUser } from "@/app/actions/auth";
import { getPublicTestById } from "@/app/actions/public-tests";
import { PageContainer } from "@/components/shared/PageContainer";
import { ScrollToTopOnMount } from "@/components/shared/ScrollToTopOnMount";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { TestDetail } from "@/components/tests/TestDetail";
import { TestDetailSkeleton } from "@/components/tests/TestDetailSkeleton";
import { formatPublicTestMetadata } from "@/lib/tests/public-tests";
import { FlaskConical, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = await getPublicTestById(testId);

  if (!test) {
    return {
      title: "Test Not Found | Ez LabTesting",
      description: "The requested lab test could not be found.",
    };
  }

  const metadata = formatPublicTestMetadata(test);

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: test.testName,
      description: test.shortDescription || test.description,
      images: test.testImage ? [test.testImage] : [],
    },
  };
}

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = await getPublicTestById(testId);
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;

  if (!test) {
    notFound();
  }

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <ScrollToTopOnMount scrollKey={test.id} />
      <div className='border-b border-slate-200 bg-white/95 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95'>
        <PageContainer>
          <div className='flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400'>
            <div className='flex items-center gap-2'>
              <ShieldCheck className='h-4 w-4 text-blue-600' />
              <span>CLIA-aligned catalog details</span>
            </div>
            <div className='flex items-center gap-2'>
              <FlaskConical className='h-4 w-4 text-cyan-600' />
              <span>Preparation and specimen guidance</span>
            </div>
          </div>
        </PageContainer>
      </div>

      <main id='main-content-section' className='flex-1'>
        <PageContainer>
          <div className='pt-6 pb-12'>
            <Suspense fallback={<TestDetailSkeleton />}>
              <TestDetail test={test} currentUserId={currentUserId} />
            </Suspense>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
