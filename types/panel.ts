export interface PanelTest {
  id: string;
  testCode: string;
  testName: string;
  price: number;
  testImage?: string;
  description?: string;
  sortOrder: number;
}

export interface Panel {
  id: string;
  name: string;
  description?: string;
  panelImage?: string | null;
  basePrice: number;
  discountPercent: number;
  bundlePrice: number;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  testsCount: number;
  tests: PanelTest[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PanelsListResponse {
  data: Panel[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreatePanelInput {
  name: string;
  description?: string;
  basePrice: number;
  discountPercent?: number;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
  testIds: string[];
}

export interface UpdatePanelInput {
  name?: string;
  description?: string;
  basePrice?: number;
  discountPercent?: number;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
  testIds?: string[];
}
