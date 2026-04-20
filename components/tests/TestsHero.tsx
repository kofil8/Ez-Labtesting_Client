"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Beaker, FileCheck2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TestsHeroMode = "single" | "panel";

const HERO_CONTENT: Record<
  TestsHeroMode,
  {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    heroImage: {
      src: string;
      alt: string;
    };
    primaryCta: { href: string; label: string };
    secondaryCta: { href: string; label: string };
    highlights: Array<{
      icon: typeof ShieldCheck;
      title: string;
      description: string;
    }>;
    overlay: Array<{ label: string; text: string }>;
  }
> = {
  single: {
    badge: "Medical Lab Testing",
    title: "Find the Right",
    highlight: "Laboratory Test",
    description:
      "Search individual lab tests, compare categories, and review specimen, fasting, and turnaround information in a cleaner healthcare-focused catalog experience.",
    heroImage: {
      src: "/images/Blood-Vial.webp",
      alt: "Laboratory blood testing",
    },
    primaryCta: { href: "#all-tests", label: "Browse Tests" },
    secondaryCta: { href: "/panels", label: "View Test Panels" },
    highlights: [
      {
        icon: ShieldCheck,
        title: "Active catalog only",
        description: "Browse the current published tests available from your backend.",
      },
      {
        icon: Beaker,
        title: "Specimen details upfront",
        description: "See specimen type and preparation expectations before opening a test.",
      },
      {
        icon: FileCheck2,
        title: "Turnaround guidance",
        description: "Review estimated result timing before moving to the next step.",
      },
    ],
    overlay: [
      { label: "Search", text: "by test name, marker, or health concern" },
      { label: "Review", text: "preparation, fasting, and specimen details" },
      { label: "Continue", text: "to the next step once you know the right test" },
    ],
  },
  panel: {
    badge: "Panel Testing",
    title: "Compare",
    highlight: "Test Panels",
    description:
      "Browse bundled screening panels with included component tests, best available pricing, and clearer lab offer visibility from the current catalog.",
    heroImage: {
      src: "/images/analyzing.webp",
      alt: "Laboratory analysis",
    },
    primaryCta: { href: "#all-tests", label: "Browse Panels" },
    secondaryCta: { href: "/tests", label: "Browse Single Tests" },
    highlights: [
      {
        icon: ShieldCheck,
        title: "Sellable panel products",
        description: "Panels come from the same public test catalog as single tests.",
      },
      {
        icon: Beaker,
        title: "Included tests visible",
        description: "Open each panel to review the ordered component list before checkout.",
      },
      {
        icon: FileCheck2,
        title: "Best-price snapshot",
        description: "See the current starting price and storefront lab before opening details.",
      },
    ],
    overlay: [
      { label: "Compare", text: "bundle pricing, included tests, and turnaround guidance" },
      { label: "Review", text: "panel composition before you open the detail page" },
      { label: "Continue", text: "with a single shared detail experience at /tests/[slug]" },
    ],
  },
};

export function TestsHero({ mode = "single" }: { mode?: TestsHeroMode }) {
  const content = HERO_CONTENT[mode];

  return (
    <section className='relative overflow-hidden border-b border-sky-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_58%,#f4faff_100%)]'>
      <div className='absolute inset-0 -z-10'>
        <div className='absolute left-[-6rem] top-10 h-56 w-56 rounded-full bg-sky-100/70 blur-3xl' />
        <div className='absolute right-[-4rem] top-8 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl' />
      </div>

      <PageContainer className='py-12 sm:py-14 lg:py-16'>
        <div className='grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
          <div className='space-y-6'>
            <Badge className='border border-sky-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm'>
              {content.badge}
            </Badge>

            <div className='space-y-4'>
              <h1 className='text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]'>
                {content.title}
                <span className='block text-sky-700'>{content.highlight}</span>
                for Your Care Journey
              </h1>
              <p className='max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'>
                {content.description}
              </p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button
                asChild
                size='lg'
                className='h-12 rounded-full bg-sky-600 px-7 text-white hover:bg-sky-700'
              >
                <Link href={content.primaryCta.href}>
                  {content.primaryCta.label}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='h-12 rounded-full border-slate-300 px-7 text-slate-700'
              >
                <Link href={content.secondaryCta.href}>{content.secondaryCta.label}</Link>
              </Button>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              {content.highlights.map((item) => (
                <div
                  key={item.title}
                  className='rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm'
                >
                  <div className='mb-3 inline-flex rounded-2xl bg-sky-100 p-2.5 text-sky-700'>
                    <item.icon className='h-5 w-5' />
                  </div>
                  <h2 className='text-sm font-semibold text-slate-900'>
                    {item.title}
                  </h2>
                  <p className='mt-1 text-xs leading-6 text-slate-600'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='relative'>
            <div className='overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_70px_-45px_rgba(14,116,144,0.45)]'>
              <Image
                src={content.heroImage.src}
                alt={content.heroImage.alt}
                width={900}
                height={720}
                className='h-full w-full object-cover'
                priority
              />
            </div>

            <div className='absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/70 bg-white/92 px-5 py-4 shadow-lg backdrop-blur'>
              <div className='grid gap-4 sm:grid-cols-3'>
                {content.overlay.map((item) => (
                  <div key={item.label}>
                    <p className='text-xs font-semibold uppercase tracking-[0.16em] text-sky-700'>
                      {item.label}
                    </p>
                    <p className='mt-1 text-sm text-slate-700'>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
