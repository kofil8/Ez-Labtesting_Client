import { useCallback, useState } from "react";

interface GeolocationCoords {
  lat: number;
  lng: number;
}

interface UseGeolocationReturn {
  coords: GeolocationCoords | null;
  isLoading: boolean;
  error: string | null;
  requestGeolocation: () => Promise<GeolocationCoords | null>;
}

/**
 * Hook to request browser geolocation
 * Handles permission denied, timeout, and position unavailable errors gracefully
 * @returns {UseGeolocationReturn} Geolocation state and request function
 */
export function useGeolocation(): UseGeolocationReturn {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestGeolocation =
    useCallback(async (): Promise<GeolocationCoords | null> => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        const err = "Geolocation is not supported by your browser";
        setError(err);
        return null;
      }

      setIsLoading(true);
      setError(null);

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const geolocation: GeolocationCoords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCoords(geolocation);
            setIsLoading(false);
            resolve(geolocation);
          },
          (err) => {
            let errorMessage = "Failed to get location";

            switch (err.code) {
              case 1: // PERMISSION_DENIED
                errorMessage =
                  "Location access denied. Please enable it in your browser settings.";
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage =
                  "Location information is unavailable. Please check your device settings.";
                break;
              case 3: // TIMEOUT
                errorMessage = "Location request timed out. Please try again.";
                break;
              default:
                errorMessage = `Unable to get location (code ${err.code}).`;
            }

            setError(errorMessage);
            setIsLoading(false);
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      });
    }, []);

  return { coords, isLoading, error, requestGeolocation };
}
