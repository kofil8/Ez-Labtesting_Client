export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  isActive?: boolean;
}

export interface Test {
  id: string;
  testName: string;
  description: string;
  category: Category | string;
  categoryId?: string;
  price: number;
  cptCodes?: string[];
  labCode?: string;
  labName?: string;
  turnaround: number; // in hours
  specimenType: string;
  preparation?: string;
  keywords?: string[];
  enabled?: boolean;
  testImage?: string;

  // Medical context fields
  fastingRequired?: boolean;
  fastingHours?: number;
  ageRequirement?: string; // e.g., "18+"
  sampleVolume?: string; // e.g., "Serum .5mL (no gel)"
  tubeType?: string; // e.g., "1 SST"
  collectionMethod?: string; // e.g., "In person at a Lab location"
  resultsTimeframe?: string; // e.g., "1-6 days from sample arrival at our lab"

  // Enhanced medical fields
  contraindications?: string[]; // List of contraindications
  clinicalSignificance?: string; // What the test is used for clinically
  panelIncludes?: string[]; // If this is a panel, what tests are included
  methodology?: string; // Lab methodology (e.g., "Immunoassay", "PCR")
  referenceRange?: string; // Normal reference ranges
  criticalValues?: string; // Critical/panic values

  // Patient guidance
  whenToTest?: string; // Best time to take the test
  resultsInterpretation?: string; // How to understand results
  followUpRecommendations?: string; // What to do with results

  // Regulatory & quality
  cliaWaived?: boolean; // CLIA waived test
  fdaApproved?: boolean; // FDA approval status
  certifications?: string[]; // Other certifications (CAP, ISO, etc.)
}

export interface TestCategory {
  id: string;
  name: string;
  description: string;
}
