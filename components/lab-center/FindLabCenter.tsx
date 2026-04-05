"use client";

import { LabCenterMap } from "@/components/lab-center/LabCenterMap";
import { useClientLocationFromOrder } from "@/hook/useClientLocationFromOrder";
import { usePlacesSearch } from "@/hook/usePlacesSearch";
import { loadGoogleMapsApi } from "@/lib/google-maps-loader";
import { LabCenterService } from "@/lib/services/lab-centers.service";
import { LabCenter } from "@/types/lab-center";
import { Menu, Share2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LabCenterFilters } from "./LabCenterFilters";
import { LabCenterList } from "./LabCenterList";
import { LabCenterSearch } from "./LabCenterSearch";

export function FindLabCenter() {
  const SIDEBAR_AUTO_HIDE_MS = 20_000;
  const [selectedLabId, setSelectedLabId] = useState<string | undefined>();
  const [showDirectionsForId, setShowDirectionsForId] = useState<
    string | undefined
  >();
  const [ratingFilter, setRatingFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(25);
  const [labType, setLabType] = useState("all");
  const [status, setStatus] = useState("all");
  const [detailsById, setDetailsById] = useState<
    Record<string, Partial<LabCenter>>
  >({});
  const [showSidebar, setShowSidebar] = useState(true);

  const [searchAnchor, setSearchAnchor] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 39.8283,
    lng: -98.5795,
  });
  const [zoom, setZoom] = useState(4);

  const [confirmedLocation, setConfirmedLocation] = useState<{
    lat: number;
    lng: number;
    label?: string;
  } | null>(null);

  const { clientLocation } = useClientLocationFromOrder();

  const { labs, isLoading, error, searchByLocation, clearError } =
    usePlacesSearch();

  useEffect(() => {
    loadGoogleMapsApi().catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to preload Google Maps API", err);
      }
    });
  }, []);

  useEffect(() => {
    if (!clientLocation) return;

    const location = {
      lat: clientLocation.lat,
      lng: clientLocation.lng,
      label: clientLocation.label,
    };

    setConfirmedLocation(location);
    setSearchAnchor({ lat: clientLocation.lat, lng: clientLocation.lng });
    setMapCenter({ lat: clientLocation.lat, lng: clientLocation.lng });
    setZoom(12);
    setSearchQuery(clientLocation.address || clientLocation.label || "");
  }, [clientLocation]);

  useEffect(() => {
    const anchor = searchAnchor || mapCenter;

    searchByLocation(
      anchor.lat,
      anchor.lng,
      radius,
      labType,
      status,
      searchQuery,
    );
  }, [
    searchAnchor,
    mapCenter,
    radius,
    labType,
    status,
    searchQuery,
    searchByLocation,
  ]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    clearError();
  }, [error, clearError]);

  const handleLocationSelect = (
    lat: number,
    lng: number,
    _address?: string,
    query?: string,
  ) => {
    setSearchAnchor({ lat, lng });
    setMapCenter({ lat, lng });
    setZoom(12);
    setSearchQuery(query || "");
    setSelectedLabId(undefined);
    setShowDirectionsForId(undefined);
  };

  const handleLabSelect = (lab: LabCenter) => {
    setSelectedLabId(lab.id);
    setMapCenter({ lat: lab.latitude, lng: lab.longitude });
  };

  const hydratePlaceDetails = async (lab: LabCenter) => {
    if (detailsById[lab.id]) {
      return;
    }

    try {
      const details = await LabCenterService.getPlaceDetails(lab.id);
      setDetailsById((prev) => ({
        ...prev,
        [lab.id]: details,
      }));
    } catch {
      // Ignore detail hydration failures for non-Google IDs or unavailable details
    }
  };

  const routeOrigin = confirmedLocation || searchAnchor;

  const handleShowDirections = (lab: LabCenter) => {
    setSelectedLabId(lab.id);
    setShowDirectionsForId(lab.id);
    hydratePlaceDetails(lab);

    if (!routeOrigin) {
      toast.info(
        "Select a city/state/zip or use your location to generate directions.",
      );
    }
  };

  const handleRatingFilterChange = () => {
    setRatingFilter((prev) =>
      prev === "all" ? "4" : prev === "4" ? "3" : "all",
    );
  };

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      const minRating =
        ratingFilter === "all" ? 0 : Number.parseInt(ratingFilter, 10);
      const matchesRating = lab.rating >= minRating;
      const matchesStatus = status === "all" || lab.status === status;
      return matchesRating && matchesStatus;
    });
  }, [labs, ratingFilter, status]);

  const displayedLabs = useMemo(
    () =>
      filteredLabs.map((lab) => ({
        ...lab,
        ...(detailsById[lab.id] || {}),
      })),
    [filteredLabs, detailsById],
  );

  useEffect(() => {
    if (!selectedLabId) return;
    const selected = filteredLabs.find((lab) => lab.id === selectedLabId);
    if (!selected) return;
    hydratePlaceDetails(selected);
  }, [selectedLabId, filteredLabs]);

  useEffect(() => {
    if (!showSidebar) return;

    const timer = window.setTimeout(() => {
      setShowSidebar(false);
    }, SIDEBAR_AUTO_HIDE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showSidebar]);

  return (
    <div
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        overflow: "hidden",
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
        background: "#fff",
        position: "relative",
      }}
    >
      <aside
        style={
          {
            width: "100%",
            maxWidth: 400,
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            boxShadow: "2px 0 6px rgba(0,0,0,0.15)",
            zIndex: 20,
            overflow: "hidden",
            transition: "transform 0.3s ease-in-out, margin 0.3s ease-in-out",
            transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
            position: "absolute",
            height: "100%",
            left: 0,
            top: 0,
            "@media (minWidth: 768px)": {
              position: "relative",
              transform: "translateX(0)",
              width: 400,
            },
          } as any
        }
        className='md:position-relative md:transform-none'
      >
        <div
          style={{
            position: "relative",
            flexShrink: 0,
            padding: "12px 16px",
            borderBottom: "1px solid #e8eaed",
          }}
        >
          <button
            onClick={() => setShowSidebar(false)}
            title='Hide sidebar'
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 2,
              background: "#fff",
              border: "1px solid #dadce0",
              borderRadius: "50%",
              width: 28,
              height: 28,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5f6368",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>

          <LabCenterSearch
            onLocationSelect={handleLocationSelect}
            disabled={isLoading}
          />
        </div>

        <div
          style={{
            flexShrink: 0,
            padding: "10px 16px 0",
            borderBottom: "1px solid #e8eaed",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(14px, 2.5vw, 16px)",
                fontWeight: 600,
                color: "#202124",
                margin: 0,
                flex: 1,
                minWidth: 0,
              }}
            >
              Results
              {filteredLabs.length > 0 && (
                <span
                  style={{
                    fontWeight: 400,
                    color: "#70757a",
                    fontSize: "clamp(12px, 2vw, 14px)",
                    marginLeft: 6,
                  }}
                >
                  · {filteredLabs.length}
                </span>
              )}
            </h2>
            <button
              title='Share'
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                borderRadius: "50%",
                color: "#5f6368",
                transition: "background-color 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#f1f3f4";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <Share2 style={{ width: 18, height: 18 }} />
            </button>
          </div>

          <div style={{ paddingBottom: 10 }}>
            <LabCenterFilters
              radius={radius}
              type={labType}
              status={status}
              onRadiusChange={setRadius}
              onTypeChange={setLabType}
              onStatusChange={setStatus}
              disabled={isLoading}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <LabCenterList
            labCenters={displayedLabs}
            isLoading={isLoading}
            onSelectLabCenter={handleLabSelect}
            selectedLabId={selectedLabId}
            onShowDirections={handleShowDirections}
          />
        </div>
      </aside>

      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Sidebar Reopen Button */}
        <button
          onClick={() => setShowSidebar(true)}
          style={{
            position: "absolute",
            top: 96,
            left: 12,
            zIndex: 30,
            background: "#fff",
            border: "1px solid #dadce0",
            borderRadius: 4,
            padding: "8px",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            display: showSidebar ? "none" : "flex",
          }}
          title='Show sidebar'
        >
          <Menu style={{ width: 24, height: 24, color: "#5f6368" }} />
        </button>

        {/* Overlay on mobile when sidebar is shown */}
        {showSidebar && (
          <div
            onClick={() => setShowSidebar(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 15,
              display: "none",
            }}
            className='block md:hidden'
          />
        )}

        <LabCenterMap
          labCenters={displayedLabs}
          center={mapCenter}
          zoom={zoom}
          selectedLabId={selectedLabId}
          confirmedLocation={confirmedLocation}
          onSelectLabCenter={handleLabSelect}
          statusFilter={status}
          onStatusFilterChange={setStatus}
          routeOrigin={routeOrigin}
          onZoomChange={setZoom}
          showDirectionsForId={showDirectionsForId}
          onCloseDirections={() => setShowDirectionsForId(undefined)}
          ratingFilter={ratingFilter}
          onRatingFilterChange={handleRatingFilterChange}
        />
      </main>
    </div>
  );
}
