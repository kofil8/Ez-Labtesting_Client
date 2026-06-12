"use client";

import { useClientLocationFromOrder } from "@/hook/useClientLocationFromOrder";
import { usePlacesSearch } from "@/hook/usePlacesSearch";
import { useCheckout } from "@/lib/context/CheckoutContext";
import { trackLocatorEvent } from "@/lib/locator/analytics";
import {
  DEFAULT_LOCATOR_FILTERS,
  getAppliedFilterChips,
  isNationwideSearchQuery,
  mapGeolocationErrorMessage,
  sortLabs,
} from "@/lib/locator/controller";
import { toSelectedLabCenter } from "@/lib/locator/selected-lab-session";
import { LabCenterService } from "@/lib/services/lab-centers.service";
import {
  AppliedFilterChip,
  LabCenter,
  LabLocatorFilters,
  LabLocatorPageMode,
  LabLocatorSearchMethod,
  LabLocatorViewMode,
  NationwideLabResponse,
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

function canUseAsAnchor(coords?: {
  latitude?: number;
  longitude?: number;
} | null) {
  return (
    coords?.latitude !== undefined &&
    coords?.longitude !== undefined &&
    Number.isFinite(coords.latitude) &&
    Number.isFinite(coords.longitude)
  );
}

export function useLabLocatorController() {
  const {
    clientLocation,
    isLoading: isOrderContextLoading,
    orderContext,
  } = useClientLocationFromOrder();
  const { selectedLab, setSelectedLab } = useCheckout();
  const { labs, isLoading, error, searchByLocation } = usePlacesSearch();

  const [viewMode, setViewMode] = useState<LabLocatorViewMode>("list");
  const [searchInput, setSearchInput] = useState("");
  const [searchRequest, setSearchRequest] = useState<SearchRequest | null>(null);
  const [uiError, setUiError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isNationwideLoading, setIsNationwideLoading] = useState(false);
  const [isNationwideMode, setIsNationwideMode] = useState(false);
  const [nationwideResults, setNationwideResults] =
    useState<NationwideLabResponse | null>(null);
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
  const hydratedInitialContextRef = useRef(false);

  useEffect(() => {
    trackLocatorEvent("locator_view");
  }, []);

  useEffect(() => {
    if (!selectedLab?.id) {
      return;
    }

    setSelectedLabId((current) => current ?? selectedLab.id);
  }, [selectedLab]);

  useEffect(() => {
    if (isOrderContextLoading || hydratedInitialContextRef.current) {
      return;
    }

    let isCancelled = false;

    const bootstrap = async () => {
      const applySearchRequest = (request: SearchRequest) => {
        startTransition(() => {
          setSearchInput(request.label);
          setSearchRequest(request);
        });
      };

      if (clientLocation) {
        hydratedInitialContextRef.current = true;
        const label =
          clientLocation.address || clientLocation.label || "Current location";

        applySearchRequest({
          anchor: { lat: clientLocation.lat, lng: clientLocation.lng },
          label,
          query: label,
          method: "order",
        });
        return;
      }

      const assignedLab = orderContext.assignedLab;
      if (assignedLab) {
        hydratedInitialContextRef.current = true;
        const label =
          assignedLab.formattedAddress ||
          assignedLab.address ||
          assignedLab.name ||
          "Assigned draw center";

        if (
          canUseAsAnchor({
            latitude: assignedLab.latitude,
            longitude: assignedLab.longitude,
          })
        ) {
          applySearchRequest({
            anchor: {
              lat: assignedLab.latitude as number,
              lng: assignedLab.longitude as number,
            },
            label,
            query: label,
            method: "assigned",
          });
          return;
        }

        if (!label.trim()) {
          return;
        }

        try {
          const geocoded = await LabCenterService.geocodeAddress(label);
          if (isCancelled) {
            return;
          }

          applySearchRequest({
            anchor: { lat: geocoded.latitude, lng: geocoded.longitude },
            label: geocoded.formattedAddress || label,
            query: label,
            method: "assigned",
          });
        } catch {
          // ACCESS-assigned context remains usable even if nearby search bootstrap fails.
        }
        return;
      }

      if (selectedLab) {
        hydratedInitialContextRef.current = true;
        applySearchRequest({
          anchor: { lat: selectedLab.latitude, lng: selectedLab.longitude },
          label: selectedLab.address || selectedLab.name,
          query: selectedLab.address || selectedLab.name,
          method: "selected",
        });
      }
    };

    void bootstrap();

    return () => {
      isCancelled = true;
    };
  }, [
    clientLocation,
    isOrderContextLoading,
    orderContext.assignedLab,
    selectedLab,
  ]);

  useEffect(() => {
    if (!searchRequest || isNationwideMode) {
      return;
    }

    resultsLoadStartedAtRef.current = Date.now();
    const searchTerm = searchRequest.method === "typed" ? searchRequest.query : "";
    void searchByLocation(
      searchRequest.anchor.lat,
      searchRequest.anchor.lng,
      filters.radius,
      filters.type,
      filters.status,
      searchTerm,
      filters.provider === "all" ? undefined : filters.provider,
    );
  }, [
    filters.provider,
    filters.radius,
    filters.status,
    filters.type,
    isNationwideMode,
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

  const effectiveIsLoading = isLoading || isNationwideLoading;

  useEffect(() => {
    if ((!searchRequest && !isNationwideMode) || effectiveIsLoading) {
      return;
    }

    if (resultsLoadStartedAtRef.current !== null) {
      trackLocatorEvent("locator_results_loaded", {
        count: isNationwideMode
          ? nationwideResults?.groups.length || 0
          : displayedLabs.length,
        radius: filters.radius,
        method: isNationwideMode ? "typed" : searchRequest?.method,
        latency_ms: Date.now() - resultsLoadStartedAtRef.current,
      });
      resultsLoadStartedAtRef.current = null;
    }
  }, [
    displayedLabs.length,
    effectiveIsLoading,
    filters.radius,
    isNationwideMode,
    nationwideResults?.groups.length,
    searchRequest,
  ]);

  const appliedFilterChips = useMemo<AppliedFilterChip[]>(
    () => getAppliedFilterChips(filters),
    [filters],
  );

  const pageMode = useMemo<LabLocatorPageMode>(() => {
    if (orderContext.assignedLab) {
      return "access_assigned";
    }

    if (isNationwideMode) {
      return "nationwide";
    }

    if (selectedLab) {
      return "selected_lab";
    }

    return "browse";
  }, [isNationwideMode, orderContext.assignedLab, selectedLab]);

  const canSelectLab =
    pageMode !== "access_assigned" && pageMode !== "nationwide";
  const activeError = uiError || (pageMode === "nationwide" ? null : error);
  const locationLabel =
    pageMode === "nationwide"
      ? "United States"
      : searchRequest?.label ||
        clientLocation?.label ||
        orderContext.assignedLab?.formattedAddress ||
        orderContext.assignedLab?.address ||
        null;
  const confirmedLocation =
    pageMode === "nationwide"
      ? null
      : clientLocation
        ? {
            lat: clientLocation.lat,
            lng: clientLocation.lng,
            label: clientLocation.label || clientLocation.address,
          }
        : null;
  const locationAnchor =
    pageMode === "nationwide"
      ? null
      : searchRequest?.anchor ||
        (clientLocation
          ? { lat: clientLocation.lat, lng: clientLocation.lng }
          : null);
  const directionsOrigin =
    pageMode === "nationwide"
      ? null
      : clientLocation
        ? { lat: clientLocation.lat, lng: clientLocation.lng }
        : searchRequest &&
            ["typed", "geolocate", "order"].includes(searchRequest.method)
          ? searchRequest.anchor
          : null;

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

  const applyLocalSearch = useCallback(
    async (
      query: string,
      nextProvider: LabLocatorFilters["provider"] = filters.provider,
    ) => {
      const result = await LabCenterService.geocodeAddress(query);
      const label = result.formattedAddress || query;

      setUiError(null);
      setIsNationwideMode(false);
      setNationwideResults(null);
      setSearchInput(query);
      setFilters((current) => ({
        ...current,
        provider: nextProvider,
      }));
      setSearchRequest({
        anchor: { lat: result.latitude, lng: result.longitude },
        label,
        query,
        method: "typed",
      });
      trackLocatorEvent("locator_location_submit", {
        method: "typed",
        query,
      });
    },
    [filters.provider],
  );

  const handleSearchSubmit = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setUiError("Enter a ZIP code, city, or address to search.");
        return;
      }

      const canSwitchNationwide = !orderContext.assignedLab;
      if (canSwitchNationwide && isNationwideSearchQuery(trimmedQuery)) {
        try {
          setUiError(null);
          setIsNationwideLoading(true);
          setIsNationwideMode(true);
          setSearchRequest(null);
          setSearchInput(trimmedQuery);
          resultsLoadStartedAtRef.current = Date.now();

          const results = await LabCenterService.getNationwideLabCenters({
            country: "US",
            providers: ["ACCESS", "CPL", "QUEST", "LABCORP"],
            page: 1,
            pageSize: 12,
          });

          setNationwideResults(results);
          trackLocatorEvent("locator_location_submit", {
            method: "typed",
            query: trimmedQuery,
          });
        } catch (searchError) {
          setUiError(
            searchError instanceof Error
              ? searchError.message
              : "We could not load nationwide availability right now.",
          );
          setIsNationwideMode(false);
          setNationwideResults(null);
        } finally {
          setIsNationwideLoading(false);
        }
        return;
      }

      try {
        await applyLocalSearch(trimmedQuery);
      } catch (searchError) {
        setUiError(
          searchError instanceof Error
            ? searchError.message
            : "We could not find that location. Try another ZIP code, city, or address.",
        );
      }
    },
    [applyLocalSearch, orderContext.assignedLab],
  );

  const handleSearchState = useCallback(
    async (stateName: string, providerCode: LabLocatorFilters["provider"]) => {
      try {
        await applyLocalSearch(stateName, providerCode);
      } catch (searchError) {
        setUiError(
          searchError instanceof Error
            ? searchError.message
            : "We could not switch to that state right now.",
        );
      }
    },
    [applyLocalSearch],
  );

  const handleUseMyLocation = useCallback(async () => {
    setIsLocating(true);
    setUiError(null);

    try {
      const location = await LabCenterService.getCurrentLocation();
      const label = "Current location";

      setUiError(null);
      setIsNationwideMode(false);
      setNationwideResults(null);
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
      if (!canSelectLab) {
        toast.info(
          pageMode === "nationwide"
            ? "Nationwide reference locations cannot be selected for checkout."
            : "This draw center was assigned by ACCESS and cannot be changed here.",
        );
        return;
      }

      await previewLab(lab, "list");
      setSelectedLab(toSelectedLabCenter(lab));
      toast.success(`${lab.name} selected for checkout.`);
      trackLocatorEvent("locator_cta_select_lab", {
        lab_id: lab.id,
      });
    },
    [canSelectLab, pageMode, previewLab, setSelectedLab],
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

    if (pageMode === "nationwide") {
      if (isNationwideLoading) {
        return "searching" as const;
      }

      if (activeError) {
        return "error" as const;
      }

      return nationwideResults?.groups.length
        ? ("results" as const)
        : ("empty" as const);
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
  }, [
    activeError,
    displayedLabs.length,
    isLoading,
    isLocating,
    isNationwideLoading,
    nationwideResults?.groups.length,
    pageMode,
    searchRequest,
  ]);

  const selectedLabCenter = useMemo<SelectedLabCenter | null>(() => {
    if (selectedLab) {
      return selectedLab;
    }

    const found = displayedLabs.find((lab) => lab.id === selectedLabId);
    return found ? toSelectedLabCenter(found) : null;
  }, [displayedLabs, selectedLab, selectedLabId]);

  const contextMessage = useMemo(() => {
    if (pageMode === "access_assigned") {
      return "ACCESS assigned this draw center for sample collection. Nearby labs are shown for reference only.";
    }

    if (pageMode === "nationwide") {
      return "Nationwide results show reference-only provider coverage and sample locations outside restricted states.";
    }

    if (pageMode === "selected_lab") {
      return "Review your saved collection location or compare nearby partner labs before checkout.";
    }

    return "Search nearby partner draw centers before you book.";
  }, [pageMode]);

  return {
    activeError,
    appliedFilterChips,
    assignedLab: orderContext.assignedLab,
    canSelectLab,
    clearAllFilters,
    clearFilterChip,
    contextMessage,
    displayedLabs,
    filters,
    handleDirections,
    handleFilterChange,
    handleSearchState,
    handleSearchSubmit,
    handleSelectLab,
    handleUseMyLocation,
    increaseRadius,
    isLoading: effectiveIsLoading,
    isOrderContextLoading,
    confirmedLocation,
    directionsOrigin,
    locationAnchor,
    locationLabel,
    nationwideResults,
    orderId: orderContext.orderId,
    pageMode,
    previewLab,
    requisitionPdfUrl: orderContext.requisitionPdfUrl,
    searchInput,
    selectedLabCenter,
    selectedLabId,
    setSearchInput,
    setShowMobileFilters,
    setViewMode,
    showMobileFilters,
    status,
    viewMode,
  };
}
