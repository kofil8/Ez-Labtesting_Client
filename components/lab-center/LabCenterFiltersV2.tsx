"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LabLocatorFilters } from "@/types/lab-center";
import { Filter, SlidersHorizontal } from "lucide-react";

const STATUSES = [
  { value: "all", label: "Any hours" },
  { value: "Open", label: "Open now" },
  { value: "Closed", label: "Closed" },
];

const RATINGS = [
  { value: "all", label: "Any rating" },
  { value: "4", label: "4+ stars" },
  { value: "3", label: "3+ stars" },
];

interface LabCenterFiltersV2Props {
  filters: LabLocatorFilters;
  onFilterChange: <T extends keyof LabLocatorFilters>(
    key: T,
    value: LabLocatorFilters[T],
  ) => void;
  onClearAll: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: "inline" | "trigger";
}

function FiltersPanel({
  filters,
  onFilterChange,
  onClearAll,
}: Omit<LabCenterFiltersV2Props, "mode" | "open" | "onOpenChange">) {
  return (
    <div className='space-y-5'>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <Label className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
            Search radius
          </Label>
          <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'>
            {filters.radius} mi
          </span>
        </div>
        <div className='flex flex-wrap gap-2'>
          {[10, 25, 50, 100].map((preset) => (
            <Button
              key={preset}
              type='button'
              variant={filters.radius === preset ? "default" : "outline"}
              className='h-8 rounded-full px-3 text-xs'
              onClick={() => onFilterChange("radius", preset)}
            >
              {preset} mi
            </Button>
          ))}
        </div>
        <Slider
          min={5}
          max={100}
          step={5}
          value={[filters.radius]}
          onValueChange={(value) => onFilterChange("radius", value[0])}
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
            Hours
          </Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger className='h-11 rounded-2xl border-slate-200 bg-white/80'>
              <SelectValue placeholder='Choose hours' />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
            Rating
          </Label>
          <Select
            value={filters.rating}
            onValueChange={(value) =>
              onFilterChange("rating", value as LabLocatorFilters["rating"])
            }
          >
            <SelectTrigger className='h-11 rounded-2xl border-slate-200 bg-white/80'>
              <SelectValue placeholder='Choose rating' />
            </SelectTrigger>
            <SelectContent>
              {RATINGS.map((rating) => (
                <SelectItem key={rating.value} value={rating.value}>
                  {rating.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
            Sort
          </Label>
          <Select
            value={filters.sort}
            onValueChange={(value) =>
              onFilterChange("sort", value as LabLocatorFilters["sort"])
            }
          >
            <SelectTrigger className='h-11 rounded-2xl border-slate-200 bg-white/80'>
              <SelectValue placeholder='Choose sorting' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='distance'>Distance</SelectItem>
              <SelectItem value='rating'>Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type='button'
        variant='ghost'
        className='h-10 w-full rounded-2xl text-slate-600'
        onClick={onClearAll}
      >
        Clear all filters
      </Button>
    </div>
  );
}

export function LabCenterFiltersV2({
  filters,
  onFilterChange,
  onClearAll,
  open = false,
  onOpenChange,
  mode = "trigger",
}: LabCenterFiltersV2Props) {
  if (mode === "inline") {
    return (
      <div className='rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-4 shadow-inner shadow-white/70'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-white p-2 text-primary shadow-sm'>
              <SlidersHorizontal className='h-4 w-4' />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900'>Refine results</p>
              <p className='text-xs text-slate-500'>Adjust radius, hours, and sort.</p>
            </div>
          </div>
        </div>
        <FiltersPanel
          filters={filters}
          onFilterChange={onFilterChange}
          onClearAll={onClearAll}
        />
      </div>
    );
  }

  return (
    <>
      <Button
        type='button'
        variant='glass'
        className='h-10 rounded-full px-4 text-slate-700'
        onClick={() => onOpenChange?.(true)}
      >
        <Filter className='mr-2 h-4 w-4' />
        Refine
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-md rounded-[28px] border-white/80 bg-white/92 p-0 shadow-[0_24px_60px_rgba(15,23,42,0.22)] backdrop-blur-2xl'>
          <DialogHeader className='border-b border-slate-200/80 px-6 py-5'>
            <DialogTitle className='flex items-center gap-2 text-xl'>
              <SlidersHorizontal className='h-5 w-5 text-primary' />
              Refine labs
            </DialogTitle>
          </DialogHeader>
          <div className='px-6 pb-6 pt-4'>
            <FiltersPanel
              filters={filters}
              onFilterChange={onFilterChange}
              onClearAll={onClearAll}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
