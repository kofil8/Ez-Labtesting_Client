"use client";

import { LocationDisplay } from "@/components/shared/LocationDisplay";
import { LocationSelector } from "@/components/shared/LocationSelector";
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
import { AnimatePresence, motion } from "framer-motion";
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
  const [showLocationSelector, setShowLocationSelector] = useState(false);
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
    <div className='space-y-8'>
      {/* Location Bar */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4'>
        <LocationDisplay
          showSelector={true}
          onOpenSelector={() => setShowLocationSelector(true)}
          className='w-full'
        />
      </div>

      {/* Location Selector Modal */}
      <AnimatePresence>
        {showLocationSelector && (
          <motion.div
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowLocationSelector(false)}
          >
            <motion.div
              className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto'
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='p-6'>
                <motion.div
                  className='flex items-center justify-between mb-4'
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <h2 className='text-xl font-semibold'>Update Location</h2>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowLocationSelector(false)}
                    className='h-8 w-8 p-0 hover:bg-gray-100'
                  >
                    ✕
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <LocationSelector
                    onLocationChange={() => setShowLocationSelector(false)}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beautiful Search Bar */}
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
        <div className='relative flex-1'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500' />
          <Input
            type='search'
            placeholder='Search for tests, ingredients, or health conditions...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl'
          />
        </div>
      </div>

      {/* Category Bar - Horizontal Scrollable with Sort and Filter */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
        <div className='relative flex items-center gap-4 px-4'>
          {/* Left Scroll Button - TEMP: Always visible */}
          <button
            onClick={() => scrollCategories("left")}
            disabled={!canScrollLeft}
            className='absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='Scroll left'
          >
            <ChevronLeft className='h-4 w-4 text-gray-600 dark:text-gray-400' />
          </button>

          {/* Scrollable Category Container */}
          <div
            ref={categoryScrollRef}
            className='flex items-center gap-5 overflow-x-scroll scrollbar-hide py-3 px-14 w-full'
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
                className={`flex-shrink-0 text-sm font-medium transition-colors pb-1 relative whitespace-nowrap ${
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

          {/* Right Scroll Button - TEMP: Always visible */}
          <button
            onClick={() => scrollCategories("right")}
            disabled={!canScrollRight}
            className='absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='Scroll right'
          >
            <ChevronRight className='h-4 w-4 text-gray-600 dark:text-gray-400' />
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        {loading ? (
          <div className='text-center py-16'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' />
            <p className='text-gray-500 dark:text-gray-400 mt-4 text-sm'>
              Loading tests...
            </p>
          </div>
        ) : tests.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              No tests found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Results Count with Sort and Filters */}
            <div className='flex items-center justify-between mb-6 gap-4'>
              <p className='text-sm text-gray-600 dark:text-gray-300 font-medium'>
                {tests.length} {tests.length === 1 ? "test" : "tests"} found
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>

              <div className='flex items-center gap-3'>
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-[180px] h-10 border-gray-300 rounded-lg'>
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
                  size='default'
                  onClick={() => setShowFilters(!showFilters)}
                  className='h-10 px-4 gap-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-lg'
                >
                  <SlidersHorizontal className='h-4 w-4' />
                  Filters
                </Button>
              </div>
            </div>

            <TestGrid tests={paginatedTests} fullWidth={true} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-2 mt-8'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='gap-1'
                >
                  <ChevronLeft className='h-4 w-4' />
                  Previous
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
                            className='px-2 text-muted-foreground'
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
                          className='w-10'
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
                  className='gap-1'
                >
                  Next
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
