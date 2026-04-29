import type { CartItem } from "@/lib/store/cart-store";
import { getTestStartingPrice } from "@/lib/tests/storefront-display";
import type { PublicCatalogTest } from "@/types/public-test";

export function canAddCatalogTestToCart(test: PublicCatalogTest): boolean {
  return buildCartItemFromPublicTest(test) !== null;
}

export function buildCartItemFromPublicTest(
  test: PublicCatalogTest,
): CartItem | null {
  const accessLabOption = test.labOptions?.find(
    (option) => option.laboratory?.code?.toUpperCase() === "ACCESS",
  );
  const labTestId = accessLabOption?.id || test.accessLabTestId || test.startingLabTestId || null;
  const price =
    typeof accessLabOption?.retailPrice === "number"
      ? accessLabOption.retailPrice
      : getTestStartingPrice(test);

  if (price === null || !labTestId) {
    return null;
  }

  return {
    id: `test-${test.id}`,
    itemType: "TEST",
    name: test.testName,
    price,
    testId: test.id,
    labTestId,
    slug: test.slug,
    isPanel: test.isPanel === true,
  };
}
