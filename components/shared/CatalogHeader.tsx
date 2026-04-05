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
      {/* Enhanced Search Bar */}
      <div className='bg-gradient-to-r from-white to-cyan-50 dark:from-slate-900 dark:to-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full' />
          <div className='absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full' />
        </div>

        <div className='relative'>
          {showSuggestions && (
            <div className='text-center mb-4'>
              <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1'>
                🔍 Search Lab Tests
              </h3>
              {subtitle && (
                <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400'>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Search Input */}
          <div className='relative flex-1 max-w-2xl mx-auto'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500' />
            <Input
              type='search'
              placeholder='Try "thyroid", "vitamin d", or any health concern...'
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className='pl-12 h-12 sm:h-14 text-base border border-slate-300 dark:border-slate-600 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl shadow-sm bg-white dark:bg-slate-950'
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

          {/* Search Suggestions */}
          {showSuggestions &&
            searchSuggestions &&
            searchSuggestions.length > 0 && (
              <div className='flex flex-wrap justify-center gap-2 mt-4'>
                {searchSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant='outline'
                    size='sm'
                    onClick={() => onSuggestionClick?.(suggestion)}
                    className='text-xs sm:text-sm bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-900'
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Controls Row */}
      <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between'>
        {/* Result Count */}
        {resultCount !== undefined && (
          <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
            Showing{" "}
            <span className='text-slate-900 dark:text-white font-semibold'>
              {resultCount}
            </span>{" "}
            results
          </p>
        )}

        {/* Sort & Filter */}
        <div className='flex gap-3 items-center'>
          {/* Sort Dropdown */}
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className='w-full sm:w-48 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 rounded-lg'>
              <SelectValue placeholder='Sort by...' />
            </SelectTrigger>
            <SelectContent className='bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700'>
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

          {/* Filter Button (Mobile/Tablet) */}
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
