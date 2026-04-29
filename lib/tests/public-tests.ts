import type {
  PublicCatalogTest,
  PublicLabOption,
  PublicLabSummary,
  PublicPanelComponent,
  PublicTestsListMeta,
  PublicTestsListResponse,
} from "@/types/public-test";

export const DEFAULT_PUBLIC_TESTS_LIMIT = 12;

export type PublicTestSortKey = "name" | "popular" | "newest" | "turnaround";
export type PublicTestPanelMode = "single" | "panel" | "all";

export type PublicTestCatalogQueryState = {
  page: number;
  limit: number;
  search: string;
  category: string;
  sort: PublicTestSortKey;
  panelMode: PublicTestPanelMode;
};

type SearchParamsLike = Pick<URLSearchParams, "get">;

export function getPublicTestSortConfig(sort: PublicTestSortKey): {
  sortBy: string;
  sortOrder: "asc" | "desc";
} {
  switch (sort) {
    case "popular":
      return { sortBy: "isPopular", sortOrder: "desc" };
    case "newest":
      return { sortBy: "createdAt", sortOrder: "desc" };
    case "turnaround":
      return { sortBy: "baseTurnaroundDays", sortOrder: "asc" };
    case "name":
    default:
      return { sortBy: "name", sortOrder: "asc" };
  }
}

export function parsePublicCatalogSearchParams(
  searchParams: SearchParamsLike,
  options?: {
    panelMode?: PublicTestPanelMode;
  },
): PublicTestCatalogQueryState {
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const requestedSort = searchParams.get("sort");
  const sort: PublicTestSortKey =
    requestedSort === "popular" ||
    requestedSort === "newest" ||
    requestedSort === "turnaround" ||
    requestedSort === "name"
      ? requestedSort
      : "name";

  return {
    page,
    limit: DEFAULT_PUBLIC_TESTS_LIMIT,
    search,
    category,
    sort,
    panelMode: options?.panelMode ?? "single",
  };
}

export function buildPublicTestsQueryString(
  queryState: PublicTestCatalogQueryState,
): string {
  const params = new URLSearchParams();
  const sortConfig = getPublicTestSortConfig(queryState.sort);
  const rawSearch = queryState.search.trim();
  const searchTokens = rawSearch ? rawSearch.split(/\s+/) : [];
  const hasPopularKeyword = searchTokens.some(
    (token) => token.toLowerCase() === "popular",
  );
  const normalizedSearch = searchTokens
    .filter((token) => token.toLowerCase() !== "popular")
    .join(" ");

  params.set("page", String(queryState.page));
  params.set("limit", String(queryState.limit));
  params.set("sortBy", sortConfig.sortBy);
  params.set("sortOrder", sortConfig.sortOrder);

  if (queryState.sort === "popular") {
    params.set("isPopular", "true");
  }

  if (queryState.panelMode === "single") {
    params.set("isPanel", "false");
  } else if (queryState.panelMode === "panel") {
    params.set("isPanel", "true");
  }

  if (hasPopularKeyword) {
    params.set("isPopular", "true");
  }

  if (normalizedSearch) {
    params.set("search", normalizedSearch);
  }

  if (queryState.category && queryState.category !== "all") {
    params.set("categoryId", queryState.category);
  }

  return params.toString();
}

function normalizePublicTestImageUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // Guard against malformed historical data ("uplloads" typo) without mutating source records.
  return trimmed.replace("/uplloads/", "/uploads/");
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function normalizeStringListLabel(value: unknown): string | undefined {
  const values = normalizeStringArray(value);
  return values.length > 0 ? values.join(", ") : undefined;
}

function normalizeLabSummary(rawLab: any): PublicLabSummary | null {
  if (!rawLab || typeof rawLab !== "object") {
    return null;
  }

  const id = String(rawLab.id ?? "");
  const name = String(rawLab.name ?? "");
  const code = String(rawLab.code ?? "");

  if (!id || !name || !code) {
    return null;
  }

  return {
    id,
    name,
    code: code.trim().toUpperCase(),
  };
}

