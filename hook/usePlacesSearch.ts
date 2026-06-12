import { LabCenterService } from "@/lib/services/lab-centers.service";
import {
  LabCenter,
  MarkerData,
  ProviderCode,
  SearchCache,
  SearchSuggestion,
} from "@/types/lab-center";
import { useCallback, useRef, useState } from "react";

interface UsePlacesSearchReturn {
  labs: MarkerData[];
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  isFetchingSuggestions: boolean;
  error: string | null;
  searchByLocation: (
    lat: number,
    lng: number,
    radius: number,
    type?: string,
    status?: string,
    search?: string,
    providerCode?: ProviderCode,
  ) => Promise<void>;
  searchByQuery: (query: string) => Promise<void>;
  getSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
  clearError: () => void;
}

// Simple in-memory cache with TTL
class SearchResultsCache {
  private cache = new Map<string, SearchCache>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, results: LabCenter[]): void {
    this.cache.set(key, {
      key,
      results,
      timestamp: Date.now(),
      expiresIn: this.DEFAULT_TTL,
    });
  }

  get(key: string): LabCenter[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > cached.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return cached.results;
  }

  clear(): void {
    this.cache.clear();
  }

  getCacheKey(
    lat: number,
    lng: number,
    radius: number,
    type?: string,
    status?: string,
    search?: string,
    providerCode?: ProviderCode,
  ): string {
    // Round to 4 decimals to avoid cache misses for slightly different coords
    return `${lat.toFixed(4)}:${lng.toFixed(4)}:${radius}:${type || "all"}:${status || "all"}:${providerCode || "all"}:${(search || "").trim().toLowerCase()}`;
  }
}

const cache = new SearchResultsCache();

/**
 * Hook for searching labs using hybrid database + Google Places API
 * Handles debouncing, caching, and error management
 * @returns Search state and functions
 */
export function usePlacesSearch(): UsePlacesSearchReturn {
  const [labs, setLabs] = useState<MarkerData[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Abort controller for cancelling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchByLocation = useCallback(
    async (
      lat: number,
      lng: number,
      radius: number,
      type?: string,
      status?: string,
      search?: string,
      providerCode?: ProviderCode,
    ) => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const cacheKey = cache.getCacheKey(
        lat,
        lng,
        radius,
        type,
        status,
        search,
        providerCode,
      );

      // Check cache first
      const cachedResults = cache.get(cacheKey);
      if (cachedResults) {
        setLabs(
          cachedResults.map((lab) => ({
            ...lab,
            source: lab.source || "database",
          })),
        );
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch from hybrid endpoint (database + Places API fallback)
        const results = await LabCenterService.getLabCenters({
          lat,
          lng,
          radius,
          search,
          type,
          providerCode,
          status,
        });

        // Check if request was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        // Transform results to MarkerData
        const markerData: MarkerData[] = results.map((lab) => ({
          ...lab,
          source: lab.source || "database",
        }));

        setLabs(markerData);
        cache.set(cacheKey, results);
        setError(null);
      } catch (err) {
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to search labs";
        setError(message);
        setLabs([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const searchByQuery = useCallback(async (query: string) => {
    if (!query.trim()) {
      setLabs([]);
      setSuggestions([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      // Try to geocode the query to get coordinates
      const geocodeResult = await LabCenterService.geocodeAddress(query);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // Search nearby labs from geocoded location
      const results = await LabCenterService.getLabCenters({
        lat: geocodeResult.latitude,
        lng: geocodeResult.longitude,
        radius: 25, // Default radius
      });

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const markerData: MarkerData[] = results.map((lab) => ({
        ...lab,
        source: lab.source || "database",
      }));

      setLabs(markerData);
      setError(null);
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const message =
        err instanceof Error ? err.message : "Failed to search by query";
      setError(message);
      setLabs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsFetchingSuggestions(true);

    try {
      // Get autocomplete suggestions from service
      const results = await LabCenterService.getAutocompleteSuggestions(query);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setSuggestions(results);
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // Gracefully handle suggestion errors - don't show toast for background suggestions
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to fetch suggestions:", err);
      }
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    labs,
    suggestions,
    isLoading,
    isFetchingSuggestions,
    error,
    searchByLocation,
    searchByQuery,
    getSuggestions,
    clearSuggestions,
    clearError,
  };
}
