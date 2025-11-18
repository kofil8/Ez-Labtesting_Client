export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (0-100) or fixed amount in dollars
  minPurchaseAmount?: number;
  maxDiscountAmount?: number; // for percentage discounts
  validFrom: string; // ISO date string
  validUntil: string; // ISO date string
  usageLimit?: number; // total number of times it can be used
  usageCount?: number; // current usage count
  enabled: boolean;
  applicableTo?: 'all' | 'tests' | 'panels';
}

