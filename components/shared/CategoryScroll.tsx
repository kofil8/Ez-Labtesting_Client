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
    <div className='relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm'>
      <div className='relative flex items-center gap-2 px-2 sm:px-4'>
        <button
          onClick={() => scrollCategories("left")}
          disabled={!canScrollLeft || isLoading}
          className='absolute left-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-sm transition-opacity disabled:opacity-20 disabled:cursor-not-allowed sm:left-2'
          aria-label='Scroll categories left'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        <div
          ref={categoryScrollRef}
          className='scrollbar-hide flex w-full items-center gap-3 overflow-x-scroll px-12 py-4 sm:gap-4 sm:px-16'
        >
          {isLoading ? (
            <div className='flex items-center gap-2 py-3 text-sm text-muted-foreground'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-r-transparent' />
              Loading categories...
            </div>
          ) : (
            categories.map((categoryItem) => {
              const isSelected = selectedCategory === categoryItem.id;

              return (
                <button
                  key={categoryItem.id}
                  onClick={() => onCategorySelect(categoryItem.id)}
                  disabled={isLoading}
                  title={categoryItem.name}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-sm"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  }`}
                >
                  {categoryItem.name}
                  {typeof categoryItem.testCount === "number" && (
                    <span
                      className={`text-[10px] font-normal ${
                        isSelected
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground/70"
                      }`}
                    >
                      ({categoryItem.testCount})
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <button
          onClick={() => scrollCategories("right")}
          disabled={!canScrollRight || isLoading}
          className='absolute right-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-sm transition-opacity disabled:opacity-20 disabled:cursor-not-allowed sm:right-2'
          aria-label='Scroll categories right'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
