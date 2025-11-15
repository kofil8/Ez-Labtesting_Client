"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LOCATION_STORAGE_KEY = "user_location";
export const LOCATION_PROMPT_FLAG = "location_permission_prompted";
export const LOCATION_UPDATED_EVENT = "user-location-updated";

export type StoredLocation = {
  method: "manual" | "geolocation";
  zipCode?: string;
  state?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  resolvedAt: string;
};

interface LocationSelectorProps {
  onLocationChange?: (zipCode: string, state: string) => void;
}

const formatCoordinate = (value?: number) => {
  if (typeof value !== "number") return "";
  return value.toFixed(3);
};

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [zipInput, setZipInput] = useState("");
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const broadcastLocationChange = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(LOCATION_UPDATED_EVENT));
    }
  }, []);

  const hydrateFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StoredLocation;
        setLocation(parsed);
        if (parsed.zipCode) {
          setZipInput(parsed.zipCode);
        }
        onLocationChange?.(parsed.zipCode ?? "", parsed.state ?? "");
      } else {
        setLocation(null);
        setZipInput("");
        onLocationChange?.("", "");
      }
    } catch (error) {
      console.error("Unable to load saved location", error);
    }
  }, [onLocationChange]);

  const persistLocation = useCallback(
    (next: StoredLocation) => {
      setLocation(next);
      if (next.zipCode) {
        setZipInput(next.zipCode);
      }
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(next));
      onLocationChange?.(next.zipCode ?? "", next.state ?? "");
      setErrorMessage(null);
      broadcastLocationChange();
    },
    [broadcastLocationChange, onLocationChange]
  );

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    const handleLocationUpdate = () => {
      hydrateFromStorage();
    };

    window.addEventListener(LOCATION_UPDATED_EVENT, handleLocationUpdate);
    return () => {
      window.removeEventListener(LOCATION_UPDATED_EVENT, handleLocationUpdate);
    };
  }, [hydrateFromStorage]);

  const requestDeviceLocation = useCallback(
    (options?: { silent?: boolean }) => {
      if (!("geolocation" in navigator)) {
        if (!options?.silent) {
          setErrorMessage("Geolocation is not supported in this browser.");
        }
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          (async () => {
            try {
              const { latitude, longitude } = position.coords;
              let derivedZip = "";
              let derivedState = "";

              // Enhanced reverse geocoding with multiple fallback services
              try {
                let geoData = null;

                // Try BigDataCloud first
                try {
                  const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                  );
                  if (response.ok) {
                    geoData = await response.json();
                    derivedZip = geoData.postcode ?? "";
                    derivedState =
                      geoData.principalSubdivision ?? geoData.countryName ?? "";

                    // If we got good data, we're done
                    if (derivedZip || derivedState) {
                      console.log(
                        "Successfully resolved location with BigDataCloud"
                      );
                    }
                  }
                } catch (error) {
                  console.warn(
                    "BigDataCloud geocoding failed, trying fallback"
                  );
                }

                // If BigDataCloud didn't provide good results, try Nominatim
                if (!derivedZip && !derivedState) {
                  try {
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
                    );
                    if (response.ok) {
                      const nominatimData = await response.json();
                      const address = nominatimData.address || {};
                      derivedZip = address.postcode ?? "";
                      derivedState = address.state ?? address.country ?? "";

                      if (derivedZip || derivedState) {
                        console.log(
                          "Successfully resolved location with Nominatim"
                        );
                      }
                    }
                  } catch (error) {
                    console.warn("Nominatim geocoding failed");
                  }
                }

                // If we still don't have good location data, provide a generic location
                if (!derivedZip && !derivedState) {
                  derivedState = "Current Location";
                  console.log("Using generic location name as fallback");
                }
              } catch (geoError) {
                console.error("All geocoding services failed", geoError);
                derivedState = "Current Location";
                if (!options?.silent) {
                  setErrorMessage(
                    "Unable to resolve exact address, but your location was saved."
                  );
                }
              }

              persistLocation({
                method: "geolocation",
                zipCode: derivedZip || undefined,
                state: derivedState || undefined,
                latitude,
                longitude,
                resolvedAt: new Date().toISOString(),
              });
            } catch (err) {
              console.error("Error saving location", err);
              if (!options?.silent) {
                setErrorMessage(
                  "We could not save your location. Please try again."
                );
              }
            } finally {
              setLoading(false);
            }
          })();
        },
        (error) => {
          console.error("Geolocation error", error);
          if (!options?.silent) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setErrorMessage(
                  "Location permission was denied. You can allow access from your browser settings."
                );
                break;
              case error.POSITION_UNAVAILABLE:
                setErrorMessage(
                  "Your location could not be determined. Please try again later."
                );
                break;
              case error.TIMEOUT:
                setErrorMessage(
                  "Timed out while getting your location. Please try again."
                );
                break;
              default:
                setErrorMessage(
                  "An unexpected error occurred while requesting your location."
                );
            }
          }
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    },
    [persistLocation]
  );

  useEffect(() => {
    if (location) {
      return;
    }

    const hasPrompted = localStorage.getItem(LOCATION_PROMPT_FLAG);
    if (!hasPrompted) {
      localStorage.setItem(LOCATION_PROMPT_FLAG, "true");
      requestDeviceLocation({ silent: true });
    }
  }, [location, requestDeviceLocation]);

  const handleSetZipCode = () => {
    if (zipInput.length === 5) {
      persistLocation({
        method: "manual",
        zipCode: zipInput,
        state: "Not specified",
        resolvedAt: new Date().toISOString(),
      });
    }
  };

  const handleClear = () => {
    setLocation(null);
    setZipInput("");
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    localStorage.removeItem(LOCATION_PROMPT_FLAG);
    broadcastLocationChange();
    onLocationChange?.("", "");
  };

  const locationLabel = (() => {
    if (!location) return "";

    // Prefer zipCode + state combination
    if (
      location.zipCode &&
      location.state &&
      location.state !== "Not specified"
    ) {
      return `${location.zipCode}, ${location.state}`;
    }

    // Just zipCode if available
    if (location.zipCode) {
      return location.zipCode;
    }

    // Just state/region if available and meaningful
    if (location.state && location.state !== "Not specified") {
      return location.state;
    }

    // Only show coordinates as absolute last resort, and make them more user-friendly
    if (location.latitude != null && location.longitude != null) {
      return `Near ${formatCoordinate(location.latitude)}, ${formatCoordinate(
        location.longitude
      )}`;
    }

    return "Location saved";
  })();

  if (location) {
    return (
      <AnimatePresence mode='wait'>
        <motion.div
          key='location-set'
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className='border-primary/20 bg-primary/5'>
            <CardContent className='pt-4 pb-4'>
              <div className='flex items-start justify-between gap-4'>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className='flex items-center gap-2'>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MapPin className='h-4 w-4 text-primary' />
                    </motion.div>
                    <motion.span
                      className='text-sm font-medium'
                      layout
                      transition={{ duration: 0.3 }}
                    >
                      {locationLabel}
                    </motion.span>
                  </div>
                  <motion.p
                    className='text-xs text-muted-foreground mt-2'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    Saved via{" "}
                    {location.method === "manual"
                      ? "manual entry"
                      : "device location"}{" "}
                    on {new Date(location.resolvedAt).toLocaleDateString()}
                  </motion.p>
                </motion.div>
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleClear}
                    className='hover:bg-red-50 hover:text-red-600 transition-colors'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='location-form'
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card>
          <CardContent className='pt-6 pb-6 space-y-4'>
            <motion.div
              className='flex items-center gap-2'
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <MapPin className='h-5 w-5 text-muted-foreground' />
              <h3 className='font-semibold'>Set Your Location</h3>
            </motion.div>
            <motion.p
              className='text-sm text-muted-foreground'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              Help us show you the most convenient labs in your area. We will
              only ask for this once.
            </motion.p>

            <motion.div
              className='space-y-3'
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className='flex gap-2'>
                <Input
                  placeholder='Enter ZIP code'
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  maxLength={5}
                  className='flex-1'
                />
                <Button
                  onClick={handleSetZipCode}
                  disabled={zipInput.length !== 5 || loading}
                >
                  Set
                </Button>
              </div>

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background px-2 text-muted-foreground'>
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant='outline'
                className='w-full transition-all hover:scale-[1.02]'
                onClick={() => requestDeviceLocation()}
                disabled={loading}
              >
                <motion.div
                  animate={{ rotate: loading ? 360 : 0 }}
                  transition={{
                    duration: 1,
                    repeat: loading ? Infinity : 0,
                    ease: "linear",
                  }}
                >
                  <MapPin className='h-4 w-4 mr-2' />
                </motion.div>
                {loading ? "Getting location..." : "Use my current location"}
              </Button>

              <AnimatePresence>
                {errorMessage && (
                  <motion.p
                    className='text-xs text-destructive'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
