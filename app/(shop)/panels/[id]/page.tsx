import { getPanelById } from "@/app/actions/panels";
import { PanelDetail } from "@/components/panels";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const panel = await getPanelById(id);

    return {
      title: `${panel.name} | Ez LabTesting`,
      description: panel.description,
    };
  } catch {
    return {
      title: "Panel Not Found | Ez LabTesting",
      description: "The requested test panel could not be found.",
    };
  }
}

export default async function PanelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let panel;
  const { id } = await params;

  try {
    panel = await getPanelById(id);
  } catch {
    notFound();
  }

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <main id='main-content-section' className='flex-1'>
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
