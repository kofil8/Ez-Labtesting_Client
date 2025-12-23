// ============================================================================
// CARD UI/UX IMPROVEMENTS - QUICK START GUIDE
// ============================================================================

/**
 * This is your quick reference for using the new card system.
 * Copy-paste the imports and examples below to get started immediately.
 */

// ============================================================================
// STEP 1: IMPORT THE COMPONENTS YOU NEED
// ============================================================================

// Base card components (always available)
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";

// Specialized card types (choose what you need)
import { 
  InteractiveCard,      // For clickable items
  StatCard,            // For metrics/KPIs
  FeatureCard,         // For features
  CompactCard,         // For dense layouts
  AlertCard,           // For notifications
  FormCard             // For forms
} from "@/components/ui/card-variants";

// Layout helpers (for organizing multiple cards)
import { 
  CardGrid,            // Responsive grid
  CardList,            // Vertical/horizontal lists
  CardContainer        // Max-width wrapper
} from "@/components/ui/card-layout";

// ============================================================================
// STEP 2: CHOOSE YOUR USE CASE AND USE THE RIGHT CARD
// ============================================================================

// USE CASE 1: Test/Item Card (Clickable, Product-like)
<InteractiveCard size="md">
  <CardContent className="text-center pt-6">
    <h3 className="font-semibold mb-2">Lipid Panel</h3>
    <p className="text-sm text-gray-600 mb-4">Cholesterol screening</p>
    <p className="text-lg font-bold text-blue-600">$45.00</p>
  </CardContent>
</InteractiveCard>

// USE CASE 2: Dashboard Metric (Stat Card)
<StatCard 
  icon={<TrendingUp className="h-6 w-6" />} 
  label="Total Orders" 
  value="2,549" 
/>

// USE CASE 3: Feature Showcase (Feature Card)
<FeatureCard
  icon={<Zap className="h-6 w-6" />}
  title="Fast Results"
  description="Get results within 24 hours"
/>

// USE CASE 4: Notification/Alert (Alert Card)
<AlertCard variant="success" title="Success">
  Test completed successfully
</AlertCard>

// USE CASE 5: Form Container (Form Card)
<FormCard title="Login" description="Enter your credentials">
  {/* Your form JSX here */}
</FormCard>

// USE CASE 6: Generic Content (Base Card)
<Card variant="elevated" size="md">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>

// ============================================================================
// STEP 3: LAYOUT YOUR CARDS RESPONSIVELY
// ============================================================================

// For grids (recommended for most cases)
<CardGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</CardGrid>

// For vertical lists
<CardList layout="vertical" gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</CardList>

// For centered forms
<CardContainer maxWidth="lg">
  <FormCard>...</FormCard>
</CardContainer>

// ============================================================================
// STEP 4: CUSTOMIZE WITH PROPS
// ============================================================================

// Card Variants
<Card variant="default">Default style</Card>
<Card variant="elevated">Elevated style (featured)</Card>
<Card variant="flat">Flat style (minimal)</Card>
<Card variant="outline">Outline style (transparent)</Card>

// Card Sizes
<Card size="sm">Small card</Card>
<Card size="md">Medium card (default)</Card>
<Card size="lg">Large card (featured)</Card>

// Alert Variants
<AlertCard variant="info">Info message</AlertCard>
<AlertCard variant="success">Success message</AlertCard>
<AlertCard variant="warning">Warning message</AlertCard>
<AlertCard variant="error">Error message</AlertCard>

// ============================================================================
// COMPLETE EXAMPLE: Test Listing Page
// ============================================================================

