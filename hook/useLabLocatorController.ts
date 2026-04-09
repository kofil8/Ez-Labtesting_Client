"use client";

import { useClientLocationFromOrder } from "@/hook/useClientLocationFromOrder";
import { usePlacesSearch } from "@/hook/usePlacesSearch";
import { useCheckout } from "@/lib/context/CheckoutContext";
import { trackLocatorEvent } from "@/lib/locator/analytics";
import {
  DEFAULT_LOCATOR_FILTERS,
  getAppliedFilterChips,
  mapGeolocationErrorMessage,
  sortLabs,
} from "@/lib/locator/controller";
import { toSelectedLabCenter } from "@/lib/locator/selected-lab-session";
import { LabCenterService } from "@/lib/services/lab-centers.service";
import {
  AppliedFilterChip,
  LabCenter,
  LabLocatorFilters,
  LabLocatorSearchMethod,
  LabLocatorViewMode,
  SelectedLabCenter,
} from "@/types/lab-center";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

type SearchRequest = {
  anchor: { lat: number; lng: number };
  label: string;
  query: string;
  method: LabLocatorSearchMethod;
};

function getGeolocationResult(error: unknown) {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "number"
      ? (error as { code: number }).code
      : 0;

  switch (code) {
    case 1:
      return "denied";
    case 2:
      return "unavailable";
    case 3:
      return "timeout";
    default:
      return "error";
  }
}

