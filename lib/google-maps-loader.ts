type GoogleMapsLibrary = "places" | "marker" | "geometry" | "routes";

let googleMapsPromise: Promise<typeof google> | null = null;

interface LoaderOptions {
  apiKey?: string;
  libraries?: GoogleMapsLibrary[];
  language?: string;
  region?: string;
}

const CALLBACK_NAME = "__ezLabGoogleMapsInit";

export function loadGoogleMapsApi({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  libraries = ["places", "marker"],
  language = "en",
  region = "US",
}: LoaderOptions = {}): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Maps can only be loaded in the browser"),
    );
  }

  if (!apiKey) {
    return Promise.reject(
      new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for Google Maps API"),
    );
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise<typeof google>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-ezlab-google-maps='true']",
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.google?.maps) {
          resolve(window.google);
          return;
        }
        reject(
          new Error(
            "Google Maps script loaded but maps namespace is unavailable",
          ),
        );
      });
      existingScript.addEventListener("error", () => {
        googleMapsPromise = null;
        reject(new Error("Failed to load Google Maps script"));
      });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.dataset.ezlabGoogleMaps = "true";

    const query = new URLSearchParams({
      key: apiKey,
      v: "weekly",
      loading: "async",
      callback: CALLBACK_NAME,
      libraries: libraries.join(","),
      language,
      region,
    });

    script.src = `https://maps.googleapis.com/maps/api/js?${query.toString()}`;

    (window as Window & { [CALLBACK_NAME]?: () => void })[CALLBACK_NAME] =
      () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          googleMapsPromise = null;
          reject(
            new Error("Google Maps callback fired without maps namespace"),
          );
        }
        delete (window as Window & { [CALLBACK_NAME]?: () => void })[
          CALLBACK_NAME
        ];
      };

    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error("Failed to load Google Maps JavaScript API"));
      delete (window as Window & { [CALLBACK_NAME]?: () => void })[
        CALLBACK_NAME
      ];
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
