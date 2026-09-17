export const homepageTrustClaims = [
  "Physician Order Included Automatically",
  "CLIA-Certified & Accredited Labs",
  "No Doctor Visit or Insurance Needed",
  "Private Results Delivered in 24-72h",
];

export const homepageHeroCopy = {
  eyebrow: "Confidential Clinical Lab Testing • USA",
  headline: "Doctor-Approved Lab Tests. On Your Own Terms.",
  description:
    "Skip the waiting rooms and surprise medical bills. Order 100% confidential blood tests online with a physician's order included, visit an authorized local lab near you, and view secure results in 24–72 hours.",
  primaryCta: "Find Tests by Symptoms",
  secondaryCta: "Browse 500+ Tests",
  helperText:
    "Enter your ZIP code to find nearby certified draw locations (Quest, Labcorp & ACCESS networks).",
};

export const homepageTrustBadgeCopy = [
  {
    title: "CLIA & CAP",
    label: "Certified laboratory partners",
  },
  {
    title: "Doctor Approved",
    label: "Physician order included",
  },
  {
    title: "100% Private",
    label: "HIPAA-compliant & confidential",
  },
  {
    title: "HSA / FSA",
    label: "Eligible card payment accepted",
  },
];

export const physicianTrustCopy = {
  badgeText: "Physician Approved",
  supportingText: "Every order reviewed by a licensed physician",
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
    testName: "Thyroid & Energy Panel",
    href: "/tests?search=thyroid%20wellness",
    quote:
      "My doctor wouldn't order a full thyroid panel, so I ordered it myself. The walk-in visit took 10 minutes and I had clear answers in two days!",
  },
  {
    name: "Marcus T.",
    location: "Austin, TX",
    rating: 5,
    testName: "Comprehensive Annual Wellness",
    href: "/tests?search=annual%20cbc%20cmp%20lipid",
    quote:
      "No high deductible bills or insurance hassles. Transparent cash price paid upfront, and the results portal was easy to read and share with my MD.",
  },
  {
    name: "Priya K.",
    location: "Phoenix, AZ",
    rating: 5,
    testName: "Diabetes & A1C Tracker",
    href: "/tests?search=a1c%20glucose",
    quote:
      "The discrete process gave me peace of mind. Fast, private, and way cheaper than doing it directly through urgent care.",
  },
  {
    name: "Daniel R.",
    location: "Denver, CO",
    rating: 5,
    testName: "Men's Hormone & Vitality",
    href: "/tests?search=testosterone%20cortisol",
    quote:
      "Clear upfront pricing and quick turnaround. It helped me monitor my hormone levels proactively without waiting weeks for an appointment.",
  },
];

export const homepageGoalCards = [
  {
    title: "Feeling Tired & Low Energy?",
    description:
      "Check common fatigue root causes: thyroid, vitamin levels, iron, and metabolism.",
    examples: ["TSH + Free T4", "Vitamin D (25-OH)", "Vitamin B12", "Ferritin / Iron"],
    search: "fatigue thyroid vitamin b12 metabolic",
    icon: "sparkles",
    tone: "sky",
    badge: "Most Common",
  },
  {
    title: "Overdue for an Annual Checkup?",
    description:
      "Complete wellness baseline covering vital organs, heart health, blood sugar, and blood counts.",
    examples: ["Comprehensive Metabolic (CMP)", "Lipid Panel", "CBC", "HbA1c"],
    search: "annual checkup cbc cmp lipid a1c",
    icon: "stethoscope",
    tone: "emerald",
    badge: "Essential",
  },
  {
    title: "Hormone & Vitality Balance",
    description:
      "Explore key hormonal biomarkers for energy, mood, muscle tone, and reproductive wellness.",
    examples: ["Total & Free Testosterone", "Estradiol", "Cortisol", "DHEA-S"],
    search: "hormone testosterone cortisol dhea",
    icon: "microscope",
    tone: "violet",
    badge: "Popular",
  },
  {
    title: "Weight & Metabolism Check",
    description:
      "Understand insulin resistance, thyroid speed, and lipid markers impacting weight.",
    examples: ["Fasting Insulin", "Thyroid Panel", "Glucose", "Lipid Profile"],
    search: "weight metabolism insulin glucose thyroid",
    icon: "activity",
    tone: "blue",
    badge: "High Demand",
  },
  {
    title: "Heart Health & Cholesterol",
    description:
      "Go beyond basic cholesterol with in-depth cardiovascular risk and inflammation markers.",
    examples: ["Advanced Lipid Panel", "hs-CRP (Inflammation)", "ApoB", "Homocysteine"],
    search: "heart lipid cholesterol hs-crp apob",
    icon: "heart",
    tone: "rose",
    badge: "Recommended",
  },
  {
    title: "Private & Confidential Screen",
    description:
      "Discrete, 100% confidential sexual health and infectious disease screenings with zero awkward questions.",
    examples: ["Comprehensive 10-Test Panel", "HIV 4th Gen", "Chlamydia & Gonorrhea"],
    search: "std sti confidential screening",
    icon: "droplet",
    tone: "amber",
    badge: "100% Discrete",
  },
];

export const homepageHowItWorksSteps = [
  {
    step: "01",
    title: "Order Online in Minutes",
    description:
      "Select your tests or panel. A licensed physician order is included automatically—no prescription or doctor visit required.",
    icon: "search",
    highlight: "Doctor's Order Included",
  },
  {
    step: "02",
    title: "Walk Into a Local Lab",
    description:
      "Bring your lab requisition to any certified draw location near you. Most visits take less than 10 minutes with no appointment necessary.",
    icon: "map",
    highlight: "Fast 10-Minute Visit",
  },
  {
    step: "03",
    title: "Get Clear Results in 24–72 Hours",
    description:
      "Receive an email when your results are ready in your secure, HIPAA-protected patient portal with easy-to-read charts you can download or share.",
    icon: "file",
    highlight: "Secure & Downloadable",
  },
];

export const homepageTestContextFallbacks = [
  {
    match: ["a1c", "glucose", "diabetes"],
    text: "Often ordered to monitor blood sugar trends, prediabetes risk, and metabolic vitality.",
  },
  {
    match: ["thyroid", "tsh", "t4", "t3"],
    text: "Essential for evaluating unexplained weight fluctuations, persistent fatigue, and mood changes.",
  },
  {
    match: ["lipid", "cholesterol", "heart", "cardiac"],
    text: "Key markers for cardiovascular health, arterial risk assessment, and dietary balance.",
  },
  {
    match: ["vitamin", "b12", "folate", "d"],
    text: "Crucial for immune resilience, bone density, mental focus, and everyday stamina.",
  },
  {
    match: ["testosterone"],
    text: "Frequently checked for strength, libido, recovery, and overall male hormonal health.",
  },
  {
    match: ["hormone", "cortisol", "dhea"],
    text: "Helps uncover adrenal fatigue, stress response, and endocrine system equilibrium.",
  },
];

export const homepageDefaultTestContext =
  "Trusted diagnostic screening for proactive health tracking and peace of mind.";

export const homepageFinalCtaCopy = {
  eyebrow: "Ready to Take Charge of Your Health?",
  title: "Find Certified Blood Draw Centers Near You",
  description:
    "Enter your ZIP code to find nearby approved partner facilities. Get upfront cash-pay pricing, doctor-approved lab orders, and results in days.",
  chips: [
    "No Doctor's Prescription Needed",
    "CLIA-Certified Partner Facilities",
    "Results in 24-72 Hours",
    "HSA & FSA Eligible Cards Accepted",
  ],
};
