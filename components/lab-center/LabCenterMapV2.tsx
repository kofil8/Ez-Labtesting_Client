"use client";

import { Button } from "@/components/ui/button";
import {
  GOOGLE_MAPS_LANGUAGE,
  GOOGLE_MAPS_LIBRARIES,
  GOOGLE_MAPS_REGION,
  GOOGLE_MAPS_VERSION,
} from "@/lib/google-maps-loader";
import { getDirectionsUrl } from "@/lib/locator/controller";
import {
  AssignedLabCenter,
  LabCenter,
  LabLocatorFilters,
  LabLocatorPageMode,
} from "@/types/lab-center";
import type { Marker } from "@googlemaps/markerclusterer";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  Bus,
  Car,
  Locate,
  Navigation,
  Plane,
  SlidersHorizontal,
  Star,
  Train,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RouteMode = "drive" | "bus" | "rail" | "flight";

type RouteRequestResult =
  | {
      status: "OK";
      source: "routes" | "directions";
      routes: any[];
    }
  | {
      status: "ZERO_RESULTS";
    }
  | {
      status: "ERROR";
      errorCode: string;
    };

function toText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "text" in value &&
    typeof (value as { text?: unknown }).text === "string"
  ) {
    return (value as { text: string }).text;
  }

  return "";
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function requestRoute({
  origin,
  destination,
  mode,
}: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  mode: RouteMode;
}): Promise<RouteRequestResult> {
  if (mode === "flight") {
    return {
      status: "ERROR",
      errorCode: "UNSUPPORTED_MODE_FLIGHT",
    };
  }

  const isTransitMode = mode === "bus" || mode === "rail";
  const routesApi = (google.maps as any).routes?.Route;

  if (!isTransitMode && routesApi?.computeRoutes) {
    try {
      const result = await routesApi.computeRoutes({
        origin,
        destination,
        travelMode: "DRIVING",
        units: "IMPERIAL",
        departureTime: new Date(),
        trafficModel: "BEST_GUESS",
        fields: ["legs", "path", "polyline"],
      });

      const routes = result?.routes;
      if (Array.isArray(routes) && routes.length > 0) {
        return { status: "OK", source: "routes", routes };
      }

      return { status: "ZERO_RESULTS" };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error || "");
      if (message.includes("ZERO_RESULTS")) {
        return { status: "ZERO_RESULTS" };
      }
    }
  }

  const directionsService = new google.maps.DirectionsService();

  return new Promise<RouteRequestResult>((resolve) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: isTransitMode
          ? google.maps.TravelMode.TRANSIT
          : google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        transitOptions: isTransitMode
          ? {
              modes: [
                mode === "bus"
                  ? google.maps.TransitMode.BUS
                  : google.maps.TransitMode.RAIL,
              ],
            }
          : undefined,
        drivingOptions: {
          departureTime: new Date(),
        },
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response?.routes) {
          resolve({ status: "OK", source: "directions", routes: response.routes });
          return;
        }

        if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
          resolve({ status: "ZERO_RESULTS" });
          return;
        }

        resolve({
          status: "ERROR",
          errorCode: status || "DIRECTIONS_REQUEST_FAILED",
        });
      },
    );
  });
}

function ClientLocationMarker({
  location,
}: {
  location: { lat: number; lng: number; label?: string } | null;
}) {
  if (!location) {
    return null;
  }

  return (
    <AdvancedMarker
      position={{
        lat: location.lat,
        lng: location.lng,
      }}
      title={location.label || "Client location"}
      zIndex={300}
    >
      <div
        style={{
          filter: "drop-shadow(0 3px 6px rgba(14,116,144,0.45))",
        }}
      >
        <svg width='32' height='46' viewBox='0 0 28 40' fill='none'>
          <path
            d='M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.268 21.732 0 14 0z'
            fill='#0369a1'
          />
          <circle cx='14' cy='14' r='6' fill='white' />
        </svg>
      </div>
    </AdvancedMarker>
  );
}

