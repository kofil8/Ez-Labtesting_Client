"use client";

import { LabCenter } from "@/types/lab-center";
import type { Marker } from "@googlemaps/markerclusterer";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { Bus, Car, Locate, Plane, SlidersHorizontal, Star, Train, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LabInfoWindow } from "./LabInfoWindow";
import { LabMarker } from "./LabMarker";

interface LabCenterMapProps {
  labCenters: LabCenter[];
  center: { lat: number; lng: number };
  zoom?: number;
  selectedLabId?: string;
  confirmedLocation?: { lat: number; lng: number; label?: string } | null;
  onSelectLabCenter?: (labCenter: LabCenter) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  routeOrigin?: { lat: number; lng: number } | null;
  onZoomChange?: (zoom: number) => void;
  showDirectionsForId?: string;
  onCloseDirections?: () => void;
  ratingFilter?: string;
  onRatingFilterChange?: () => void;
}

interface DirectionStep {
  instruction: string;
  distance: string;
  duration: string;
}

type RouteMode = "drive" | "bus" | "rail" | "flight";

type RouteStatus = "OK" | "ZERO_RESULTS" | "ERROR";

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

function toText(value: any): string {
  if (typeof value === "string") return value;
  if (value && typeof value.text === "string") return value.text;
  return "";
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

function ClusteredMarkers({
  labCenters,
  selectedLabId,
  onSelectLabCenter,
  onShowDirections,
}: {
  labCenters: LabCenter[];
  selectedLabId?: string;
  onSelectLabCenter?: (labCenter: LabCenter) => void;
  onShowDirections?: (lab: LabCenter) => void;
}) {
  const map = useMap();
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const [selectedLab, setSelectedLab] = useState<LabCenter | null>(null);
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        markers: [],
        algorithm: new SuperClusterAlgorithm({ radius: 60 }),
      });
    }

    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [map]);

  const syncClustererMarkers = useCallback(() => {
    if (!clusterer.current) return;
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markersRef.current));
  }, []);

  useEffect(() => {
    if (!map || labCenters.length === 0 || selectedLabId) return;

    if (labCenters.length === 1) {
      const onlyLab = labCenters[0];
      map.panTo({ lat: onlyLab.latitude, lng: onlyLab.longitude });
      map.setZoom(13);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    labCenters.forEach((lab) => {
      bounds.extend(new google.maps.LatLng(lab.latitude, lab.longitude));
    });

    map.fitBounds(bounds, { top: 80, right: 60, bottom: 60, left: 60 });
  }, [labCenters, map, selectedLabId]);

  useEffect(() => {
    if (!selectedLabId) {
      setSelectedLab(null);
      return;
    }

    const found = labCenters.find((lab) => lab.id === selectedLabId) || null;
    setSelectedLab(found);

    if (found && map) {
      map.panTo({ lat: found.latitude, lng: found.longitude });
      if ((map.getZoom() ?? 0) < 13) {
        map.setZoom(13);
      }
    }
  }, [selectedLabId, labCenters, map]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    const currentMarker = markersRef.current[key];

    if (marker && currentMarker === marker) {
      return;
    }

    if (!marker && !currentMarker) {
      return;
    }

    if (marker) {
      markersRef.current[key] = marker;
    } else {
      delete markersRef.current[key];
    }

    syncClustererMarkers();
  };

  return (
    <>
      {labCenters.map((lab) => (
        <LabMarker
          key={lab.id}
          lab={lab}
          isSelected={selectedLabId === lab.id}
          isOpen={lab.status === "Open"}
          onClick={() => {
            setSelectedLab(lab);
            onSelectLabCenter?.(lab);
          }}
          ref={(marker) => setMarkerRef(marker, lab.id)}
        />
      ))}

      {selectedLab && (
        <InfoWindow
          position={{ lat: selectedLab.latitude, lng: selectedLab.longitude }}
          onCloseClick={() => setSelectedLab(null)}
          pixelOffset={[0, -44]}
          maxWidth={300}
        >
          <LabInfoWindow
            lab={selectedLab}
            onClose={() => setSelectedLab(null)}
            onShowDirections={() => onShowDirections?.(selectedLab)}
            showDirectionsButton={true}
          />
        </InfoWindow>
      )}
    </>
  );
}

