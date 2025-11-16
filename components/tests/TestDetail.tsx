"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Test } from "@/types/test";
import {
  AlertCircle,
  Award,
  Beaker,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Heart,
  Info,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TestDetailProps {
  test: Test;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    general: "🩺",
    metabolic: "⚡",
    cardiac: "❤️",
    thyroid: "🦋",
    nutrition: "🥗",
    hormone: "💊",
    std: "🔬",
  };
  return icons[category] || "🔬";
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    general: "from-blue-500/10 to-blue-600/10 border-blue-200",
    metabolic: "from-yellow-500/10 to-yellow-600/10 border-yellow-200",
    cardiac: "from-red-500/10 to-red-600/10 border-red-200",
    thyroid: "from-purple-500/10 to-purple-600/10 border-purple-200",
    nutrition: "from-green-500/10 to-green-600/10 border-green-200",
    hormone: "from-pink-500/10 to-pink-600/10 border-pink-200",
    std: "from-indigo-500/10 to-indigo-600/10 border-indigo-200",
  };
  return colors[category] || "from-gray-500/10 to-gray-600/10 border-gray-200";
};

export function TestDetail({ test }: TestDetailProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [relatedTests, setRelatedTests] = useState<Test[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Set empty related tests for now (can be populated via API later)
    setRelatedTests([]);
  }, [test.category, test.id]);

  const handleAddToCart = () => {
    addItem({
      testId: test.id,
      testName: test.name,
      price: test.price,
    });
    toast({
      title: "✓ Added to cart",
      description: `${test.name} has been added to your cart.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: test.name,
          text: test.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "✓ Link copied",
        description: "Test link copied to clipboard",
      });
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "✓ Added to wishlist",
      description: isWishlisted
        ? `${test.name} removed from your wishlist.`
        : `${test.name} added to your wishlist.`,
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "details", label: "Test Details", icon: FileText },
    { id: "preparation", label: "Preparation", icon: Zap },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "faq", label: "FAQ", icon: MessageSquare },
  ];

  const faqs = [
    {
      question: "How do I collect my sample?",
      answer: `For ${test.sampleType.toLowerCase()} samples, you will receive a collection kit with detailed instructions. The process is simple and can be done at home or at any of our partner collection centers.`,
    },
    {
      question: "How long until I get my results?",
      answer: `Your results will be available within ${test.turnaroundDays} ${
        test.turnaroundDays === 1 ? "day" : "days"
      } after your sample reaches the lab. You'll receive a notification via email and SMS.`,
    },
    {
      question: "Are the results confidential?",
      answer:
        "Yes, absolutely. All test results are completely confidential and HIPAA-compliant. Only you and your designated healthcare providers will have access to your results.",
    },
    {
      question: "Do I need a doctor's prescription?",
      answer:
        "No prescription is required for most tests. However, we recommend consulting with a healthcare provider to understand your results and any necessary follow-up actions.",
    },
    {
      question: "Can I use insurance?",
      answer:
        "We provide detailed invoices that you can submit to your insurance company for potential reimbursement. Check with your insurance provider for coverage details.",
    },
  ];

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Fast turnaround time and very accurate results. The whole process was smooth and professional.",
    },
    {
      name: "Michael Chen",
      rating: 5,
      date: "1 month ago",
      comment:
        "Great service! Results came back even faster than expected. Highly recommend!",
    },
    {
      name: "Emily Rodriguez",
      rating: 4,
      date: "1 month ago",
      comment:
        "Very convenient and easy to understand results. Would use again.",
    },
  ];

  return (
    <div className='space-y-6 sm:space-y-8 animate-in fade-in duration-500'>
      {/* Breadcrumb & Actions */}
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push("/tests")}
            className='h-auto p-0 hover:text-foreground transition-colors'
          >
            Tests
          </Button>
          <span>/</span>
          <span className='capitalize'>{test.category}</span>
          <span className='hidden sm:inline'>/</span>
          <span className='hidden sm:inline text-foreground font-medium truncate max-w-[200px]'>{test.name}</span>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleWishlist}
            className='group'
          >
            <Heart
              className={`h-3 w-3 sm:h-4 sm:w-4 transition-all ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "group-hover:text-red-500"
              }`}
            />
          </Button>
          <Button variant='outline' size='sm' onClick={handleShare}>
            <Share2 className='h-3 w-3 sm:h-4 sm:w-4' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8'>
        {/* Main Content - 8 columns */}
        <div className='md:col-span-8 space-y-6'>
            {/* Test Requirements Section */}
            {(test.sampleVolume || test.tubeType || test.collectionMethod || test.resultsTimeframe || test.ageRequirement || test.fastingRequired !== undefined) && (
              <Card className='border-2 border-primary/20 shadow-lg'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='h-5 w-5' />
                    Important Test Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {test.sampleVolume && (
                    <div className='p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'>
                      <div className='text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1'>Sample Volume</div>
                      <div className='text-sm font-medium'>{test.sampleVolume}</div>
                    </div>
                  )}
                  {test.tubeType && (
                    <div className='p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800'>
                      <div className='text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1'>Tube Type</div>
                      <div className='text-sm font-medium'>{test.tubeType}</div>
                    </div>
                  )}
                  {test.collectionMethod && (
                    <div className='p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'>
                      <div className='text-xs font-semibold text-green-700 dark:text-green-300 mb-1'>Collection</div>
                      <div className='text-sm font-medium'>{test.collectionMethod}</div>
                    </div>
                  )}
                  {test.resultsTimeframe && (
                    <div className='p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800'>
                      <div className='text-xs font-semibold text-orange-700 dark:text-orange-300 mb-1'>Results</div>
                      <div className='text-sm font-medium'>{test.resultsTimeframe}</div>
                    </div>
                  )}
                  {test.ageRequirement && (
                    <div className='p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800'>
                      <div className='text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1'>Age Requirement</div>
                      <div className='text-sm font-medium'>{test.ageRequirement}</div>
                    </div>
                  )}
                  {test.fastingRequired !== undefined && (
                    <div className={`p-3 rounded-lg border ${
                      test.fastingRequired 
                        ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                        : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    }`}>
                      <div className={`text-xs font-semibold mb-1 ${
                        test.fastingRequired
                          ? 'text-orange-700 dark:text-orange-300'
                          : 'text-green-700 dark:text-green-300'
                      }`}>
                        Fasting
                      </div>
                      <div className='text-sm font-medium'>
                        {test.fastingRequired ? `Required${test.fastingHours ? ` (${test.fastingHours}h)` : ''}` : 'Not Required'}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Purchase Card */}
            <Card className='border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative'>
              <div className='absolute -top-3 left-1/2 -translate-x-1/2 z-10'>
                <Badge className='bg-gradient-to-r from-primary to-primary/80 shadow-lg px-4 py-1'>
                  <TrendingUp className='h-3 w-3 mr-1' />
                  Most Popular
                </Badge>
              </div>

              <CardHeader className='pb-4 pt-8'>
                  <div className='flex items-baseline justify-between mb-2'>
                  <div>
                    <div className='text-xs sm:text-sm text-muted-foreground font-medium'>
                      Starting at
                    </div>
                    <div className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                      {formatCurrency(test.price)}
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      One-time payment
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-3 sm:space-y-4'>
                <Button
                  onClick={handleAddToCart}
                  className='w-full h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/90'
                  size='lg'
                >
                  <ShoppingCart className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                  Add to Cart
                </Button>

                <Button
                  variant='outline'
                  className='w-full h-10 sm:h-11 text-sm sm:text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105'
                  onClick={() => {
                    handleAddToCart();
                    router.push("/checkout");
                  }}
                >
                  <Zap className='h-3 w-3 sm:h-4 sm:w-4 mr-2' />
                  Buy Now - Fast Checkout
                </Button>

                <div className='p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'>
                  <div className='flex items-center gap-2 text-sm text-green-700 dark:text-green-300'>
                    <CheckCircle2 className='h-4 w-4 shrink-0' />
                    <span className='font-medium'>
                      In Stock - Ships within 24 hours
                    </span>
                  </div>
                </div>

                <Separator />

                <div className='space-y-3 text-sm'>
                  <div className='font-semibold mb-2'>What&apos;s Included:</div>
                  <div className='flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors'>
                    <Shield className='h-4 w-4 text-green-500 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-medium'>
                        100% Secure & Confidential
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        HIPAA-compliant data protection
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors'>
                    <Truck className='h-4 w-4 text-blue-500 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-medium'>Free Express Shipping</div>
                      <div className='text-xs text-muted-foreground'>
                        Test kit delivered to your door
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors'>
                    <Users className='h-4 w-4 text-purple-500 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-medium'>No Doctor Visit Needed</div>
                      <div className='text-xs text-muted-foreground'>
                        Order directly online
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors'>
                    <Mail className='h-4 w-4 text-orange-500 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-medium'>Fast Digital Results</div>
                      <div className='text-xs text-muted-foreground'>
                        Receive results via email & SMS
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors'>
                    <Calendar className='h-4 w-4 text-red-500 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-medium'>
                        {test.turnaroundDays}-Day Turnaround
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Quick and reliable results
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Sidebar - 4 columns */}
        <div className='md:col-span-4'>
          <div className='space-y-6'>
          {/* Product Hero */}
          <Card className='overflow-hidden border-2 hover:shadow-xl transition-all duration-300'>
            <div
              className={`bg-gradient-to-br ${getCategoryColor(
                test.category
              )} border-b p-12 flex items-center justify-center relative overflow-hidden`}
            >
              <div className='absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]' />
              <div className='text-8xl animate-in zoom-in duration-700 relative z-10'>
                {getCategoryIcon(test.category)}
              </div>
              <Badge
                variant='secondary'
                className='absolute top-4 right-4 text-sm px-3 py-1 shadow-lg backdrop-blur-sm'
              >
                <Award className='h-3 w-3 mr-1' />
                Lab Certified
              </Badge>
              <Badge
                variant='default'
                className='absolute top-4 left-4 text-sm px-3 py-1 shadow-lg'
              >
                <TrendingUp className='h-3 w-3 mr-1' />
                Popular
              </Badge>
            </div>

              <CardHeader className='space-y-3 sm:space-y-4'>
              <div className='flex items-start justify-between gap-4'>
                <div className='space-y-2 sm:space-y-3 flex-1'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <Badge variant='outline' className='capitalize font-medium text-xs sm:text-sm'>
                      {test.category}
                    </Badge>
                    <Badge variant='secondary' className='font-medium text-xs sm:text-sm'>
                      {test.labName}
                    </Badge>
                    <div className='flex items-center gap-1 text-xs sm:text-sm'>
                      <Star className='h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400' />
                      <span className='font-semibold'>4.9</span>
                      <span className='text-muted-foreground hidden sm:inline'>
                        (247 reviews)
                      </span>
                    </div>
                  </div>
                  <CardTitle className='text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                    {test.name}
                  </CardTitle>
                  <CardDescription className='text-sm sm:text-base leading-relaxed'>
                    {test.description}
                  </CardDescription>
                </div>
              </div>

              {/* Quick Stats */}
              <div className='grid grid-cols-3 gap-2 sm:gap-4 pt-4'>
                <div className='group text-center p-2 sm:p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-2 border-blue-200/50 dark:border-blue-800/50 hover:scale-105 transition-all cursor-default'>
                  <Clock className='h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-blue-600 dark:text-blue-400 group-hover:animate-spin' />
                  <div className='text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100'>
                    {test.turnaroundDays}
                  </div>
                  <div className='text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 font-medium'>
                    Days
                  </div>
                </div>
                <div className='group text-center p-2 sm:p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-2 border-purple-200/50 dark:border-purple-800/50 hover:scale-105 transition-all cursor-default'>
                  <Beaker className='h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-purple-600 dark:text-purple-400 group-hover:animate-bounce' />
                  <div className='text-xs sm:text-sm font-bold text-purple-900 dark:text-purple-100'>
                    {test.sampleType}
                  </div>
                  <div className='text-[10px] sm:text-xs text-purple-700 dark:text-purple-300 font-medium'>
                    Sample
                  </div>
                </div>
                <div className='group text-center p-2 sm:p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-2 border-amber-200/50 dark:border-amber-800/50 hover:scale-105 transition-all cursor-default'>
                  <Star className='h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform' />
                  <div className='text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-100'>
                    4.9
                  </div>
                  <div className='text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 font-medium'>
                    Rating
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Card className='overflow-hidden'>
            <CardHeader className='pb-0'>
              <div className='flex gap-1 border-b overflow-x-auto'>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex items-center gap-2 pb-3 px-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 transition-transform ${
                          activeTab === tab.id
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      />
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in slide-in-from-left duration-300' />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              {activeTab === "overview" && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
                      <Info className='h-5 w-5 text-primary' />
                      What This Test Measures
                    </h3>
                    <p className='text-muted-foreground leading-relaxed'>
                      {test.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='text-lg font-semibold mb-4'>Key Benefits</h3>
                    <div className='grid sm:grid-cols-2 gap-3'>
                      <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/30'>
                        <CheckCircle2 className='h-5 w-5 text-green-500 shrink-0 mt-0.5' />
                        <div>
                          <div className='font-medium'>Fast Results</div>
                          <div className='text-sm text-muted-foreground'>
                            Get your results in {test.turnaroundDays}{" "}
                            {test.turnaroundDays === 1 ? "day" : "days"}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/30'>
                        <CheckCircle2 className='h-5 w-5 text-green-500 shrink-0 mt-0.5' />
                        <div>
                          <div className='font-medium'>Certified Lab</div>
                          <div className='text-sm text-muted-foreground'>
                            Processed by {test.labName}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/30'>
                        <CheckCircle2 className='h-5 w-5 text-green-500 shrink-0 mt-0.5' />
                        <div>
                          <div className='font-medium'>
                            Easy Sample Collection
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            Simple {test.sampleType.toLowerCase()} sample
                          </div>
                        </div>
                      </div>
                      <div className='flex items-start gap-3 p-3 rounded-lg bg-muted/30'>
                        <CheckCircle2 className='h-5 w-5 text-green-500 shrink-0 mt-0.5' />
                        <div>
                          <div className='font-medium'>Doctor Reviewed</div>
                          <div className='text-sm text-muted-foreground'>
                            Results reviewed by physicians
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold mb-4'>
                      Test Details
                    </h3>
                    <dl className='grid sm:grid-cols-2 gap-4'>
                      {test.sampleVolume && (
                        <div className='p-4 rounded-lg border bg-card'>
                          <dt className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                            <Beaker className='h-4 w-4' />
                            Sample Type
                          </dt>
                          <dd className='font-semibold text-lg'>
                            {test.sampleVolume}
                          </dd>
                        </div>
                      )}
                      {test.tubeType && (
                        <div className='p-4 rounded-lg border bg-card'>
                          <dt className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                            <Beaker className='h-4 w-4' />
                            Tube Type
                          </dt>
                          <dd className='font-semibold text-lg'>
                            {test.tubeType}
                          </dd>
                        </div>
                      )}
                      {test.collectionMethod && (
                        <div className='p-4 rounded-lg border bg-card'>
                          <dt className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                            <Calendar className='h-4 w-4' />
                            Collection Method
                          </dt>
                          <dd className='font-semibold text-lg'>
                            {test.collectionMethod}
                          </dd>
                        </div>
                      )}
                      {test.resultsTimeframe && (
                        <div className='p-4 rounded-lg border bg-card'>
                          <dt className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                            <Clock className='h-4 w-4' />
                            Results
                          </dt>
                          <dd className='font-semibold text-lg'>
                            {test.resultsTimeframe}
                          </dd>
                        </div>
                      )}
                      {test.ageRequirement && (
                        <div className='p-4 rounded-lg border bg-card'>
                          <dt className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                            <Users className='h-4 w-4' />
                            Age
                          </dt>
                          <dd className='font-semibold text-lg'>
                            {test.ageRequirement}
                          </dd>
                        </div>
                      )}
                      {test.fastingRequired !== undefined && (
                        <div className='p-4 rounded-lg border bg-card'>
                          <dt className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
                            <AlertCircle className='h-4 w-4' />
                            Fasting Required
                          </dt>
                          <dd className='font-semibold text-lg'>
                            {test.fastingRequired ? (
                              <span className='text-orange-600 dark:text-orange-400'>
                                Yes{test.fastingHours ? ` (${test.fastingHours} hours)` : ""}
                              </span>
                            ) : (
                              <span className='text-green-600 dark:text-green-400'>No</span>
                            )}
                          </dd>
                        </div>
                      )}
                      <div className='p-4 rounded-lg border bg-card'>
                        <dt className='text-sm text-muted-foreground mb-1'>
                          Sample Type
                        </dt>
                        <dd className='font-semibold text-lg'>
                          {test.sampleType}
                        </dd>
                      </div>
                      <div className='p-4 rounded-lg border bg-card'>
                        <dt className='text-sm text-muted-foreground mb-1'>
                          Turnaround Time
                        </dt>
                        <dd className='font-semibold text-lg'>
                          {test.turnaroundDays}{" "}
                          {test.turnaroundDays === 1 ? "day" : "days"}
                        </dd>
                      </div>
                      <div className='p-4 rounded-lg border bg-card'>
                        <dt className='text-sm text-muted-foreground mb-1'>
                          Laboratory
                        </dt>
                        <dd className='font-semibold text-lg'>
                          {test.labName}
                        </dd>
                      </div>
                      <div className='p-4 rounded-lg border bg-card'>
                        <dt className='text-sm text-muted-foreground mb-1'>
                          Lab Code
                        </dt>
                        <dd className='font-semibold text-lg'>
                          {test.labCode}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <Separator />

                  <div>
                    <h3 className='text-lg font-semibold mb-3'>CPT Codes</h3>
                    <div className='flex flex-wrap gap-2'>
                      {test.cptCodes.map((code) => (
                        <Badge
                          key={code}
                          variant='outline'
                          className='text-sm px-3 py-1'
                        >
                          {code}
                        </Badge>
                      ))}
                    </div>
                    <p className='text-sm text-muted-foreground mt-3'>
                      CPT codes are used for medical billing and insurance
                      purposes.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "preparation" && (
                <div className='space-y-6 animate-in fade-in duration-300'>
                  {test.fastingRequired !== undefined && (
                    <div className={`p-6 rounded-lg border-2 ${
                      test.fastingRequired 
                        ? "border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20"
                        : "border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20"
                    }`}>
                      <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
                        <AlertCircle className={`h-5 w-5 ${
                          test.fastingRequired ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
                        }`} />
                        Fasting Requirements
                      </h3>
                      <p className='text-base leading-relaxed font-medium'>
                        {test.fastingRequired ? (
                          <>
                            <span className='text-orange-700 dark:text-orange-300'>
                              Fasting is required for this test.
                            </span>
                            {test.fastingHours && (
                              <span className='block mt-2 text-sm text-orange-600 dark:text-orange-400'>
                                Please fast for {test.fastingHours} hours before your test. Only water is allowed during the fasting period.
                              </span>
                            )}
                          </>
                        ) : (
                          <span className='text-green-700 dark:text-green-300'>
                            No fasting required. You can eat and drink normally before this test.
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  <div className='p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10'>
                    <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
                      <Zap className='h-5 w-5 text-primary' />
                      Preparation Instructions
                    </h3>
                    <p className='text-base leading-relaxed'>
                      {test.preparation ||
                        "No special preparation needed for this test."}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-lg font-semibold mb-4'>
                      General Guidelines
                    </h3>
                    <ul className='space-y-3'>
                      <li className='flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors'>
                        <div className='h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 text-primary-foreground font-bold'>
                          1
                        </div>
                        <div className='flex-1'>
                          <div className='font-semibold'>Stay Hydrated</div>
                          <div className='text-sm text-muted-foreground'>
                            Drink plenty of water before your test to ensure
                            accurate results
                          </div>
                        </div>
                      </li>
                      <li className='flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors'>
                        <div className='h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 text-primary-foreground font-bold'>
                          2
                        </div>
                        <div className='flex-1'>
                          <div className='font-semibold'>
                            Follow Specific Instructions
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {test.preparation ||
                              "Follow the instructions provided with your test kit"}
                          </div>
                        </div>
                      </li>
                      <li className='flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors'>
                        <div className='h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 text-primary-foreground font-bold'>
                          3
                        </div>
                        <div className='flex-1'>
                          <div className='font-semibold'>Bring Valid ID</div>
                          <div className='text-sm text-muted-foreground'>
                            Government-issued photo ID required at collection
                            center
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className='space-y-6 animate-in fade-in duration-300'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h3 className='text-lg font-semibold'>
                        Customer Reviews
                      </h3>
                      <div className='flex items-center gap-2 mt-1'>
                        <div className='flex'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className='h-4 w-4 fill-yellow-400 text-yellow-400'
                            />
                          ))}
                        </div>
                        <span className='text-sm text-muted-foreground'>
                          4.9 out of 5 (247 reviews)
                        </span>
                      </div>
                    </div>
                    <Button variant='outline' size='sm'>
                      <MessageSquare className='h-4 w-4 mr-2' />
                      Write Review
                    </Button>
                  </div>

                  <div className='space-y-4'>
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className='p-4 rounded-lg border bg-card hover:shadow-md transition-all'
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div>
                            <div className='font-semibold'>{review.name}</div>
                            <div className='flex items-center gap-2 mt-1'>
                              <div className='flex'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className='text-xs text-muted-foreground'>
                                {review.date}
                              </span>
                            </div>
                          </div>
                          <Badge variant='secondary' className='text-xs'>
                            Verified Purchase
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground leading-relaxed'>
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button variant='outline' className='w-full'>
                    Load More Reviews
                  </Button>
                </div>
              )}

              {activeTab === "faq" && (
                <div className='space-y-4 animate-in fade-in duration-300'>
                  <div className='mb-4'>
                    <h3 className='text-lg font-semibold'>
                      Frequently Asked Questions
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      Find answers to common questions about this test
                    </p>
                  </div>

                  <div className='space-y-2'>
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className='border rounded-lg overflow-hidden hover:border-primary/50 transition-colors'
                      >
                        <button
                          onClick={() =>
                            setExpandedFaq(expandedFaq === index ? null : index)
                          }
                          className='w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors'
                        >
                          <span className='font-semibold pr-4'>
                            {faq.question}
                          </span>
                          {expandedFaq === index ? (
                            <ChevronUp className='h-5 w-5 shrink-0 text-primary' />
                          ) : (
                            <ChevronDown className='h-5 w-5 shrink-0 text-muted-foreground' />
                          )}
                        </button>
                        {expandedFaq === index && (
                          <div className='px-4 pb-4 text-sm text-muted-foreground leading-relaxed animate-in slide-in-from-top duration-200'>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className='mt-6 p-4 rounded-lg bg-muted/50 border'>
                    <div className='flex items-start gap-3'>
                      <AlertCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                      <div>
                        <div className='font-semibold text-sm mb-1'>
                          Still have questions?
                        </div>
                        <p className='text-sm text-muted-foreground mb-3'>
                          Our support team is here to help you with any
                          questions about this test.
                        </p>
                        <Button variant='outline' size='sm'>
                          <Phone className='h-4 w-4 mr-2' />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Tests */}
          {relatedTests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Tests</CardTitle>
                <CardDescription>
                  Other tests you might be interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid sm:grid-cols-3 gap-4'>
                  {relatedTests.map((relatedTest) => (
                    <Link
                      key={relatedTest.id}
                      href={`/tests/${relatedTest.id}`}
                      className='group'
                    >
                      <Card className='h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50'>
                        <CardHeader className='pb-3'>
                          <div className='text-4xl mb-2'>
                            {getCategoryIcon(relatedTest.category)}
                          </div>
                          <CardTitle className='text-base group-hover:text-primary transition-colors'>
                            {relatedTest.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className='pt-0'>
                          <div className='flex items-center justify-between'>
                            <span className='text-lg font-bold'>
                              {formatCurrency(relatedTest.price)}
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              {relatedTest.turnaroundDays}d
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>

      </div>
    </div>
  );
}