export function useLabLocatorController() {
  const { clientLocation } = useClientLocationFromOrder();
  const { selectedLab, setSelectedLab } = useCheckout();
  const { labs, isLoading, error, searchByLocation } = usePlacesSearch();

  const [viewMode, setViewMode] = useState<LabLocatorViewMode>("list");
  const [searchInput, setSearchInput] = useState("");
  const [searchRequest, setSearchRequest] = useState<SearchRequest | null>(null);
  const [uiError, setUiError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [filters, setFilters] = useState<LabLocatorFilters>(
    DEFAULT_LOCATOR_FILTERS,
  );
  const [selectedLabId, setSelectedLabId] = useState<string | undefined>(
    selectedLab?.id,
  );
  const [detailsById, setDetailsById] = useState<
    Record<string, Partial<LabCenter>>
  >({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const resultsLoadStartedAtRef = useRef<number | null>(null);
  const hydratedFromOrderRef = useRef(false);

  useEffect(() => {
    trackLocatorEvent("locator_view");
  }, []);

  useEffect(() => {
    if (!clientLocation || hydratedFromOrderRef.current) {
      return;
    }

    hydratedFromOrderRef.current = true;
    const label =
      clientLocation.address || clientLocation.label || "Current location";

    const frameId = window.requestAnimationFrame(() => {
      startTransition(() => {
        setSearchInput(label);
        setSearchRequest({
          anchor: { lat: clientLocation.lat, lng: clientLocation.lng },
          label,
          query: label,
          method: "order",
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [clientLocation]);

  useEffect(() => {
    if (!searchRequest) {
      return;
    }

    resultsLoadStartedAtRef.current = Date.now();
    void searchByLocation(
      searchRequest.anchor.lat,
      searchRequest.anchor.lng,
      filters.radius,
      filters.type,
      filters.status,
      searchRequest.query,
    );
  }, [
    filters.radius,
    filters.status,
    filters.type,
    searchByLocation,
    searchRequest,
  ]);

  const displayedLabs = useMemo(() => {
    const hydratedLabs = labs.map((lab) => ({
      ...lab,
      ...(detailsById[lab.id] || {}),
    }));

    const minRating =
      filters.rating === "all" ? 0 : Number.parseInt(filters.rating, 10);
    const filteredLabs = hydratedLabs.filter((lab) => {
      if (filters.status !== "all" && lab.status !== filters.status) {
        return false;
      }

      return lab.rating >= minRating;
    });

    return sortLabs(filteredLabs, filters.sort);
  }, [detailsById, filters.rating, filters.sort, filters.status, labs]);

  useEffect(() => {
    if (!searchRequest || isLoading) {
      return;
    }

    if (resultsLoadStartedAtRef.current !== null) {
      trackLocatorEvent("locator_results_loaded", {
        count: displayedLabs.length,
        radius: filters.radius,
        method: searchRequest.method,
        latency_ms: Date.now() - resultsLoadStartedAtRef.current,
      });
      resultsLoadStartedAtRef.current = null;
    }
  }, [
    displayedLabs.length,
    error,
    filters.radius,
    isLoading,
    searchRequest,
    uiError,
  ]);

  const appliedFilterChips = useMemo<AppliedFilterChip[]>(
    () => getAppliedFilterChips(filters),
    [filters],
  );

  const activeError = uiError || error;
  const locationLabel = searchRequest?.label || clientLocation?.label || null;
  const confirmedLocation = clientLocation
    ? {
        lat: clientLocation.lat,
        lng: clientLocation.lng,
        label: clientLocation.label || clientLocation.address,
      }
    : null;
  const locationAnchor = searchRequest?.anchor ||
    (clientLocation
      ? { lat: clientLocation.lat, lng: clientLocation.lng }
      : null);
  const directionsOrigin = clientLocation
    ? { lat: clientLocation.lat, lng: clientLocation.lng }
    : searchRequest?.anchor || null;
  const activeLabId = selectedLabId || selectedLab?.id;

  const hydratePlaceDetails = useCallback(
    async (lab: LabCenter) => {
      if (detailsById[lab.id]) {
        return;
      }

      try {
        const details = await LabCenterService.getPlaceDetails(lab.id);
        setDetailsById((current) => ({
          ...current,
          [lab.id]: details,
        }));
      } catch {
        // Ignore detail hydration failures for non-Google IDs.
      }
    },
    [detailsById],
  );

  const previewLab = useCallback(
    async (lab: LabCenter, source: "list" | "map") => {
      setSelectedLabId(lab.id);

      if (source === "map") {
        trackLocatorEvent("locator_map_pin_click", {
          lab_id: lab.id,
        });
      } else {
        trackLocatorEvent("locator_result_click", {
          lab_id: lab.id,
        });
      }

      await hydratePlaceDetails(lab);
    },
    [hydratePlaceDetails],
  );

  const handleSearchSubmit = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setUiError("Enter a ZIP code, city, or address to search.");
        return;
      }

      try {
        const result = await LabCenterService.geocodeAddress(trimmedQuery);
        const label = result.formattedAddress || trimmedQuery;

        setUiError(null);
        setSearchInput(trimmedQuery);
        setSearchRequest({
          anchor: { lat: result.latitude, lng: result.longitude },
          label,
          query: trimmedQuery,
          method: "typed",
        });
        setSelectedLabId(selectedLab?.id);
        trackLocatorEvent("locator_location_submit", {
          method: "typed",
          query: trimmedQuery,
        });
      } catch (searchError) {
        setUiError(
          searchError instanceof Error
            ? searchError.message
            : "We could not find that location. Try another ZIP code, city, or address.",
        );
      }
    },
    [selectedLab],
  );

  const handleUseMyLocation = useCallback(async () => {
    setIsLocating(true);
    setUiError(null);

    try {
      const location = await LabCenterService.getCurrentLocation();
      const label = "Current location";

      setUiError(null);
      setSearchInput(label);
      setSearchRequest({
        anchor: { lat: location.latitude, lng: location.longitude },
        label,
        query: "",
        method: "geolocate",
      });
      trackLocatorEvent("locator_location_submit", {
        method: "geolocate",
      });
      trackLocatorEvent("locator_geolocate_result", {
        result: "granted",
      });
    } catch (locationError) {
      setUiError(mapGeolocationErrorMessage(locationError));
      trackLocatorEvent("locator_geolocate_result", {
        result: getGeolocationResult(locationError),
      });
    } finally {
      setIsLocating(false);
    }
  }, []);

  const handleFilterChange = useCallback(
    <T extends keyof LabLocatorFilters>(
      key: T,
      value: LabLocatorFilters[T],
    ) => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
      trackLocatorEvent("locator_filter_change", {
        filter_name: key,
        value,
      });
    },
    [],
  );

  const clearFilterChip = useCallback(
    (key: keyof LabLocatorFilters) => {
      handleFilterChange(key, DEFAULT_LOCATOR_FILTERS[key]);
    },
    [handleFilterChange],
  );

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_LOCATOR_FILTERS);
  }, []);

  const increaseRadius = useCallback(() => {
    const nextRadius =
      filters.radius >= 50 ? 100 : filters.radius >= 25 ? 50 : 25;
    handleFilterChange("radius", nextRadius);
  }, [filters.radius, handleFilterChange]);

  const handleSelectLab = useCallback(
    async (lab: LabCenter) => {
      await previewLab(lab, "list");
      setSelectedLab(toSelectedLabCenter(lab));
      toast.success(`${lab.name} selected for checkout.`);
      trackLocatorEvent("locator_cta_select_lab", {
        lab_id: lab.id,
      });
    },
    [previewLab, setSelectedLab],
  );

  const handleDirections = useCallback((lab: LabCenter) => {
    trackLocatorEvent("locator_cta_directions", {
      lab_id: lab.id,
    });
  }, []);

  const status = useMemo(() => {
    if (isLocating) {
      return "locating" as const;
    }

    if (!searchRequest) {
      return "idle" as const;
    }

    if (isLoading) {
      return "searching" as const;
    }

    if (activeError) {
      return "error" as const;
    }

    return displayedLabs.length > 0 ? ("results" as const) : ("empty" as const);
  }, [activeError, displayedLabs.length, isLoading, isLocating, searchRequest]);

  const selectedLabCenter = useMemo<SelectedLabCenter | null>(() => {
    if (selectedLab && selectedLab.id === activeLabId) {
      return selectedLab;
    }

    const found = displayedLabs.find((lab) => lab.id === activeLabId);
    return found ? toSelectedLabCenter(found) : selectedLab || null;
  }, [activeLabId, displayedLabs, selectedLab]);

  return {
    activeError,
    appliedFilterChips,
    clearAllFilters,
    clearFilterChip,
    displayedLabs,
    filters,
    handleDirections,
    handleFilterChange,
    handleSearchSubmit,
    handleSelectLab,
    handleUseMyLocation,
    increaseRadius,
    isLoading,
    confirmedLocation,
    directionsOrigin,
    locationAnchor,
    locationLabel,
    previewLab,
    searchInput,
    selectedLabCenter,
    selectedLabId: activeLabId,
    setSearchInput,
    setShowMobileFilters,
    setViewMode,
    showMobileFilters,
    status,
    viewMode,
  };
}
