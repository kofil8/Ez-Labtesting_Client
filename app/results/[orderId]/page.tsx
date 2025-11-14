import { ResultViewer } from "@/components/results/ResultViewer";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { getResultByOrderId } from "@/lib/api";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Test Results | EZ Lab Testing",
  description: "View your test results",
};

export default async function ResultViewerPage({
  params,
}: {
  params: { orderId: string };
}) {
  const result = await getResultByOrderId(params.orderId);

  if (!result) {
    notFound();
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='py-8'>
            <ResultViewer result={result} />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
