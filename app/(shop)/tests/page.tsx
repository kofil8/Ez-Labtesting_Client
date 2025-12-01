import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TestCatalog } from "@/components/tests/TestCatalog";

export const metadata = {
  title: "Browse Lab Tests | Ez LabTesting",
  description: "Find and order the lab tests you need",
};

export default function TestsPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />

      {/* Hero Section with Background */}
      <div className='relative min-h-[320px] bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700'>
        {/* Background Image Overlay */}
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15'
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600"><defs><pattern id="lab" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="20" cy="20" r="3" fill="%23ffffff" opacity="0.4"/><circle cx="80" cy="60" r="2" fill="%23ffffff" opacity="0.3"/><rect x="40" y="10" width="20" height="30" rx="2" fill="%23ffffff" opacity="0.2"/><path d="M10 80 Q20 70 30 80 Q40 90 50 80" stroke="%23ffffff" stroke-width="1" fill="none" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(%23lab)"/></svg>')`,
          }}
        />

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-blue-700/20 to-transparent' />

        {/* Content */}
        <div className='relative z-10 flex items-center justify-center min-h-[320px]'>
          <div className='text-center text-white px-4 max-w-4xl mx-auto'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg'>
              Laboratory Tests
            </h1>
            <p className='text-lg sm:text-xl md:text-2xl mb-8 text-cyan-50 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md'>
              Browse our comprehensive catalog of CLIA-certified laboratory
              tests and find the perfect diagnostic solution for your health
              needs
            </p>
          </div>
        </div>
      </div>

      <main className='flex-1 bg-gray-50 dark:bg-gray-900'>
        <PageContainer>
          <div className='py-8 space-y-8'>
            {/* Test Catalog */}
            <TestCatalog />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
