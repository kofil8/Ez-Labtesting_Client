import { FeaturedPanelGrid } from "@/components/panels/FeaturedPanelGrid";
import { PanelsHero } from "@/components/panels/PanelsHero";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Suspense } from "react";

export const metadata = {
  title: "Featured Test Panels | Ez LabTesting",
  description:
    "Browse our featured test panels with special offers and savings",
};

export default function PanelsPage() {
  return (
    <div className='flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950'>
      <PanelsHero />

      <main
        id='main-content-section'
        className='flex-1 bg-gray-50 dark:bg-gray-900'
      >
        <PageContainer>
          <div className='py-12 space-y-8'>
            <Suspense
              fallback={
                <div className='py-10 text-center text-muted-foreground'>
                  <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent' />
                  <p className='mt-4'>Loading featured panels...</p>
                </div>
              }
            >
              <FeaturedPanelGrid />
            </Suspense>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
