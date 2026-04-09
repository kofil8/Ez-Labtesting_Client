export interface LabCenter {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  type: string;
  hours?: string;
  status: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  lastVerified: string;
  createdAt: string;
  updatedAt: string;
  distance?: number;
}

export interface SelectedLabCenter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  hours?: string;
  status?: string;
  type?: string;
  source?: "locator" | "order";
  selectedAt?: string;
}

export interface LabCenterQuery {
  lat?: number;
  lng?: number;
  radius?: number;
  search?: string;
  type?: string;
  status?: string;
  isActive?: boolean;
}

export interface GeocodeRequest {
  address: string;
}

export interface GeocodeResponse {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface CreateLabCenterRequest {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  type: string;
  hours?: string;
  status?: string;
  latitude: number;
  longitude: number;
  rating?: number;
  reviewCount?: number;
  isActive?: boolean;
}

export interface UpdateLabCenterRequest extends Partial<CreateLabCenterRequest> {
  lastVerified?: string;
}

// Google Places integration types
export interface GooglePlaceResult {
  placeId?: string;
  location?: {
    lat: number;
    lng: number;
  };
  formattedAddress?: string;
  photos?: string[];
  businessStatus?: string;
  openingHours?: {
    isOpen?: boolean;
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
  };
}

// Search suggestion for autocomplete
export interface SearchSuggestion {
  placeId?: string;
  mainText: string;
  secondaryText?: string;
  formattedAddress?: string;
  description: string;
}

// Marker data for clustering and display
export interface MarkerData extends LabCenter {
  source?: "database" | "places"; // Indicate data source
}

// Search state for managing API calls and caching
export interface SearchCache {
  key: string; // "lat:lng:radius"
  results: LabCenter[];
  timestamp: number;
  expiresIn: number; // TTL in milliseconds
}

// Geolocation state
export interface GeolocationState {
  coords: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
}

export interface ClientLocation {
  lat: number;
  lng: number;
  label?: string;
  address?: string;
  source?: "order" | "payload" | "manual";
}

export interface LabCenterFilterState {
  radius: number;
  type: string;
  status: string;
  rating: "all" | "4" | "3";
}

export type LabLocatorStatus =
  | "idle"
  | "locating"
  | "searching"
  | "results"
  | "empty"
  | "error";

export type LabLocatorViewMode = "list" | "map";

export type LabLocatorSearchMethod = "typed" | "geolocate" | "order";

export type LabCenterSortOption = "distance" | "rating";

export interface LabLocatorFilters {
  radius: number;
  type: string;
  status: string;
  rating: "all" | "4" | "3";
  sort: LabCenterSortOption;
}

export interface AppliedFilterChip {
  key: keyof LabLocatorFilters;
  label: string;
}
