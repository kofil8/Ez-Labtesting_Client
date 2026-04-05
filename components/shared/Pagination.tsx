"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  resultCount?: number;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  resultCount,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const range = 1;

    for (let i = 1; i <= totalPages; i++) {
      const isFirst = i === 1;
      const isLast = i === totalPages;
      const isNear = i >= currentPage - range && i <= currentPage + range;

      if (isFirst || isLast || isNear) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..." &&
        pages.length > 0 &&
        pages[pages.length - 1] !== totalPages
      ) {
        pages.push("...");
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className='flex items-center justify-center gap-2 mt-8 flex-wrap bg-slate-50 dark:bg-slate-700 rounded-lg p-4'>
      {/* Previous Button */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className='gap-1 text-sm h-10 px-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'
      >
        <ChevronLeft className='h-4 w-4' />
        <span className='hidden sm:inline'>Previous</span>
        <span className='sm:hidden'>Prev</span>
      </Button>

      {/* Page Numbers */}
      <div className='flex items-center gap-1'>
        {pageNumbers.map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className='px-2 text-slate-500 dark:text-slate-400 text-sm'
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size='sm'
              onClick={() => onPageChange(page as number)}
              disabled={isLoading}
              className={`w-10 h-10 text-sm ${
                currentPage === page
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-500 text-white"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-cyan-400"
              }`}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className='gap-1 text-sm h-10 px-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'
      >
        <span className='hidden sm:inline'>Next</span>
        <span className='sm:hidden'>Next</span>
        <ChevronRight className='h-4 w-4' />
      </Button>

      {/* Result Count */}
      {resultCount !== undefined && (
        <div className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 ml-auto'>
          Showing{" "}
          <span className='font-semibold text-slate-900 dark:text-white'>
            {resultCount}
          </span>{" "}
          results
        </div>
      )}
    </div>
  );
}
