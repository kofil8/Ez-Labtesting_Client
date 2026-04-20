"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

export interface SortOption {
  value: string;
  label: string;
}

interface CatalogHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  onFilterToggle?: () => void;
  resultCount?: number;
  searchSuggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  showSuggestions?: boolean;
  subtitle?: string;
}

export function CatalogHeader({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions,
  onFilterToggle,
  resultCount,
  searchSuggestions,
  onSuggestionClick,
  showSuggestions = false,
  subtitle,
}: CatalogHeaderProps) {
  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='relative'>
          {showSuggestions && (
            <div className='mb-5 text-center'>
              <h3 className='text-lg font-semibold text-slate-900 sm:text-xl'>
                Search the lab test catalog
              </h3>
              {subtitle && (
                <p className='mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600'>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className='relative mx-auto flex-1 max-w-3xl'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500' />
            <Input
              type='search'
              placeholder='Search by test name, health concern, or marker...'
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className='h-12 rounded-2xl border-slate-300 bg-slate-50 pl-12 text-base focus:border-sky-500 focus:ring-sky-500'
            />
            {searchValue && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onSearchChange("")}
                className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              >
                <X className='h-5 w-5' />
              </Button>
            )}
          </div>

          {showSuggestions &&
            searchSuggestions &&
            searchSuggestions.length > 0 && (
              <div className='mt-4 flex flex-wrap justify-center gap-2'>
                {searchSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant='outline'
                    size='sm'
                    onClick={() => onSuggestionClick?.(suggestion)}
                    className='rounded-full border-slate-200 bg-white text-xs text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 sm:text-sm'
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
        </div>
      </div>

      <div className='flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center'>
        {resultCount !== undefined && (
          <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
            Showing{" "}
            <span className='text-slate-900 dark:text-white font-semibold'>
              {resultCount}
            </span>{" "}
            results
          </p>
        )}

        <div className='flex items-center gap-3'>
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className='h-11 w-full rounded-xl border-slate-200 bg-white sm:w-52'>
              <SelectValue placeholder='Sort by...' />
            </SelectTrigger>
            <SelectContent className='border-slate-200 bg-white'>
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='cursor-pointer'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {onFilterToggle && (
            <Button
              variant='outline'
              size='icon'
              onClick={onFilterToggle}
              className='h-11 w-11 lg:hidden rounded-lg border-slate-200 dark:border-slate-700'
              title='Toggle filters'
            >
              <SlidersHorizontal className='h-5 w-5' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
