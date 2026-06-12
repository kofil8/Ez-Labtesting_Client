"use client";

import { ZipSearchForm } from "@/components/shared/ZipSearchForm";
import { cn } from "@/lib/utils";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import geoUrl from "us-atlas/states-10m.json";

const restrictedStates: Record<string, string> = {
  NJ: "Restricted / Physician Required",
  MD: "Restricted / Physician Required",
  MA: "Restricted / Physician Required",
  RI: "Restricted / Physician Required",
  NY: "Restricted / Physician Required",
};

const stateByFips: Record<string, { abbr: string; name: string }> = {
  "01": { abbr: "AL", name: "Alabama" },
  "02": { abbr: "AK", name: "Alaska" },
  "04": { abbr: "AZ", name: "Arizona" },
  "05": { abbr: "AR", name: "Arkansas" },
  "06": { abbr: "CA", name: "California" },
  "08": { abbr: "CO", name: "Colorado" },
  "09": { abbr: "CT", name: "Connecticut" },
  "10": { abbr: "DE", name: "Delaware" },
  "11": { abbr: "DC", name: "District of Columbia" },
  "12": { abbr: "FL", name: "Florida" },
  "13": { abbr: "GA", name: "Georgia" },
  "15": { abbr: "HI", name: "Hawaii" },
  "16": { abbr: "ID", name: "Idaho" },
  "17": { abbr: "IL", name: "Illinois" },
  "18": { abbr: "IN", name: "Indiana" },
  "19": { abbr: "IA", name: "Iowa" },
  "20": { abbr: "KS", name: "Kansas" },
  "21": { abbr: "KY", name: "Kentucky" },
  "22": { abbr: "LA", name: "Louisiana" },
  "23": { abbr: "ME", name: "Maine" },
  "24": { abbr: "MD", name: "Maryland" },
  "25": { abbr: "MA", name: "Massachusetts" },
  "26": { abbr: "MI", name: "Michigan" },
  "27": { abbr: "MN", name: "Minnesota" },
  "28": { abbr: "MS", name: "Mississippi" },
  "29": { abbr: "MO", name: "Missouri" },
  "30": { abbr: "MT", name: "Montana" },
  "31": { abbr: "NE", name: "Nebraska" },
  "32": { abbr: "NV", name: "Nevada" },
  "33": { abbr: "NH", name: "New Hampshire" },
  "34": { abbr: "NJ", name: "New Jersey" },
  "35": { abbr: "NM", name: "New Mexico" },
  "36": { abbr: "NY", name: "New York" },
  "37": { abbr: "NC", name: "North Carolina" },
  "38": { abbr: "ND", name: "North Dakota" },
  "39": { abbr: "OH", name: "Ohio" },
  "40": { abbr: "OK", name: "Oklahoma" },
  "41": { abbr: "OR", name: "Oregon" },
  "42": { abbr: "PA", name: "Pennsylvania" },
  "44": { abbr: "RI", name: "Rhode Island" },
  "45": { abbr: "SC", name: "South Carolina" },
  "46": { abbr: "SD", name: "South Dakota" },
  "47": { abbr: "TN", name: "Tennessee" },
  "48": { abbr: "TX", name: "Texas" },
  "49": { abbr: "UT", name: "Utah" },
  "50": { abbr: "VT", name: "Vermont" },
  "51": { abbr: "VA", name: "Virginia" },
  "53": { abbr: "WA", name: "Washington" },
  "54": { abbr: "WV", name: "West Virginia" },
  "55": { abbr: "WI", name: "Wisconsin" },
  "56": { abbr: "WY", name: "Wyoming" },
};

