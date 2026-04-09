"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AppliedFilterChip,
  LabCenter,
  SelectedLabCenter,
} from "@/types/lab-center";
import { ChevronDown, MapPin, Phone, Star } from "lucide-react";
import { useMemo, useState } from "react";

interface LabCenterResultsV2Props {
  activeError?: string | null;
  appliedFilterChips: AppliedFilterChip[];
  isLoading?: boolean;
  labs: LabCenter[];
  locationLabel?: string | null;
  onClearFilterChip: (key: AppliedFilterChip["key"]) => void;
  onIncreaseRadius: () => void;
  onPreviewLab: (lab: LabCenter) => void;
  onSearchAnotherArea: () => void;
  onSelectLab: (lab: LabCenter) => void;
  onDirections: (lab: LabCenter) => void;
  selectedLab?: SelectedLabCenter | null;
  selectedLabId?: string;
  status:
    | "idle"
    | "locating"
    | "searching"
    | "results"
    | "empty"
    | "error";
}

function StatePanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className='rounded-[24px] border border-slate-200/80 bg-white/78 p-5 text-center shadow-sm backdrop-blur'>
      <div className='mx-auto flex max-w-sm flex-col items-center gap-3'>
        <div className='rounded-full bg-sky-50 p-3 text-primary'>
          <MapPin className='h-5 w-5' />
        </div>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
          <p className='text-sm leading-6 text-slate-500'>{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function ResultCard({
  lab,
  isActive,
  isSelected,
  onPreviewLab,
  onSelectLab,
  onDirections,
}: {
  lab: LabCenter;
  isActive: boolean;
  isSelected: boolean;
  onPreviewLab: (lab: LabCenter) => void;
  onSelectLab: (lab: LabCenter) => void;
  onDirections: (lab: LabCenter) => void;
}) {
  const [showHours, setShowHours] = useState(false);

  return (
    <article
      className={`rounded-[24px] border px-4 py-4 transition ${
        isActive
          ? "border-sky-200 bg-sky-50/80 shadow-[0_16px_35px_rgba(14,116,144,0.12)]"
          : "border-slate-200/80 bg-white/88 shadow-sm hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <button
        type='button'
        className='w-full text-left'
        onClick={() => onPreviewLab(lab)}
      >
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='truncate text-[15px] font-semibold text-slate-900'>
                {lab.name}
              </h3>
              {isSelected ? (
                <Badge className='rounded-full bg-sky-600 text-white hover:bg-sky-600'>
                  Selected
                </Badge>
              ) : null}
            </div>
            <div className='flex flex-wrap items-center gap-2 text-xs'>
              <span
                className={`rounded-full px-2.5 py-1 font-semibold ${
                  lab.status === "Open"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {lab.status === "Open" ? "Open now" : "Closed"}
              </span>
              {lab.rating > 0 ? (
                <span className='inline-flex items-center gap-1 text-slate-500'>
                  <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
                  {lab.rating.toFixed(1)}
                </span>
              ) : null}
            </div>
          </div>
          {lab.distance !== undefined ? (
            <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'>
              {lab.distance.toFixed(1)} mi
            </span>
          ) : null}
        </div>

        <p className='mt-3 text-sm leading-6 text-slate-500'>{lab.address}</p>
      </button>

      <div className='mt-4 flex flex-wrap gap-2'>
        <Button
          type='button'
          className='h-10 rounded-full bg-gradient-to-r from-sky-700 to-cyan-700 px-4 text-white'
          onClick={() => onSelectLab(lab)}
        >
          Select this lab
        </Button>
        <Button
          type='button'
          variant='outline'
          className='h-10 rounded-full px-4'
          onClick={() => onDirections(lab)}
        >
          Directions
        </Button>
        {lab.phone ? (
          <Button asChild type='button' variant='ghost' className='h-10 rounded-full px-3 text-slate-600'>
            <a href={`tel:${lab.phone}`}>
              <Phone className='h-4 w-4' />
              Call
            </a>
          </Button>
        ) : null}
        {lab.hours ? (
          <Button
            type='button'
            variant='ghost'
            className='h-10 rounded-full px-3 text-slate-600'
            onClick={() => setShowHours((current) => !current)}
          >
            Hours
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform ${
                showHours ? "rotate-180" : ""
              }`}
            />
          </Button>
        ) : null}
      </div>

      {showHours ? (
        <div className='mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500'>
          {lab.hours}
        </div>
      ) : null}
    </article>
  );
}

export function LabCenterResultsV2({
  activeError,
  appliedFilterChips,
  isLoading = false,
  labs,
  locationLabel,
  onClearFilterChip,
  onIncreaseRadius,
  onPreviewLab,
  onSearchAnotherArea,
  onSelectLab,
  onDirections,
  selectedLab,
  selectedLabId,
  status,
}: LabCenterResultsV2Props) {
  const summary = useMemo(() => {
    if (!locationLabel) {
      return `${labs.length} labs found`;
    }

    return `${labs.length} labs near ${locationLabel}`;
  }, [labs.length, locationLabel]);

  return (
    <div className='space-y-4'>
      <div className='space-y-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400'>
              Nearby labs
            </p>
            <h2 className='truncate text-lg font-semibold text-slate-900'>
              {locationLabel || "Search to see results"}
            </h2>
            <p className='text-sm text-slate-500'>
              {status === "searching" ? "Refreshing results..." : summary}
            </p>
          </div>
          {selectedLab ? (
            <Badge className='rounded-full bg-sky-50 px-3 py-1 text-sky-700 hover:bg-sky-50'>
              {selectedLab.name}
            </Badge>
          ) : null}
        </div>

        {appliedFilterChips.length > 0 ? (
          <div className='flex flex-wrap gap-2'>
            {appliedFilterChips.map((chip) => (
              <button
                key={chip.key}
                type='button'
                className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50'
                onClick={() => onClearFilterChip(chip.key)}
              >
                {chip.label} x
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {status === "idle" ? (
        <StatePanel
          title='Search to see nearby labs'
          description='Enter a city, state, or ZIP code, or use your current location to load the map and results.'
        />
      ) : null}

      {status === "error" ? (
        <StatePanel
          title='We could not load labs'
          description={
            activeError ||
            "Try another location or use your current location instead."
          }
        />
      ) : null}

      {status === "empty" ? (
        <StatePanel
          title='No labs matched this search'
          description='Try broadening the radius, clearing filters, or searching another area.'
        >
          <div className='mt-2 flex flex-wrap justify-center gap-2'>
            <Button type='button' className='rounded-full' onClick={onIncreaseRadius}>
              Increase radius
            </Button>
            <Button
              type='button'
              variant='outline'
              className='rounded-full'
              onClick={onSearchAnotherArea}
            >
              Search another area
            </Button>
          </div>
        </StatePanel>
      ) : null}

      {(status === "results" || status === "searching") && labs.length > 0 ? (
        <div className='space-y-3'>
          {labs.map((lab) => (
            <ResultCard
              key={lab.id}
              lab={lab}
              isActive={selectedLabId === lab.id}
              isSelected={selectedLab?.id === lab.id}
              onPreviewLab={onPreviewLab}
              onSelectLab={onSelectLab}
              onDirections={onDirections}
            />
          ))}
        </div>
      ) : null}

      {isLoading && labs.length === 0 ? (
        <div className='rounded-[24px] border border-slate-200/80 bg-white/70 px-4 py-4 text-sm text-slate-500 shadow-sm backdrop-blur'>
          Loading nearby labs...
        </div>
      ) : null}
    </div>
  );
}
