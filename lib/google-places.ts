import { LabCenter } from "@/types/lab-center";

const GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GOOGLE_NEARBY_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const METERS_PER_MILE = 1609.34;
const MAX_NEARBY_RADIUS_METERS = 50000; // Google Nearby Search caps at 50 km

function getGoogleApiKey(): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set");
  }
  return key;
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now?: boolean;
  };
  business_status?: string;
  types?: string[];
}

interface NearbySearchResponse {
  status: string;
  results: GooglePlaceResult[];
  error_message?: string;
}

/**
 * Geocode a free-form address or city string using Google Geocoding API
 */
export async function geocodeLocation(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  const key = getGoogleApiKey();
  const params = new URLSearchParams({
    address: query,
    key,
  });

  try {
    const response = await fetch(`${GOOGLE_GEOCODE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    const data = await response.json();

    if (data.status !== "OK" || !data.results?.length) {
      return null;
    }

    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  } catch (error) {
    console.error("Error geocoding location:", error);
    return null;
  }
}

/**
 * Convert a Google Places Nearby Search result into our LabCenter domain model
 */
export function googlePlaceToLabCenter(place: GooglePlaceResult): LabCenter {
  const location = place.geometry.location;
  const typeLabel = place.types?.find(
    (type) => !type.startsWith("point_of_interest") && type !== "establishment"
  );

  const isOperational = place.business_status === "OPERATIONAL";
  const isOpenNow = place.opening_hours?.open_now;

  return {
    id: place.place_id,
    name: place.name,
    address: place.formatted_address || place.vicinity || "",
    latitude: location.lat,
    longitude: location.lng,
    phone: "Call for info",
    hours:
      isOpenNow === undefined
        ? "Call for hours"
        : isOpenNow
        ? "Open now"
        : "Closed now",
    rating: place.rating ?? 0,
    reviewCount: place.user_ratings_total ?? 0,
    status: isOperational && isOpenNow !== false ? "Open" : "Closed",
    type: typeLabel
      ? typeLabel
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "Medical Lab",
    website: undefined,
    isActive: true,
    lastVerified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Find medical labs near a coordinate using Google Places Nearby Search
 */
export async function fetchMedicalLabsNear(
  lat: number,
  lng: number,
  radiusMiles: number = 25,
  limit: number = 20
): Promise<LabCenter[]> {
  const key = getGoogleApiKey();
  const radiusMeters = Math.min(
    Math.max(radiusMiles, 1) * METERS_PER_MILE,
    MAX_NEARBY_RADIUS_METERS
  );

  const params = new URLSearchParams({
    key,
    location: `${lat},${lng}`,
    radius: radiusMeters.toFixed(0),
    keyword: "medical laboratory blood test diagnostics clinic",
    type: "health",
  });

  try {
    const response = await fetch(`${GOOGLE_NEARBY_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Google Places error: ${response.status}`);
    }

    const data: NearbySearchResponse = await response.json();
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      const message = data.error_message || data.status;
      throw new Error(`Google Places error: ${message}`);
    }

    const results = data.results || [];
    return results.slice(0, limit).map(googlePlaceToLabCenter);
  } catch (error) {
    console.error("Error fetching labs near location:", error);
    return [];
  }
}
