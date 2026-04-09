"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hook/usePerformance";
import { useLabLocatorController } from "@/hook/useLabLocatorController";
import { getDirectionsUrl } from "@/lib/locator/controller";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LabCenterFiltersV2 } from "./LabCenterFiltersV2";
import { LabCenterResultsV2 } from "./LabCenterResultsV2";
import { LabCenterSearchV2 } from "./LabCenterSearchV2";

const LazyLabCenterMapV2 = dynamic(
  () =>
    import("./LabCenterMapV2").then((module) => ({
      default: module.LabCenterMapV2,
    })),
  {
    loading: () => (
      <div className='h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_30%),linear-gradient(180deg,_rgba(241,245,249,0.95),_rgba(226,232,240,0.9))]' />
    ),
    ssr: false,
  },
);

function SelectedLabStrip({
  address,
  name,
  onDirections,
}: {
  address: string;
  name: string;
  onDirections: () => void;
}) {
  return (
    <div className='rounded-[24px] border border-sky-100 bg-white/92 p-4 shadow-[0_14px_34px_rgba(14,116,144,0.12)] backdrop-blur-xl'>
      <div className='flex items-center justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600'>
            Selected lab
          </p>
          <p className='truncate text-sm font-semibold text-slate-900'>{name}</p>
          <p className='truncate text-xs text-slate-500'>{address}</p>
        </div>
        <Button
          type='button'
          variant='outline'
          className='h-9 rounded-full px-4'
          onClick={onDirections}
        >
          Directions
        </Button>
      </div>
    </div>
  );
}