function ClusteredMarkers({
  canSelect,
  labs,
  selectedLabId,
  onDirections,
  onSelect,
}: {
  canSelect: boolean;
  labs: LabCenter[];
  selectedLabId?: string;
  onDirections: (lab: LabCenter) => void;
  onSelect: (lab: LabCenter) => void;
}) {
  const map = useMap();
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [previewedLabId, setPreviewedLabId] = useState<string | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        markers: [],
        algorithm: new SuperClusterAlgorithm({ radius: 72 }),
      });
    }

    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [map]);

  useEffect(() => {
    if (!map || labs.length === 0 || selectedLabId) {
      return;
    }

    if (labs.length === 1) {
      map.panTo({ lat: labs[0].latitude, lng: labs[0].longitude });
      map.setZoom(13);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    labs.forEach((lab) => {
      bounds.extend({ lat: lab.latitude, lng: lab.longitude });
    });

    map.fitBounds(bounds, 96);
  }, [labs, map, selectedLabId]);

  useEffect(() => {
    if (!selectedLabId) {
      return;
    }

    const nextLab = labs.find((lab) => lab.id === selectedLabId) || null;
    if (nextLab && map) {
      map.panTo({ lat: nextLab.latitude, lng: nextLab.longitude });
      if ((map.getZoom() ?? 0) < 13) {
        map.setZoom(13);
      }
    }
  }, [labs, map, selectedLabId]);

  const syncClustererMarkers = useCallback(() => {
    if (!clusterer.current) {
      return;
    }

    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markersRef.current));
  }, []);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker) {
      markersRef.current[key] = marker;
    } else {
      delete markersRef.current[key];
    }

    syncClustererMarkers();
  };

  const activeLab = useMemo(() => {
    const activeId = previewedLabId || selectedLabId;
    return activeId ? labs.find((lab) => lab.id === activeId) || null : null;
  }, [labs, previewedLabId, selectedLabId]);

  return (
    <>
      {labs.map((lab) => (
        <AdvancedMarker
          key={lab.id}
          ref={(marker) => setMarkerRef(marker as Marker | null, lab.id)}
          position={{ lat: lab.latitude, lng: lab.longitude }}
          title={lab.name}
          onClick={() => {
            setPreviewedLabId(lab.id);
            onSelect(lab);
          }}
        >
          <div
            className={`min-w-[64px] rounded-full border px-3 py-1.5 text-center text-[11px] font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition ${
              selectedLabId === lab.id
                ? "border-sky-600 bg-gradient-to-r from-sky-700 to-cyan-700 text-white"
                : "border-white/90 bg-white/95 text-slate-700"
            }`}
          >
            {lab.distance !== undefined ? `${lab.distance.toFixed(1)} mi` : "Lab"}
          </div>
        </AdvancedMarker>
      ))}

      {activeLab ? (
        <InfoWindow
          position={{ lat: activeLab.latitude, lng: activeLab.longitude }}
          onCloseClick={() => setPreviewedLabId(null)}
          pixelOffset={[0, -38]}
          maxWidth={280}
        >
          <div className='max-w-[240px] space-y-3 p-1'>
            <div className='space-y-1'>
              <p className='font-semibold text-slate-900'>{activeLab.name}</p>
              <p className='text-xs leading-5 text-slate-500'>
                {activeLab.address}
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                type='button'
                size='sm'
                className='h-8 rounded-full bg-gradient-to-r from-sky-700 to-cyan-700 px-3 text-white'
                onClick={() => onSelect(activeLab)}
              >
                {canSelect ? "Select" : "Preview"}
              </Button>
              <Button
                type='button'
                size='sm'
                variant='outline'
                className='h-8 rounded-full px-3'
                onClick={() => onDirections(activeLab)}
              >
                Directions
              </Button>
            </div>
          </div>
        </InfoWindow>
      ) : null}
    </>
  );
}

