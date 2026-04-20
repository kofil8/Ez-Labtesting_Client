"use client";

import { Button } from "@/components/ui/button";
import { publicFetch } from "@/lib/api-client";
import { normalizePublicTestsResponse } from "@/lib/tests/public-tests";
import type { PublicCatalogTest } from "@/types/public-test";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Search,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const trustPoints = [
  { icon: CheckCircle2, text: "CLIA-certified partner labs" },
  { icon: Lock, text: "HIPAA-compliant data protection" },
  { icon: CheckCircle2, text: "Physician-reviewed reports" },
];

const popularSearches = [
  "CBC",
  "Thyroid Panel",
  "Lipid Panel",
  "STD Screen",
  "Vitamin D",
  "A1C",
];

const quickJumpLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#popular-categories", label: "Categories" },
  { href: "#popular-tests", label: "Popular Tests" },
  { href: "#popular-panels", label: "Panels" },
];

const metrics = [
  {
    label: "Fast Results",
    value: "24-72h",
    icon: Clock,
    subtitle: "Average turnaround",
  },
  {
    label: "Lab Network",
    value: "2,000+",
    icon: Zap,
    subtitle: "Locations nationwide",
  },
  {
    label: "Secure",
    value: "HIPAA",
    icon: Lock,
    subtitle: "Enterprise encryption",
  },
];

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const router = useRouter();
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownItems, setDropdownItems] = useState<PublicCatalogTest[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const listboxId = "hero-test-search-suggestions";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setDropdownOpen(false);
      setDropdownItems([]);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await publicFetch(
          `/tests/all?search=${encodeURIComponent(val.trim())}&limit=8&sortBy=name&sortOrder=asc&isPanel=false`,
        );
        if (res.ok) {
          const json = await res.json();
          const normalized = normalizePublicTestsResponse(json, {
            page: 1,
            limit: 8,
            total: 0,
          });
          setDropdownItems(normalized.data);
          setDropdownOpen(true);
          setActiveIndex(-1);
        }
      } catch {
        setDropdownItems([]);
        setActiveIndex(-1);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSearchSubmit = () => {
    setDropdownOpen(false);
    setActiveIndex(-1);
    if (searchTerm.trim()) {
      router.push(`/tests?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (dropdownItems.length > 0) {
        setDropdownOpen(true);
      }
      return;
    }

    if (dropdownItems.length > 0 && e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % dropdownItems.length);
      return;
    }

    if (dropdownItems.length > 0 && e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? dropdownItems.length - 1 : prev - 1,
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (dropdownOpen && activeIndex >= 0 && dropdownItems[activeIndex]) {
        handleDropdownClick(dropdownItems[activeIndex]);
        return;
      }
      handleSearchSubmit();
    }
    if (e.key === "Escape") {
      setDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleDropdownClick = (test: PublicCatalogTest) => {
    setDropdownOpen(false);
    setActiveIndex(-1);
    setSearchTerm(test.testName);
    router.push(`/tests/${test.slug}`);
  };

  return (
    <section className='relative overflow-hidden pt-6 sm:pt-10 lg:pt-16 pb-6 sm:pb-10 lg:pb-16 bg-gradient-to-b from-slate-50 via-white to-blue-50/30'>
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20'></div>
        <div className='absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20'></div>
      </div>

      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_1.05fr]'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='space-y-6'
          >
            <motion.div variants={itemVariants} className='inline-block'>
              <span className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700'>
                <span className='w-2 h-2 rounded-full bg-blue-600'></span>
                Healthcare Technology
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className='space-y-2'>
              <h1 className='text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight'>
                Online Lab Testing,
                <br />
                <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                  Simplified.
                </span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div ref={searchWrapperRef} className='relative'>
                <div className='flex flex-col gap-2 sm:flex-row'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none' />
                    <input
                      type='text'
                      value={searchTerm}
                      onChange={handleSearchInput}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        if (dropdownItems.length > 0) setDropdownOpen(true);
                      }}
                      placeholder='Search for a lab test (e.g., CBC, A1C, thyroid...)'
                      className='w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md'
                      aria-label='Search lab tests'
                      role='combobox'
                      aria-autocomplete='list'
                      aria-expanded={dropdownOpen}
                      aria-controls={listboxId}
                      aria-activedescendant={
                        activeIndex >= 0
                          ? `${listboxId}-option-${activeIndex}`
                          : undefined
                      }
                      autoComplete='off'
                    />
                    {dropdownOpen && (
                      <div
                        id={listboxId}
                        role='listbox'
                        className='absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden'
                      >
                        {isSearching ? (
                          <div className='px-4 py-3 text-sm text-slate-500'>
                            Searching...
                          </div>
                        ) : dropdownItems.length > 0 ? (
                          dropdownItems.map((item, index) => (
                            <button
                              key={item.id}
                              id={`${listboxId}-option-${index}`}
                              role='option'
                              aria-selected={index === activeIndex}
                              type='button'
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleDropdownClick(item);
                              }}
                              onMouseEnter={() => setActiveIndex(index)}
                              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors border-b border-slate-100 last:border-0 ${
                                index === activeIndex
                                  ? "bg-blue-50"
                                  : "hover:bg-blue-50"
                              }`}
                            >
                              <div className='min-w-0'>
                                <p className='text-sm font-medium text-slate-800 truncate'>
                                  {item.testName}
                                </p>
                                <p className='text-xs text-slate-500 mt-0.5 truncate'>
                                  {item.category?.name || "General Health"} -{" "}
                                  {item.shortDescription}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className='px-4 py-3 text-sm text-slate-500'>
                            No tests found for &ldquo;{searchTerm}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    type='button'
                    onClick={handleSearchSubmit}
                    className='rounded-xl bg-blue-600 text-white hover:bg-blue-700 px-5 shadow-md shrink-0 py-3.5 h-auto w-full sm:w-auto'
                  >
                    Search Tests
                  </Button>
                </div>

                <div className='flex flex-wrap items-center gap-2 mt-3'>
                  <span className='text-xs text-slate-400 font-medium shrink-0'>
                    Popular:
                  </span>
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type='button'
                      onClick={() => {
                        setSearchTerm(term);
                        router.push(`/tests?search=${encodeURIComponent(term)}`);
                      }}
                      className='text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm'
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className='text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl'
            >
              Use our online lab testing site to order medical lab tests with
              transparent pricing, CLIA-certified processing, and secure result
              delivery.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className='flex flex-wrap gap-x-5 gap-y-2.5'
            >
              {trustPoints.map((point) => (
                <div key={point.text} className='flex items-center gap-2'>
                  <div className='flex-shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-100 flex items-center justify-center'>
                    <point.icon className='h-2.5 w-2.5 text-emerald-600' />
                  </div>
                  <span className='text-xs font-medium text-slate-600'>
                    {point.text}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='flex flex-col sm:flex-row gap-3 pt-1'
            >
              <Button
                asChild
                size='lg'
                className='rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all'
              >
                <Link href='/tests' className='inline-flex items-center gap-2'>
                  Browse All Tests
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='rounded-lg border-slate-300 bg-white/90 text-slate-800 hover:bg-slate-100'
              >
                <Link href='/find-lab-center'>Find a Lab Center</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='flex flex-wrap items-center gap-2 pt-1'
            >
              <span className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Jump to
              </span>
              {quickJumpLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='relative'
          >
            <div className='relative'>
              <div className='relative overflow-hidden rounded-2xl lg:rounded-3xl border border-slate-200 bg-white shadow-2xl'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10'></div>
                <Image
                  src='/images/Pipetting.jpeg'
                  alt='Professional lab testing environment'
                  width={900}
                  height={700}
                  className='h-full w-full object-cover'
                  priority
                />
                <div className='absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg border border-white/50'>
                  <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                  <span className='text-xs font-semibold text-slate-900'>
                    Physician-reviewed
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3'
              >
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow'
                  >
                    <div className='mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50'>
                      <metric.icon className='h-5 w-5 text-blue-600' />
                    </div>
                    <p className='text-sm font-bold text-slate-900'>
                      {metric.value}
                    </p>
                    <p className='text-xs text-slate-500 mt-1'>
                      {metric.subtitle}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
