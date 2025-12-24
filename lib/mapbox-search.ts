/**
 * Mapbox Search Box API helpers for medical laboratory POI searches
 * @see https://docs.mapbox.com/api/search/search-box/
 */

const MAPBOX_BASE_URL = "https://api.mapbox.com/search/searchbox/v1";

export interface MapboxFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    name: string;
    name_preferred?: string;
    mapbox_id: string;
    feature_type: string;
    address?: string;
    full_address?: string;
    place_formatted?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    context?: {
      country?: { name: string; country_code: string };
      region?: { name: string; region_code: string };
      postcode?: { name: string };
      place?: { name: string };
      neighborhood?: { name: string };
      street?: { name: string };
    };
    poi_category?: string[];
    poi_category_ids?: string[];
    maki?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface MapboxResponse {
  type: "FeatureCollection";
  features: MapboxFeature[];
  attribution: string;
}

/**
 * Fetch medical labs near a coordinate using Category or Text search
 */
export async function fetchMedicalLabsNear(
  lat: number,
  lng: number,
  limit: number = 10
): Promise<MapboxFeature[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set");
  }

  // Use text search with POI category filter for medical labs
  const params = new URLSearchParams({
    q: "medical lab laboratory clinic",
    types: "poi",
    poi_category: "medical_laboratory,medical_clinic,health_services",
    proximity: `${lng},${lat}`,
    limit: limit.toString(),
    country: "US",
    access_token: token,
  });

  try {
    const response = await fetch(`${MAPBOX_BASE_URL}/forward?${params}`);
    if (!response.ok) {
      throw new Error(
        `Mapbox API error: ${response.status} ${response.statusText}`
      );
    }
    const data: MapboxResponse = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error fetching medical labs near location:", error);
    return [];
  }
}

/**
 * Search for medical labs by location query (e.g., "Las Vegas, NV")
 */
export async function searchMedicalLabsByLocation(
  query: string,
  proximity?: { lat: number; lng: number },
  limit: number = 10
): Promise<MapboxFeature[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set");
  }

  const params = new URLSearchParams({
    q: `${query} medical lab`,
    types: "poi",
    poi_category: "medical_laboratory,medical_clinic,health_services",
    limit: limit.toString(),
    country: "US",
    access_token: token,
  });

  if (proximity) {
    params.set("proximity", `${proximity.lng},${proximity.lat}`);
  }

  try {
    const response = await fetch(`${MAPBOX_BASE_URL}/forward?${params}`);
    if (!response.ok) {
      throw new Error(
        `Mapbox API error: ${response.status} ${response.statusText}`
      );
    }
    const data: MapboxResponse = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error searching medical labs by location:", error);
    return [];
  }
}

/**
 * Get available POI categories from Mapbox
 */
export async function listMapboxCategories(): Promise<
  Array<{ canonical_id: string; icon: string; name: string }>
> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set");
  }

  try {
    const response = await fetch(
      `${MAPBOX_BASE_URL}/list/category?language=en&access_token=${token}`
    );
    if (!response.ok) {
      throw new Error(
        `Mapbox API error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.listItems || [];
  } catch (error) {
    console.error("Error fetching Mapbox categories:", error);
    return [];
  }
}

/**
 * Convert MapboxFeature to LabCenter format for compatibility
 */
export function mapboxFeatureToLabCenter(feature: MapboxFeature): {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  phone: string;
  hours: string;
  rating: number;
  reviewCount: number;
  status: "Open" | "Closed";
  type: string;
  website?: string;
} {
  return {
    id: feature.properties.mapbox_id,
    name: feature.properties.name_preferred || feature.properties.name,
    address:
      feature.properties.full_address ||
      feature.properties.address ||
      feature.properties.place_formatted ||
      "",
    location: {
      lat: feature.properties.coordinates.latitude,
      lng: feature.properties.coordinates.longitude,
    },
    // Default values for fields not provided by Mapbox
    phone: "Call for info",
    hours: "Call for hours",
    rating: 0,
    reviewCount: 0,
    status: "Open",
    type: "Medical Lab",
    website: undefined,
  };
}

/**
 * Geocode a location query to get coordinates using Mapbox Geocoding API
 */
export async function geocodeLocation(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set");
  }

  const params = new URLSearchParams({
    q: query,
    types: "place,locality,neighborhood,address",
    limit: "1",
    country: "US",
    access_token: token,
  });

  try {
    const response = await fetch(`${MAPBOX_BASE_URL}/forward?${params}`);
    if (!response.ok) {
      throw new Error(
        `Mapbox API error: ${response.status} ${response.statusText}`
      );
    }
    const data: MapboxResponse = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        lat: feature.properties.coordinates.latitude,
        lng: feature.properties.coordinates.longitude,
      };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding location:", error);
    return null;
  }
}
