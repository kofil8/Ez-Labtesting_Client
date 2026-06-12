import { getPublicTests } from "@/app/actions/public-tests";
import { PageContainer } from "@/components/shared/PageContainer";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestCatalog } from "@/components/tests/TestCatalog";
import { TestsHero } from "@/components/tests/TestsHero";
import {
  parsePublicCatalogSearchParams,
  type PublicTestCatalogQueryState,
} from "@/lib/tests/public-tests";
import { ArrowRight, Beaker, Headphones, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Lab Test Catalog | Ez LabTesting",
  description:
    "Browse active laboratory tests with specimen guidance, preparation details, and expected turnaround information.",
};

export const dynamic = "force-dynamic";

function toSearchParamsRecord(
  value: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(value)) {
    if (typeof rawValue === "string") {
      params.set(key, rawValue);
      continue;
    }

    if (Array.isArray(rawValue) && rawValue[0]) {
      params.set(key, rawValue[0]);
    }
  }

  return params;
}

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Clinical-first catalog",
    description: "Focused on active tests, not panel bundles or placeholder pricing.",
  },
  {
    icon: Beaker,
    title: "Specimen guidance",
    description: "Review sample type, fasting requirements, and preparation notes earlier.",
  },
  {
    icon: Headphones,
    title: "Support when needed",
    description: "Use support if you need help choosing the right test before ordering.",
  },
];

export default async function TestsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  let initialResults = undefined;
  let initialQuery: PublicTestCatalogQueryState | undefined = undefined;

  try {
    const resolvedSearchParams = searchParams ? await searchParams : {};
    initialQuery = parsePublicCatalogSearchParams(
      toSearchParamsRecord(resolvedSearchParams),
      { panelMode: "single" },
    );
    initialResults = await getPublicTests(initialQuery);
  } catch {
    initialResults = undefined;
  }

  return (
    <>
      <TestsHero mode='single' />

      <main
        id='main-content-section'
        className='flex-1 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_24%,#f8fbff_100%)]'
      >
        <section className='border-y border-sky-100 bg-white'>
          <PageContainer className='py-5'>
            <div className='grid gap-4 md:grid-cols-3'>
              {trustPoints.map((point) => (
                <div
                  key={point.title}
                  className='rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4'
                >
                  <div className='flex items-start gap-3'>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700'>
                      <point.icon className='h-5 w-5' />
                    </div>
                    <div>
                      <h2 className='text-sm font-semibold text-slate-900'>
                        {point.title}
                      </h2>
                      <p className='mt-1 text-sm leading-6 text-slate-600'>
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        <PageContainer>
          <div id='all-tests' className='py-10 sm:py-12 space-y-8'>
            <div className='mx-auto max-w-3xl text-center'>
              <Badge className='border border-sky-200 bg-sky-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-none'>
                Laboratory Catalog
              </Badge>
              <h2 className='mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>
                Browse Individual Lab Tests
              </h2>
              <p className='mt-4 text-base leading-7 text-slate-600 sm:text-lg'>
                Search active tests from your current catalog, filter by
                category, and open each test page for preparation, specimen, and
                turnaround details.
              </p>
            </div>

            <Suspense
              fallback={
                <div className='rounded-[2rem] border border-slate-200 bg-white py-14 text-center text-slate-600 shadow-sm'>
                  <div className='mx-auto inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-500 border-r-transparent' />
                  <p className='mt-4 text-sm font-medium'>
                    Loading laboratory tests...
                  </p>
                </div>
              }
            >
              <TestCatalog
                initialResults={initialResults}
                initialQuery={initialQuery}
                mode='single'
              />
            </Suspense>
          </div>
        </PageContainer>

        <section className='pb-14 sm:pb-16'>
          <PageContainer>
            <div className='rounded-[2rem] border border-sky-100 bg-[linear-gradient(135deg,#eff8ff_0%,#ffffff_54%,#eef7ff_100%)] px-6 py-8 sm:px-10'>
              <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                <div className='max-w-2xl'>
                  <p className='text-xs font-semibold uppercase tracking-[0.22em] text-sky-700'>
                    Need Guidance
                  </p>
                  <h3 className='mt-3 text-2xl font-bold text-slate-900 sm:text-3xl'>
                    Not sure which test fits your symptoms or monitoring plan?
                  </h3>
                  <p className='mt-3 text-sm leading-7 text-slate-600 sm:text-base'>
                    Start with the catalog, then reach out to support if you
                    need help narrowing down the right laboratory test before
                    checkout.
                  </p>
                </div>

                <div className='flex flex-col gap-3 sm:flex-row'>
                  <Button
                    asChild
                    className='h-11 rounded-full bg-sky-600 px-6 text-white hover:bg-sky-700'
                  >
                    <Link href='/help-center'>
                      Contact Support
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant='outline'
                    className='h-11 rounded-full border-slate-300 px-6 text-slate-700'
                  >
                    <Link href='/find-lab-center'>Find Lab Center</Link>
                  </Button>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
