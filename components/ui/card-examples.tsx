/**
 * Quick Reference Guide for Card Components
 * Copy and paste ready components for common use cases
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertCard,
  CompactCard,
  FeatureCard,
  FormCard,
  InteractiveCard,
  StatCard,
} from "@/components/ui/card-variants";

import { CardContainer, CardGrid, CardList } from "@/components/ui/card-layout";

import { Badge } from "@/components/ui/badge";

import {
  Beaker,
  CheckCircle2,
  Clock,
  Heart,
  Lock,
  ShoppingCart,
  TrendingUp,
  Zap,
} from "lucide-react";

// ============================================================================
// COMMON PATTERNS
// ============================================================================

/**
 * Test/Item Card - Perfect for test cards in grids
 */
const TestCardExample = () => {
  return (
    <Card size='md'>
      <InteractiveCard>
        <CardContent className='text-center pt-6'>
          <div className='h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3 flex items-center justify-center'>
            <Beaker className='h-6 w-6 text-blue-600' />
          </div>
          <h3 className='font-semibold mb-1'>Lipid Panel</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            Cholesterol screening
          </p>
          <p className='text-lg font-bold text-blue-600'>$45.00</p>
        </CardContent>
      </InteractiveCard>
    </Card>
  );
};

/**
 * Panel/Bundle Card - For grouped test panels
 */
const PanelCardExample = () => {
  return (
    <Card variant='elevated' size='lg'>
      <div className='h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-xl' />
      <CardHeader>
        <CardTitle>Complete Health Panel</CardTitle>
        <CardDescription>All-inclusive screening package</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2 text-sm'>
          <li className='flex items-center gap-2'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            Test 1
          </li>
          <li className='flex items-center gap-2'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            Test 2
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <p className='text-sm'>Save 20% on bundle</p>
        <p className='font-bold'>$199.00</p>
      </CardFooter>
    </Card>
  );
};

/**
 * Transaction/Order Card
 */
const TransactionCardExample = () => {
  return (
    <Card variant='flat'>
      <CardHeader>
        <CardTitle className='text-base'>Order #12345</CardTitle>
        <CardDescription>March 15, 2024</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex justify-between'>
          <span>Lipid Panel</span>
          <span className='font-medium'>$45.00</span>
        </div>
        <div className='flex justify-between border-t pt-3'>
          <span className='font-semibold'>Total</span>
          <span className='font-bold'>$45.00</span>
        </div>
      </CardContent>
      <CardFooter>
        <Badge>Completed</Badge>
      </CardFooter>
    </Card>
  );
};

/**
 * Dashboard Metrics Grid
 */
const DashboardGridExample = () => {
  const metrics = [
    { label: "Total Orders", value: "2,549", icon: ShoppingCart },
    { label: "Pending Tests", value: "47", icon: Clock },
    { label: "Completed", value: "2,502", icon: CheckCircle2 },
    { label: "Revenue", value: "$125K", icon: TrendingUp },
  ];

  return (
    <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap='md'>
      {metrics.map((metric) => (
        <StatCard
          key={metric.label}
          icon={<metric.icon className='h-6 w-6' />}
          label={metric.label}
          value={metric.value}
        />
      ))}
    </CardGrid>
  );
};

/**
 * Feature Section
 */
const FeaturesGridExample = () => {
  const features = [
    {
      icon: Zap,
      title: "Fast Results",
      description: "Get results within 24 hours",
    },
    {
      icon: Heart,
      title: "Safe Testing",
      description: "Certified lab professionals",
    },
    {
      icon: Lock,
      title: "Secure Data",
      description: "Your data is fully protected",
    },
  ];

  return (
    <CardGrid columns={{ mobile: 1, tablet: 3, desktop: 3 }} gap='lg'>
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={<feature.icon className='h-6 w-6' />}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </CardGrid>
  );
};

/**
 * Alert/Notification Section
 */
const AlertExamplesExample = () => {
  return (
    <div className='space-y-3 max-w-2xl'>
      <AlertCard variant='info' title='Info'>
        Your test results are ready for review
      </AlertCard>
      <AlertCard variant='success' title='Success'>
        Test completed successfully
      </AlertCard>
      <AlertCard variant='warning' title='Warning'>
        Please schedule your appointment soon
      </AlertCard>
      <AlertCard variant='error' title='Error'>
        Payment processing failed
      </AlertCard>
    </div>
  );
};

/**
 * Compact List
 */
const CompactListExample = () => {
  const items = ["Complete Blood Count", "Lipid Panel", "Thyroid Test"];

  return (
    <div className='space-y-2'>
      {items.map((item) => (
        <CompactCard key={item}>
          <div className='flex items-center gap-3'>
            <CheckCircle2 className='h-4 w-4 text-green-600 flex-shrink-0' />
            <span className='text-sm'>{item}</span>
          </div>
        </CompactCard>
      ))}
    </div>
  );
};

/**
 * Form Container
 */
const FormExample = () => {
  return (
    <CardContainer maxWidth='lg'>
      <FormCard
        title='Edit Profile'
        description='Update your personal information'
      >
        <form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Full Name</label>
            <input
              type='text'
              className='w-full border rounded-lg px-3 py-2 text-sm'
              placeholder='John Doe'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Email</label>
            <input
              type='email'
              className='w-full border rounded-lg px-3 py-2 text-sm'
              placeholder='john@example.com'
            />
          </div>
          <button className='w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700'>
            Save Changes
          </button>
        </form>
      </FormCard>
    </CardContainer>
  );
};

/**
 * Responsive Test Grid
 */
const TestGridExample = () => {
  const tests = [
    { id: 1, name: "Lipid Panel", price: 45 },
    { id: 2, name: "CBC", price: 35 },
    { id: 3, name: "Thyroid", price: 55 },
    { id: 4, name: "Metabolic", price: 60 },
    { id: 5, name: "STD Panel", price: 85 },
    { id: 6, name: "Hormone", price: 75 },
  ];

  return (
    <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap='md'>
      {tests.map((test) => (
        <Card key={test.id} size='md'>
          <InteractiveCard>
            <CardContent className='text-center pt-6'>
              <Beaker className='h-8 w-8 mx-auto mb-3 text-blue-600' />
              <h3 className='font-semibold'>{test.name}</h3>
              <p className='text-sm text-gray-600 mb-4'>Fast & Accurate</p>
              <p className='text-lg font-bold text-blue-600'>${test.price}</p>
            </CardContent>
          </InteractiveCard>
        </Card>
      ))}
    </CardGrid>
  );
};

/**
 * Vertical Timeline/List
 */
const TimelineListExample = () => {
  const events = [
    { date: "Mar 15", status: "Completed", description: "Order placed" },
    { date: "Mar 16", status: "In Progress", description: "Test scheduled" },
    { date: "Mar 17", status: "Pending", description: "Results processing" },
  ];

  return (
    <CardList layout='vertical' gap='md'>
      {events.map((event) => (
        <Card key={event.date} variant='flat' size='sm'>
          <CardContent className='p-4'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-xs text-gray-600 font-semibold'>
                  {event.date}
                </p>
                <p className='font-medium'>{event.description}</p>
              </div>
              <Badge>{event.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </CardList>
  );
};

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export {
  AlertExamplesExample,
  CompactListExample,
  DashboardGridExample,
  FeaturesGridExample,
  FormExample,
  PanelCardExample,
  TestCardExample,
  TestGridExample,
  TimelineListExample,
  TransactionCardExample,
};
