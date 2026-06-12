import { normalizePublicTest } from "@/lib/tests/public-tests";
import { describe, expect, it } from "vitest";

describe("normalizePublicTest", () => {
  it("preserves the physician reviewed flag", () => {
    expect(
      normalizePublicTest({
        id: "test-1",
        slug: "thyroid",
        name: "Thyroid Panel",
        categoryId: "category-1",
        category: { id: "category-1", name: "Hormones" },
        isPhysicianReviewed: true,
      }).isPhysicianReviewed,
    ).toBe(true);
  });
});
