import {
  AppliedFilterChip,
  GeolocationState,
  LabCenter,
  LabCenterSortOption,
  LabLocatorFilters,
} from "@/types/lab-center";

export const DEFAULT_LOCATOR_FILTERS: LabLocatorFilters = {
  radius: 25,
  type: "all",
  status: "all",
  rating: "all",
  sort: "distance",
};

export function getAppliedFilterChips(
  filters: LabLocatorFilters,
): AppliedFilterChip[] {
  const chips: AppliedFilterChip[] = [];

  if (filters.radius !== DEFAULT_LOCATOR_FILTERS.radius) {
    chips.push({
      key: "radius",
      label: `Within ${filters.radius} mi`,
    });
  }

  if (filters.type !== "all") {
    chips.push({
      key: "type",
      label: `Lab type: ${filters.type}`,
    });
  }

  if (filters.status !== "all") {
    chips.push({
      key: "status",
      label: filters.status === "Open" ? "Open now" : filters.status,
    });
  }

  if (filters.rating !== "all") {
    chips.push({
      key: "rating",
      label: `${filters.rating}+ stars`,
    });
  }

  if (filters.sort !== DEFAULT_LOCATOR_FILTERS.sort) {
    chips.push({
      key: "sort",
      label: `Sort: ${filters.sort === "rating" ? "Top rated" : "Distance"}`,
    });
  }

  return chips;
}

export function sortLabs(
  labs: LabCenter[],
  sort: LabCenterSortOption,
): LabCenter[] {
  const next = [...labs];

  if (sort === "rating") {
    return next.sort((left, right) => {
      if (right.rating !== left.rating) {
        return right.rating - left.rating;
      }

      return (left.distance ?? Number.MAX_SAFE_INTEGER) -
        (right.distance ?? Number.MAX_SAFE_INTEGER);
    });
  }

  return next.sort((left, right) => {
    return (left.distance ?? Number.MAX_SAFE_INTEGER) -
      (right.distance ?? Number.MAX_SAFE_INTEGER);
  });
}

export function mapGeolocationErrorMessage(error: unknown): string {
  if (
    error instanceof Error &&
    error.message.trim() &&
    !/failed to get location/i.test(error.message)
  ) {
    return error.message;
  }

  const errorCode =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "number"
      ? (error as { code: number }).code
      : 0;

  switch (errorCode) {
    case 1:
      return "Location access was denied. Search by ZIP code, city, or address instead.";
    case 2:
      return "Your location is unavailable right now. Check device settings or search manually.";
    case 3:
      return "Location request timed out. Try again or search by ZIP code.";
    default:
      return "We could not get your location. Search by ZIP code, city, or address instead.";
  }
}

export function getResultsStatus(
  labs: LabCenter[],
  error: string | null,
  hasSearchRequest: boolean,
): GeolocationState["error"] | "idle" | "results" | "empty" {
  if (!hasSearchRequest) {
    return "idle";
  }

  if (error) {
    return error;
  }

  return labs.length > 0 ? "results" : "empty";
}

export function getDirectionsUrl(lab: Pick<LabCenter, "address" | "name">) {
  const query = encodeURIComponent(`${lab.name} ${lab.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
