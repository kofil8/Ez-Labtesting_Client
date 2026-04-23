import {
  CreateLabCenterRequest,
  GeocodeResponse,
  LabCenter,
  LabCenterQuery,
  NationwideLabQuery,
  NationwideLabResponse,
  SearchSuggestion,
  UpdateLabCenterRequest,
} from "@/types/lab-center";
import { clientFetch, getApiUrl, publicFetch } from "@/lib/api-client";

export class LabCenterService {
  /**
   * Get lab centers with optional filtering and distance calculation
   */
  static async getLabCenters(query?: LabCenterQuery): Promise<LabCenter[]> {
    const params = new URLSearchParams();

    if (query?.lat !== undefined) params.append("lat", query.lat.toString());
    if (query?.lng !== undefined) params.append("lng", query.lng.toString());
    if (query?.radius !== undefined)
      params.append("radius", query.radius.toString());
    if (query?.search && query.search.trim())
      params.append("search", query.search.trim());
    // Only add type/status if they are not "all"
    if (query?.type && query.type !== "all") params.append("type", query.type);
    if (query?.providerCode) params.append("providerCode", query.providerCode);
    if (query?.providerCodes?.length)
      params.append("providerCodes", query.providerCodes.join(","));
    if (query?.status && query.status !== "all")
      params.append("status", query.status);
    if (query?.isActive !== undefined)
      params.append("isActive", query.isActive.toString());

    const url = getApiUrl(
      `/lab-centers${params.toString() ? `?${params.toString()}` : ""}`,
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[LabCenterService] Fetching labs with URL:", url);
    }

    const response = await publicFetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to fetch lab centers" }));
      throw new Error(error.message || "Failed to fetch lab centers");
    }

    const data = await response.json();
    if (process.env.NODE_ENV === "development") {
      console.log("[LabCenterService] Got labs:", data.data?.length, "results");
    }
    return data.data || [];
  }

  static async getNationwideLabCenters(
    query?: NationwideLabQuery,
  ): Promise<NationwideLabResponse> {
    const params = new URLSearchParams();

    params.append("country", query?.country || "US");
    if (query?.providers?.length) {
      params.append("providers", query.providers.join(","));
    }
    if (query?.page !== undefined) params.append("page", query.page.toString());
    if (query?.pageSize !== undefined)
      params.append("pageSize", query.pageSize.toString());

    const response = await publicFetch(
      getApiUrl(`/lab-centers/nationwide?${params.toString()}`),
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to fetch nationwide lab availability" }));
      throw new Error(
        error.message || "Failed to fetch nationwide lab availability",
      );
    }

    const data = await response.json();
    return (
      data.data || {
        groups: [],
        meta: {
          page: query?.page || 1,
          pageSize: query?.pageSize || 12,
          totalGroups: 0,
          excludedStates: [],
        },
      }
    );
  }

  /**
   * Get a single lab center by ID
   */
  static async getLabCenterById(id: string): Promise<LabCenter> {
    const response = await publicFetch(getApiUrl(`/lab-centers/${id}`), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Lab center not found" }));
      throw new Error(error.message || "Lab center not found");
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Geocode an address to get latitude and longitude
   */
  static async geocodeAddress(address: string): Promise<GeocodeResponse> {
    const response = await publicFetch(getApiUrl("/lab-centers/geocode"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to geocode address" }));
      throw new Error(error.message || "Failed to geocode address");
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Create a new lab center (admin only)
   */
  static async createLabCenter(
    labCenter: CreateLabCenterRequest,
  ): Promise<LabCenter> {
    const response = await clientFetch(getApiUrl("/lab-centers"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(labCenter),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to create lab center" }));
      throw new Error(error.message || "Failed to create lab center");
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Update an existing lab center (admin only)
   */
  static async updateLabCenter(
    id: string,
    updates: UpdateLabCenterRequest,
  ): Promise<LabCenter> {
    const response = await clientFetch(getApiUrl(`/lab-centers/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to update lab center" }));
      throw new Error(error.message || "Failed to update lab center");
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Delete a lab center (admin only, soft delete)
   */
  static async deleteLabCenter(id: string): Promise<void> {
    const response = await clientFetch(getApiUrl(`/lab-centers/${id}`), {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to delete lab center" }));
      throw new Error(error.message || "Failed to delete lab center");
    }
  }

  /**
   * Get user's current location using browser geolocation API
   */
  static async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    // Pre-check permission state so we can give an immediate helpful message
    if ("permissions" in navigator) {
      try {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        if (status.state === "denied") {
          throw new Error(
            "Location access is blocked. Please enable it in your browser settings (click the lock icon in the address bar).",
          );
        }
      } catch (err) {
        // If the permission check itself throws (e.g. already a location error), rethrow it
        if (
          err instanceof Error &&
          err.message.includes("Location access is blocked")
        ) {
          throw err;
        }
        // Otherwise ignore — the permissions API may not support geolocation query in all browsers
      }
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // Use numeric constants (1/2/3) — safer than accessing instance properties
          let message: string;
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              message =
                "Location access denied. Click the lock icon in your address bar to enable it.";
              break;
            case 2: // POSITION_UNAVAILABLE
              message =
                "Your location could not be determined. Check your device\'s location settings.";
              break;
            case 3: // TIMEOUT
              message = "Location request timed out. Please try again.";
              break;
            default:
              message = `Unable to retrieve your location (code ${error.code}).`;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    });
  }

  /**
   * Get autocomplete suggestions for a search query
   * Uses Google Places Autocomplete API via backend
   */
  static async getAutocompleteSuggestions(
    query: string,
  ): Promise<SearchSuggestion[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        getApiUrl(
          `/lab-centers/autocomplete?input=${encodeURIComponent(query.trim())}`,
        ),
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Failed to fetch suggestions" }));
        throw new Error(error.message || "Failed to fetch suggestions");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return [];
    }
  }

  static async getPlaceDetails(placeId: string): Promise<Partial<LabCenter>> {
    const response = await publicFetch(
      getApiUrl(`/lab-centers/place-details/${encodeURIComponent(placeId)}`),
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to fetch place details" }));
      throw new Error(error.message || "Failed to fetch place details");
    }

    const data = await response.json();
    const details = data.data || {};

    return {
      id: details.id,
      name: details.name,
      address: details.address,
      phone: details.phone,
      website: details.website,
      hours: details.hours,
      status: details.status,
      latitude: details.latitude,
      longitude: details.longitude,
      rating: details.rating,
      reviewCount: details.reviewCount,
    };
  }
}
