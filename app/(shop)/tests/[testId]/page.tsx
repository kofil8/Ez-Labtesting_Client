import { getCurrentUser } from "@/app/actions/auth";
import { getTestById } from "@/app/actions/tests";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { TestDetail } from "@/components/tests/TestDetail";
import { TestDetailSkeleton } from "@/components/tests/TestDetailSkeleton";
import { formatTestMetadata } from "@/lib/test-utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = await getTestById(testId);

  if (!test) {
    return {
      title: "Test Not Found | Ez LabTesting",
      description: "The requested lab test could not be found.",
    };
  }

  const metadata = formatTestMetadata(test);

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: test.testName,
      description: test.description,
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
  const test = await getTestById(testId);

  // Get current user for review system (optional)
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;

  if (!test) {
    notFound();
  }

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      {/* Professional top banner */}
      <div className='bg-primary text-primary-foreground py-3'>
        <PageContainer>
          <div className='flex items-center justify-center gap-6 text-sm font-medium'>
            <div className='flex items-center gap-2'>
              <span>✅</span>
              <span>CLIA-Certified Labs</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>🚚</span>
              <span>Free Express Shipping</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>🔒</span>
              <span>HIPAA Compliant</span>
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