function normalizePanelComponents(rawComponents: unknown): PublicPanelComponent[] | undefined {
  if (!Array.isArray(rawComponents)) {
    return undefined;
  }

  const components = rawComponents
    .map((component): PublicPanelComponent | null => {
      if (!component || typeof component !== "object") {
        return null;
      }

      const sortOrder = normalizeNumber(component.sortOrder) ?? 0;
      const category =
        component.category && typeof component.category === "object"
          ? {
              id: String(component.category.id ?? ""),
              name: String(component.category.name ?? ""),
              slug:
                typeof component.category.slug === "string"
                  ? component.category.slug
                  : undefined,
            }
          : undefined;

      return {
        id: String(component.id ?? ""),
        name: String(component.name ?? ""),
        slug: String(component.slug ?? ""),
        shortDescription:
          typeof component.shortDescription === "string" &&
          component.shortDescription.trim()
            ? component.shortDescription.trim()
            : undefined,
        specimenType:
          typeof component.specimenType === "string" &&
          component.specimenType.trim()
            ? component.specimenType.trim()
            : undefined,
        baseTurnaroundDays: normalizeNumber(component.baseTurnaroundDays),
        cptCode: normalizeStringListLabel(component.cptCode),
        testImageUrl: normalizePublicTestImageUrl(component.testImageUrl),
        isPanel:
          typeof component.isPanel === "boolean" ? component.isPanel : undefined,
        sortOrder,
        category:
          category && category.id && category.name
            ? category
            : undefined,
      };
    })
    .filter((component): component is PublicPanelComponent => {
      return !!component && !!component.id && !!component.name && !!component.slug;
    })
    .sort((left, right) => left.sortOrder - right.sortOrder);

  return components;
}

function normalizeLabOptions(rawLabOptions: unknown): PublicLabOption[] | undefined {
  if (!Array.isArray(rawLabOptions)) {
    return undefined;
  }

  const labOptions = rawLabOptions
    .map((option): PublicLabOption | null => {
      if (!option || typeof option !== "object") {
        return null;
      }

      const retailPrice = normalizeNumber(option.retailPrice);
      const laboratory = normalizeLabSummary(option.laboratory);

      if (retailPrice === null || !laboratory) {
        return null;
      }

      return {
        id: String(option.id ?? ""),
        labTestCode:
          typeof option.labTestCode === "string" ? option.labTestCode : "",
        retailPrice,
        labCost: normalizeNumber(option.labCost),
        turnaroundDays: normalizeNumber(option.turnaroundDays),
        laboratory,
      };
    })
    .filter((option): option is PublicLabOption => {
      return !!option && !!option.id && !!option.labTestCode;
    });

  return labOptions;
}

export function normalizePublicTest(rawTest: any): PublicCatalogTest {
  const category =
    rawTest?.category && typeof rawTest.category === "object"
      ? {
          id: String(rawTest.category.id ?? rawTest.categoryId ?? ""),
          name: String(rawTest.category.name ?? "General Health"),
          slug:
            typeof rawTest.category.slug === "string"
              ? rawTest.category.slug
              : undefined,
        }
      : {
          id: String(rawTest?.categoryId ?? ""),
          name:
            typeof rawTest?.category === "string" && rawTest.category.trim()
              ? rawTest.category
              : "General Health",
        };

  const description =
    typeof rawTest?.description === "string" && rawTest.description.trim()
      ? rawTest.description.trim()
      : typeof rawTest?.shortDescription === "string" &&
          rawTest.shortDescription.trim()
        ? rawTest.shortDescription.trim()
        : "Detailed laboratory information is available on the test page.";

  const shortDescription =
    typeof rawTest?.shortDescription === "string" &&
    rawTest.shortDescription.trim()
      ? rawTest.shortDescription.trim()
      : description;

  const turnaroundDays =
    normalizeNumber(rawTest?.turnaroundDays) ??
    normalizeNumber(rawTest?.baseTurnaroundDays) ??
    0;
  const startingLab = normalizeLabSummary(rawTest?.startingLab);
  const components = normalizePanelComponents(rawTest?.components);
  const labOptions = normalizeLabOptions(rawTest?.labOptions);

  return {
    id: String(rawTest?.id ?? ""),
    slug: String(rawTest?.slug ?? ""),
    testName: String(rawTest?.name ?? rawTest?.testName ?? ""),
    description,
    shortDescription,
    categoryId: String(rawTest?.categoryId ?? category.id ?? ""),
    category,
    testImage:
      normalizePublicTestImageUrl(rawTest?.testImageUrl) ??
      normalizePublicTestImageUrl(rawTest?.testImage),
    specimenType:
      typeof rawTest?.specimenType === "string" && rawTest.specimenType.trim()
        ? rawTest.specimenType.trim()
        : "Blood sample",
    turnaround: turnaroundDays * 24,
    turnaroundDays,
    cptCode: normalizeStringListLabel(rawTest?.cptCode),
    setUpSchedule: normalizeStringArray(rawTest?.setUpSchedule),
    preparation:
      typeof rawTest?.preparationInstructions === "string" &&
      rawTest.preparationInstructions.trim()
        ? rawTest.preparationInstructions.trim()
        : typeof rawTest?.preparation === "string" && rawTest.preparation.trim()
          ? rawTest.preparation.trim()
          : undefined,
    keywords: Array.isArray(rawTest?.searchKeywords)
      ? rawTest.searchKeywords.filter(
          (value: unknown): value is string =>
            typeof value === "string" && value.trim().length > 0,
        )
      : undefined,
    requiresFasting:
      typeof rawTest?.requiresFasting === "boolean"
        ? rawTest.requiresFasting
        : undefined,
    minAge:
      typeof rawTest?.minAge === "number" && Number.isFinite(rawTest.minAge)
        ? rawTest.minAge
        : undefined,
    maxAge:
      typeof rawTest?.maxAge === "number" && Number.isFinite(rawTest.maxAge)
        ? rawTest.maxAge
        : undefined,
    isPopular:
      typeof rawTest?.isPopular === "boolean" ? rawTest.isPopular : undefined,
    isPanel:
      typeof rawTest?.isPanel === "boolean" ? rawTest.isPanel : undefined,
    accessLabTestId:
      typeof rawTest?.accessLabTestId === "string" && rawTest.accessLabTestId
        ? rawTest.accessLabTestId
        : null,
    startingLabTestId:
      typeof rawTest?.startingLabTestId === "string" && rawTest.startingLabTestId
        ? rawTest.startingLabTestId
        : null,
    startingPrice: normalizeNumber(rawTest?.startingPrice),
    startingLab,
    componentCount:
      normalizeNumber(rawTest?.componentCount) ??
      components?.length ??
      undefined,
    components,
    labOptions,
    seoTitle:
      typeof rawTest?.seoTitle === "string" && rawTest.seoTitle.trim()
        ? rawTest.seoTitle.trim()
        : undefined,
    seoDescription:
      typeof rawTest?.seoDescription === "string" &&
      rawTest.seoDescription.trim()
        ? rawTest.seoDescription.trim()
        : undefined,
  };
}