const labels = [
  { abbr: "WA", coordinates: [-120.5, 47.4] },
  { abbr: "OR", coordinates: [-120.6, 43.9] },
  { abbr: "CA", coordinates: [-119.5, 37.1] },
  { abbr: "ID", coordinates: [-114.5, 44.3] },
  { abbr: "NV", coordinates: [-117.0, 39.3] },
  { abbr: "MT", coordinates: [-109.6, 46.8] },
  { abbr: "WY", coordinates: [-107.6, 43.0] },
  { abbr: "UT", coordinates: [-111.6, 39.4] },
  { abbr: "AZ", coordinates: [-111.6, 34.3] },
  { abbr: "CO", coordinates: [-105.6, 39.0] },
  { abbr: "NM", coordinates: [-106.1, 34.3] },
  { abbr: "ND", coordinates: [-100.4, 47.5] },
  { abbr: "SD", coordinates: [-100.2, 44.4] },
  { abbr: "NE", coordinates: [-99.8, 41.5] },
  { abbr: "KS", coordinates: [-98.4, 38.5] },
  { abbr: "OK", coordinates: [-97.5, 35.6] },
  { abbr: "TX", coordinates: [-99.2, 31.2] },
  { abbr: "MN", coordinates: [-94.4, 46.0] },
  { abbr: "IA", coordinates: [-93.4, 42.1] },
  { abbr: "MO", coordinates: [-92.5, 38.4] },
  { abbr: "AR", coordinates: [-92.4, 34.9] },
  { abbr: "LA", coordinates: [-91.5, 30.9] },
  { abbr: "WI", coordinates: [-89.8, 44.6] },
  { abbr: "IL", coordinates: [-89.2, 40.0] },
  { abbr: "MS", coordinates: [-89.7, 32.8] },
  { abbr: "MI", coordinates: [-84.8, 44.4] },
  { abbr: "IN", coordinates: [-86.1, 40.0] },
  { abbr: "KY", coordinates: [-85.3, 37.7] },
  { abbr: "TN", coordinates: [-86.2, 35.8] },
  { abbr: "AL", coordinates: [-86.7, 32.7] },
  { abbr: "OH", coordinates: [-82.8, 40.2] },
  { abbr: "WV", coordinates: [-80.6, 38.6] },
  { abbr: "VA", coordinates: [-78.6, 37.5] },
  { abbr: "NC", coordinates: [-79.3, 35.3] },
  { abbr: "SC", coordinates: [-80.9, 33.8] },
  { abbr: "GA", coordinates: [-83.4, 32.7] },
  { abbr: "FL", coordinates: [-82.6, 28.1] },
  { abbr: "PA", coordinates: [-77.7, 40.9] },
  { abbr: "NY", coordinates: [-75.2, 42.9] },
  { abbr: "VT", coordinates: [-72.7, 44.1] },
  { abbr: "NH", coordinates: [-71.6, 43.7] },
  { abbr: "ME", coordinates: [-69.2, 45.2] },
  { abbr: "MA", coordinates: [-71.9, 42.2] },
  { abbr: "RI", coordinates: [-71.2, 41.7] },
  { abbr: "CT", coordinates: [-72.7, 41.6] },
  { abbr: "NJ", coordinates: [-74.7, 40.1] },
  { abbr: "DE", coordinates: [-75.4, 39.0] },
  { abbr: "MD", coordinates: [-76.8, 39.0] },
  { abbr: "AK", coordinates: [-152, 64] },
  { abbr: "HI", coordinates: [-157, 20.7] },
];

type StateItem = { abbr: string; name: string };

function getStateStatus(state: StateItem) {
  const restricted = Boolean(restrictedStates[state.abbr]);
  return {
    ...state,
    restricted,
    status: restricted ? restrictedStates[state.abbr] : "Available",
    description: restricted
      ? "Service may be blocked or require additional physician authorization."
      : "Online ordering is available. Draw center availability depends on ZIP code.",
  };
}

