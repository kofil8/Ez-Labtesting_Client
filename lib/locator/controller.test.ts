import {
  DEFAULT_LOCATOR_FILTERS,
  getAppliedFilterChips,
  isNationwideSearchQuery,
  mapGeolocationErrorMessage,
  sortLabs,
} from "@/lib/locator/controller";
import { LabCenter } from "@/types/lab-center";
import { describe, expect, it } from "vitest";

const baseLab = (overrides: Partial<LabCenter>): LabCenter => ({
  id: "lab-1",
  name: "Lab One",
  address: "123 Main St",
  type: "Labcorp",
  status: "Open",
  latitude: 1,
  longitude: 2,
  rating: 4,
  reviewCount: 10,
  isActive: true,
  lastVerified: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("locator/controller", () => {
  it("builds applied filter chips only for non-default values", () => {
    expect(
      getAppliedFilterChips({
        ...DEFAULT_LOCATOR_FILTERS,
        radius: 50,
        provider: "QUEST",
        rating: "4",
        status: "Open",
        sort: "rating",
      }),
    ).toEqual([
      { key: "radius", label: "Within 50 mi" },
      { key: "provider", label: "Provider: Quest Diagnostics" },
      { key: "status", label: "Open now" },
      { key: "rating", label: "4+ stars" },
      { key: "sort", label: "Sort: Top rated" },
    ]);
  });

  it("sorts labs by distance by default", () => {
    const labs = [
      baseLab({ id: "b", distance: 18 }),
      baseLab({ id: "a", distance: 4 }),
      baseLab({ id: "c", distance: 10 }),
    ];

    expect(sortLabs(labs, "distance").map((lab) => lab.id)).toEqual([
      "a",
      "c",
      "b",
    ]);
  });

  it("sorts labs by rating and falls back to distance", () => {
    const labs = [
      baseLab({ id: "a", rating: 4.1, distance: 4 }),
      baseLab({ id: "b", rating: 4.9, distance: 18 }),
      baseLab({ id: "c", rating: 4.9, distance: 6 }),
    ];

    expect(sortLabs(labs, "rating").map((lab) => lab.id)).toEqual([
      "c",
      "b",
      "a",
    ]);
  });

  it("maps geolocation errors to recovery copy", () => {
    expect(mapGeolocationErrorMessage({ code: 1 })).toContain("denied");
    expect(mapGeolocationErrorMessage({ code: 2 })).toContain("unavailable");
    expect(mapGeolocationErrorMessage({ code: 3 })).toContain("timed out");
  });

  it("detects nationwide search aliases", () => {
    expect(isNationwideSearchQuery("USA")).toBe(true);
    expect(isNationwideSearchQuery("United States")).toBe(true);
    expect(isNationwideSearchQuery("  us  ")).toBe(true);
    expect(isNationwideSearchQuery("California")).toBe(false);
  });
});
