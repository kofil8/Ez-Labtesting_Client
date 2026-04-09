import { ComplianceBanner } from "@/components/home/ComplianceBanner";
import { HealthReadyCTA } from "@/components/home/HealthReadyCTA";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PopularCategoriesSection } from "@/components/home/PopularCategoriesSection";
import { PopularTestsSection } from "@/components/home/PopularTestsSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { HomepageLabAssistant } from "@/components/chat/HomepageLabAssistant";
import { LazyFooter } from "@/components/shared/LazyFooter";

export default function HomePage() {
  return (
    <>
      <main
        id='main-content-section'
        className='flex-1 min-w-0 overflow-x-hidden'
      >
        <HeroSection />
        <HowItWorksSection />
        <PopularCategoriesSection />
        <PopularTestsSection />
        <TestimonialSection />
        <WhyChooseUsSection />
        <HealthReadyCTA />
        <ComplianceBanner />
      </main>
      <LazyFooter />
      <HomepageLabAssistant />
    </>
  );
}
