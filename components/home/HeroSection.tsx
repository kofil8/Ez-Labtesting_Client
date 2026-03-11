"use client";

import { Button } from "@/components/ui/button";
import { publicFetch } from "@/lib/api-client";
import type { Test } from "@/types/test";
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
  const [dropdownItems, setDropdownItems] = useState<Test[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await publicFetch(
          `/api/v1/tests/all?searchTerm=${encodeURIComponent(val.trim())}&limit=8&isActive=true`,
        );
        if (res.ok) {
          const json = await res.json();
          setDropdownItems(json.data || []);
          setDropdownOpen(true);
        }
      } catch {
        // silently fail
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSearchSubmit = () => {
    setDropdownOpen(false);
    if (searchTerm.trim()) {
      router.push(`/tests?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
    if (e.key === "Escape") setDropdownOpen(false);
  };

  const handleDropdownClick = (test: Test) => {
    setDropdownOpen(false);
    setSearchTerm(test.testName);
    router.push(`/tests/${test.id}`);
  };

  return (
    <section className='relative overflow-hidden pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-10 lg:pb-16 bg-gradient-to-b from-slate-50 via-white to-blue-50/30'>
      {/* Decorative background elements */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20'></div>
        <div className='absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20'></div>
      </div>

      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10'>
        <div className='grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]'>
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='space-y-6'
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className='inline-block'>
              <span className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700'>
                <span className='w-2 h-2 rounded-full bg-blue-600'></span>
                Healthcare Technology
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className='space-y-2'>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight'>
                Lab Testing,
                <br />
                <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                  Simplified.
                </span>
              </h1>
            </motion.div>

            {/* Search Bar — top of interactive area */}
            <motion.div variants={itemVariants}>
              <div ref={searchWrapperRef} className='relative'>
                <div className='flex gap-2'>
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
                      placeholder='Search for a lab test (e.g., CBC, A1C, thyroid…)'
                      className='w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md'
                      aria-label='Search lab tests'
                      autoComplete='off'
                    />
                    {dropdownOpen && (
                      <div className='absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden'>
                        {isSearching ? (
                          <div className='px-4 py-3 text-sm text-slate-500'>
                            Searching…
                          </div>
                        ) : dropdownItems.length > 0 ? (
                          dropdownItems.map((item) => (
                            <button
                              key={item.id}
                              type='button'
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleDropdownClick(item);
                              }}
                              className='w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 text-left transition-colors border-b border-slate-100 last:border-0'
                            >
                              <div className='min-w-0'>
                                <p className='text-sm font-medium text-slate-800 truncate'>
                                  {item.testName}
                                </p>
                                <p className='text-xs text-slate-500 mt-0.5'>
                                  {typeof item.category === "object" &&
                                  item.category !== null
                                    ? (item.category as { name: string }).name
                                    : item.category}
                                </p>
                              </div>
                              <span className='text-sm font-semibold text-blue-600 ml-4 shrink-0'>
                                ${item.price.toFixed(2)}
                              </span>
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
                    className='rounded-xl bg-blue-600 text-white hover:bg-blue-700 px-5 shadow-md shrink-0 py-3.5 h-auto'
                  >
                    Search
                  </Button>
                </div>

                {/* Popular search chips */}
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
                        router.push(
                          `/tests?searchTerm=${encodeURIComponent(term)}`,
                        );
                      }}
                      className='text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm'
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className='text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg'
            >
              Get comprehensive lab results from CLIA-certified facilities.
              Order online, visit your nearest collection center, and access
              secure reports within 24-72 hours.
            </motion.p>

            {/* Trust Points — horizontal compact */}
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

            {/* CTA */}
            <motion.div variants={itemVariants} className='flex gap-3 pt-1'>
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
            </motion.div>
          </motion.div>

          {/* Right Image & Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='relative'
          >
            <div className='relative'>
              {/* Image Container */}
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
                {/* Badge */}
                <div className='absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg border border-white/50'>
                  <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                  <span className='text-xs font-semibold text-slate-900'>
                    Physician-reviewed
                  </span>
                </div>
              </div>

              {/* Metrics Grid - Below Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className='mt-6 grid grid-cols-3 gap-3'
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
