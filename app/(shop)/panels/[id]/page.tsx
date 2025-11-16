import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PanelDetail } from "@/components/panels/PanelDetail";
import panelsData from "@/data/panels.json";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const panel = (panelsData as any[]).find((p) => p.id === id);

  if (!panel) {
    return {
      title: "Panel Not Found",
    };
  }

  return {
    title: `${panel.name} | Ez LabTesting`,
    description: panel.description,
  };
}

export default async function PanelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const panel = (panelsData as any[]).find((p) => p.id === id);

  if (!panel) {
    notFound();
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='py-8'>
            <PanelDetail panel={panel} />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}

