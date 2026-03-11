import { Test } from "@/types/test";
import {
  formatTurnaroundDisplay as formatTurnaroundDisplayNew,
  getTurnaroundDays as getTurnaroundDaysNew,
  isValidTurnaroundInput,
  normalizeTurnaround,
  parseTurnaroundInput,
  type NormalizedTurnaround,
} from "./utils/turnaround-normalizer";

// Re-export new functions
export {
  isValidTurnaroundInput,
  normalizeTurnaround,
  parseTurnaroundInput,
  type NormalizedTurnaround,
};

/**
 * Format turnaround time from hours to days
 * @param turnaroundHours - Turnaround time in hours
 * @returns Formatted string like "2 days" or "1 day"
 * @deprecated Use formatTurnaroundDisplay from turnaround-normalizer for more options
 */
export const formatTurnaroundTime = (turnaroundHours: number): string => {
  return formatTurnaroundDisplayNew(turnaroundHours, {
    style: "full",
    preferDays: true,
  });
};

/**
 * Get numeric days from turnaround hours
 * @param turnaroundHours - Turnaround time in hours
 * @returns Number of days (rounded up)
 */
export const getTurnaroundDays = (turnaroundHours: number): number => {
  return getTurnaroundDaysNew(turnaroundHours);
};

/**
 * Format turnaround time with style options
 * @param turnaroundHours - Turnaround time in hours
 * @param options - Display options
 * @returns Formatted string
 */
export const formatTurnaroundDisplay = formatTurnaroundDisplayNew;

/**
 * Calculate savings amount based on retail markup
 * @param price - Current price
 * @param markupMultiplier - Markup multiplier (default 2.5x)
 * @returns Savings amount
 */
export const calculateSavings = (
  price: number,
  markupMultiplier: number = 2.5,
): number => {
  const retailPrice = price * markupMultiplier;
  return retailPrice - price;
};

/**
 * Calculate discount percentage
 * @param price - Current price
 * @param markupMultiplier - Markup multiplier (default 2.5x)
 * @returns Discount percentage (e.g., 60 for 60%)
 */
export const calculateDiscountPercent = (
  price: number,
  markupMultiplier: number = 2.5,
): number => {
  const retailPrice = price * markupMultiplier;
  return Math.round(((retailPrice - price) / retailPrice) * 100);
};

/**
 * Get category icon emoji based on test category
 * @param category - Category name or object
 * @returns Emoji icon string
 */
export const getCategoryIcon = (
  category: string | { id: string; name: string } | undefined,
): string => {
  const categoryName =
    typeof category === "string"
      ? category.toLowerCase()
      : category?.name?.toLowerCase() || "";

  const icons: Record<string, string> = {
    general: "🩺",
    metabolic: "⚡",
    cardiac: "❤️",
    thyroid: "🦋",
    nutrition: "🥗",
    hormone: "💊",
    std: "🔬",
    allergy: "🤧",
    blood: "🩸",
    cancer: "🔬",
    "covid-19": "🦠",
    diabetes: "🩺",
    vitamin: "💊",
    wellness: "✨",
    fitness: "💪",
    skin: "💊",
  };

  return icons[categoryName] || "🔬";
};

/**
 * Get gradient color pair for category
 * @param category - Category name or object
 * @returns Object with from and to gradient colors
 */
export const getCategoryGradient = (
  category: string | { id: string; name: string } | undefined,
): { from: string; to: string } => {
  const categoryName =
    typeof category === "string"
      ? category.toLowerCase()
      : category?.name?.toLowerCase() || "";

  const gradients: Record<string, { from: string; to: string }> = {
    general: { from: "from-cyan-500", to: "to-blue-500" },
    metabolic: { from: "from-amber-500", to: "to-orange-500" },
    cardiac: { from: "from-red-500", to: "to-pink-500" },
    thyroid: { from: "from-purple-500", to: "to-pink-500" },
    nutrition: { from: "from-green-500", to: "to-emerald-500" },
    hormone: { from: "from-violet-500", to: "to-purple-500" },
    std: { from: "from-blue-500", to: "to-cyan-500" },
    allergy: { from: "from-orange-500", to: "to-yellow-500" },
    blood: { from: "from-red-500", to: "to-rose-500" },
    wellness: { from: "from-cyan-500", to: "to-teal-500" },
  };

  return (
    gradients[categoryName] || { from: "from-cyan-500", to: "to-blue-500" }
  );
};

/**
 * Format test metadata for SEO
 * @param test - Test object
 * @returns Formatted metadata object
 */
export const formatTestMetadata = (test: Test) => {
  const days = getTurnaroundDays(test.turnaround);
  const price = test.price.toFixed(0);

  return {
    title: `${test.testName} - $${price} | Fast ${days}d Results | Ez LabTesting`,
    description: `Order ${test.testName} lab test online. $${price} with ${days}-day results. CLIA-certified labs. No doctor visit required. Free shipping included.`,
    keywords: `${test.testName}, lab test, ${
      typeof test.category === "string"
        ? test.category
        : test.category?.name || ""
    }, CLIA certified, fast results, online lab testing`,
  };
};

/**
 * Get medical context for a test
 * @param test - Test object
 * @returns Object with medical context fields
 */
export const getTestMedicalContext = (test: Test) => {
  return {
    turnaroundDays: getTurnaroundDays(test.turnaround),
    specimenType: test.specimenType,
    labName: test.labName,
    labCode: test.labCode,
    fastingRequired: test.fastingRequired ?? false,
    fastingHours: test.fastingHours ?? 0,
    ageRequirement: test.ageRequirement || "18+",
    sampleVolume: test.sampleVolume || "See lab for details",
    tubeType: test.tubeType || "Standard",
    collectionMethod: test.collectionMethod || "In person at a Lab location",
    preparation:
      test.preparation || "No special preparation needed for this test.",
  };
};

/**
 * Validate test data before rendering
 * @param test - Test object
 * @returns Boolean indicating if test has required fields
 */
export const isValidTest = (test: Test | null | undefined): test is Test => {
  if (!test) return false;
  return !!(test.id && test.testName && test.price >= 0);
};

/**
 * Get related test suggestions based on category
 * @param currentTestId - Current test ID
 * @param tests - Array of all tests
 * @param limit - Number of suggestions to return
 * @returns Array of related tests
 */
export const getRelatedTests = (
  currentTestId: string,
  tests: Test[],
  currentCategory?: string,
  limit: number = 3,
): Test[] => {
  return tests
    .filter(
      (test) =>
        test.id !== currentTestId &&
        (currentCategory
          ? typeof test.category === "string"
            ? test.category === currentCategory
            : test.category?.name === currentCategory
          : true),
    )
    .slice(0, limit);
};

/**
 * Calculate test affordability metrics
 * @param price - Test price
 * @returns Object with affordability indicators
 */
export const getAffordabilityMetrics = (price: number) => {
  return {
    monthlyPayments: Math.ceil(price / 3),
    isAffordable: price < 200,
    isConvenient: price < 100,
  };
};
