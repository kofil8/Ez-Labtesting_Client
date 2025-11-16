export interface Test {
  id: string;
  name: string;
  description: string;
  category:
    | "hormone"
    | "std"
    | "general"
    | "nutrition"
    | "thyroid"
    | "cardiac"
    | "metabolic";
  price: number;
  cptCodes: string[];
  labCode: string;
  labName: string;
  turnaroundDays: number;
  sampleType: string;
  preparation?: string;
  keywords?: string[];
  enabled: boolean;
  image?: string;
  // Additional lab test details
  fastingRequired?: boolean;
  fastingHours?: number;
  ageRequirement?: string; // e.g., "18+"
  sampleVolume?: string; // e.g., "Serum .5mL (no gel)"
  tubeType?: string; // e.g., "1 SST"
  collectionMethod?: string; // e.g., "In person at a Lab location"
  resultsTimeframe?: string; // e.g., "1-6 days from sample arrival at our lab"
}

export interface TestCategory {
  id: string;
  name: string;
  description: string;
}
