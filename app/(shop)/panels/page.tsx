import { FeaturedPanelGrid } from "@/components/panels/FeaturedPanelGrid";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata = {
  title: "Featured Test Panels | Ez LabTesting",
  description:
    "Browse our featured test panels with special offers and savings",
};

export default function PanelsPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />

      {/* Hero Section */}
      <div className='relative min-h-[280px] bg-gradient-to-br from-purple-900 via-blue-800 to-cyan-800'>
        {/* Background Pattern */}
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20'
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600"><defs><pattern id="panel" patternUnits="userSpaceOnUse" width="100" height="100"><rect x="20" y="20" width="30" height="40" rx="2" fill="%23ffffff" opacity="0.2"/><circle cx="80" cy="30" r="5" fill="%23ffffff" opacity="0.15"/><path d="M10 80 L40 60 L70 75" stroke="%23ffffff" stroke-width="1" fill="none" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(%23panel)"/></svg>')`,
          }}
        />

        {/* Content */}
        <div className='relative z-10 flex items-center justify-center min-h-[280px]'>
          <div className='text-center text-white px-4 max-w-4xl mx-auto'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight'>
              Test{" "}
              <span className='bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'>
                Panels
              </span>
            </h1>
            <p className='text-lg sm:text-xl md:text-2xl mb-6 text-blue-100 max-w-3xl mx-auto leading-relaxed'>
              Discover our curated test bundles with exclusive savings. Get
              comprehensive health screening at the best value.
            </p>
          </div>
        </div>
      </div>

      <main className='flex-1 bg-gray-50 dark:bg-gray-900'>
        <PageContainer>
          <div className='py-12 space-y-8'>
            <FeaturedPanelGrid />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
