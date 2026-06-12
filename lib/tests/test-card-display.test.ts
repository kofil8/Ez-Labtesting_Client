import {
  getVisibleSoldLabel,
  isPhysicianReviewedTest,
} from "@/components/tests/TestCard";
import type { PublicCatalogTest } from "@/types/public-test";
import { describe, expect, it } from "vitest";

const baseTest: PublicCatalogTest = {
  id: "test-1",
  slug: "test-one",
  testName: "Test One",
  description: "Description",
  shortDescription: "Short description",
  categoryId: "category-1",
  category: { id: "category-1", name: "General Health" },
  specimenType: "Blood sample",
  turnaround: 48,
};

describe("TestCard display helpers", () => {
  it("hides sold counts below the threshold", () => {
    expect(getVisibleSoldLabel({ ...baseTest, soldCount: 99 })).toBeNull();
  });

  it("shows sold counts at the threshold and above", () => {
    expect(getVisibleSoldLabel({ ...baseTest, soldCount: 100 })).toBe(
      "100 sold",
    );
  });

  it("uses the physician reviewed catalog flag", () => {
    expect(
      isPhysicianReviewedTest({
        ...baseTest,
        isPhysicianReviewed: true,
      }),
    ).toBe(true);
  });
});
