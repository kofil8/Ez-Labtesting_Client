"use client";

import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hook/useDebounce";
import { LabCenterService } from "@/lib/services/lab-centers.service";
import { SearchSuggestion } from "@/types/lab-center";
import { Loader2, MapPin, Navigation, Search, Sparkles, X } from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

interface LabCenterSearchV2Props {
  error?: string | null;
  isBusy?: boolean;
  onSearch: (query: string) => Promise<void> | void;
  onUseMyLocation: () => Promise<void> | void;
  value: string;
  onValueChange: (value: string) => void;
}

export function LabCenterSearchV2({
  error,
  isBusy = false,
  onSearch,
  onUseMyLocation,
  value,
  onValueChange,
}: LabCenterSearchV2Props) {
  const listboxId = useId();
  const debouncedValue = useDebounce(value, 250);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (debouncedValue.trim().length < 2) {
        setSuggestions([]);
        setIsSuggestionsLoading(false);
        setIsExpanded(false);
        setActiveIndex(-1);
        return;
      }

      setIsSuggestionsLoading(true);
      const nextSuggestions =
        await LabCenterService.getAutocompleteSuggestions(debouncedValue);

      if (!active) {
        return;
      }

      setSuggestions(nextSuggestions);
      setIsExpanded(nextSuggestions.length > 0);
      setActiveIndex(nextSuggestions.length > 0 ? 0 : -1);
      setIsSuggestionsLoading(false);
    };

    void run().catch(() => {
      if (!active) {
        return;
      }

      setSuggestions([]);
      setIsExpanded(false);
      setActiveIndex(-1);
      setIsSuggestionsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [debouncedValue]);

  const activeSuggestionId = useMemo(() => {
    if (activeIndex < 0 || activeIndex >= suggestions.length) {
      return undefined;
    }

    return `${listboxId}-option-${activeIndex}`;
  }, [activeIndex, listboxId, suggestions.length]);

  const submitSearch = async (query: string) => {
    setIsExpanded(false);
    setSuggestions([]);
    setActiveIndex(-1);
    await onSearch(query);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitSearch(value);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isExpanded || suggestions.length === 0) {
      if (event.key === "Enter") {
        event.preventDefault();
        await submitSearch(value);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        current >= suggestions.length - 1 ? 0 : current + 1,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === "Escape") {
      setIsExpanded(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedSuggestion = suggestions[activeIndex];
      if (selectedSuggestion) {
        onValueChange(selectedSuggestion.description);
        await submitSearch(selectedSuggestion.description);
        return;
      }

      await submitSearch(value);
    }
  };

  const handleUseMyLocation = async () => {
    setIsLocating(true);
    try {
      await onUseMyLocation();
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className='relative w-full'>
      <div className='rounded-[28px] border border-white/80 bg-white/80 p-2 shadow-[0_22px_55px_rgba(15,23,42,0.16)] backdrop-blur-2xl'>
        <form
          className='flex flex-col gap-2 lg:flex-row lg:items-center'
          onSubmit={handleSubmit}
        >
          <div className='relative min-w-0 flex-1'>
            <label htmlFor='lab-center-search' className='sr-only'>
              Search by ZIP code, city, or address
            </label>
            <div className='pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-slate-400'>
              <MapPin className='h-4 w-4' />
            </div>
            <input
              id='lab-center-search'
              role='combobox'
              aria-autocomplete='list'
              aria-controls={listboxId}
              aria-expanded={isExpanded}
              aria-activedescendant={activeSuggestionId}
              className='h-14 w-full rounded-[22px] border border-slate-200/80 bg-white/80 pl-11 pr-14 text-sm text-slate-800 shadow-inner shadow-slate-100 outline-none transition focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10'
              placeholder='Search city, state, or ZIP'
              value={value}
              onChange={(event) => {
                onValueChange(event.target.value);
                setIsExpanded(true);
              }}
              onFocus={() => setIsExpanded(suggestions.length > 0)}
              onKeyDown={handleKeyDown}
              autoComplete='off'
            />
            {value ? (
              <button
                type='button'
                onClick={() => {
                  onValueChange("");
                  setIsExpanded(false);
                  setActiveIndex(-1);
                }}
                className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'
                aria-label='Clear search'
              >
                <X className='h-4 w-4' />
              </button>
            ) : null}
          </div>

          <div className='flex flex-col gap-2 sm:flex-row lg:items-center'>
            <Button
              type='button'
              variant='glass'
              className='h-12 rounded-full px-4 text-slate-700'
              onClick={handleUseMyLocation}
              disabled={isBusy || isLocating}
            >
              {isLocating ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Navigation className='h-4 w-4 text-primary' />
              )}
              Use my location
            </Button>
            <Button
              type='submit'
              className='h-12 rounded-full bg-gradient-to-r from-sky-700 to-cyan-700 px-5 text-white shadow-lg shadow-sky-200/60 hover:from-sky-800 hover:to-cyan-800'
              disabled={isBusy || !value.trim()}
            >
              {isBusy ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Search className='h-4 w-4' />
              )}
              Search
            </Button>
          </div>
        </form>
      </div>

      {isExpanded && (suggestions.length > 0 || isSuggestionsLoading) ? (
        <div
          id={listboxId}
          role='listbox'
          className='absolute inset-x-0 top-full z-30 mt-3 overflow-hidden rounded-[24px] border border-white/80 bg-white/92 p-2 shadow-[0_20px_48px_rgba(15,23,42,0.18)] backdrop-blur-2xl'
        >
          {isSuggestionsLoading ? (
            <div className='flex items-center gap-2 rounded-2xl px-4 py-4 text-sm text-slate-500'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Finding nearby places...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.description}-${index}`}
                id={`${listboxId}-option-${index}`}
                role='option'
                aria-selected={activeIndex === index}
                className={`flex w-full items-start gap-3 rounded-[18px] px-4 py-3 text-left transition ${
                  activeIndex === index
                    ? "bg-sky-50 text-sky-700"
                    : "hover:bg-slate-50"
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={async () => {
                  onValueChange(suggestion.description);
                  await submitSearch(suggestion.description);
                }}
              >
                <div className='mt-0.5 rounded-full bg-sky-100 p-2 text-sky-700'>
                  <Sparkles className='h-3.5 w-3.5' />
                </div>
                <div className='min-w-0'>
                  <div className='truncate text-sm font-semibold'>
                    {suggestion.mainText}
                  </div>
                  {suggestion.secondaryText ? (
                    <div className='truncate text-xs text-slate-500'>
                      {suggestion.secondaryText}
                    </div>
                  ) : null}
                </div>
              </button>
            ))
          )}
        </div>
      ) : null}

      {error ? (
        <div className='mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-4 py-2 text-sm text-rose-600 shadow-sm backdrop-blur'>
          <span className='h-2 w-2 rounded-full bg-rose-500' />
          <span className='truncate'>{error}</span>
        </div>
      ) : null}
    </div>
  );
}
