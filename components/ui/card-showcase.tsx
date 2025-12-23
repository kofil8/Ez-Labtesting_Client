/**
 * Card Component Examples & Showcase
 *
 * This file demonstrates all available card components and their usage patterns.
 * Use this as a reference for implementing cards throughout the application.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardContainer, CardGrid, CardList } from "@/components/ui/card-layout";
import {
  AlertCard,
  CompactCard,
  FeatureCard,
  FormCard,
  InteractiveCard,
  StatCard,
} from "@/components/ui/card-variants";
import { Activity, CheckCircle2, Heart, Zap } from "lucide-react";

/**
 * Showcase all card variants and their use cases
 */
export function CardShowcase() {
  return (
    <div className='space-y-12 p-8'>
      {/* Section 1: Base Card Variants */}
      <section>
        <h2 className='text-2xl font-bold mb-6'>Card Variants</h2>
        <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap='md'>
          <Card variant='default'>
            <CardHeader>
              <CardTitle>Default</CardTitle>
              <CardDescription>Blue border with shadow</CardDescription>
            </CardHeader>
            <CardContent>Standard card with border</CardContent>
          </Card>

          <Card variant='elevated'>
            <CardHeader>
              <CardTitle>Elevated</CardTitle>
              <CardDescription>No border, strong shadow</CardDescription>
            </CardHeader>
            <CardContent>Featured content</CardContent>
          </Card>

          <Card variant='flat'>
            <CardHeader>
              <CardTitle>Flat</CardTitle>
              <CardDescription>Gray background</CardDescription>
            </CardHeader>
            <CardContent>Minimal styling</CardContent>
          </Card>

          <Card variant='outline'>
            <CardHeader>
              <CardTitle>Outline</CardTitle>
              <CardDescription>Transparent background</CardDescription>
            </CardHeader>
            <CardContent>Just the outline</CardContent>
          </Card>
        </CardGrid>
      </section>

      {/* Section 2: Card Sizes */}
      <section>
        <h2 className='text-2xl font-bold mb-6'>Card Sizes</h2>
        <CardGrid columns={{ mobile: 1, tablet: 1, desktop: 3 }} gap='md'>
          <Card size='sm' variant='elevated'>
            <CardHeader>
              <CardTitle className='text-base'>Small</CardTitle>
            </CardHeader>
            <CardContent className='text-sm'>Minimal height</CardContent>
          </Card>

          <Card size='md' variant='elevated'>
            <CardHeader>
              <CardTitle>Medium</CardTitle>
            </CardHeader>
            <CardContent>200px minimum height</CardContent>
          </Card>

          <Card size='lg' variant='elevated'>
            <CardHeader>
              <CardTitle>Large</CardTitle>
            </CardHeader>
            <CardContent>
              300px minimum height - good for featured content
            </CardContent>
          </Card>
        </CardGrid>
      </section>

      {/* Section 3: Specialized Cards */}
      <section>
        <h2 className='text-2xl font-bold mb-6'>Specialized Card Components</h2>

        <div className='space-y-6'>
          {/* Interactive Cards */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Interactive Cards</h3>
            <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap='md'>
              <InteractiveCard>
                <CardContent className='text-center pt-6'>
                  <Heart className='h-8 w-8 mx-auto mb-2 text-red-500' />
                  <h3 className='font-semibold'>Cardiac Tests</h3>
                  <p className='text-sm text-gray-600'>
                    Heart health screening
                  </p>
                </CardContent>
              </InteractiveCard>

              <InteractiveCard>
                <CardContent className='text-center pt-6'>
                  <Activity className='h-8 w-8 mx-auto mb-2 text-blue-500' />
                  <h3 className='font-semibold'>General Tests</h3>
                  <p className='text-sm text-gray-600'>
                    Comprehensive screening
                  </p>
                </CardContent>
              </InteractiveCard>

              <InteractiveCard>
                <CardContent className='text-center pt-6'>
                  <Zap className='h-8 w-8 mx-auto mb-2 text-yellow-500' />
                  <h3 className='font-semibold'>Quick Tests</h3>
                  <p className='text-sm text-gray-600'>Fast results</p>
                </CardContent>
              </InteractiveCard>
            </CardGrid>
          </div>

          {/* Stat Cards */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>
              Stat Cards (Dashboard)
            </h3>
            <CardGrid columns={{ mobile: 2, tablet: 2, desktop: 4 }} gap='md'>
              <StatCard
                icon={<Activity className='h-6 w-6' />}
                label='Total Tests'
                value='2,549'
              />
              <StatCard
                icon={<Heart className='h-6 w-6' />}
                label='Active Users'
                value='1,847'
              />
              <StatCard
                icon={<CheckCircle2 className='h-6 w-6' />}
                label='Completed'
                value='890'
              />
              <StatCard
                icon={<Zap className='h-6 w-6' />}
                label='This Week'
                value='342'
              />
            </CardGrid>
          </div>

          {/* Feature Cards */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Feature Cards</h3>
            <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap='md'>
              <FeatureCard
                icon={<Heart className='h-6 w-6' />}
                title='Easy to Use'
                description='Simple interface for quick test ordering'
              />
              <FeatureCard
                icon={<Zap className='h-6 w-6' />}
                title='Fast Results'
                description='Get your test results within 24 hours'
              />
              <FeatureCard
                icon={<CheckCircle2 className='h-6 w-6' />}
                title='Certified Labs'
                description='All tests performed by certified professionals'
              />
            </CardGrid>
          </div>

          {/* Compact Cards */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Compact Cards</h3>
            <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap='sm'>
              <CompactCard>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-600' />
                  <span className='text-sm'>Item 1</span>
                </div>
              </CompactCard>
              <CompactCard>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-600' />
                  <span className='text-sm'>Item 2</span>
                </div>
              </CompactCard>
              <CompactCard>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-600' />
                  <span className='text-sm'>Item 3</span>
                </div>
              </CompactCard>
              <CompactCard>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-600' />
                  <span className='text-sm'>Item 4</span>
                </div>
              </CompactCard>
            </CardGrid>
          </div>

          {/* Alert Cards */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Alert Cards</h3>
            <div className='space-y-3'>
              <AlertCard variant='info' title='Information'>
                This is an informational message. Use this for general updates.
              </AlertCard>
              <AlertCard variant='success' title='Success'>
                Operation completed successfully!
              </AlertCard>
              <AlertCard variant='warning' title='Warning'>
                Please review these terms and conditions before proceeding.
              </AlertCard>
              <AlertCard variant='error' title='Error'>
                An unexpected error occurred. Please try again.
              </AlertCard>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Form Card */}
      <section>
        <h2 className='text-2xl font-bold mb-6'>Form Card Example</h2>
        <CardContainer maxWidth='lg'>
          <FormCard
            title='Login Form'
            description='Enter your credentials to continue'
          >
            <form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Email</label>
                <input
                  type='email'
                  className='w-full border rounded-lg px-3 py-2 text-sm'
                  placeholder='user@example.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Password
                </label>
                <input
                  type='password'
                  className='w-full border rounded-lg px-3 py-2 text-sm'
                  placeholder='••••••••'
                />
              </div>
              <button className='w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700'>
                Sign In
              </button>
            </form>
          </FormCard>
        </CardContainer>
      </section>

      {/* Section 5: Card Lists */}
      <section>
        <h2 className='text-2xl font-bold mb-6'>Card List Layouts</h2>

        <div className='grid grid-cols-2 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Vertical Stack</h3>
            <CardList layout='vertical' gap='md'>
              <Card variant='flat'>
                <CardHeader>
                  <CardTitle className='text-base'>Item 1</CardTitle>
                </CardHeader>
              </Card>
              <Card variant='flat'>
                <CardHeader>
                  <CardTitle className='text-base'>Item 2</CardTitle>
                </CardHeader>
              </Card>
              <Card variant='flat'>
                <CardHeader>
                  <CardTitle className='text-base'>Item 3</CardTitle>
                </CardHeader>
              </Card>
            </CardList>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4'>Horizontal Wrap</h3>
            <CardList layout='horizontal' gap='md'>
              <CompactCard className='flex-1 min-w-[120px]'>
                <div className='text-center'>
                  <p className='font-semibold'>Option 1</p>
                </div>
              </CompactCard>
              <CompactCard className='flex-1 min-w-[120px]'>
                <div className='text-center'>
                  <p className='font-semibold'>Option 2</p>
                </div>
              </CompactCard>
              <CompactCard className='flex-1 min-w-[120px]'>
                <div className='text-center'>
                  <p className='font-semibold'>Option 3</p>
                </div>
              </CompactCard>
            </CardList>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CardShowcase;