export function normalizePublicTestsMeta(
  rawMeta: any,
  fallback: Pick<PublicTestsListMeta, "page" | "limit" | "total">,
): PublicTestsListMeta {
  const page =
    typeof rawMeta?.page === "number" && Number.isFinite(rawMeta.page)
      ? rawMeta.page
      : fallback.page;
  const limit =
    typeof rawMeta?.limit === "number" && Number.isFinite(rawMeta.limit)
      ? rawMeta.limit
      : fallback.limit;
  const total =
    typeof rawMeta?.total === "number" && Number.isFinite(rawMeta.total)
      ? rawMeta.total
      : fallback.total;
  const totalPages =
    typeof rawMeta?.totalPages === "number" &&
    Number.isFinite(rawMeta.totalPages)
      ? rawMeta.totalPages
      : Math.max(1, Math.ceil(total / Math.max(1, limit)));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage:
      typeof rawMeta?.hasNextPage === "boolean"
        ? rawMeta.hasNextPage
        : page < totalPages,
    hasPrevPage:
      typeof rawMeta?.hasPrevPage === "boolean"
        ? rawMeta.hasPrevPage
        : page > 1,
    sortBy: typeof rawMeta?.sortBy === "string" ? rawMeta.sortBy : undefined,
    sortOrder:
      rawMeta?.sortOrder === "asc" || rawMeta?.sortOrder === "desc"
        ? rawMeta.sortOrder
        : undefined,
  };
}

export function normalizePublicTestsResponse(
  payload: any,
  fallback: Pick<PublicTestsListMeta, "page" | "limit" | "total"> = {
    page: 1,
    limit: DEFAULT_PUBLIC_TESTS_LIMIT,
    total: 0,
  },
): PublicTestsListResponse {
  const rawTests = Array.isArray(payload?.data) ? payload.data : [];
  const normalizedTests = rawTests.map(normalizePublicTest);

  return {
    data: normalizedTests,
    meta: normalizePublicTestsMeta(payload?.meta, fallback),
  };
}

export function formatPublicTestMetadata(test: PublicCatalogTest) {
  const turnaroundDays = test.turnaroundDays
    ? Math.max(1, Math.ceil(test.turnaroundDays))
    : test.turnaround > 0
      ? Math.max(1, Math.ceil(test.turnaround / 24))
      : null;
  const summary = test.shortDescription || test.description;
  const categoryName = test.category?.name || "Lab Test";
  const titlePrefix = test.isPanel ? `${test.testName} Panel` : test.testName;
  const descriptionPrefix =
    test.isPanel && test.componentCount
      ? `${summary} Includes ${test.componentCount} component tests.`
      : summary;

  return {
    title: `${titlePrefix} | ${categoryName} | Ez LabTesting`,
    description: turnaroundDays
      ? `${descriptionPrefix} Results typically available in about ${turnaroundDays} ${turnaroundDays === 1 ? "day" : "days"}.`
      : descriptionPrefix,
    keywords: [
      test.testName,
      categoryName,
      ...(test.keywords || []),
      "lab test",
      "CLIA certified",
      "Ez LabTesting",
    ].join(", "),
  };
}
