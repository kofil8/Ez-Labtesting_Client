import type { CartItem } from "@/lib/store/cart-store";
import { getTestStartingPrice } from "@/lib/tests/storefront-display";
import type { PublicCatalogTest } from "@/types/public-test";

export function canAddCatalogTestToCart(test: PublicCatalogTest): boolean {
  return getTestStartingPrice(test) !== null;
}

export function buildCartItemFromPublicTest(
  test: PublicCatalogTest,
): CartItem | null {
  const price = getTestStartingPrice(test);

  if (price === null) {
    return null;
  }

  return {
    id: `test-${test.id}`,
    itemType: "TEST",
    name: test.testName,
    price,
    testId: test.id,
    slug: test.slug,
    isPanel: test.isPanel === true,
  };
}
