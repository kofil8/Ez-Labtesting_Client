"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  LOCATION_STORAGE_KEY, 
  LOCATION_UPDATED_EVENT, 
  StoredLocation 
} from "./LocationSelector";

interface LocationDisplayProps {
  showSelector?: boolean;
  onOpenSelector?: () => void;
  className?: string;
}

// Enhanced reverse geocoding function that tries multiple services
const reverseGeocode = async (latitude: number, longitude: number): Promise<{
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  displayName?: string;
}> => {
  const services = [
    // Primary service - BigDataCloud (free, no API key required)
    async () => {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city || data.locality,
          state: data.principalSubdivision,
          country: data.countryName,
          zipCode: data.postcode,
          displayName: data.city && data.principalSubdivision 
            ? `${data.city}, ${data.principalSubdivision}`
            : data.locality && data.countryName
            ? `${data.locality}, ${data.countryName}`
            : undefined
        };
      }
      throw new Error('BigDataCloud failed');
    },
    
    // Fallback service - Nominatim (OpenStreetMap)
    async () => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        return {
          city: address.city || address.town || address.village,
          state: address.state,
          country: address.country,
          zipCode: address.postcode,
          displayName: address.city && address.state
            ? `${address.city}, ${address.state}`
            : address.town && address.country
            ? `${address.town}, ${address.country}`
            : undefined
        };
      }
      throw new Error('Nominatim failed');
    }
  ];

  // Try each service in order
  for (const service of services) {
    try {
      const result = await service();
      if (result.displayName) {
        return result;
      }
    } catch (error) {
      console.warn('Geocoding service failed:', error);
      continue;
    }
  }

  // If all services fail, return a generic location based on coordinates
  return {
    displayName: `Location ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
  };
};

export function LocationDisplay({ 
  showSelector = true, 
  onOpenSelector,
  className = ""
}: LocationDisplayProps) {
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const hydrateFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StoredLocation;
        setLocation(parsed);
      } else {
        setLocation(null);
        setDisplayName("");
      }
    } catch (error) {
      console.error("Unable to load saved location", error);
      setLocation(null);
      setDisplayName("");
    }
  }, []);

  // Resolve location name from coordinates or stored data
  const resolveLocationName = useCallback(async (loc: StoredLocation) => {
    // If we already have a good location name, use it
    if (loc.zipCode && loc.state && loc.state !== "Not specified") {
      setDisplayName(`${loc.zipCode}, ${loc.state}`);
      return;
    }

    // If we have coordinates, try to resolve to a real location name
    if (loc.latitude != null && loc.longitude != null) {
      setIsResolving(true);
      try {
        const geoResult = await reverseGeocode(loc.latitude, loc.longitude);
        if (geoResult.displayName) {
          setDisplayName(geoResult.displayName);
          
          // Update stored location with resolved data
          const updatedLocation = {
            ...loc,
            zipCode: geoResult.zipCode || loc.zipCode,
            state: geoResult.state || loc.state,
            city: geoResult.city,
            country: geoResult.country
          };
          localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(updatedLocation));
        } else {
          setDisplayName("Current Location");
        }
      } catch (error) {
        console.error("Failed to resolve location name:", error);
        setDisplayName("Current Location");
      } finally {
        setIsResolving(false);
      }
    } else {
      setDisplayName(loc.zipCode || "Location Set");
    }
  }, []);

  // Load and resolve location on mount and updates
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (location) {
      resolveLocationName(location);
    }
  }, [location, resolveLocationName]);

  // Listen for location updates
  useEffect(() => {
    const handleLocationUpdate = () => {
      hydrateFromStorage();
    };

    window.addEventListener(LOCATION_UPDATED_EVENT, handleLocationUpdate);
    return () => {
      window.removeEventListener(LOCATION_UPDATED_EVENT, handleLocationUpdate);
    };
  }, [hydrateFromStorage]);

  const handleRefreshLocation = async () => {
    if (!location || !location.latitude || !location.longitude) return;
    
    setIsResolving(true);
    try {
      await resolveLocationName(location);
    } finally {
      setIsResolving(false);
    }
  };

  if (!location) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      >
        <MapPin className="h-4 w-4" />
        <span>No location set</span>
        {showSelector && onOpenSelector && (
          <Button
            variant="link"
            size="sm"
            onClick={onOpenSelector}
            className="h-auto p-0 text-primary hover:text-primary/80"
          >
            Set Location
          </Button>
        )}
      </motion.div>
    );
  }

  const locationDate = new Date(location.resolvedAt).toLocaleDateString();
  const locationMethod = location.method === "manual" ? "manual entry" : "device location";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayName}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`flex items-center gap-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ 
              rotate: isResolving ? 360 : 0,
              scale: isResolving ? 1.1 : 1
            }}
            transition={{ 
              rotate: { duration: 1, repeat: isResolving ? Infinity : 0, ease: "linear" },
              scale: { duration: 0.2 }
            }}
          >
            {isResolving ? (
              <RefreshCw className="h-4 w-4 text-blue-500" />
            ) : (
              <MapPin className="h-4 w-4 text-blue-600" />
            )}
          </motion.div>
          
          <div className="flex flex-col">
            <motion.span 
              className="text-sm font-medium text-gray-900 dark:text-white"
              layout
            >
              {displayName || "Resolving location..."}
            </motion.span>
            <motion.span 
              className="text-xs text-gray-500"
              layout
            >
              Saved via {locationMethod} on {locationDate}
            </motion.span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {location.latitude && location.longitude && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshLocation}
              disabled={isResolving}
              className="h-8 w-8 p-0 hover:bg-blue-50"
              title="Refresh location name"
            >
              <RefreshCw className={`h-3 w-3 ${isResolving ? 'animate-spin' : ''}`} />
            </Button>
          )}
          
          {showSelector && onOpenSelector && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSelector}
              className="h-8 px-3 text-xs hover:bg-blue-50 hover:border-blue-200"
            >
              Change
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
