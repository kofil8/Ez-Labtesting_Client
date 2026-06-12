export const homepageTrustClaims = [
  "Most results in 24-72h after processing",
  "Secure, HIPAA-compliant account access",
  "No insurance required",
  "Built for U.S. state-by-state availability",
];

export const homepageHeroCopy = {
  eyebrow: "Built for U.S. patients",
  headline: "Lab results you can understand.",
  description:
    "Start with what you want to learn, check local availability, and order eligible lab tests with clear cash-pay pricing through authorized U.S. partner lab coverage.",
  primaryCta: "Quick Health Quiz",
  secondaryCta: "Browse Tests",
  helperText:
    "Enter your ZIP code to confirm local availability before you order.",
};

export const homepageTrustBadgeCopy = [
  {
    title: "HIPAA",
    label: "HIPAA-compliant privacy",
  },
  {
    title: "CLIA",
    label: "CLIA-certified lab processing",
  },
  {
    title: "256-bit",
    label: "Encrypted checkout",
  },
];

export const physicianTrustCopy = {
  badgeText: "Physician Reviewed",
  supportingText: "Physician involvement where required",
};

export const siteMetricsFallback = {
  testsProcessed: 50000,
  averageRating: 4.9,
  reviewCount: 120,
};

export const homepageTestimonials = [
  {
    name: "Sarah M.",
    location: "Seattle, WA",
    rating: 5,
    testName: "Thyroid wellness",
    href: "/tests?search=thyroid%20wellness",
    quote:
      "The plain-language flow helped me stop guessing and bring something concrete to my appointment.",
  },
  {
    name: "Marcus T.",
    location: "Austin, TX",
    rating: 5,
    testName: "Annual checkup",
    href: "/tests?search=annual%20cbc%20cmp%20lipid",
    quote:
      "I could compare pricing, check availability, and get results in one place without phone calls.",
  },
  {
    name: "Priya K.",
    location: "Phoenix, AZ",
    rating: 5,
    testName: "A1C tracking",
    href: "/tests?search=a1c%20glucose",
    quote:
      "The process felt private and clear, and the results gave me better questions for my clinician.",
  },
  {
    name: "Daniel R.",
    location: "Denver, CO",
    rating: 4,
    testName: "Heart markers",
    href: "/tests?search=lipid%20cholesterol",
    quote:
      "Transparent cash pricing and secure account access made it easier to follow up on routine labs.",
  },
];

export const homepageGoalCards = [
  {
    title: "I'm tired all the time",
    description:
      "Look at common markers tied to energy, thyroid, vitamins, and metabolism.",
    examples: ["TSH", "Vitamin D", "B12"],
    search: "fatigue thyroid vitamin b12 metabolic",
    icon: "sparkles",
    tone: "sky",
  },
  {
    title: "I want a yearly checkup",
    description:
      "Start with baseline labs people commonly review for routine wellness.",
    examples: ["CBC", "CMP", "Lipid"],
    search: "annual checkup cbc cmp lipid a1c",
    icon: "stethoscope",
    tone: "emerald",
  },
  {
    title: "I'm tracking A1C",
    description:
      "Compare glucose and metabolic markers often used for blood sugar trends.",
    examples: ["A1C", "Glucose", "CMP"],
    search: "diabetes a1c glucose metabolic",
    icon: "droplet",
    tone: "amber",
  },
  {
    title: "I'm checking thyroid",
    description:
      "Find thyroid markers that may help explain energy, weight, or temperature changes.",
    examples: ["TSH", "Free T4", "Free T3"],
    search: "thyroid tsh free t4 free t3",
    icon: "activity",
    tone: "blue",
  },
  {
    title: "I want heart markers",
    description:
      "Review cholesterol and inflammation markers used in heart-health screening.",
    examples: ["Lipid", "hs-CRP", "ApoB"],
    search: "heart lipid cholesterol hs-crp apob",
    icon: "heart",
    tone: "rose",
  },
  {
    title: "I'm checking hormones",
    description:
      "Explore common hormone markers for men's, women's, and general wellness.",
    examples: ["Testosterone", "Cortisol", "DHEA"],
    search: "hormone testosterone cortisol dhea",
    icon: "microscope",
    tone: "violet",
  },
];

export const homepageHowItWorksSteps = [
  {
    title: "Start with what you want to understand",
    description:
      "Choose a plain-language health goal or browse the catalog if you already know the test name.",
    icon: "search",
  },
  {
    title: "Check what's available near you",
    description:
      "State rules, ZIP coverage, partner availability, and test type are checked before checkout.",
    icon: "map",
  },
  {
    title: "Order securely",
    description:
      "Review cash-pay pricing, complete patient details, and pay through secure checkout.",
    icon: "lock",
  },
  {
    title: "Visit a partner draw center",
    description:
      "When eligible, collection instructions point you to an approved partner location.",
    icon: "building",
  },
  {
    title: "Read results in your account",
    description:
      "Results return to your secure account with marker flags and educational context when available.",
    icon: "file",
  },
];

export const homepageTestContextFallbacks = [
  {
    match: ["a1c", "glucose", "diabetes"],
    text: "Often ordered to understand blood sugar trends and metabolic health.",
  },
  {
    match: ["thyroid", "tsh", "t4", "t3"],
    text: "Often ordered when energy, weight, or thyroid function is a concern.",
  },
  {
    match: ["lipid", "cholesterol", "heart", "cardiac"],
    text: "Often ordered to review cholesterol and heart-health markers.",
  },
  {
    match: ["vitamin", "b12", "folate", "d"],
    text: "Often ordered to check nutrient markers tied to wellness and energy.",
  },
  {
    match: ["testosterone", "hormone", "cortisol", "dhea"],
    text: "Often ordered to explore hormone markers and wellness questions.",
  },
];

export const homepageDefaultTestContext =
  "Often ordered by people who want a clearer baseline before their next health conversation.";

export const homepageFinalCtaCopy = {
  eyebrow: "Take the next step",
  title: "See what is available in your ZIP code.",
  description:
    "Check coverage first, then browse eligible tests with transparent pricing before checkout.",
  chips: [
    "ACCESS active coverage",
    "State and ZIP availability checked first",
    "Secure account results",
  ],
};
