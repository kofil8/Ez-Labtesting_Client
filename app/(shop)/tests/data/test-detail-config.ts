/**
 * Test Detail Configuration
 * Contains reusable content for test detail pages
 */

export interface TestFeature {
  icon: string;
  title: string;
  description: string;
}

export interface TestFAQ {
  question: string;
  answer: string;
}

export interface TestTestimonial {
  initials: string;
  name: string;
  rating: number;
  text: string;
  date?: string;
}

export interface TestDetailConfig {
  features: TestFeature[];
  faqs: TestFAQ[];
  testimonials: TestTestimonial[];
  whatsIncluded: {
    icon: string;
    title: string;
    subtitle: string;
  }[];
}

/**
 * Default features for all tests
 */
const DEFAULT_FEATURES: TestFeature[] = [
  {
    icon: "⚡",
    title: "Lightning Fast Results",
    description:
      "Get your results in just 1-7 days - faster than most clinics!",
  },
  {
    icon: "🏥",
    title: "CLIA-Certified Excellence",
    description: "Processed by certified labs with highest industry standards",
  },
  {
    icon: "❤️",
    title: "Convenience You'll Love",
    description: "Simple sample collection at home or at a lab near you",
  },
  {
    icon: "👨‍⚕️",
    title: "Doctor-Level Analysis",
    description: "Results reviewed by board-certified physicians",
  },
];

/**
 * Default FAQs for all tests
 */
const DEFAULT_FAQS: TestFAQ[] = [
  {
    question: "How do I collect my sample?",
    answer:
      "You will receive a collection kit with detailed instructions. The process is simple and can be done at home or at any of our partner collection centers. Each test kit is designed for easy self-collection with step-by-step guidance.",
  },
  {
    question: "How long until I get my results?",
    answer:
      "Your results will be available within 1-7 days after your sample reaches the lab, depending on the test type. You'll receive a notification via email and SMS as soon as your results are ready. You can also check your account portal anytime.",
  },
  {
    question: "Are the results confidential?",
    answer:
      "Yes, absolutely. All test results are completely confidential and HIPAA-compliant. Only you and your designated healthcare providers will have access to your results. Your privacy is our top priority.",
  },
  {
    question: "Do I need a doctor's prescription?",
    answer:
      "No prescription is required for most tests. You can order directly online. However, we recommend consulting with a healthcare provider to understand your results and any necessary follow-up actions.",
  },
  {
    question: "Can I use insurance?",
    answer:
      "We provide detailed invoices that you can submit to your insurance company for potential reimbursement. Check with your insurance provider for coverage details specific to your plan.",
  },
];

/**
 * Default testimonials for all tests
 */
const DEFAULT_TESTIMONIALS: TestTestimonial[] = [
  {
    initials: "SM",
    name: "Sarah M.",
    rating: 5,
    text: "Got my results in 2 days instead of the usual week at my doctor's office. The report was detailed and easy to understand. Will definitely use again!",
  },
  {
    initials: "JD",
    name: "John D.",
    rating: 5,
    text: "Very convenient. Ordered online, got my kit in 2 days, and results back quickly. The entire process was smooth and professional.",
  },
  {
    initials: "EM",
    name: "Emily M.",
    rating: 5,
    text: "Amazing experience from start to finish. Fast shipping, easy collection, and accurate results. Customer service was helpful throughout.",
  },
];

/**
 * What's included in every test purchase
 */
const WHATS_INCLUDED = [
  {
    icon: "🔬",
    title: "CLIA-Certified Lab Processing",
    subtitle: "FDA-approved facilities + HIPAA protection",
  },
  {
    icon: "👨‍⚕️",
    title: "Board-Certified Physician Review",
    subtitle: "Expert analysis + health insights included",
  },
  {
    icon: "🚚",
    title: "Free Express Shipping (Both Ways)",
    subtitle: "Test kit + prepaid return label included",
  },
  {
    icon: "⚡",
    title: "Fast Results Delivery",
    subtitle: "Email + SMS + secure portal access",
  },
  {
    icon: "📞",
    title: "24/7 Customer Support",
    subtitle: "Live chat + phone support included",
  },
];

/**
 * Category-specific overrides (optional)
 */
const CATEGORY_CONFIGS: Record<string, Partial<TestDetailConfig>> = {
  cardiac: {
    features: [
      {
        icon: "❤️",
        title: "Heart Health Insight",
        description:
          "Monitor your cardiovascular health with comprehensive testing",
      },
      {
        icon: "📊",
        title: "Risk Assessment",
        description: "Identify potential cardiac risk factors early",
      },
      {
        icon: "👨‍⚕️",
        title: "Cardiologist Review",
        description: "Results reviewed by board-certified cardiologists",
      },
      {
        icon: "🏃",
        title: "Actionable Insights",
        description:
          "Receive personalized recommendations for heart health improvement",
      },
    ],
  },
  metabolic: {
    features: [
      {
        icon: "⚡",
        title: "Energy & Metabolism",
        description: "Understand your metabolic function and energy levels",
      },
      {
        icon: "🔬",
        title: "Comprehensive Analysis",
        description:
          "Detailed metabolic panel covering glucose, lipids, and more",
      },
      {
        icon: "💪",
        title: "Fitness Optimization",
        description:
          "Perfect for athletes and fitness enthusiasts tracking progress",
      },
      {
        icon: "📈",
        title: "Trend Tracking",
        description: "Monitor changes over time with integrated dashboard",
      },
    ],
  },
  thyroid: {
    features: [
      {
        icon: "🦋",
        title: "Thyroid Function",
        description: "Complete thyroid panel (TSH, T3, T4) testing",
      },
      {
        icon: "⚖️",
        title: "Balance Your Health",
        description: "Identify thyroid issues affecting energy and weight",
      },
      {
        icon: "👩‍⚕️",
        title: "Endocrinologist Insights",
        description: "Expert interpretation of results included",
      },
      {
        icon: "🎯",
        title: "Treatment Guidance",
        description: "Recommendations for medication or lifestyle adjustments",
      },
    ],
  },
};

/**
 * Get configuration for a test detail page
 * @param category - Test category name
 * @returns Configuration object with features, FAQs, testimonials, and more
 */
export const getTestDetailConfig = (category?: string): TestDetailConfig => {
  const categoryKey = category?.toLowerCase() || "";
  const categoryConfig = CATEGORY_CONFIGS[categoryKey];

  return {
    features: categoryConfig?.features || DEFAULT_FEATURES,
    faqs: categoryConfig?.faqs || DEFAULT_FAQS,
    testimonials: categoryConfig?.testimonials || DEFAULT_TESTIMONIALS,
    whatsIncluded: WHATS_INCLUDED,
  };
};

/**
 * Get urgency messaging based on stock and demand
 */
export const getUrgencyMessaging = (ordersThisMonth: number = 2847): string => {
  if (ordersThisMonth > 2000) {
    return "Popular choice - 2,847+ ordered this month";
  }
  if (ordersThisMonth > 500) {
    return "Growing in popularity - Join thousands of satisfied customers";
  }
  return "Growing demand - Order now to ensure prompt processing";
};

/**
 * Get promotional messaging (medical-context appropriate)
 */
export const getPromotionalMessaging = () => {
  return {
    mainBanner: "LIMITED TIME: Free Same-Day Processing",
    badges: [
      { icon: "✅", text: "CLIA-Certified Labs" },
      { icon: "🚚", text: "Free Express Shipping" },
    ],
    urgency: "Special pricing available - Order within 24 hours",
    guarantee:
      "100% Money-Back Guarantee - Not satisfied? Full refund within 30 days",
  };
};
