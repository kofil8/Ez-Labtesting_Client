"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NationwideLabResponse, ProviderCode } from "@/types/lab-center";
import { ArrowRight, Building2, MapPin } from "lucide-react";

interface NationwideLabResultsProps {
  activeError?: string | null;
  isLoading?: boolean;
  onSearchState: (stateName: string, providerCode: ProviderCode) => void;
  results: NationwideLabResponse | null;
  status:
    | "idle"
    | "locating"
    | "searching"
    | "results"
    | "empty"
    | "error";
}

export function NationwideLabResults({
  activeError,
  isLoading = false,
  onSearchState,
  results,
  status,
}: NationwideLabResultsProps) {
  if (status === "error") {
    return (
      <div className='rounded-[24px] border border-slate-200/80 bg-white/88 p-5 text-center shadow-sm backdrop-blur'>
        <div className='mx-auto flex max-w-xl flex-col items-center gap-3'>
          <div className='rounded-full bg-rose-50 p-3 text-rose-600'>
            <MapPin className='h-5 w-5' />
          </div>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold text-slate-900'>
              We could not load nationwide availability
            </h3>
            <p className='text-sm leading-6 text-slate-500'>
              {activeError || "Try again in a moment or search by state instead."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "searching" || isLoading) {
    return (
      <div className='rounded-[24px] border border-slate-200/80 bg-white/88 p-5 text-sm text-slate-500 shadow-sm backdrop-blur'>
        Loading nationwide provider availability...
      </div>
    );
  }

  if (!results || status === "empty") {
    return (
      <div className='rounded-[24px] border border-slate-200/80 bg-white/88 p-5 text-center shadow-sm backdrop-blur'>
        <div className='mx-auto flex max-w-xl flex-col items-center gap-3'>
          <div className='rounded-full bg-sky-50 p-3 text-primary'>
            <Building2 className='h-5 w-5' />
          </div>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold text-slate-900'>
              No nationwide groups available
            </h3>
            <p className='text-sm leading-6 text-slate-500'>
              Try a state search or check again after provider availability refreshes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400'>
            Nationwide availability
          </p>
          <h2 className='text-lg font-semibold text-slate-900'>
            {results.meta.totalGroups} provider and state groups
          </h2>
          <p className='text-sm text-slate-500'>
            Reference-only coverage for ACCESS, CPL, Quest, and Labcorp outside restricted states.
          </p>
        </div>
        <Badge className='rounded-full bg-sky-50 px-3 py-1 text-sky-700 hover:bg-sky-50'>
          Page {results.meta.page}
        </Badge>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        {results.groups.map((group) => (
          <article
            key={`${group.providerCode}-${group.stateCode}`}
            className='rounded-[24px] border border-slate-200/80 bg-white/92 p-5 shadow-sm'
          >
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='space-y-2'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h3 className='text-[15px] font-semibold text-slate-900'>
                    {group.stateName}
                  </h3>
                  <Badge
                    variant='outline'
                    className='rounded-full border-slate-200 bg-slate-50 text-slate-700'
                  >
                    {group.providerLabel}
                  </Badge>
                  <Badge className='rounded-full bg-amber-50 text-amber-700 hover:bg-amber-50'>
                    Reference only
                  </Badge>
                </div>
                <p className='text-sm text-slate-500'>
                  {group.sampleLabs.length > 0
                    ? `${group.sampleLabs.length} sample places available for preview.`
                    : "Sample places are unavailable right now, but this provider and state remain in the nationwide view."}
                </p>
              </div>

              <Button
                type='button'
                variant='outline'
                className='h-10 rounded-full px-4'
                onClick={() =>
                  onSearchState(group.stateName, group.providerCode)
                }
              >
                Search this state
                <ArrowRight className='h-4 w-4' />
              </Button>
            </div>

            <div className='mt-4 space-y-3'>
              {group.sampleLabs.length > 0 ? (
                group.sampleLabs.map((lab) => (
                  <div
                    key={`${group.providerCode}-${group.stateCode}-${lab.id}`}
                    className='rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3'
                  >
                    <div className='flex items-start gap-3'>
                      <span className='mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm'>
                        <MapPin className='h-4 w-4' />
                      </span>
                      <div className='min-w-0 space-y-1'>
                        <p className='text-sm font-semibold text-slate-900'>
                          {lab.name}
                        </p>
                        <p className='text-sm leading-6 text-slate-500'>
                          {lab.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-500'>
                  Sample locations are temporarily unavailable for this provider and state.
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
