import { ComplianceBanner } from "@/components/home/ComplianceBanner";
import { FAQSection } from "@/components/home/FAQSection";
import { HealthGoalDiscoverySection } from "@/components/home/HealthGoalDiscoverySection";
import { HealthReadyCTA } from "@/components/home/HealthReadyCTA";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PartnerNetwork } from "@/components/home/PartnerNetwork";
import { PopularTestsSection } from "@/components/home/PopularTestsSection";
import { PromoCodeTopBanner } from "@/components/home/PromoCodeTopBanner";
import { ResultExperience } from "@/components/home/ResultExperience";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { LazyFooter } from "@/components/shared/LazyFooter";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ezlabtesting.com";

export const metadata: Metadata = {
  title: "Lab Results You Can Understand | EzLabTesting",
  description:
    "Start with your health goal, check local availability, and order eligible lab tests online with clear cash-pay pricing and secure account access.",
  keywords: [
    "order lab tests online",
    "online lab testing",
    "lab test ecommerce",
    "blood tests online",
    "secure lab results",
    "ACCESS lab testing",
    "cash pay lab tests",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lab Results You Can Understand | EzLabTesting",
    description:
      "Find lab tests by health goal, check local availability, and access secure results through your EzLabTesting account.",
    url: siteUrl,
    siteName: "EzLabTesting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab Results You Can Understand | EzLabTesting",
    description:
      "Start with what you want to understand, then check eligible lab testing options near you.",
  },
};

const faqJsonLdItems = [
  {
    question: "Is EzLabTesting a laboratory?",
    answer:
      "No. EzLabTesting is an online ordering and result access platform. Sample collection and laboratory testing are performed by authorized partner laboratories.",
  },
  {
    question: "Which lab partner is currently active?",
    answer:
      "ACCESS is currently active for eligible orders. Additional partner networks such as CPL, Labcorp, and Quest are planned.",
  },
  {
    question: "Which states are restricted?",
    answer:
      "New York, New Jersey, Maryland, Massachusetts, and Rhode Island are restricted or may require additional physician involvement.",
  },
  {
    question: "Do I need a doctor's order?",
    answer:
      "Requirements vary by state and test. Some states or tests may require physician involvement or may not be available.",
  },
  {
    question: "How do I get my sample collected?",
    answer:
      "After order confirmation, you will receive instructions for an approved partner draw center or collection process when available.",
  },
  {
    question: "How fast will I get results?",
    answer:
      "Many results may be available within 24-72 hours after lab processing, depending on the test type and partner lab.",
  },
  {
    question: "Can I use insurance?",
    answer:
      "EzLabTesting is designed for transparent cash-pay pricing. Insurance billing is not required unless explicitly shown during checkout.",
  },
  {
    question: "Are result insights medical advice?",
    answer:
      "No. Result insights are educational and do not replace medical advice, diagnosis, or treatment.",
  },
];

export default function HomePage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EzLabTesting",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/tests?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EzLabTesting",
    url: siteUrl,
    description:
      "Online lab test ordering, checkout, account management, and result access platform.",
    areaServed: "US",
    sameAs: [],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqJsonLdItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main
        id='main-content-section'
        className='flex-1 min-w-0 overflow-x-hidden'
      >
        <PromoCodeTopBanner />
        <HeroSection />
        <TrustStrip />
        <HealthGoalDiscoverySection />
        <HowItWorksSection />
        <PopularTestsSection />
        <TestimonialSection />
        <PartnerNetwork />
        <ResultExperience />
        <ComplianceBanner />
        <FAQSection />
        <HealthReadyCTA />
      </main>
      <LazyFooter showDeveloperCredit />
    </>
  );
}
