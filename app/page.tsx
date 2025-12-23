import { FeaturedBundles } from "@/components/home/FeaturedBundles";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PromoCodeSection } from "@/components/home/PromoCodeSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { FloatingActionButton } from "@/components/shared/FloatingActionButton";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export default function HomePage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main id='main-content' className='flex-1'>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturedBundles />
        <PromoCodeSection />
        <TestimonialSection />
      </main>
      <SiteFooter />
      <FloatingActionButton />
    </div>
  );
}
