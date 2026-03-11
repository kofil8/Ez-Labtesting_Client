import { getPanels } from "@/app/actions/panels";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { TestCatalog } from "@/components/tests/TestCatalog";
import { TestsHero } from "@/components/tests/TestsHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Panel } from "@/types/panel";
import {
  ArrowRight,
  Award,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Premium Lab Tests | CLIA-Certified | Ez LabTesting",
  description:
    "Order lab tests online with fast results, expert analysis, and affordable pricing. CLIA-certified labs, same-day processing available.",
};

export default async function TestsPage() {
  let featuredPanels: Panel[] = [];
  try {
    const res = await getPanels({
      page: 1,
      limit: 3,
      isActive: true,
      sortBy: "discountPercent",
      sortOrder: "desc",
    });
    featuredPanels = res.data || [];
  } catch {
    // silently fall back to empty — cards won't render
  }

  return (
    <>
      <TestsHero />

      <div className='bg-slate-50 dark:bg-slate-900/50 py-20 border-t border-slate-100 dark:border-slate-800'>
        <PageContainer>
          <div className='text-center mb-16'>
            <Badge className='mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest'>
              <TrendingUp className='h-4 w-4 mr-2' />
              Trusted Results
            </Badge>
            <h2 className='text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight'>
              Most Ordered <span className='text-primary'>Test Panels</span>
            </h2>
            <p className='text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light'>
              Join over 100,000 patients who have taken control of their health
              with these comprehensive screenings.
            </p>
          </div>

          {featuredPanels.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
              {featuredPanels.map((panel) => {
                const savings =
                  panel.basePrice > panel.bundlePrice
                    ? Math.round(
                        ((panel.basePrice - panel.bundlePrice) /
                          panel.basePrice) *
                          100,
                      )
                    : panel.discountPercent;
                return (
                  <Link key={panel.id} href={`/panels/${panel.id}`}>
                    <Card className='relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-slate-100 dark:border-slate-800 hover:border-primary/30 rounded-[2rem] bg-white dark:bg-slate-900 group cursor-pointer'>
                      <CardContent className='p-8'>
                        <h3 className='font-bold text-xl mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors'>
                          {panel.name}
                        </h3>
                        <p className='text-slate-500 dark:text-slate-400 text-sm mb-6 font-light leading-relaxed italic'>
                          &quot;
                          {panel.description || ""}
                          &quot;
                        </p>
                        <div className='flex items-center gap-3 mb-8'>
                          <span className='text-3xl font-black text-slate-900 dark:text-white'>
                            {formatCurrency(panel.bundlePrice)}
                          </span>
                          {panel.basePrice > panel.bundlePrice && (
                            <span className='text-sm text-slate-400 line-through font-medium'>
                              {formatCurrency(panel.basePrice)}
                            </span>
                          )}
                          {savings > 0 && (
                            <Badge
                              variant='outline'
                              className='text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-100 font-bold ml-auto'
                            >
                              Save {savings}%
                            </Badge>
                          )}
                        </div>
                        <Button className='w-full bg-primary hover:bg-blue-600 text-white font-bold rounded-full h-12 shadow-lg shadow-blue-500/10 transition-all'>
                          Order This Panel
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          <div className='text-center'>
            <Link href='/panels'>
              <Button
                variant='outline'
                size='lg'
                className='border-2 border-primary/20 text-primary hover:bg-primary/5 font-bold rounded-full px-10 h-14 transition-all'
              >
                Explore All Health Panels
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </PageContainer>
      </div>

      <main
        id='main-content-section'
        className='flex-1 bg-gray-50 dark:bg-gray-900'
      >
        <PageContainer>
          <div id='all-tests' className='py-8 space-y-8'>
            {/* Section Header */}
            <div className='text-center'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white'>
                All Laboratory Tests
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8'>
                Browse our complete catalog of CLIA-certified laboratory tests.
                Each test includes expert physician review and detailed health
                insights.
              </p>
            </div>

            {/* Test Catalog */}
            <Suspense
              fallback={
                <div className='py-10 text-center text-muted-foreground'>
                  <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent' />
                  <p className='mt-4'>Loading premium lab tests...</p>
                </div>
              }
            >
              <TestCatalog />
            </Suspense>
          </div>
        </PageContainer>
      </main>

      {/* Trust & Security Section */}
      <div className='bg-gradient-to-br from-blue-900 to-cyan-900 text-white py-16'>
        <PageContainer>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Trusted by Healthcare Professionals
            </h2>
            <p className='text-lg opacity-90 max-w-3xl mx-auto'>
              Our CLIA-certified laboratory network ensures accurate results you
              can trust
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {[
              {
                icon: <ShieldCheck className='h-10 w-10' />,
                title: "CLIA Certified",
                description:
                  "All tests processed in CLIA-certified laboratories",
              },
              {
                icon: <Award className='h-10 w-10' />,
                title: "Board Certified",
                description: "Results reviewed by board-certified physicians",
              },
              {
                icon: <Users className='h-10 w-10' />,
                title: "100K+ Patients",
                description: "Trusted by over 100,000 satisfied customers",
              },
              {
                icon: <Star className='h-10 w-10' />,
                title: "4.9/5 Rating",
                description: "Exceptional service rated by real customers",
              },
            ].map((feature, index) => (
              <div key={index} className='text-center'>
                <div className='flex justify-center mb-4 text-cyan-300'>
                  {feature.icon}
                </div>
                <h3 className='font-bold text-lg mb-2'>{feature.title}</h3>
                <p className='text-sm opacity-90'>{feature.description}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      <SiteFooter />
    </>
  );
}
