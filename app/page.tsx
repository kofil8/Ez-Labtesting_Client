import { ComplianceBanner } from "@/components/home/ComplianceBanner";
import { FeaturedPanelsSection } from "@/components/home/FeaturedPanelsSection";
import { HealthReadyCTA } from "@/components/home/HealthReadyCTA";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PopularCategoriesSection } from "@/components/home/PopularCategoriesSection";
import { PopularTestsSection } from "@/components/home/PopularTestsSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { LazyFooter } from "@/components/shared/LazyFooter";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ezlabtesting.com";

export const metadata: Metadata = {
  title: "Online Medical Lab Tests | Lab Testing Site | Ez LabTesting",
  description:
    "Ez LabTesting is an online lab testing site to order medical lab tests and panels with transparent pricing, HIPAA-secure checkout, and CLIA-certified labs.",
  keywords: [
    "labtest",
    "lab test",
    "medical lab test",
    "medical lab tests online",
    "online lab testing site",
    "order lab tests online",
    "blood tests online",
    "diagnostic lab tests",
    "lab test ecommerce",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Online Lab Testing Site | Medical Lab Tests & Panels",
    description:
      "Shop medical lab tests online with secure checkout, clear pricing, and nationwide lab access.",
    url: siteUrl,
    siteName: "Ez LabTesting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Lab Testing Site | Medical Lab Tests & Panels",
    description:
      "Shop medical lab tests online with secure checkout, clear pricing, and nationwide lab access.",
  },
};

export default function HomePage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ez LabTesting",
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
    name: "Ez LabTesting",
    url: siteUrl,
    description:
      "Online medical lab testing ecommerce platform with CLIA-certified partner labs and HIPAA-secure checkout.",
    areaServed: "US",
    sameAs: [],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is EzLabTesting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EzLabTesting is an online lab testing site where you can order medical lab tests directly without a doctor's prescription, with CLIA-certified partner labs and transparent pricing.",
        },
      },
      {
        "@type": "Question",
        name: "How does online lab testing work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Browse tests, add to cart, complete secure checkout, receive your requisition form, visit a partner lab center, and view results in your account when ready.",
        },
      },
      {
        "@type": "Question",
        name: "Are your medical lab tests accurate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Tests are processed by CLIA-certified laboratories that follow high quality standards used by traditional healthcare providers.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need insurance to order lab tests online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Insurance is not required. You can pay directly using major cards and eligible HSA or FSA funds.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I get my sample collected?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the Find a Lab Center tool to locate certified partner draw centers nationwide for blood and other specimen collection.",
        },
      },
      {
        "@type": "Question",
        name: "How long do lab results take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most results are available within 1 to 3 business days after your lab visit, while some specialized tests may take longer.",
        },
      },
      {
        "@type": "Question",
        name: "Is my health information secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. EzLabTesting uses HIPAA-compliant safeguards and encryption to protect your personal health information and test results.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a refund for a lab test order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Refunds may be requested before sample collection. After collection, tests are generally non-refundable because lab processing has started.",
        },
      },
    ],
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
        <HeroSection />
        <HowItWorksSection />
        <PopularCategoriesSection />
        <PopularTestsSection />
        <FeaturedPanelsSection />
        <TestimonialSection />
        <WhyChooseUsSection />
        <HealthReadyCTA />
        <ComplianceBanner />
      </main>
      <LazyFooter showDeveloperCredit />
    </>
  );
}
