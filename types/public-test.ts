export interface PublicTestCategory {
  id: string;
  name: string;
  slug?: string;
}

export interface PublicLabSummary {
  id: string;
  name: string;
  code: string;
}

export interface PublicPanelComponent {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  specimenType?: string;
  baseTurnaroundDays?: number | null;
  cptCode?: string;
  testImageUrl?: string;
  isPanel?: boolean;
  sortOrder: number;
  category?: PublicTestCategory;
}

export interface PublicLabOption {
  id: string;
  labTestCode: string;
  retailPrice: number;
  labCost?: number | null;
  turnaroundDays?: number | null;
  laboratory: PublicLabSummary;
}

export interface PublicCatalogTest {
  id: string;
  slug: string;
  testName: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  category: PublicTestCategory;
  testImage?: string;
  specimenType: string;
  turnaround: number;
  cptCode?: string;
  setUpSchedule?: string[];
  preparation?: string;
  keywords?: string[];
  requiresFasting?: boolean;
  minAge?: number;
  maxAge?: number;
  isPopular?: boolean;
  isPanel?: boolean;
  startingPrice?: number | null;
  startingLab?: PublicLabSummary | null;
  turnaroundDays?: number | null;
  componentCount?: number;
  components?: PublicPanelComponent[];
  labOptions?: PublicLabOption[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface PublicTestsListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PublicTestsListResponse {
  data: PublicCatalogTest[];
  meta: PublicTestsListMeta;
}