export function FindLabCenterV2() {
  const {
    activeError,
    appliedFilterChips,
    clearAllFilters,
    clearFilterChip,
    confirmedLocation,
    directionsOrigin,
    displayedLabs,
    filters,
    handleDirections,
    handleFilterChange,
    handleSearchSubmit,
    handleSelectLab,
    handleUseMyLocation,
    increaseRadius,
    isLoading,
    locationAnchor,
    locationLabel,
    previewLab,
    searchInput,
    selectedLabCenter,
    selectedLabId,
    setSearchInput,
    setShowMobileFilters,
    setViewMode,
    showMobileFilters,
    status,
    viewMode,
  } = useLabLocatorController();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [directionsLabId, setDirectionsLabId] = useState<string | undefined>();
  const hasInteractiveResults = status !== "idle";

  const mapCenter = useMemo(() => {
    const activeLab = displayedLabs.find((lab) => lab.id === selectedLabId);
    if (activeLab) {
      return {
        lat: activeLab.latitude,
        lng: activeLab.longitude,
      };
    }

    if (selectedLabCenter) {
      return {
        lat: selectedLabCenter.latitude,
        lng: selectedLabCenter.longitude,
      };
    }

    if (locationAnchor) {
      return locationAnchor;
    }

    const firstLab = displayedLabs[0];
    if (firstLab) {
      return {
        lat: firstLab.latitude,
        lng: firstLab.longitude,
      };
    }

    return {
      lat: 39.8283,
      lng: -98.5795,
    };
  }, [displayedLabs, locationAnchor, selectedLabCenter, selectedLabId]);

  const selectedLabDirections = () => {
    if (!selectedLabCenter) {
      return;
    }

    window.open(
      getDirectionsUrl({
        name: selectedLabCenter.name,
        address: selectedLabCenter.address,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDirectionsClick = (lab: (typeof displayedLabs)[number]) => {
    void previewLab(lab, "list");
    handleDirections(lab);
    setDirectionsLabId(lab.id);
    setViewMode("map");

    if (!directionsOrigin) {
      toast.info("Search or use your location to generate directions.");
    }
  };

  const handleOpenFilters = () => {
    if (isMobile) {
      setShowMobileFilters(true);
    }
  };

  return (
    <div className='relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950'>
      <div className='absolute inset-0'>
        <LazyLabCenterMapV2
          center={mapCenter}
          confirmedLocation={confirmedLocation}
          filters={filters}
          hasSearchAnchor={Boolean(locationAnchor || selectedLabCenter)}
          labs={displayedLabs}
          onDirections={handleDirectionsClick}
          onFilterChange={handleFilterChange}
          onOpenFilters={handleOpenFilters}
          onSelect={(lab) => void previewLab(lab, "map")}
          onCloseDirections={() => setDirectionsLabId(undefined)}
          routeOrigin={directionsOrigin}
          selectedLabId={selectedLabId}
          showDirectionsForId={directionsLabId}
        />
      </div>

      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.35),_rgba(255,255,255,0.05)_28%,rgba(15,23,42,0.12)_100%)]' />

      <div className='pointer-events-none absolute inset-x-0 top-4 z-30 px-3 sm:px-6 lg:top-6'>
        <div className='mx-auto flex w-full max-w-[780px] flex-col gap-3'>
          <div className='pointer-events-auto'>
            <LabCenterSearchV2
              error={activeError}
              isBusy={isLoading || status === "locating"}
              onSearch={handleSearchSubmit}
              onUseMyLocation={handleUseMyLocation}
              onValueChange={setSearchInput}
              value={searchInput}
            />
          </div>
        </div>
      </div>

      <div className='pointer-events-none absolute inset-0 hidden lg:block'>
        <div className='pointer-events-auto absolute bottom-6 left-6 top-[8.75rem] z-20 w-[min(400px,calc(100vw-3rem))]'>
          <div className='flex h-full flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/82 shadow-[0_26px_60px_rgba(15,23,42,0.18)] backdrop-blur-2xl'>
            <div className='border-b border-slate-200/80 px-5 py-4'>
              <div className='min-w-0'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400'>
                  Find lab center
                </p>
                <h1 className='text-xl font-semibold text-slate-900'>
                  Find a lab near you
                </h1>
                <p className='text-sm text-slate-500'>
                  Search first, then compare nearby labs and book the right location.
                </p>
              </div>
            </div>

            <div className='min-h-0 flex-1 overflow-y-auto px-4 py-4'>
              <div className='space-y-4'>
                {selectedLabCenter ? (
                  <SelectedLabStrip
                    address={selectedLabCenter.address}
                    name={selectedLabCenter.name}
                    onDirections={selectedLabDirections}
                  />
                ) : null}

                {hasInteractiveResults ? (
                  <LabCenterFiltersV2
                    filters={filters}
                    mode='inline'
                    onClearAll={clearAllFilters}
                    onFilterChange={handleFilterChange}
                  />
                ) : null}

                <LabCenterResultsV2
                  activeError={activeError}
                  appliedFilterChips={appliedFilterChips}
                  isLoading={isLoading}
                  labs={displayedLabs}
                  locationLabel={locationLabel}
                  onClearFilterChip={clearFilterChip}
                  onDirections={handleDirectionsClick}
                  onIncreaseRadius={increaseRadius}
                  onPreviewLab={(lab) => void previewLab(lab, "list")}
                  onSearchAnotherArea={() => setSearchInput("")}
                  onSelectLab={handleSelectLab}
                  selectedLab={selectedLabCenter}
                  selectedLabId={selectedLabId}
                  status={status}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='pointer-events-none absolute inset-x-3 bottom-3 z-20 lg:hidden'>
        <div
          className={`pointer-events-auto overflow-hidden rounded-[30px] border border-white/80 bg-white/84 shadow-[0_26px_60px_rgba(15,23,42,0.2)] backdrop-blur-2xl transition-all duration-300 ${
            viewMode === "map" ? "max-h-[180px]" : "max-h-[68vh]"
          }`}
        >
          <div className='border-b border-slate-200/80 px-4 pb-4 pt-3'>
            <div className='mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200' />
            <div className='flex items-center justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400'>
                  Find lab center
                </p>
                <p className='truncate text-sm font-semibold text-slate-900'>
                  {locationLabel || "Search by city, state, or ZIP"}
                </p>
              </div>
              {hasInteractiveResults ? (
                <div className='flex items-center gap-2'>
                  <LabCenterFiltersV2
                    filters={filters}
                    onClearAll={clearAllFilters}
                    onFilterChange={handleFilterChange}
                    onOpenChange={setShowMobileFilters}
                    open={showMobileFilters}
                  />
                  <div className='flex rounded-full border border-slate-200 bg-white p-1 shadow-sm'>
                    <Button
                      type='button'
                      variant={viewMode === "list" ? "default" : "ghost"}
                      className='h-8 rounded-full px-3 text-xs'
                      onClick={() => setViewMode("list")}
                    >
                      List
                    </Button>
                    <Button
                      type='button'
                      variant={viewMode === "map" ? "default" : "ghost"}
                      className='h-8 rounded-full px-3 text-xs'
                      onClick={() => setViewMode("map")}
                    >
                      Map
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
            {selectedLabCenter ? (
              <div className='mt-3'>
                <SelectedLabStrip
                  address={selectedLabCenter.address}
                  name={selectedLabCenter.name}
                  onDirections={selectedLabDirections}
                />
              </div>
            ) : null}
          </div>

          <div className='overflow-y-auto px-4 pb-4 pt-4'>
            {viewMode === "map" ? (
              <div className='rounded-[24px] border border-slate-200/80 bg-white/72 p-4 text-sm text-slate-500 shadow-sm'>
                {status === "idle"
                  ? "Search by city, state, or ZIP to start browsing nearby labs."
                  : "Use the map to inspect pins, then switch back to list to compare labs."}
              </div>
            ) : (
              <LabCenterResultsV2
                activeError={activeError}
                appliedFilterChips={appliedFilterChips}
                isLoading={isLoading}
                labs={displayedLabs}
                locationLabel={locationLabel}
                onClearFilterChip={clearFilterChip}
                onDirections={handleDirectionsClick}
                onIncreaseRadius={increaseRadius}
                onPreviewLab={(lab) => void previewLab(lab, "list")}
                onSearchAnotherArea={() => setSearchInput("")}
                onSelectLab={handleSelectLab}
                selectedLab={selectedLabCenter}
                selectedLabId={selectedLabId}
                status={status}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
