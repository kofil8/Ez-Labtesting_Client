"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hook/use-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Panel } from "@/types/panel";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Beaker,
  Check,
  Clock,
  Heart,
  Info,
  Package,
  Share2,
  ShoppingCart,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PanelDetail({ panel }: { panel: Panel }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const router = useRouter();

  // Calculate savings percentage from discount percent
  const savingsAmount = panel.basePrice - panel.bundlePrice;
  const savingsPercentage = panel.discountPercent;

  // Get tests from panel.tests array
  const includedTests = panel.tests;

  // Get max turnaround days (use a default if test data not available)
  const totalTurnaround = 5; // Default value, would need test details for actual calculation

  const handleAddToCart = () => {
    addItem({
      id: `panel-${panel.id}`,
      itemType: "PANEL",
      name: panel.name,
      price: panel.bundlePrice,
      panelId: panel.id,
      testIds: includedTests.map((t) => t.id),
    });

    toast({
      title: "Panel added to cart",
      description: `${panel.name} has been added to your cart.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: panel.name,
          text: panel.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    }
  };

  return (
    <div className='space-y-8'>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='flex items-center gap-2 text-sm'
      >
        <Link
          href='/panels'
          className='text-muted-foreground hover:text-foreground transition-colors'
        >
          Test Panels
        </Link>
        <span className='text-muted-foreground'>/</span>
        <span className='font-semibold text-foreground'>{panel.name}</span>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='grid grid-cols-1 lg:grid-cols-3 gap-8'
      >
        {/* Left Column - Summary Card */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Hero Card */}
          <Card className='border-2 overflow-hidden'>
            <div className='h-64 relative overflow-hidden'>
              {panel.panelImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={panel.panelImage}
                    alt={panel.name}
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-black/40' />
                </>
              ) : (
                <>
                  <div className='absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500' />
                  <div className='absolute inset-0 opacity-30'>
                    <svg className='w-full h-full' viewBox='0 0 400 300'>
                      <defs>
                        <pattern
                          id='dots'
                          width='30'
                          height='30'
                          patternUnits='userSpaceOnUse'
                        >
                          <circle cx='15' cy='15' r='2' fill='white' />
                        </pattern>
                      </defs>
                      <rect width='400' height='300' fill='url(#dots)' />
                    </svg>
                  </div>
                </>
              )}

              {/* Content */}
              <div className='absolute inset-0 flex flex-col justify-end p-6'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
                      {panel.name}
                    </h1>
                    <p className='text-blue-100 text-sm sm:text-base'>
                      {panel.description}
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Badge className='bg-white text-purple-600 border-0 shadow-lg px-4 py-2 text-base font-bold whitespace-nowrap'>
                      Save {savingsPercentage}%
                    </Badge>
                  </motion.div>
                </div>
              </div>
            </div>

            <CardContent className='p-6 space-y-4'>
              {/* Quick Stats */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                <div className='p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'>
                  <div className='text-xs text-muted-foreground mb-1'>
                    Tests
                  </div>
                  <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                    {includedTests.length}
                  </div>
                </div>
                <div className='p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800'>
                  <div className='text-xs text-muted-foreground mb-1'>
                    You Save
                  </div>
                  <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                    {savingsPercentage}%
                  </div>
                </div>
                <div className='p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'>
                  <div className='text-xs text-muted-foreground mb-1'>
                    Savings
                  </div>
                  <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    {formatCurrency(savingsAmount)}
                  </div>
                </div>
                <div className='p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'>
                  <div className='text-xs text-muted-foreground mb-1'>
                    Turnaround
                  </div>
                  <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                    {totalTurnaround}d
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3 mb-6'>
              <TabsTrigger value='overview' className='flex items-center gap-2'>
                <Info className='h-4 w-4' />
                <span className='hidden sm:inline'>Overview</span>
              </TabsTrigger>
              <TabsTrigger value='tests' className='flex items-center gap-2'>
                <Beaker className='h-4 w-4' />
                <span className='hidden sm:inline'>
                  Tests ({includedTests.length})
                </span>
              </TabsTrigger>
              <TabsTrigger value='benefits' className='flex items-center gap-2'>
                <Zap className='h-4 w-4' />
                <span className='hidden sm:inline'>Benefits</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value='overview' className='space-y-4'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key='overview'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Package className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                        What&apos;s Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <Zap className='h-4 w-4 text-yellow-500' />
                          <span>
                            {includedTests.length} comprehensive lab tests
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Check className='h-4 w-4 text-green-500' />
                          <span>Quality-assured lab partners</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4 text-blue-500' />
                          <span>Fast results in 2-5 business day s</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <ShoppingCart className='h-4 w-4 text-purple-500' />
                          <span>Flexible payment options</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* Tests Tab */}
            <TabsContent value='tests' className='space-y-4'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key='tests'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='space-y-3'
                >
                  {includedTests.map((test, index) => (
                    <Link key={test.id} href={`/tests/${test.id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className='group hover:shadow-md transition-all cursor-pointer hover:border-purple-300 dark:hover:border-purple-700'>
                          <CardContent className='p-4'>
                            <div className='flex items-start justify-between gap-4'>
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 mb-1'>
                                  <h4 className='font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1'>
                                    {test.testName}
                                  </h4>
                                  <Badge
                                    variant='outline'
                                    className='shrink-0 text-xs'
                                  >
                                    {test.testCode}
                                  </Badge>
                                </div>
                                <p className='text-sm text-muted-foreground line-clamp-1'>
                                  Included in this panel
                                </p>
                              </div>
                              <div className='text-right shrink-0'>
                                <div className='font-semibold'>
                                  {formatCurrency(test.price)}
                                </div>
                                <ArrowRight className='h-4 w-4 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors' />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value='benefits' className='space-y-4'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key='benefits'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Zap className='h-5 w-5 text-yellow-500' />
                        Why Choose This Panel?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {[
                        {
                          title: "Comprehensive Health Screening",
                          description: `Get ${includedTests.length} important health tests in one convenient package`,
                          icon: "📋",
                        },
                        {
                          title: "Maximum Savings",
                          description: `Save ${formatCurrency(
                            savingsAmount,
                          )} (${savingsPercentage}%) compared to individual test pricing`,
                          icon: "💰",
                        },
                        {
                          title: "Expert Lab Partners",
                          description:
                            "Tests processed by CLIA-certified, accredited laboratories",
                          icon: "✅",
                        },
                        {
                          title: "Fast Results",
                          description: `Get results in as little as ${totalTurnaround} business day${
                            Number(totalTurnaround) !== 1 ? "s" : ""
                          }`,
                          icon: "⚡",
                        },
                        {
                          title: "Secure & Confidential",
                          description:
                            "Your health data is encrypted and protected",
                          icon: "🔒",
                        },
                        {
                          title: "Easy Ordering",
                          description:
                            "Simple online ordering with sample collection at home or nearby location",
                          icon: "🎯",
                        },
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className='flex gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'
                        >
                          <div className='text-2xl shrink-0'>
                            {benefit.icon}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-semibold text-sm'>
                              {benefit.title}
                            </h4>
                            <p className='text-sm text-muted-foreground'>
                              {benefit.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='lg:col-span-1'
        >
          <div className='sticky top-20 space-y-4'>
            {/* Pricing Card */}
            <Card className='border-2 border-gradient-cosmic'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-2xl font-bold'>
                  {formatCurrency(panel.bundlePrice)}
                </CardTitle>
                <CardDescription>
                  <span className='line-through text-muted-foreground'>
                    {formatCurrency(panel.basePrice)}
                  </span>
                </CardDescription>
              </CardHeader>

              <Separator />

              <CardContent className='pt-4 space-y-3'>
                {/* Quantity Selector */}
                <div className='space-y-2'>
                  <label className='text-sm font-semibold'>Quantity</label>
                  <div className='flex items-center border rounded-lg'>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='px-3 py-2 hover:bg-muted transition-colors'
                    >
                      −
                    </button>
                    <div className='flex-1 text-center font-semibold'>
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className='px-3 py-2 hover:bg-muted transition-colors'
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className='flex justify-between pt-2 border-t'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-semibold'>
                    {formatCurrency(panel.bundlePrice * quantity)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className='flex-col gap-3 pt-4'>
                <Button
                  onClick={handleAddToCart}
                  className='w-full gradient-blue-purple text-base font-semibold'
                  size='lg'
                >
                  <ShoppingCart className='h-5 w-5 mr-2' />
                  Add to Cart
                </Button>

                <Button
                  onClick={() => router.push("/cart")}
                  variant='outline'
                  className='w-full text-base font-semibold'
                  size='lg'
                >
                  <ArrowRight className='h-5 w-5 mr-2' />
                  Go to Cart
                </Button>

                <div className='flex gap-2'>
                  <Button
                    onClick={() => setIsFavorite(!isFavorite)}
                    variant={isFavorite ? "default" : "outline"}
                    size='lg'
                    className='flex-1'
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant='outline'
                    size='lg'
                    className='flex-1'
                  >
                    <Share2 className='h-5 w-5' />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Important Info</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <div>
                  <div className='font-semibold mb-1'>Included Tests</div>
                  <div className='flex flex-wrap gap-2'>
                    {includedTests.slice(0, 5).map((t) => (
                      <Badge key={t.id} variant='secondary' className='text-xs'>
                        {t.testCode}
                      </Badge>
                    ))}
                    {includedTests.length > 5 && (
                      <Badge variant='secondary' className='text-xs'>
                        +{includedTests.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className='font-semibold mb-2'>Quick Facts</div>
                  <ul className='space-y-1.5 text-muted-foreground'>
                    <li className='flex items-start gap-2'>
                      <span className='mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0' />
                      <span className='text-xs'>
                        Fast and convenient collection
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0' />
                      <span className='text-xs'>
                        Results typically within 2-5 business days
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className='bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800'>
              <CardContent className='pt-6'>
                <p className='text-sm text-center mb-3'>
                  <span className='font-semibold'>✓ Questions?</span> Our health
                  advisors are here to help
                </p>
                <Button variant='outline' className='w-full' asChild>
                  <a href='#contact'>Contact Us</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
