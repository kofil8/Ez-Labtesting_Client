import { FloatingActionButton } from "@/components/shared/FloatingActionButton";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  CalendarIcon,
  CheckCircle2,
  ClipboardCheckIcon,
  Clock,
  CreditCard,
  Download,
  FileTextIcon,
  MapPin,
  SearchIcon,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main id='main-content' className='flex-1'>
        {/* Hero Section */}
        <section className='py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-white'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='max-w-3xl mx-auto text-center'>
              <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-6'>
                How EzLabTesting Works
              </h1>
              <p className='text-xl text-muted-foreground mb-8'>
                Getting lab tests has never been easier. We've streamlined the
                entire process to save you time and provide you with accurate
                results quickly.
              </p>
            </div>
          </div>
        </section>

        {/* Main Steps Section */}
        <section className='py-16 md:py-24 bg-white'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='max-w-5xl mx-auto space-y-16'>
              {/* Step 1 */}
              <div className='flex flex-col md:flex-row gap-8 items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl'>
                    <SearchIcon className='w-10 h-10 text-primary-foreground' />
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-3'>
                    <span className='px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm'>
                      STEP 1
                    </span>
                    <h2 className='text-3xl font-bold'>Choose Your Test</h2>
                  </div>
                  <p className='text-lg text-muted-foreground mb-4'>
                    Browse through our extensive catalog of individual tests and
                    comprehensive health panels. Whether you need routine blood
                    work, specialized diagnostics, or complete health
                    screenings, we have you covered.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>
                        Search by condition, test name, or health concern
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>
                        Compare test packages and save with bundled panels
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>
                        View detailed descriptions and preparation instructions
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className='flex flex-col md:flex-row-reverse gap-8 items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl'>
                    <CalendarIcon className='w-10 h-10 text-primary-foreground' />
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-3'>
                    <span className='px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm'>
                      STEP 2
                    </span>
                    <h2 className='text-3xl font-bold'>
                      Book Your Appointment
                    </h2>
                  </div>
                  <p className='text-lg text-muted-foreground mb-4'>
                    Find a convenient lab center near you and schedule your
                    visit at a time that fits your schedule. Our extensive
                    network of certified labs ensures you're never far from
                    quality care.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>View available time slots in real-time</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>Choose from multiple locations near you</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>
                        Flexible scheduling with same-day appointments available
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className='flex flex-col md:flex-row gap-8 items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl'>
                    <ClipboardCheckIcon className='w-10 h-10 text-primary-foreground' />
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-3'>
                    <span className='px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm'>
                      STEP 3
                    </span>
                    <h2 className='text-3xl font-bold'>Get Tested</h2>
                  </div>
                  <p className='text-lg text-muted-foreground mb-4'>
                    Visit your chosen lab center for a quick and professional
                    sample collection. Our trained phlebotomists ensure a
                    comfortable experience with minimal wait times.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>Quick 15-minute appointment duration</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>
                        Certified and experienced healthcare professionals
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>
                        Clean, modern facilities with strict safety protocols
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className='flex flex-col md:flex-row-reverse gap-8 items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl'>
                    <FileTextIcon className='w-10 h-10 text-primary-foreground' />
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-3'>
                    <span className='px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm'>
                      STEP 4
                    </span>
                    <h2 className='text-3xl font-bold'>Receive Your Results</h2>
                  </div>
                  <p className='text-lg text-muted-foreground mb-4'>
                    Access your comprehensive test results through our secure
                    online portal. Get detailed reports with clear explanations
                    and reference ranges.
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>Results available within 24-48 hours</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>Easy-to-understand reports with visual charts</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                      <span>
                        Download and share reports with your healthcare provider
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className='py-16 md:py-24 bg-gray-50'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
                Why Choose EzLabTesting?
              </h2>
              <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                We're committed to making healthcare accessible, affordable, and
                convenient for everyone.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
              <Card>
                <CardHeader>
                  <Clock className='w-12 h-12 text-primary mb-4' />
                  <CardTitle>Fast Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Get your results within 24-48 hours through our secure
                    online portal.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className='w-12 h-12 text-primary mb-4' />
                  <CardTitle>Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Your health data is encrypted and protected with
                    industry-leading security.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className='w-12 h-12 text-primary mb-4' />
                  <CardTitle>Expert Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Certified professionals and accredited labs ensure accurate
                    results.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CreditCard className='w-12 h-12 text-primary mb-4' />
                  <CardTitle>Transparent Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    No hidden fees. See the exact cost upfront before you book.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className='py-16 md:py-24 bg-white'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='max-w-4xl mx-auto'>
              <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center'>
                Additional Features
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <MapPin className='w-8 h-8 text-primary' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold mb-2'>
                      Nationwide Network
                    </h3>
                    <p className='text-muted-foreground'>
                      Access hundreds of certified lab centers across the
                      country. Find convenient locations near your home or
                      workplace.
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <Bell className='w-8 h-8 text-primary' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold mb-2'>
                      Smart Notifications
                    </h3>
                    <p className='text-muted-foreground'>
                      Receive timely reminders for your appointments and instant
                      alerts when your results are ready.
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <Download className='w-8 h-8 text-primary' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold mb-2'>Easy Sharing</h3>
                    <p className='text-muted-foreground'>
                      Download PDF reports and share them securely with your
                      doctor or healthcare provider.
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <FileTextIcon className='w-8 h-8 text-primary' />
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold mb-2'>
                      History Tracking
                    </h3>
                    <p className='text-muted-foreground'>
                      Keep all your test results in one place and track your
                      health trends over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'>
          <div className='container mx-auto px-4 md:px-6'>
            <div className='max-w-3xl mx-auto text-center'>
              <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-6'>
                Ready to Get Started?
              </h2>
              <p className='text-xl mb-8 opacity-90'>
                Take control of your health today. Browse our tests and book
                your appointment in minutes.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link href='/tests'>
                  <Button
                    size='lg'
                    variant='secondary'
                    className='w-full sm:w-auto'
                  >
                    Browse Tests
                  </Button>
                </Link>
                <Link href='/panels'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='w-full sm:w-auto bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary'
                  >
                    View Test Panels
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <FloatingActionButton />
    </div>
  );
}
