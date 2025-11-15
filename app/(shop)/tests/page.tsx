import { LocationSelector } from "@/components/shared/LocationSelector";
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
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-green-400 via-yellow-300 to-green-500'>
      <SiteHeader />
      <main className='flex-1'>
        <PageContainer>
          <div className='py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8'>
            {/* Minimalistic Header */}
            <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <div className='space-y-2'>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-900'>
                    Lab Tests
                  </h1>
                  <p className='text-gray-700 text-sm md:text-base max-w-2xl'>
                    Browse our comprehensive catalog of laboratory tests
                  </p>
                </div>
                <div className='w-full sm:w-auto sm:min-w-[280px]'>
                  <LocationSelector />
                </div>
              </div>
            </div>

            {/* Test Catalog */}
            <TestCatalog />
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