function RecenterButton({
  center,
  disabled,
}: {
  center: { lat: number; lng: number };
  disabled?: boolean;
}) {
  const map = useMap();

  return (
    <Button
      type='button'
      size='icon'
      variant='glass'
      className='pointer-events-auto h-11 w-11 rounded-full border-white/80 bg-white/88 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur'
      disabled={disabled}
      onClick={() => {
        if (!map || disabled) {
          return;
        }

        map.panTo(center);
        map.setZoom(11);
      }}
      aria-label='Recenter map'
    >
      <Locate className='h-4 w-4 text-slate-700' />
    </Button>
  );
}

function DirectionsRenderer({
  destination,
  origin,
  routeMode,
}: {
  destination: { lat: number; lng: number };
  origin: { lat: number; lng: number };
  routeMode: RouteMode;
}) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    polylineRef.current = new google.maps.Polyline({
      path: [],
      strokeColor: "#0284c7",
      strokeWeight: 4,
      strokeOpacity: 0.85,
      map,
    });

    return () => {
      polylineRef.current?.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!polylineRef.current) {
      return;
    }

    if (routeMode === "flight") {
      polylineRef.current.setPath([]);
      return;
    }

    let active = true;

    const fetchRoute = async () => {
      try {
        const result = await requestRoute({
          origin,
          destination,
          mode: routeMode,
        });

        if (!active) {
          return;
        }

        if (result.status !== "OK" || result.routes.length === 0) {
          polylineRef.current?.setPath([]);
          return;
        }

        const routeData = result.routes[0];
        const path =
          routeData.overview_path ||
          routeData.path ||
          routeData.polyline?.path ||
          [];

        polylineRef.current?.setPath(path);
      } catch {
        if (!active) {
          return;
        }

        polylineRef.current?.setPath([]);
      }
    };

    void fetchRoute();

    return () => {
      active = false;
    };
  }, [destination, origin, routeMode]);

  return null;
}

