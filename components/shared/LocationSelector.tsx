"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const LOCATION_STORAGE_KEY = "user_location";
export const LOCATION_PROMPT_FLAG = "location_permission_prompted";
export const LOCATION_UPDATED_EVENT = "user-location-updated";

export type StoredLocation = {
  method: "manual" | "geolocation";
  zipCode?: string;
  state?: string;
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

              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );
                if (response.ok) {
                  const data = await response.json();
                  derivedZip = data.postcode ?? "";
                  derivedState =
                    data.principalSubdivision ?? data.countryName ?? "";
                }
              } catch (geoError) {
                console.error("Reverse geocoding failed", geoError);
                if (!options?.silent) {
                  setErrorMessage(
                    "Unable to resolve address details, but your coordinates were saved."
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
    if (location.zipCode && location.state) {
      return `${location.zipCode}, ${location.state}`;
    }
    if (location.zipCode) {
      return location.zipCode;
    }
    if (location.latitude != null && location.longitude != null) {
      return `Lat ${formatCoordinate(
        location.latitude
      )}, Lon ${formatCoordinate(location.longitude)}`;
    }
    return "Location saved";
  })();

  if (location) {
    return (
      <Card className='border-primary/20 bg-primary/5'>
        <CardContent className='pt-4 pb-4'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-primary' />
                <span className='text-sm font-medium'>{locationLabel}</span>
              </div>
              <p className='text-xs text-muted-foreground mt-2'>
                Saved via{" "}
                {location.method === "manual"
                  ? "manual entry"
                  : "device location"}{" "}
                on {new Date(location.resolvedAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant='ghost' size='sm' onClick={handleClear}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className='pt-6 pb-6 space-y-4'>
        <div className='flex items-center gap-2'>
          <MapPin className='h-5 w-5 text-muted-foreground' />
          <h3 className='font-semibold'>Set Your Location</h3>
        </div>
        <p className='text-sm text-muted-foreground'>
          Help us show you the most convenient labs in your area. We will only
          ask for this once.
        </p>

        <div className='space-y-3'>
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
            className='w-full'
            onClick={() => requestDeviceLocation()}
            disabled={loading}
          >
            <MapPin className='h-4 w-4 mr-2' />
            {loading ? "Getting location..." : "Use my current location"}
          </Button>

          {errorMessage && (
            <p className='text-xs text-destructive'>{errorMessage}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
