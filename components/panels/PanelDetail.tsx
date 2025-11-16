"use client";

import { motion, AnimatePresence } from "framer-motion";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import testsData from "@/data/tests.json";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Package,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  Info,
  Beaker,
} from "lucide-react";
import { useState } from "react";

interface Panel {
  id: string;
  name: string;
  description: string;
  testIds: string[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
}

interface Test {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  turnaroundDays: number;
  sampleType: string;
  preparation?: string;
  labName?: string;
}

export function PanelDetail({ panel }: { panel: Panel }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  // Get tests included in the panel
  const includedTests = (testsData as any[]).filter((test) =>
    panel.testIds.includes(test.id)
  ) as Test[];

  const savingsPercentage = Math.round(
    (panel.savings / panel.originalPrice) * 100
  );

  const totalTurnaround = Math.max(...includedTests.map((t) => t.turnaroundDays), 1);

  const handleAddToCart = () => {
    // Add all tests in the bundle
    includedTests.forEach((test) => {
      for (let i = 0; i < quantity; i++) {
        addItem({
          testId: test.id,
          testName: test.name,
          price: test.price,
        });
      }
    });

    toast({
      title: "Bundle added to cart",
      description: `${panel.name} (${includedTests.length} tests) × ${quantity} has been added to your cart.`,
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
        <Link href='/panels' className='text-muted-foreground hover:text-foreground transition-colors'>
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
            <div className='h-64 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 relative overflow-hidden'>
              {/* Animated background */}
              <div className='absolute inset-0 opacity-30'>
                <svg className='w-full h-full' viewBox='0 0 400 300'>
                  <defs>
                    <pattern id='dots' width='30' height='30' patternUnits='userSpaceOnUse'>
                      <circle cx='15' cy='15' r='2' fill='white' />
                    </pattern>
                  </defs>
                  <rect width='400' height='300' fill='url(#dots)' />
                </svg>
              </div>

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
                  <div className='text-xs text-muted-foreground mb-1'>Tests</div>
                  <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                    {includedTests.length}
                  </div>
                </div>
                <div className='p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800'>
                  <div className='text-xs text-muted-foreground mb-1'>You Save</div>
                  <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                    {savingsPercentage}%
                  </div>
                </div>
                <div className='p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'>
                  <div className='text-xs text-muted-foreground mb-1'>Savings</div>
                  <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    {formatCurrency(panel.savings)}
                  </div>
                </div>
                <div className='p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'>
                  <div className='text-xs text-muted-foreground mb-1'>Turnaround</div>
                  <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                    {totalTurnaround}d
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-3 mb-6'>
              <TabsTrigger value='overview' className='flex items-center gap-2'>
                <Info className='h-4 w-4' />
                <span className='hidden sm:inline'>Overview</span>
              </TabsTrigger>
              <TabsTrigger value='tests' className='flex items-center gap-2'>
                <Beaker className='h-4 w-4' />
                <span className='hidden sm:inline'>Tests ({includedTests.length})</span>
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
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <Zap className='h-4 w-4 text-yellow-500' />
                          <span>{includedTests.length} comprehensive lab tests</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Check className='h-4 w-4 text-green-500' />
                          <span>Quality-assured lab partners</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4 text-blue-500' />
                          <span>Fast results in {totalTurnaround} business day{totalTurnaround !== 1 ? 's' : ''}</span>
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
                                    {test.name}
                                  </h4>
                                  <Badge variant='outline' className='shrink-0 text-xs'>
                                    {test.category}
                                  </Badge>
                                </div>
                                <p className='text-sm text-muted-foreground line-clamp-1'>
                                  {test.description}
                                </p>
                                <div className='flex items-center gap-4 mt-2 text-xs text-muted-foreground'>
                                  <span className='flex items-center gap-1'>
                                    <Clock className='h-3 w-3' />
                                    {test.turnaroundDays}d
                                  </span>
                                  <span className='flex items-center gap-1'>
                                    <Beaker className='h-3 w-3' />
                                    {test.sampleType}
                                  </span>
                                </div>
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
                          description: `Save ${formatCurrency(panel.savings)} ({savingsPercentage}%) compared to individual test pricing`,
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
                          description: `Get results in as little as ${totalTurnaround} business day${totalTurnaround !== 1 ? "s" : ""}`,
                          icon: "⚡",
                        },
                        {
                          title: "Secure & Confidential",
                          description: "Your health data is encrypted and protected",
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
                          <div className='text-2xl shrink-0'>{benefit.icon}</div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-semibold text-sm'>{benefit.title}</h4>
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
                    {formatCurrency(panel.originalPrice)}
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
                    <div className='flex-1 text-center font-semibold'>{quantity}</div>
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
                  <div className='font-semibold mb-1'>Sample Types</div>
                  <div className='flex flex-wrap gap-2'>
                    {Array.from(new Set(includedTests.map((t) => t.sampleType))).map(
                      (type) => (
                        <Badge key={type} variant='secondary' className='text-xs'>
                          {type}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className='font-semibold mb-2'>Preparation Required</div>
                  <ul className='space-y-1.5 text-muted-foreground'>
                    {Array.from(
                      new Set(includedTests.map((t) => t.preparation || "No preparation required"))
                    )
                      .slice(0, 3)
                      .map((prep, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0' />
                          <span className='text-xs'>{prep}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className='bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800'>
              <CardContent className='pt-6'>
                <p className='text-sm text-center mb-3'>
                  <span className='font-semibold'>✓ Questions?</span> Our health advisors are here to help
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

