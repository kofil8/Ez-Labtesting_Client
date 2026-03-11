import { getTestById } from "@/app/actions/tests";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { TestDetail } from "@/components/tests/TestDetail";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = (await params);
  const test = await getTestById(id);

  if (!test) {
    return {
      title: "Test Not Found",
    };
  }

  return {
    title: test.name,
    description: test.description,
  };
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = (await params);
  const test = await getTestById(id);

  if (!test) {
    notFound();
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <main id='main-content-section' className='flex-1'>
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
