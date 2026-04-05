"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Category {
  id: string;
  name: string;
  testCount?: number;
}

interface CategoryScrollProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  isLoading?: boolean;
}

export function CategoryScroll({
  categories,
  selectedCategory,
  onCategorySelect,
  isLoading = false,
}: CategoryScrollProps) {
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        categoryScrollRef.current;
      const hasScroll = scrollWidth > clientWidth;
      const left = hasScroll && scrollLeft > 5;
      const right = hasScroll && scrollLeft < scrollWidth - clientWidth - 5;

      setCanScrollLeft(left);
      setCanScrollRight(right);
    }
  };

  useEffect(() => {
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
      setTimeout(() => {
        checkScrollPosition();
      }, 300);
    }
  };

  return (
    <div className='border border-border rounded-xl bg-card shadow-sm relative overflow-hidden'>
      {/* Top accent line */}
      <div className='h-0.5 bg-primary/30' />

      <div className='relative flex items-center gap-2 sm:gap-4 px-2 sm:px-4'>
        {/* Left Scroll Button */}
        <button
          onClick={() => scrollCategories("left")}
          disabled={!canScrollLeft || isLoading}
          className='absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md transition-opacity disabled:opacity-20 disabled:cursor-not-allowed'
          aria-label='Scroll categories left'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        {/* Categories Scroll Container */}
        <div
          ref={categoryScrollRef}
          className='flex items-center gap-3 sm:gap-5 overflow-x-scroll scrollbar-hide py-3 sm:py-4 px-12 sm:px-16 w-full'
        >
          {isLoading ? (
            <div className='text-sm text-muted-foreground flex items-center gap-2 py-3'>
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-primary border-r-transparent' />
              Loading categories...
            </div>
          ) : (
            categories.map((categoryItem) => {
              const isEmpty = categoryItem.testCount === 0;
              const isSelected = selectedCategory === categoryItem.id;

              return (
                <button
                  key={categoryItem.id}
                  onClick={() => !isEmpty && onCategorySelect(categoryItem.id)}
                  disabled={isLoading || isEmpty}
                  title={
                    isEmpty
                      ? `No available tests in ${categoryItem.name}`
                      : categoryItem.name
                  }
                  className={`flex-shrink-0 flex items-center gap-1.5 text-sm font-medium whitespace-nowrap px-4 py-2 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isEmpty
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {categoryItem.name}
                  {isEmpty && (
                    <span className='text-[10px] text-muted-foreground/40 font-normal'>
                      (0)
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scrollCategories("right")}
          disabled={!canScrollRight || isLoading}
          className='absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md transition-opacity disabled:opacity-20 disabled:cursor-not-allowed'
          aria-label='Scroll categories right'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