export function USAServiceAvailabilityMap() {
  const [active, setActive] = useState<StateItem | null>(null);
  const [selected, setSelected] = useState<StateItem | null>(null);
  const [tooltip, setTooltip] = useState({ x: 240, y: 180 });

  const activeState = useMemo(() => {
    const state = active || selected;
    return state ? getStateStatus(state) : null;
  }, [active, selected]);

  return (
    <section
      id='state-availability'
      className='w-full bg-[linear-gradient(180deg,#ffffff_0%,#f1f8fb_100%)] px-4 py-16 dark:bg-slate-950 md:px-8'
    >
      <div className='mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.38fr_0.62fr] lg:items-stretch'>
        <div className='rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 md:p-8'>
          <p className='mb-3 text-xs font-black uppercase tracking-wider text-sky-700 dark:text-cyan-300'>
            State availability
          </p>
          <h2 className='text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
            Check service availability by state
          </h2>
          <p className='mt-4 text-base leading-7 text-slate-600 dark:text-slate-300'>
            EzLabTesting is currently available in most U.S. states through
            active partner lab coverage. Some states are restricted or may
            require additional physician involvement.
          </p>

          <div className='mt-6 grid grid-cols-3 gap-3'>
            {[
              ["45+", "Available states"],
              ["5", "Restricted states"],
              ["ZIP", "Validation before checkout"],
            ].map(([value, label]) => (
              <div
                key={value}
                className='rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950'
              >
                <p className='text-2xl font-black text-slate-950 dark:text-white'>
                  {value}
                </p>
                <p className='mt-1 text-xs font-semibold leading-4 text-slate-500 dark:text-slate-400'>
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className='mt-6 flex flex-wrap gap-3 text-sm'>
            <div className='flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-2 font-bold text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300'>
              <CheckCircle2 className='h-4 w-4' /> Available
            </div>
            <div className='flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 font-bold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300'>
              <ShieldAlert className='h-4 w-4' /> Restricted / Physician
              Required
            </div>
          </div>

          <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950'>
            <p className='text-sm font-black text-slate-900 dark:text-white'>
              Restricted states
            </p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {["NY", "NJ", "MD", "MA", "RI"].map((state) => (
                <span
                  key={state}
                  className='rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300'
                >
                  {state}
                </span>
              ))}
            </div>
          </div>

          <div className='mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950'>
            <p className='text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Selected state
            </p>
            {activeState ? (
              <div className='mt-2'>
                <div className='text-lg font-black text-slate-900 dark:text-white'>
                  {activeState.name} ({activeState.abbr})
                </div>
                <div
                  className={cn(
                    "mt-2 inline-flex rounded-full px-3 py-1 text-sm font-bold",
                    activeState.restricted
                      ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
                  )}
                >
                  {activeState.status}
                </div>
                <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                  {activeState.description}
                </p>
              </div>
            ) : (
              <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                Hover, click, or tab to a state to view service status.
              </p>
            )}
          </div>

          <ZipSearchForm
            className='mt-5'
            buttonLabel='Check ZIP Availability'
            inputClassName='rounded-xl'
            buttonClassName='rounded-xl'
            compact
          />
        </div>

        <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800'>
            <p className='text-sm font-black text-slate-900 dark:text-white'>
              USA service map
            </p>
            <p className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
              Hover or tap a state to view service status.
            </p>
          </div>
          <div
            className='relative overflow-hidden p-0 dark:bg-slate-950/30 sm:p-0.5'
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setTooltip({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            }}
          >
            {activeState && (
              <div
                className='pointer-events-none absolute z-20 hidden max-w-[250px] rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 md:block'
                style={{
                  left: `clamp(12px, ${tooltip.x + 16}px, calc(100% - 300px))`,
                  top: `clamp(12px, ${tooltip.y - 20}px, calc(100% - 150px))`,
                }}
              >
                <div className='text-xs font-black uppercase tracking-wide text-slate-400'>
                  {activeState.abbr}
                </div>
                <div className='text-base font-black text-slate-900 dark:text-white'>
                  {activeState.name}
                </div>
                <div
                  className={cn(
                    "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold",
                    activeState.restricted
                      ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
                  )}
                >
                  {activeState.status}
                </div>
                <p className='mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400'>
                  {activeState.description}
                </p>
              </div>
            )}

            <ComposableMap
              projection='geoAlbersUsa'
              width={1448}
              height={1086}
              className='-ml-[6%] h-auto w-[112%] max-w-none bg-white dark:bg-slate-950/10'
              role='img'
              aria-label='Clickable USA map showing available and restricted states'
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const fips = String(geo.id).padStart(2, "0");
                    const state = stateByFips[fips];

                    if (!state || state.abbr === "DC") return null;

                    const isRestricted = Boolean(restrictedStates[state.abbr]);
                    const fill = isRestricted ? "#ef4444" : "#16a34a";
                    const hoverFill = isRestricted ? "#dc2626" : "#15803d";

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        tabIndex={0}
                        aria-label={`${state.name}, ${isRestricted ? "restricted or physician required" : "available"}`}
                        onMouseEnter={() => setActive(state)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(state)}
                        onBlur={() => setActive(null)}
                        onClick={() => setSelected(state)}
                        style={{
                          default: {
                            fill,
                            stroke: "#ffffff",
                            strokeWidth: isRestricted ? 3.4 : 2.2,
                            outline: "none",
                            cursor: "pointer",
                          },
                          hover: {
                            fill: hoverFill,
                            stroke: "#ffffff",
                            strokeWidth: isRestricted ? 4.2 : 2.8,
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: hoverFill,
                            stroke: "#ffffff",
                            strokeWidth: 3,
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {labels.map((state) => (
                <Marker
                  key={state.abbr}
                  coordinates={state.coordinates as [number, number]}
                >
                  <text
                    textAnchor='middle'
                    dominantBaseline='central'
                    fill='#ffffff'
                    fontSize={
                      ["RI", "DE", "NJ", "CT", "MA", "MD", "VT", "NH"].includes(
                        state.abbr,
                      )
                        ? 18
                        : 28
                    }
                    fontWeight={800}
                    fontFamily='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {state.abbr}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </div>

          <div className='border-t border-slate-100 px-5 py-4 dark:border-slate-800'>
            <Link
              href='/find-lab-center'
              className='inline-flex text-sm font-bold text-sky-700 hover:text-sky-800 dark:text-cyan-300'
            >
              Enter ZIP code to confirm local draw center availability
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