function TestListingPage() {
  const tests = [
    { id: 1, name: "Lipid Panel", price: 45 },
    { id: 2, name: "CBC", price: 35 },
    { id: 3, name: "Thyroid", price: 55 },
  ];

  return (
    <div className="space-y-8">
      {/* Alert Banner */}
      <AlertCard variant="info" title="New Tests Available">
        We've added 5 new test options this month
      </AlertCard>

      {/* Test Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Tests</h2>
        <CardGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
          {tests.map((test) => (
            <InteractiveCard key={test.id} size="md">
              <CardContent className="text-center pt-6">
                <h3 className="font-semibold mb-2">{test.name}</h3>
                <p className="text-lg font-bold text-blue-600">${test.price}</p>
              </CardContent>
            </InteractiveCard>
          ))}
        </CardGrid>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <CardGrid columns={{ mobile: 2, tablet: 2, desktop: 4 }} gap="md">
          <StatCard icon={<Beaker />} label="Total Tests" value="245" />
          <StatCard icon={<Users />} label="Active Users" value="1,240" />
          <StatCard icon={<TrendingUp />} label="Growth" value="+12%" />
          <StatCard icon={<Activity />} label="Orders Today" value="42" />
        </CardGrid>
      </div>
    </div>
  );
}

// ============================================================================
// COMMON VARIANTS COMBINATIONS (COPY-PASTE READY)
// ============================================================================

// DEFAULT INTERACTIVE CARD (Most Common)
<InteractiveCard size="md">
  <CardContent className="text-center pt-6">
    <h3 className="font-semibold">Title</h3>
    <p className="text-sm text-gray-600">Description</p>
  </CardContent>
</InteractiveCard>

// ELEVATED CARD WITH HEADER & FOOTER
<Card variant="elevated" size="md">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <button>Action</button>
  </CardFooter>
</Card>

// FLAT CARD (Minimal Style)
<Card variant="flat" size="sm">
  <CardContent>Minimal content</CardContent>
</Card>

// OUTLINE CARD (Subtle Background)
<Card variant="outline" size="md">
  <CardContent>Outlined card</CardContent>
</Card>

// ============================================================================
// RESPONSIVE GRID CONFIGURATIONS
// ============================================================================

// 1 Column Mobile, 2 Tablet, 3 Desktop (Most Common)
<CardGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">

// 2 Columns Mobile, 2 Tablet, 4 Desktop (Dashboard Stats)
<CardGrid columns={{ mobile: 2, tablet: 2, desktop: 4 }} gap="md">

// 1 Column Mobile, 1 Tablet, 2 Desktop (Large Cards)
<CardGrid columns={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">

// ============================================================================
// SPACING OPTIONS
// ============================================================================

// Small Gap (12px) - Compact layouts
<CardGrid gap="sm">

// Medium Gap (16px) - Default, most balanced
<CardGrid gap="md">

// Large Gap (24px) - Spacious, breathing room
<CardGrid gap="lg">

// ============================================================================
// TROUBLESHOOTING
// ============================================================================

// Issue: Cards look too small
// Solution: Use size="lg" or gap="lg"
<Card size="lg">

// Issue: Cards look cramped
// Solution: Use gap="lg" or reduce columns
<CardGrid columns={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">

// Issue: Need better focus/emphasis
// Solution: Use variant="elevated"
<Card variant="elevated">

// Issue: Need subtle background
// Solution: Use variant="flat"
<Card variant="flat">

// Issue: Notification needs attention
// Solution: Use AlertCard with appropriate variant
<AlertCard variant="warning" title="Important">

// ============================================================================
// NEXT STEPS
// ============================================================================

// 1. ✅ Read CARD_UI_IMPROVEMENTS.md for full documentation
// 2. ✅ Check card-showcase.tsx for visual examples
// 3. ✅ Copy examples from card-examples.tsx
// 4. ✅ Replace existing card usage in your app
// 5. ✅ Test responsive layouts on mobile/tablet/desktop

// ============================================================================
// FILE REFERENCES
// ============================================================================

// Component Implementation
// - Base Card: components/ui/card.tsx
// - Variants: components/ui/card-variants.tsx
// - Layouts: components/ui/card-layout.tsx

// Documentation
// - CARD_UI_IMPROVEMENTS.md (Full guide)
// - card-showcase.tsx (Visual examples)
// - card-examples.tsx (Copy-paste patterns)
// - This file (Quick reference)

// ============================================================================
