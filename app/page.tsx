import { SiteHeader } from '@/components/shared/SiteHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import { FeaturedBundles } from '@/components/home/FeaturedBundles'
import { HeroSection } from '@/components/home/HeroSection'
import { StatsSection } from '@/components/home/StatsSection'
import { TestimonialSection } from '@/components/home/TestimonialSection'
import { FloatingActionButton } from '@/components/shared/FloatingActionButton'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturedBundles />
        <TestimonialSection />
      </main>
      <SiteFooter />
      <FloatingActionButton />
    </div>
  )
}

