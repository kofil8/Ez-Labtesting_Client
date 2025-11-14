import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TestDetail } from "@/components/tests/TestDetail";
import { getTestById } from "@/lib/api";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = await getTestById(testId);

  if (!test) {
    return {
      title: "Test Not Found",
    };
  }

  return {
    title: `${test.name} | EZ Lab Testing`,
    description: test.description,
  };
}

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = await getTestById(testId);

  if (!test) {
    notFound();
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='py-8'>
            <TestDetail test={test} />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
