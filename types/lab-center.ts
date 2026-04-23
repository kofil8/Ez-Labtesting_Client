export type ProviderCode = "ACCESS" | "CPL" | "QUEST" | "LABCORP";

export interface LabCenter {
  id: string;
  name: string;
  address: string;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
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
  providerCode?: ProviderCode | null;
  providerLabel?: string | null;
  source?: "database" | "places";
  matchType?: "partner" | "reference" | "assigned";
  selectionAllowed?: boolean;
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

export interface AssignedLabCenter {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  hours?: string;
  status?: string;
  type?: string;
  source?: "assigned";
  siteId?: string;
  city?: string;
  state?: string;
  zip?: string;
  formattedAddress?: string;
}

export interface LabCenterQuery {
  lat?: number;
  lng?: number;
  radius?: number;
  search?: string;
  type?: string;
  providerCode?: ProviderCode;
  providerCodes?: ProviderCode[];
  status?: string;
  isActive?: boolean;
}

export interface NationwideLabQuery {
  country?: "US";
  providers?: ProviderCode[];
  page?: number;
  pageSize?: number;
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
  source?: "database" | "places";
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

export type LabLocatorSearchMethod =
  | "typed"
  | "geolocate"
  | "order"
  | "selected"
  | "assigned";

export type LabLocatorPageMode =
  | "browse"
  | "selected_lab"
  | "access_assigned"
  | "nationwide";

export type LabCenterSortOption = "distance" | "rating";

export interface LabLocatorFilters {
  radius: number;
  type: string;
  provider: "all" | ProviderCode;
  status: string;
  rating: "all" | "4" | "3";
  sort: LabCenterSortOption;
}

export interface AppliedFilterChip {
  key: keyof LabLocatorFilters;
  label: string;
}

export interface NationwideLabGroup {
  stateCode: string;
  stateName: string;
  providerCode: ProviderCode;
  providerLabel: string;
  sampleLabs: LabCenter[];
  source: "places";
  matchType: "reference";
}

export interface NationwideLabResponse {
  groups: NationwideLabGroup[];
  meta: {
    page: number;
    pageSize: number;
    totalGroups: number;
    excludedStates: string[];
  };
}