function RecenterButton({
  onRecenter,
  disabled,
}: {
  onRecenter: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onRecenter}
      disabled={disabled}
      title='Recenter map'
      style={{
        position: "absolute",
        top: 70,
        right: 10,
        zIndex: 12,
        background: "#fff",
        border: "1px solid #dadce0",
        borderRadius: 4,
        padding: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Locate style={{ width: 20, height: 20, color: "#5f6368" }} />
    </button>
  );
}

function DirectionsPanel({
  lab,
  routeOrigin,
  routeMode,
  onRouteModeChange,
  onClose,
}: {
  lab: LabCenter;
  routeOrigin: { lat: number; lng: number } | null;
  routeMode: RouteMode;
  onRouteModeChange: (mode: RouteMode) => void;
  onClose: () => void;
}) {
  const [directions, setDirections] = useState<DirectionStep[]>([]);
  const [totalDistance, setTotalDistance] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDirections = useCallback(async () => {
    if (!routeOrigin) {
      setError(
        "Location is required. Use search or your current location first.",
      );
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

        if (
          result.errorCode.includes("OVER_QUERY_LIMIT") ||
          result.errorCode.includes("QUOTA_EXCEEDED")
        ) {
          setError("Directions request limit reached. Please try again shortly.");
          return;
        }

        setError("Unable to get directions right now. Please retry.");
        return;
      }

      if (result.routes.length > 0) {
        const routeData = result.routes[0];
        const leg = routeData?.legs?.[0];

        if (!leg) {
          setError("No route details available for this destination.");
          return;
        }

        setTotalDistance(toText(leg.distance));
        setTotalDuration(toText(leg.duration));

        if (leg.steps) {
          setDirections(
            leg.steps.map((step: any) => ({
              instruction:
                step.instructions || step.navigationInstruction?.instructions || "",
              distance: toText(step.distance),
              duration: toText(step.duration),
            })),
          );
        }
        return;
      }

      setError("No route found between your location and this lab.");
    } catch (err) {
      setIsLoading(false);

      const errorMessage = err instanceof Error ? err.message : "";
      if (errorMessage.includes("ZERO_RESULTS")) {
        setError("No route found between your location and this lab.");
        return;
      }

      if (
        errorMessage.includes("OVER_QUERY_LIMIT") ||
        errorMessage.includes("QUOTA_EXCEEDED")
      ) {
        setError("Directions request limit reached. Please try again shortly.");
        return;
      }

      setError("Unable to get directions right now. Please retry.");
    }
  }, [lab, routeOrigin, routeMode]);

  useEffect(() => {
    fetchDirections();
  }, [fetchDirections]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 50,
        width: 320,
        maxHeight: "calc(100% - 20px)",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        zIndex: 100,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e8eaed",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8f9fa",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: "#202124",
            }}
          >
            Directions
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#70757a" }}>
            {lab.name}
          </p>
        </div>
        <button
          onClick={onClose}
          title='Close (ESC)'
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X style={{ width: 20, height: 20, color: "#5f6368" }} />
        </button>
      </div>

      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #e8eaed",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          background: "#fff",
        }}
      >
        {([
          { key: "drive", label: "Drive", Icon: Car },
          { key: "bus", label: "Bus", Icon: Bus },
          { key: "rail", label: "Rail", Icon: Train },
          { key: "flight", label: "Flight", Icon: Plane },
        ] as { key: RouteMode; label: string; Icon: any }[]).map((option) => {
          const isActive = routeMode === option.key;
          return (
            <button
              key={option.key}
              onClick={() => onRouteModeChange(option.key)}
              style={{
                padding: "6px 10px",
                borderRadius: 16,
                border: isActive ? "1px solid #1a73e8" : "1px solid #dadce0",
                background: isActive ? "#e8f0fe" : "#fff",
                color: isActive ? "#1a73e8" : "#3c4043",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <option.Icon style={{ width: 14, height: 14 }} />
              {option.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {isLoading ? (
          <div style={{ padding: 24, textAlign: "center", color: "#70757a" }}>
            Getting directions...
          </div>
        ) : error ? (
          <div style={{ padding: 24, textAlign: "center" }}>
            <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "#c5221f" }}>
              {error}
            </p>
            {routeMode !== "flight" && (
              <button
                onClick={fetchDirections}
                style={{
                  padding: "8px 16px",
                  background: "#1a73e8",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <>
            {(totalDistance || totalDuration) && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "#e8f0fe",
                  borderBottom: "1px solid #d2e3fc",
                  display: "flex",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 13, color: "#1a73e8" }}>
                  {totalDistance}
                </span>
                <span style={{ fontSize: 13, color: "#1a73e8" }}>
                  {totalDuration}
                </span>
              </div>
            )}
            <div style={{ padding: "8px 0" }}>
              {directions.map((step, index) => (
                <div
                  key={index}
                  style={{ padding: "8px 16px", display: "flex", gap: 12 }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: index === 0 ? "#1a73e8" : "#e8eaed",
                      color: index === 0 ? "#fff" : "#5f6368",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "#202124",
                        lineHeight: 1.4,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: step.instruction.replace(/<b>|<\/b>/g, ""),
                      }}
                    />
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: 11,
                        color: "#70757a",
                      }}
                    >
                      {step.distance} · {step.duration}
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

function DirectionsRenderer({
  origin,
  destination,
  routeMode,
}: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  routeMode: RouteMode;
}) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create a polyline for the route
    polylineRef.current = new google.maps.Polyline({
      path: [],
      strokeColor: "#1a73e8",
      strokeWeight: 4,
      strokeOpacity: 0.8,
      map,
    });

    return () => {
      polylineRef.current?.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!polylineRef.current) return;

    if (routeMode === "flight") {
      polylineRef.current.setPath([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        const result = await requestRoute({ origin, destination, mode: routeMode });

        if (result.status === "ZERO_RESULTS") {
          polylineRef.current?.setPath([]);
          return;
        }

        if (result.status === "ERROR") {
          throw new Error(result.errorCode);
        }

        if (result.routes.length > 0) {
          const routeData = result.routes[0];

          const path =
            routeData.overview_path ||
            routeData.path ||
            routeData.polyline?.path ||
            [];

          polylineRef.current?.setPath(path);
          return;
        }

        polylineRef.current?.setPath([]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "";
        if (!errorMessage.includes("ZERO_RESULTS")) {
          console.error("Error fetching route:", error);
        }
        polylineRef.current?.setPath([]);
      }
    };

    fetchRoute();
  }, [origin, destination, routeMode]);

  return <></>;
}

export function LabCenterMap({
  labCenters,
  center,
  zoom = 12,
  selectedLabId,
  confirmedLocation,
  onSelectLabCenter,
  statusFilter,
  onStatusFilterChange,
  routeOrigin,
  onZoomChange,
  showDirectionsForId,
  onCloseDirections,
  ratingFilter = "all",
  onRatingFilterChange,
}: LabCenterMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

  const [camera, setCamera] = useState<{
    center: { lat: number; lng: number };
    zoom: number;
  }>({
    center,
    zoom,
  });
  const [showDirectionsFor, setShowDirectionsFor] = useState<LabCenter | null>(
    null,
  );
  const [routeMode, setRouteMode] = useState<RouteMode>("drive");
  const [showAllFilters, setShowAllFilters] = useState(false);

  useEffect(() => {
    setCamera((prev) => ({
      ...prev,
      center,
      zoom,
    }));
  }, [center, zoom]);

  useEffect(() => {
    if (!showDirectionsForId) return;

    const lab =
      labCenters.find((item) => item.id === showDirectionsForId) || null;
    setShowDirectionsFor(lab);
  }, [showDirectionsForId, labCenters]);

  const handleRecenter = useCallback(() => {
    if (!routeOrigin) return;
    setCamera({ center: routeOrigin, zoom: 14 });
    onZoomChange?.(14);
  }, [routeOrigin, onZoomChange]);

  const handleShowDirections = useCallback((lab: LabCenter) => {
    setShowDirectionsFor(lab);
  }, []);

  const handleCloseDirections = useCallback(() => {
    setShowDirectionsFor(null);
    onCloseDirections?.();
  }, [onCloseDirections]);

  const destination = useMemo(() => {
    if (!showDirectionsFor) return null;
    return {
      lat: showDirectionsFor.latitude,
      lng: showDirectionsFor.longitude,
    };
  }, [showDirectionsFor]);

  if (!apiKey) {
    return (
      <div className='w-full h-full flex items-center justify-center bg-[#e8e0d5]'>
        <p className='text-gray-600 text-sm'>
          Google Maps API key not configured
        </p>
      </div>
    );
  }

  return (
    <div className='relative w-full h-full'>
      <APIProvider apiKey={apiKey} libraries={["marker", "places", "routes"]}>
        <Map
          mapId={mapId}
          center={camera.center}
          zoom={camera.zoom}
          gestureHandling='greedy'
          disableDefaultUI={false}
          mapTypeControl={true}
          zoomControl={true}
          fullscreenControl={true}
          streetViewControl={true}
          scaleControl={true}
          rotateControl={true}
          keyboardShortcuts={true}
          style={{ width: "100%", height: "100%" }}
          onCameraChanged={(event) => {
            const nextZoom = Math.round(event.detail.zoom);
            setCamera({ center: event.detail.center, zoom: nextZoom });
            onZoomChange?.(nextZoom);
          }}
        >
          {confirmedLocation && (
            <AdvancedMarker
              position={{
                lat: confirmedLocation.lat,
                lng: confirmedLocation.lng,
              }}
              title={confirmedLocation.label || "Client location"}
              zIndex={300}
            >
              <div
                style={{
                  filter: "drop-shadow(0 3px 6px rgba(26,115,232,0.5))",
                }}
              >
                <svg width='32' height='46' viewBox='0 0 28 40' fill='none'>
                  <path
                    d='M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.268 21.732 0 14 0z'
                    fill='#1a73e8'
                  />
                  <circle cx='14' cy='14' r='6' fill='white' />
                </svg>
              </div>
            </AdvancedMarker>
          )}

          <ClusteredMarkers
            labCenters={labCenters}
            selectedLabId={selectedLabId}
            onSelectLabCenter={onSelectLabCenter}
            onShowDirections={handleShowDirections}
          />

          {routeOrigin && destination && routeMode !== "flight" && (
            <DirectionsRenderer
              origin={routeOrigin}
              destination={destination}
              routeMode={routeMode}
            />
          )}
        </Map>

        <RecenterButton onRecenter={handleRecenter} disabled={!routeOrigin} />

        {showDirectionsFor && (
          <DirectionsPanel
            lab={showDirectionsFor}
            routeOrigin={routeOrigin || null}
            routeMode={routeMode}
            onRouteModeChange={setRouteMode}
            onClose={handleCloseDirections}
          />
        )}
      </APIProvider>

      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <button
          onClick={onRatingFilterChange}
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: ratingFilter !== "all" ? "#e8f0fe" : "#fff",
            border:
              ratingFilter !== "all"
                ? "1px solid #1a73e8"
                : "1px solid #dadce0",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: ratingFilter !== "all" ? "#1a73e8" : "#3c4043",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            fontFamily: "Roboto, Arial, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          <Star
            style={{
              width: 14,
              height: 14,
              fill: ratingFilter !== "all" ? "#1a73e8" : "#5f6368",
              color: ratingFilter !== "all" ? "#1a73e8" : "#5f6368",
            }}
          />
          {ratingFilter === "all" ? "Rating" : `${ratingFilter}+ ★`}
        </button>

        <button
          onClick={() =>
            onStatusFilterChange(statusFilter === "Open" ? "all" : "Open")
          }
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: statusFilter === "Open" ? "#e8f0fe" : "#fff",
            border:
              statusFilter === "Open"
                ? "1px solid #1a73e8"
                : "1px solid #dadce0",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: statusFilter === "Open" ? "#1a73e8" : "#3c4043",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            fontFamily: "Roboto, Arial, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Hours
        </button>

        <button
          onClick={() => setShowAllFilters((value) => !value)}
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: showAllFilters ? "#e8f0fe" : "#fff",
            border: showAllFilters ? "1px solid #1a73e8" : "1px solid #dadce0",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: showAllFilters ? "#1a73e8" : "#3c4043",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            fontFamily: "Roboto, Arial, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          <SlidersHorizontal
            style={{
              width: 14,
              height: 14,
              color: showAllFilters ? "#1a73e8" : "#5f6368",
            }}
          />
          All filters
        </button>
      </div>
    </div>
  );
}