function DirectionsPanel({
  lab,
  routeMode,
  routeOrigin,
  onClose,
  onRouteModeChange,
}: {
  lab: LabCenter;
  routeMode: RouteMode;
  routeOrigin: { lat: number; lng: number } | null;
  onClose: () => void;
  onRouteModeChange: (mode: RouteMode) => void;
}) {
  const [directions, setDirections] = useState<
    { instruction: string; distance: string; duration: string }[]
  >([]);
  const [totalDistance, setTotalDistance] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!routeOrigin) {
        setDirections([]);
        setTotalDistance("");
        setTotalDuration("");
        setError("Location is required. Search or use your location first.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setDirections([]);
      setTotalDistance("");
      setTotalDuration("");

      try {
        const result = await requestRoute({
          origin: routeOrigin,
          destination: { lat: lab.latitude, lng: lab.longitude },
          mode: routeMode,
        });

        if (!active) {
          return;
        }

        setIsLoading(false);

        if (result.status === "ZERO_RESULTS") {
          setError("No route found between your location and this lab.");
          return;
        }

        if (result.status === "ERROR") {
          if (result.errorCode === "UNSUPPORTED_MODE_FLIGHT") {
            setError(
              "Flight directions are not available in map routing. Choose Drive, Bus, or Rail.",
            );
            return;
          }

          setError("Unable to get directions right now. Please retry.");
          return;
        }

        if (result.routes.length === 0) {
          setError("No route found between your location and this lab.");
          return;
        }

        const routeData = result.routes[0];
        const leg = routeData?.legs?.[0];

        if (!leg) {
          setError("No route details available for this destination.");
          return;
        }

        setTotalDistance(toText(leg.distance));
        setTotalDuration(toText(leg.duration));
        setDirections(
          (leg.steps || []).map((step: any) => ({
            instruction:
              step.instructions || step.navigationInstruction?.instructions || "",
            distance: toText(step.distance),
            duration: toText(step.duration),
          })),
        );
      } catch {
        if (!active) {
          return;
        }

        setIsLoading(false);
        setError("Unable to get directions right now. Please retry.");
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [lab, routeMode, routeOrigin]);

  return (
    <div className='pointer-events-auto absolute bottom-4 right-4 top-28 z-30 hidden w-[360px] overflow-hidden rounded-[28px] border border-white/80 bg-white/94 shadow-[0_24px_60px_rgba(15,23,42,0.22)] backdrop-blur-2xl lg:flex lg:flex-col'>
      <div className='flex items-start justify-between gap-3 border-b border-slate-200/80 px-5 py-4'>
        <div className='min-w-0'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400'>
            Directions
          </p>
          <h3 className='truncate text-base font-semibold text-slate-900'>
            {lab.name}
          </h3>
          <p className='truncate text-xs text-slate-500'>{lab.address}</p>
        </div>
        <Button
          type='button'
          size='icon-sm'
          variant='ghost'
          className='rounded-full'
          onClick={onClose}
          aria-label='Close directions panel'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex flex-wrap gap-2 border-b border-slate-200/80 px-5 py-4'>
        {([
          { key: "drive", label: "Drive", Icon: Car },
          { key: "bus", label: "Bus", Icon: Bus },
          { key: "rail", label: "Rail", Icon: Train },
          { key: "flight", label: "Flight", Icon: Plane },
        ] as { key: RouteMode; label: string; Icon: typeof Car }[]).map(
          (option) => (
            <Button
              key={option.key}
              type='button'
              variant={routeMode === option.key ? "default" : "outline"}
              className='h-9 rounded-full px-3 text-xs'
              onClick={() => onRouteModeChange(option.key)}
            >
              <option.Icon className='h-3.5 w-3.5' />
              {option.label}
            </Button>
          ),
        )}
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='px-5 py-8 text-sm text-slate-500'>Getting directions...</div>
        ) : error ? (
          <div className='space-y-3 px-5 py-8'>
            <p className='text-sm text-rose-600'>{error}</p>
            <Button
              type='button'
              variant='outline'
              className='rounded-full'
              asChild
            >
              <a
                href={getDirectionsUrl(lab)}
                rel='noreferrer'
                target='_blank'
              >
                Open in Google Maps
              </a>
            </Button>
          </div>
        ) : (
          <>
            {(totalDistance || totalDuration) && (
              <div className='flex gap-4 border-b border-sky-100 bg-sky-50/70 px-5 py-3 text-sm font-medium text-sky-700'>
                <span>{totalDistance}</span>
                <span>{totalDuration}</span>
              </div>
            )}
            <div className='space-y-4 px-5 py-4'>
              {directions.map((step, index) => (
                <div key={`${step.instruction}-${index}`} className='flex gap-3'>
                  <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600'>
                    {index + 1}
                  </div>
                  <div className='space-y-1'>
                    <p
                      className='text-sm leading-6 text-slate-800'
                    >
                      {stripHtml(step.instruction)}
                    </p>
                    <p className='text-xs text-slate-500'>
                      {step.distance} {step.duration ? `• ${step.duration}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ViewportSync({
  center,
  hasLabs,
  hasSearchAnchor,
  selectedLabId,
}: {
  center: { lat: number; lng: number };
  hasLabs: boolean;
  hasSearchAnchor: boolean;
  selectedLabId?: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || hasLabs || selectedLabId) {
      return;
    }

    map.panTo(center);
    map.setZoom(hasSearchAnchor ? 11 : 4);
  }, [center, hasLabs, hasSearchAnchor, map, selectedLabId]);

  return null;
}

function MapChip({
  active = false,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      className={`pointer-events-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur transition ${
        active
          ? "border-sky-200 bg-sky-50/95 text-sky-700"
          : "border-white/80 bg-white/92 text-slate-700"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function IdleMapOverlay() {
  return (
    <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6'>
      <div className='max-w-md rounded-[28px] border border-white/80 bg-white/84 p-6 text-center shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl'>
        <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400'>
          Find Lab Center
        </p>
        <h2 className='mt-2 text-2xl font-semibold text-slate-900'>
          Search to see nearby labs
        </h2>
        <p className='mt-2 text-sm leading-6 text-slate-500'>
          Enter a city, state, or ZIP code, or use your current location to load
          nearby lab centers and compare your options.
        </p>
      </div>
    </div>
  );
}

export function LabCenterMapV2({
  assignedLab = null,
  center,
  compact = false,
  confirmedLocation = null,
  filters,
  hasSearchAnchor = false,
  labs,
  onDirections,
  onOpenFilters,
  onSelect,
  onFilterChange,
  pageMode = "browse",
  routeOrigin = null,
  selectedLabId,
  showDirectionsForId,
  onCloseDirections,
}: {
  assignedLab?: AssignedLabCenter | null;
  center: { lat: number; lng: number };
  compact?: boolean;
  confirmedLocation?: { lat: number; lng: number; label?: string } | null;
  filters: LabLocatorFilters;
  hasSearchAnchor?: boolean;
  labs: LabCenter[];
  onDirections: (lab: LabCenter) => void;
  onOpenFilters: () => void;
  onSelect: (lab: LabCenter) => void;
  onFilterChange: <T extends keyof LabLocatorFilters>(
    key: T,
    value: LabLocatorFilters[T],
  ) => void;
  pageMode?: LabLocatorPageMode;
  routeOrigin?: { lat: number; lng: number } | null;
  selectedLabId?: string;
  showDirectionsForId?: string;
  onCloseDirections?: () => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
  const [localDirectionsLabId, setLocalDirectionsLabId] = useState<
    string | undefined
  >(undefined);
  const [routeMode, setRouteMode] = useState<RouteMode>("drive");

  const activeDirectionsLabId = showDirectionsForId ?? localDirectionsLabId;
  const directionsLab = activeDirectionsLabId
    ? labs.find((lab) => lab.id === activeDirectionsLabId) || null
    : null;
  const selectedLab = selectedLabId
    ? labs.find((lab) => lab.id === selectedLabId) || null
    : null;
  const isIdle = !hasSearchAnchor && labs.length === 0;

  const handleDirectionsOpen = useCallback(
    (lab: LabCenter) => {
      setLocalDirectionsLabId(lab.id);
      onDirections(lab);
    },
    [onDirections],
  );

  const handleDirectionsClose = useCallback(() => {
    setLocalDirectionsLabId(undefined);
    onCloseDirections?.();
  }, [onCloseDirections]);

  if (!apiKey) {
    return (
      <div className='flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(180deg,_rgba(248,250,252,0.95),_rgba(226,232,240,0.85))] p-6 text-center text-sm text-slate-500'>
        Google Maps is not configured for this environment.
      </div>
    );
  }

  return (
    <div className='relative h-full w-full overflow-hidden'>
      <APIProvider
        apiKey={apiKey}
        libraries={GOOGLE_MAPS_LIBRARIES}
        language={GOOGLE_MAPS_LANGUAGE}
        region={GOOGLE_MAPS_REGION}
        version={GOOGLE_MAPS_VERSION}
      >
        <Map
          mapId={mapId}
          defaultCenter={center}
          defaultZoom={4}
          mapTypeId='roadmap'
          gestureHandling='greedy'
          disableDefaultUI={false}
          fullscreenControl={true}
          keyboardShortcuts={true}
          mapTypeControl={true}
          rotateControl={true}
          scaleControl={true}
          streetViewControl={true}
          zoomControl={true}
          style={{ width: "100%", height: "100%" }}
        >
          <ViewportSync
            center={center}
            hasLabs={labs.length > 0}
            hasSearchAnchor={hasSearchAnchor}
            selectedLabId={selectedLabId}
          />
          <ClientLocationMarker location={confirmedLocation} />
          <ClusteredMarkers
            canSelect={pageMode !== "access_assigned"}
            labs={labs}
            onDirections={handleDirectionsOpen}
            onSelect={onSelect}
            selectedLabId={selectedLabId}
          />
          {routeOrigin && directionsLab && routeMode !== "flight" ? (
            <DirectionsRenderer
              destination={{
                lat: directionsLab.latitude,
                lng: directionsLab.longitude,
              }}
              origin={routeOrigin}
              routeMode={routeMode}
            />
          ) : null}

          {!compact && !isIdle ? (
            <div className='pointer-events-none absolute inset-x-4 top-24 z-20 flex items-start justify-center sm:inset-x-6 sm:top-28'>
              <div className='flex flex-wrap items-center justify-center gap-2'>
                <MapChip
                  active={filters.rating !== "all"}
                  onClick={() =>
                    onFilterChange(
                      "rating",
                      filters.rating === "all"
                        ? "4"
                        : filters.rating === "4"
                          ? "3"
                          : "all",
                    )
                  }
                >
                  <Star
                    className={`h-4 w-4 ${
                      filters.rating !== "all"
                        ? "fill-sky-500 text-sky-500"
                        : "text-slate-500"
                    }`}
                  />
                  {filters.rating === "all" ? "Rating" : `${filters.rating}+ stars`}
                </MapChip>
                <MapChip
                  active={filters.status === "Open"}
                  onClick={() =>
                    onFilterChange(
                      "status",
                      filters.status === "Open" ? "all" : "Open",
                    )
                  }
                >
                  Hours
                </MapChip>
                <MapChip active={false} onClick={onOpenFilters}>
                  <SlidersHorizontal className='h-4 w-4 text-slate-500' />
                  All filters
                </MapChip>
              </div>
            </div>
          ) : null}

          <div
            className={`pointer-events-none absolute inset-x-4 z-20 flex items-start justify-between gap-3 sm:inset-x-6 ${
              compact ? "top-4" : "top-4 sm:top-6"
            }`}
          >
            <div className='flex flex-col items-start gap-2'>
              {labs.length > 0 ? (
                <div className='rounded-full border border-white/80 bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[0_16px_32px_rgba(15,23,42,0.12)] backdrop-blur'>
                  {`${labs.length} nearby labs`}
                </div>
              ) : null}
              {pageMode === "access_assigned" && assignedLab ? (
                <div className='max-w-[280px] rounded-full border border-emerald-100 bg-white/92 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_16px_32px_rgba(15,23,42,0.12)] backdrop-blur'>
                  Assigned: <span className='text-slate-900'>{assignedLab.name}</span>
                </div>
              ) : null}
              {selectedLab && !directionsLab ? (
                <div className='max-w-[260px] rounded-full border border-sky-100 bg-white/92 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_16px_32px_rgba(15,23,42,0.12)] backdrop-blur'>
                  Selected: <span className='text-slate-900'>{selectedLab.name}</span>
                </div>
              ) : null}
            </div>
            <RecenterButton center={routeOrigin || center} disabled={isIdle} />
          </div>
        </Map>

        {isIdle ? <IdleMapOverlay /> : null}

        {directionsLab ? (
          <DirectionsPanel
            lab={directionsLab}
            onClose={handleDirectionsClose}
            onRouteModeChange={setRouteMode}
            routeMode={routeMode}
            routeOrigin={routeOrigin}
          />
        ) : null}

        {directionsLab ? (
          <div className='pointer-events-auto absolute bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] -translate-x-1/2 rounded-[24px] border border-white/80 bg-white/92 p-4 shadow-[0_20px_48px_rgba(15,23,42,0.18)] backdrop-blur-2xl lg:hidden'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400'>
                  Directions
                </p>
                <p className='truncate text-sm font-semibold text-slate-900'>
                  {directionsLab.name}
                </p>
                <p className='truncate text-xs text-slate-500'>
                  {routeOrigin
                    ? "Switch to desktop width for step-by-step directions."
                    : "Search or use your location first to enable directions."}
                </p>
              </div>
              <Button
                type='button'
                size='icon-sm'
                variant='ghost'
                className='rounded-full'
                onClick={handleDirectionsClose}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
            <div className='mt-3 flex flex-wrap gap-2'>
              <Button
                type='button'
                variant='outline'
                className='rounded-full'
                asChild
              >
                <a
                  href={getDirectionsUrl(directionsLab)}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Navigation className='h-4 w-4' />
                  Open in Maps
                </a>
              </Button>
            </div>
          </div>
        ) : null}
      </APIProvider>
    </div>
  );
}
