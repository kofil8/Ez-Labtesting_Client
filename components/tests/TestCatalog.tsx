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
import { searchTests } from "@/lib/api";
import { Test } from "@/types/test";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TestGrid } from "./TestGrid";

const ITEMS_PER_PAGE = 10;

export function TestCatalog() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const loadTests = useCallback(async () => {
    setLoading(true);
    try {
      const results = await searchTests(searchQuery, category, sortBy);
      setTests(results);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, sortBy]);

  useEffect(() => {
    loadTests();
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [loadTests]);

  // Check scroll position for category bar
  const checkScrollPosition = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        categoryScrollRef.current;
      const hasScroll = scrollWidth > clientWidth;
      const left = hasScroll && scrollLeft > 5;
      const right = hasScroll && scrollLeft < scrollWidth - clientWidth - 5;

      console.log("Category scroll state:", {
        scrollWidth,
        clientWidth,
        scrollLeft,
        hasScroll,
        canScrollLeft: left,
        canScrollRight: right,
      });

      setCanScrollLeft(left);
      setCanScrollRight(right);
    }
  };

  useEffect(() => {
    // Multiple checks to ensure we catch the scroll state
    const checkMultipleTimes = () => {
      checkScrollPosition();
      setTimeout(checkScrollPosition, 100);
      setTimeout(checkScrollPosition, 300);
      setTimeout(checkScrollPosition, 500);
      setTimeout(checkScrollPosition, 1000);
    };

    checkMultipleTimes();

    const scrollElement = categoryScrollRef.current;
    let scrollTimeout: NodeJS.Timeout | undefined;
    let resizeObserver: ResizeObserver | null = null;

    // Also check when scroll ends (for smooth scrolling)
    const handleScroll = () => {
      checkScrollPosition();
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(checkScrollPosition, 100);
    };

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", checkMultipleTimes);

      // Use ResizeObserver to detect when content size changes
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          checkScrollPosition();
        });
        resizeObserver.observe(scrollElement);
      }
    }

    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", checkMultipleTimes);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        categoryScrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      categoryScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
      // Check scroll position after animation completes
      setTimeout(() => {
        checkScrollPosition();
      }, 300);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(tests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTests = tests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className='space-y-4 sm:space-y-6 md:space-y-8'>
      {/* Beautiful Search Bar */}
      <div className='bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500' />
          <Input
            type='search'
            placeholder='Search for tests, ingredients, or health conditions...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg sm:rounded-xl'
          />
        </div>
      </div>

      {/* Category Bar - Horizontal Scrollable with Sort and Filter */}
      <div className='bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
        <div className='relative flex items-center gap-2 sm:gap-4 px-2 sm:px-4'>
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollCategories("left")}
            disabled={!canScrollLeft}
            className='absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='Scroll left'
          >
            <ChevronLeft className='h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400' />
          </button>

          {/* Scrollable Category Container */}
          <div
            ref={categoryScrollRef}
            className='flex items-center gap-3 sm:gap-5 overflow-x-scroll scrollbar-hide py-2 sm:py-3 px-10 sm:px-14 w-full'
          >
            {[
              { id: "all", name: "All Tests" },
              { id: "general", name: "General Health" },
              { id: "hormone", name: "Hormone" },
              { id: "std", name: "STD Screening" },
              { id: "thyroid", name: "Thyroid" },
              { id: "cardiac", name: "Cardiac" },
              { id: "metabolic", name: "Metabolic" },
              { id: "nutrition", name: "Nutrition" },
              { id: "immunology", name: "Immunology" },
            ].map((categoryItem) => (
              <button
                key={categoryItem.id}
                onClick={() => setCategory(categoryItem.id)}
                className={`flex-shrink-0 text-xs sm:text-sm font-medium transition-colors pb-1 relative whitespace-nowrap ${
                  category === categoryItem.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {categoryItem.name}
                {category === categoryItem.id && (
                  <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400' />
                )}
              </button>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollCategories("right")}
            disabled={!canScrollRight}
            className='absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='Scroll right'
          >
            <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400' />
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className='bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6'>
        {loading ? (
          <div className='text-center py-12 sm:py-16'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' />
            <p className='text-gray-500 dark:text-gray-400 mt-4 text-sm'>
              Loading tests...
            </p>
          </div>
        ) : tests.length === 0 ? (
          <div className='text-center py-12 sm:py-16'>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              No tests found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Results Count with Sort and Filters */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium'>
                {tests.length} {tests.length === 1 ? "test" : "tests"} found
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>

              <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto'>
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-full sm:w-[140px] md:w-[180px] h-9 sm:h-10 border-gray-300 rounded-lg text-xs sm:text-sm'>
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='name'>Name</SelectItem>
                    <SelectItem value='price-asc'>
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value='price-desc'>
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value='turnaround'>
                      Fastest Turnaround
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Filters Button */}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowFilters(!showFilters)}
                  className='h-9 sm:h-10 px-3 sm:px-4 gap-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-lg text-xs sm:text-sm flex-shrink-0'
                >
                  <SlidersHorizontal className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Filters</span>
                </Button>
              </div>
            </div>

            <TestGrid tests={paginatedTests} fullWidth={true} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 flex-wrap'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3'
                >
                  <ChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Previous</span>
                  <span className='sm:hidden'>Prev</span>
                </Button>

                <div className='flex items-center gap-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      const showEllipsis =
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 &&
                          currentPage < totalPages - 2);

                      if (showEllipsis) {
                        return (
                          <span
                            key={page}
                            className='px-1 sm:px-2 text-muted-foreground text-xs sm:text-sm'
                          >
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size='sm'
                          onClick={() => handlePageChange(page)}
                          className='w-8 sm:w-10 h-8 sm:h-9 text-xs sm:text-sm'
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3'
                >
                  <span className='hidden sm:inline'>Next</span>
                  <span className='sm:hidden'>Next</span>
                  <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
