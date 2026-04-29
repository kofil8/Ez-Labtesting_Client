import type {
  PublicCatalogTest,
  PublicLabOption,
  PublicLabSummary,
  PublicPanelComponent,
} from "@/types/public-test";

export const STOREFRONT_LAB_CODES = ["ACCESS", "CPL", "QUEST", "LABCORP"] as const;

export type StorefrontLabCode = (typeof STOREFRONT_LAB_CODES)[number];

export type StorefrontLabCard = {
  code: StorefrontLabCode;
  name: string;
  isAvailable: boolean;
  retailPrice: number | null;
  turnaroundDays: number | null;
  labTestCode?: string;
  cptCode?: string;
  setUpSchedule?: string[];
  laboratory?: PublicLabSummary;
};

const STOREFRONT_LAB_NAMES: Record<StorefrontLabCode, string> = {
  ACCESS: "Access Medical Labs",
  CPL: "Clinical Pathology Laboratories",
  QUEST: "Quest Diagnostics",
  LABCORP: "Labcorp",
};

export function getTestStartingPrice(test: PublicCatalogTest): number | null {
  if (typeof test.startingPrice === "number" && Number.isFinite(test.startingPrice)) {
    return test.startingPrice;
  }

  const firstLabOption = test.labOptions?.find(
    (option) => typeof option.retailPrice === "number" && Number.isFinite(option.retailPrice),
  );

  return firstLabOption?.retailPrice ?? null;
}

export function getTestStartingLab(test: PublicCatalogTest): PublicLabSummary | null {
  if (test.startingLab?.id && test.startingLab?.code) {
    return test.startingLab;
  }

  return test.labOptions?.[0]?.laboratory ?? null;
}

export function getCatalogTurnaroundDays(test: PublicCatalogTest): number | null {
  if (typeof test.turnaroundDays === "number" && Number.isFinite(test.turnaroundDays)) {
    return test.turnaroundDays;
  }

  if (test.turnaround > 0) {
    return Math.max(1, Math.ceil(test.turnaround / 24));
  }

  const firstLabTurnaround = test.labOptions?.find(
    (option) =>
      typeof option.turnaroundDays === "number" && Number.isFinite(option.turnaroundDays),
  );

  return firstLabTurnaround?.turnaroundDays ?? null;
}

export function formatTurnaroundDaysLabel(days: number | null): string {
  if (!days || days <= 0) {
    return "Timing varies";
  }

  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function formatStartingPriceLabel(test: PublicCatalogTest): string {
  const price = getTestStartingPrice(test);
  if (price === null) {
    return "Price unavailable";
  }

  return `From $${price.toFixed(2)}`;
}

export function getSortedPanelComponents(test: PublicCatalogTest): PublicPanelComponent[] {
  return [...(test.components ?? [])].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function buildStorefrontLabCards(test: PublicCatalogTest): StorefrontLabCard[] {
  const optionByCode = new Map<StorefrontLabCode, PublicLabOption>();

  for (const option of test.labOptions ?? []) {
    const code = option.laboratory?.code?.toUpperCase() as StorefrontLabCode | undefined;
    if (code && STOREFRONT_LAB_CODES.includes(code)) {
      optionByCode.set(code, option);
    }
  }

  const cards = STOREFRONT_LAB_CODES.map((code) => {
    const option = optionByCode.get(code);

    return {
      code,
      name: option?.laboratory?.name || STOREFRONT_LAB_NAMES[code],
      isAvailable: !!option,
      retailPrice: option?.retailPrice ?? null,
      turnaroundDays: option?.turnaroundDays ?? getCatalogTurnaroundDays(test),
      labTestCode: option?.labTestCode,
      cptCode: code === "ACCESS" ? test.cptCode : undefined,
      setUpSchedule: code === "ACCESS" ? test.setUpSchedule : undefined,
      laboratory: option?.laboratory,
    };
  });

  return cards.sort((left, right) => {
    if (left.code === "ACCESS" && right.code !== "ACCESS") return -1;
    if (right.code === "ACCESS" && left.code !== "ACCESS") return 1;
    if (left.isAvailable === right.isAvailable) return 0;
    return left.isAvailable ? -1 : 1;
  });
}
