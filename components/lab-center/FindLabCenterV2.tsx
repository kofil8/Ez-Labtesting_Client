"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hook/usePerformance";
import { useLabLocatorController } from "@/hook/useLabLocatorController";
import { getDirectionsUrl } from "@/lib/locator/controller";
import { getRequisitionDownloadUrl } from "@/lib/services/order.service";
import { AssignedLabCenter, LabLocatorPageMode } from "@/types/lab-center";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LabCenterFiltersV2 } from "./LabCenterFiltersV2";
import { LabCenterResultsV2 } from "./LabCenterResultsV2";
import { LabCenterSearchV2 } from "./LabCenterSearchV2";
import { NationwideLabResults } from "./NationwideLabResults";

import {
  Compass,
  ExternalLink,
  FileDown,
  FileText,
  MapPin,
  Navigation,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

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

function hasLabCoordinates(
  lab: Pick<AssignedLabCenter, "latitude" | "longitude"> | null | undefined,
): lab is Pick<AssignedLabCenter, "latitude" | "longitude"> & {
  latitude: number;
  longitude: number;
} {
  return (
    lab?.latitude !== undefined &&
    lab?.longitude !== undefined &&
    Number.isFinite(lab.latitude) &&
    Number.isFinite(lab.longitude)
  );
}

function openDirections(address: string) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function ContextSummaryCard({
  contextMessage,
  mode,
  onDownloadRequisition,
  onOpenGoogleMaps,
  onOpenRequisition,
  onPrimaryDirections,
  isRequisitionReady,
  isRequisitionLoading,
  orderId,
  primaryLab,
}: {
  contextMessage: string;
  mode: LabLocatorPageMode;
  isRequisitionLoading: boolean;
  isRequisitionReady: boolean;
  onDownloadRequisition: () => void;
  onOpenGoogleMaps: () => void;
  onOpenRequisition: () => void;
  onPrimaryDirections: () => void;
  orderId: string | null;
  primaryLab: {
    address: string;
    name: string;
  } | null;
}) {
  const eyebrow =
    mode === "access_assigned"
      ? "Assigned draw center"
      : mode === "selected_lab"
        ? "Saved collection location"
        : mode === "nationwide"
          ? "Nationwide search"
          : "Find a lab center";
  const title =
    mode === "access_assigned"
      ? "Your draw center has been assigned"
      : mode === "selected_lab"
        ? "Review your collection location"
        : mode === "nationwide"
          ? "Browse provider availability across the US"
          : "Find a nearby partner draw center";
  const description =
    mode === "access_assigned"
      ? "ACCESS is the system of record for your requisition and sample collection location."
      : mode === "selected_lab"
        ? "You can keep your current lab or compare nearby partner locations before checkout."
        : mode === "nationwide"
          ? "USA searches now show provider coverage and sample places outside restricted states."
          : "Search nearby draw centers before you book. Your final collection location may depend on provider routing.";

  return (
    <section className='rounded-[32px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(240,249,255,0.92))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur xl:p-7'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='space-y-2'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700'>
              {eyebrow}
            </p>
            <h1 className='text-2xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]'>
              {title}
            </h1>
            <p className='max-w-2xl text-sm leading-6 text-slate-600'>
              {description}
            </p>
            <p className='max-w-2xl text-sm leading-6 text-slate-500'>
              {contextMessage}
            </p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {mode === "access_assigned" ? (
              <span className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700'>
                <ShieldCheck className='h-3.5 w-3.5' />
                ACCESS authoritative
              </span>
            ) : null}
            {mode === "nationwide" ? (
              <span className='inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700'>
                <ShieldAlert className='h-3.5 w-3.5' />
                Reference only
              </span>
            ) : null}
            {orderId ? (
              <span className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600'>
                Order {orderId}
              </span>
            ) : null}
          </div>
        </div>

        {primaryLab ? (
          <div className='rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-sm'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700'>
                    <MapPin className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='text-sm font-semibold text-slate-900'>
                      {primaryLab.name}
                    </p>
                    <p className='text-sm text-slate-500'>{primaryLab.address}</p>
                  </div>
                </div>
                {mode === "access_assigned" ? (
                  <p className='text-xs leading-5 text-slate-500'>
                    Use this draw center with the requisition from ACCESS. Nearby labs below are shown only for reference.
                  </p>
                ) : null}
              </div>

              <div className='flex flex-wrap gap-2'>
                {isRequisitionReady ? (
                  <>
                    <Button
                      type='button'
                      className='h-10 rounded-full bg-gradient-to-r from-sky-700 to-cyan-700 px-4 text-white'
                      onClick={onDownloadRequisition}
                      disabled={isRequisitionLoading}
                    >
                      <FileDown className='h-4 w-4' />
                      {isRequisitionLoading
                        ? "Preparing requisition..."
                        : "Download requisition"}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-10 rounded-full px-4'
                      onClick={onOpenRequisition}
                      disabled={isRequisitionLoading}
                    >
                      <FileText className='h-4 w-4' />
                      Open requisition
                    </Button>
                  </>
                ) : null}

                <Button
                  type='button'
                  variant='outline'
                  className='h-10 rounded-full px-4'
                  onClick={onPrimaryDirections}
                >
                  <Navigation className='h-4 w-4' />
                  Get directions
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='h-10 rounded-full px-4'
                  onClick={onOpenGoogleMaps}
                >
                  <ExternalLink className='h-4 w-4' />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MapSupportCard({
  assignedLab,
  center,
  confirmedLocation,
  filters,
  hasSearchAnchor,
  labs,
  onDirections,
  onFilterChange,
  onOpenFilters,
  onSelect,
  pageMode,
  routeOrigin,
  selectedLabId,
  showDirectionsForId,
  onCloseDirections,
}: ComponentProps<typeof LazyLabCenterMapV2> & {
  assignedLab: AssignedLabCenter | null;
  pageMode: "browse" | "selected_lab" | "access_assigned";
}) {
  const title =
    pageMode === "access_assigned"
      ? "Assigned center and nearby map"
      : pageMode === "selected_lab"
        ? "Saved center and nearby map"
        : "Nearby map";
  const description =
    pageMode === "access_assigned"
      ? "Use the assigned draw center first. Nearby labs remain visible for context and directions."
      : "Inspect nearby labs, compare pins, and open directions when needed.";

  return (
    <section className='rounded-[32px] border border-white/70 bg-white/88 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur'>
      <div className='mb-4 space-y-1 px-1'>
        <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>
          Map support
        </p>
        <h2 className='text-lg font-semibold text-slate-900'>{title}</h2>
        <p className='text-sm leading-6 text-slate-500'>{description}</p>
      </div>

      <div className='h-[360px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-100 sm:h-[420px] xl:h-[620px]'>
        <LazyLabCenterMapV2
          assignedLab={assignedLab}
          center={center}
          compact={true}
          confirmedLocation={confirmedLocation}
          filters={filters}
          hasSearchAnchor={hasSearchAnchor}
          labs={labs}
          onDirections={onDirections}
          onFilterChange={onFilterChange}
          onOpenFilters={onOpenFilters}
          onSelect={onSelect}
          pageMode={pageMode}
          routeOrigin={routeOrigin}
          selectedLabId={selectedLabId}
          showDirectionsForId={showDirectionsForId}
          onCloseDirections={onCloseDirections}
        />
      </div>
    </section>
  );
}

function NationwideSupportCard({ excludedStates }: { excludedStates: string[] }) {
  return (
    <>
      <section className='rounded-[28px] border border-amber-100 bg-amber-50/70 p-5 text-sm leading-6 text-amber-900 shadow-sm'>
        <div className='flex items-start gap-3'>
          <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm'>
            <ShieldAlert className='h-5 w-5' />
          </span>
          <div className='space-y-2'>
            <p className='font-semibold'>Restricted states excluded</p>
            <p>
              Nationwide availability hides states with blocked or physician-review restrictions.
            </p>
            <p className='font-medium'>
              {excludedStates.length > 0 ? excludedStates.join(", ") : "None"}
            </p>
          </div>
        </div>
      </section>

      <section className='rounded-[28px] border border-slate-200 bg-white/90 p-5 text-sm leading-6 text-slate-600 shadow-sm'>
        <div className='flex items-start gap-3'>
          <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700'>
            <Compass className='h-5 w-5' />
          </span>
          <div className='space-y-2'>
            <p className='font-semibold text-slate-900'>How to use this view</p>
            <p>
              These cards show provider coverage and sample Google Places references. Use “Search this state” to switch into the normal state-level locator while keeping the provider selection.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function FindLabCenterV2() {
  const {
    activeError,
    appliedFilterChips,
    assignedLab,
    canSelectLab,
    clearAllFilters,
    clearFilterChip,
    contextMessage,
    confirmedLocation,
    directionsOrigin,
    displayedLabs,
    filters,
    handleDirections,
    handleFilterChange,
    handleSearchState,
    handleSearchSubmit,
    handleSelectLab,
    handleUseMyLocation,
    increaseRadius,
    isLoading,
    locationAnchor,
    locationLabel,
    nationwideResults,
    orderId,
    pageMode,
    previewLab,
    requisitionPdfUrl,
    searchInput,
    selectedLabCenter,
    selectedLabId,
    setSearchInput,
    setShowMobileFilters,
    showMobileFilters,
    status,
  } = useLabLocatorController();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [directionsLabId, setDirectionsLabId] = useState<string | undefined>();
  const [isRequisitionLoading, setIsRequisitionLoading] = useState(false);

  const primaryLab = useMemo(() => {
    if (pageMode === "nationwide") {
      return null;
    }

    if (pageMode === "access_assigned" && assignedLab) {
      return {
        name: assignedLab.name,
        address:
          assignedLab.formattedAddress || assignedLab.address || assignedLab.name,
      };
    }

    if (selectedLabCenter) {
      return {
        name: selectedLabCenter.name,
        address: selectedLabCenter.address,
      };
    }

    return null;
  }, [assignedLab, pageMode, selectedLabCenter]);

  const mapCenter = useMemo<{ lat: number; lng: number }>(() => {
    const activeLab = displayedLabs.find((lab) => lab.id === selectedLabId);
    if (activeLab) {
      return {
        lat: activeLab.latitude,
        lng: activeLab.longitude,
      };
    }

    if (
      pageMode === "access_assigned" &&
      assignedLab &&
      hasLabCoordinates(assignedLab)
    ) {
      return {
        lat: assignedLab.latitude,
        lng: assignedLab.longitude,
      };
    }

    if (selectedLabCenter) {
      return {
        lat: selectedLabCenter.latitude,
        lng: selectedLabCenter.longitude,
      };
    }

    if (locationAnchor) {
      return {
        lat: locationAnchor.lat,
        lng: locationAnchor.lng,
      };
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
  }, [
    assignedLab,
    displayedLabs,
    locationAnchor,
    pageMode,
    selectedLabCenter,
    selectedLabId,
  ]);

  const searchPlaceholder = useMemo(() => {
    if (pageMode === "access_assigned") {
      return "Search another ZIP, city, or address";
    }

    if (pageMode === "selected_lab") {
      return "Search nearby partner labs";
    }

    return "Search city, state, ZIP, or USA";
  }, [pageMode]);

  const handleDirectionsClick = (lab: (typeof displayedLabs)[number]) => {
    void previewLab(lab, "list");
    handleDirections(lab);
    setDirectionsLabId(lab.id);

    if (!directionsOrigin) {
      toast.info("Search or use your location to generate directions.");
    }
  };

  const handlePrimaryDirections = () => {
    if (!primaryLab?.address) {
      return;
    }

    openDirections(primaryLab.address);
  };

  const handlePrimaryGoogleMaps = () => {
    if (!primaryLab) {
      return;
    }

    window.open(
      getDirectionsUrl({
        name: primaryLab.name,
        address: primaryLab.address,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const withSecureRequisitionUrl = async (action: (url: string) => void) => {
    if (!orderId || !requisitionPdfUrl) {
      return;
    }

    try {
      setIsRequisitionLoading(true);
      const { url } = await getRequisitionDownloadUrl(orderId);
      action(url);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to open your requisition right now.",
      );
    } finally {
      setIsRequisitionLoading(false);
    }
  };

  const handleOpenRequisition = () => {
    void withSecureRequisitionUrl((url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  };

  const handleDownloadRequisition = () => {
    void withSecureRequisitionUrl((url) => {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.download = "requisition.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    });
  };

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-[linear-gradient(180deg,#eef8ff_0%,#f8fafc_22%,#ffffff_100%)]'>
      <div className='mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
        <LabCenterSearchV2
          error={activeError}
          isBusy={isLoading || status === "locating"}
          onSearch={handleSearchSubmit}
          onUseMyLocation={handleUseMyLocation}
          onValueChange={setSearchInput}
          placeholder={searchPlaceholder}
          value={searchInput}
        />

        <div className='grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]'>
          <div className='space-y-6'>
            <ContextSummaryCard
              contextMessage={contextMessage}
              isRequisitionLoading={isRequisitionLoading}
              isRequisitionReady={Boolean(orderId && requisitionPdfUrl)}
              mode={pageMode}
              onDownloadRequisition={handleDownloadRequisition}
              onOpenGoogleMaps={handlePrimaryGoogleMaps}
              onOpenRequisition={handleOpenRequisition}
              onPrimaryDirections={handlePrimaryDirections}
              orderId={orderId}
              primaryLab={primaryLab}
            />

            {pageMode === "nationwide" ? (
              <section className='rounded-[32px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.1)] backdrop-blur sm:p-6'>
                <div className='mb-5'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>
                    Nationwide browse
                  </p>
                  <h2 className='text-lg font-semibold text-slate-900'>
                    Provider availability by state
                  </h2>
                  <p className='text-sm text-slate-500'>
                    {locationLabel
                      ? `Current area: ${locationLabel}`
                      : "Search USA to browse provider availability."}
                  </p>
                </div>

                <NationwideLabResults
                  activeError={activeError}
                  isLoading={isLoading}
                  onSearchState={handleSearchState}
                  results={nationwideResults}
                  status={status}
                />
              </section>
            ) : (
              <section className='rounded-[32px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.1)] backdrop-blur sm:p-6'>
                <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>
                      Refine results
                    </p>
                    <h2 className='text-lg font-semibold text-slate-900'>
                      {pageMode === "access_assigned"
                        ? "Nearby reference labs"
                        : "Partner lab results"}
                    </h2>
                    <p className='text-sm text-slate-500'>
                      {locationLabel
                        ? `Current area: ${locationLabel}`
                        : "Search a location or use your current position."}
                    </p>
                  </div>

                  {isMobile ? (
                    <LabCenterFiltersV2
                      filters={filters}
                      onClearAll={clearAllFilters}
                      onFilterChange={handleFilterChange}
                      onOpenChange={setShowMobileFilters}
                      open={showMobileFilters}
                    />
                  ) : (
                    <div className='w-full max-w-[420px]'>
                      <LabCenterFiltersV2
                        filters={filters}
                        mode='inline'
                        onClearAll={clearAllFilters}
                        onFilterChange={handleFilterChange}
                      />
                    </div>
                  )}
                </div>

                <LabCenterResultsV2
                  activeError={activeError}
                  appliedFilterChips={appliedFilterChips}
                  canSelectLab={canSelectLab}
                  isLoading={isLoading}
                  labs={displayedLabs}
                  locationLabel={locationLabel}
                  mode={pageMode}
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
              </section>
            )}
          </div>

          <div className='space-y-6 xl:sticky xl:top-6 xl:self-start'>
            {pageMode === "nationwide" ? (
              <NationwideSupportCard
                excludedStates={nationwideResults?.meta.excludedStates || []}
              />
            ) : (
              <>
                <MapSupportCard
                  assignedLab={assignedLab}
                  center={mapCenter}
                  confirmedLocation={confirmedLocation}
                  filters={filters}
                  hasSearchAnchor={Boolean(
                    locationAnchor || selectedLabCenter || assignedLab,
                  )}
                  labs={displayedLabs}
                  onDirections={handleDirectionsClick}
                  onFilterChange={handleFilterChange}
                  onOpenFilters={() => setShowMobileFilters(true)}
                  onSelect={(lab) => void previewLab(lab, "map")}
                  onCloseDirections={() => setDirectionsLabId(undefined)}
                  pageMode={pageMode}
                  routeOrigin={directionsOrigin}
                  selectedLabId={selectedLabId}
                  showDirectionsForId={directionsLabId}
                />

                {pageMode === "access_assigned" ? (
                  <section className='rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-5 text-sm leading-6 text-emerald-900 shadow-sm'>
                    <div className='flex items-start gap-3'>
                      <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm'>
                        <ShieldCheck className='h-5 w-5' />
                      </span>
                      <div className='space-y-2'>
                        <p className='font-semibold'>ACCESS order handling</p>
                        <p>
                          Your requisition and draw-center assignment come from ACCESS after order confirmation. Use the assigned center first, then use nearby labs only as reference for orientation.
                        </p>
                      </div>
                    </div>
                  </section>
                ) : null}

                {pageMode === "browse" ? (
                  <section className='rounded-[28px] border border-slate-200 bg-white/90 p-5 text-sm leading-6 text-slate-600 shadow-sm'>
                    <div className='flex items-start gap-3'>
                      <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700'>
                        <Compass className='h-5 w-5' />
                      </span>
                      <div className='space-y-2'>
                        <p className='font-semibold text-slate-900'>
                          Browse before you book
                        </p>
                        <p>
                          This search helps customers explore nearby draw centers before checkout. Final routing, requisition, and assigned collection details can still depend on the provider and order outcome.
                        </p>
                      </div>
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
