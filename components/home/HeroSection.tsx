"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Lab test carousel images - local images from public folder
const MEDICAL_CAROUSEL_SLIDES = [
  {
    id: 1,
    url: "/images/Pipetting.jpeg",
    alt: "Lab technician pipetting samples for diagnostic testing",
    title: "Pipetting Diagnostic Samples",
  },
  {
    id: 2,
    url: "/images/Blood-Vial.webp",
    alt: "Blood vials organized for laboratory analysis",
    title: "Blood Vial Processing",
  },
  {
    id: 3,
    url: "/images/Manual-testing.webp",
    alt: "Automated analyzer running clinical chemistry tests",
    title: "Automated Analyzer",
  },
  {
    id: 4,
    url: "/images/analyzing.webp",
    alt: "Scientist using microscope for lab diagnostics",
    title: "Microscope Diagnostics",
  },
  {
    id: 5,
    url: "/images/consulting.jpeg",
    alt: "Sample racks prepared for clinical lab testing",
    title: "Sample Rack Prep",
  },
  {
    id: 6,
    url: "/images/collect-blood.webp",
    alt: "Technician loading samples into automated lab equipment",
    title: "Loading Automated Equipment",
  },
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [shuffledSlides, setShuffledSlides] = useState(MEDICAL_CAROUSEL_SLIDES);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize shuffled slides and hydration state on mount
  useEffect(() => {
    const slides = [...MEDICAL_CAROUSEL_SLIDES];
    const start = Math.floor(Math.random() * slides.length);
    setShuffledSlides(slides.slice(start).concat(slides.slice(0, start)));
    setIsHydrated(true);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Carousel auto-play logic
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === shuffledSlides.length - 1 ? 0 : prev + 1
      );
    }, 5500); // Change image every 5.5 seconds (2.5s transition + 3s display)

    return () => clearInterval(interval);
  }, [isAutoPlaying, prefersReducedMotion, shuffledSlides.length]);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === shuffledSlides.length - 1 ? 0 : prev + 1
    );
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? shuffledSlides.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section
      data-hero-section
      className='relative overflow-hidden bg-kalles-card awsmd-section'
    >
      {/* Kalles-style background with subtle patterns */}
      <div className='absolute inset-0 bg-kalles-pattern opacity-10 z-0' />
      <div className='absolute inset-0 bg-kalles-dots opacity-8 z-0' />

      {/* Subtle animated gradient accents - Optimized */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-[500px] h-[500px] awsmd-gradient-purple-pink rounded-full blur-3xl opacity-20 animate-blob gpu-accelerated' />
        <div className='absolute -bottom-40 -left-40 w-[600px] h-[600px] awsmd-gradient-blue-purple rounded-full blur-3xl opacity-15 animate-blob animation-delay-2000 gpu-accelerated' />
      </div>

      {/* Medical Image Carousel - Main Background */}
      <div className='absolute inset-0 w-full h-full overflow-hidden z-0'>
        <AnimatePresence mode='popLayout'>
          {/* Current Image */}
          <motion.div
            key={`img-${currentImageIndex}`}
            initial={{ opacity: 1, filter: "blur(0px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              filter: "blur(30px)",
              scale: 0.9,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 2.5,
              ease: "easeInOut",
            }}
            className='absolute inset-0 w-full h-full'
          >
            <Image
              src={shuffledSlides[currentImageIndex].url}
              alt={shuffledSlides[currentImageIndex].alt}
              fill
              className='object-cover'
              priority={currentImageIndex === 0}
              sizes='100vw'
              quality={85}
            />
            {/* Dark overlay for text readability */}
            <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60' />
          </motion.div>

          {/* Advanced Shatter Glass Effect with Image Pieces */}
          <motion.div
            key={`shatter-${currentImageIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 2.5,
              ease: "easeInOut",
            }}
            className='absolute inset-0 w-full h-full overflow-hidden'
            style={{ pointerEvents: "none" }}
          >
            {/* Grid of shatter pieces with image background */}
            {Array.from({ length: 24 }).map((_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const randomRotation = Math.random() * 360;
              const randomDelay = i * 0.08;
              const staggerDirection = i % 2 === 0 ? 1 : -1;

              // Map piece position to background position for image continuity
              const bgPositionX = (col / 6) * 100;
              const bgPositionY = (row / 4) * 100;

              return (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: (col - 2.5) * staggerDirection * 150,
                    y: (row - 2) * staggerDirection * 150,
                    rotate: randomRotation,
                    scale: 0.1,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 2.2,
                    delay: randomDelay,
                    ease: "easeInOut",
                  }}
                  className='absolute w-1/6 h-1/4 border-2 border-cyan-400/80 backdrop-blur-md shadow-2xl'
                  style={{
                    left: `${col * 16.666}%`,
                    top: `${row * 25}%`,
                    backgroundImage: `url('${shuffledSlides[currentImageIndex].url}')`,
                    backgroundSize: "600% 400%",
                    backgroundPosition: `${bgPositionX}% ${bgPositionY}%`,
                    boxShadow:
                      "0 0 30px rgba(34, 211, 238, 0.8), inset 0 0 15px rgba(168, 85, 247, 0.4)",
                  }}
                />
              );
            })}

            {/* Radial burst lines */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const distance = 200;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <motion.div
                  key={`burst-${i}`}
                  initial={{
                    opacity: 0.8,
                    scaleX: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scaleX: 1,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 1.8,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                  className='absolute h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-transparent origin-left'
                  style={{
                    width: "400px",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) rotate(${
                      angle * (180 / Math.PI)
                    }deg)`,
                    boxShadow: "0 0 40px rgba(34, 211, 238, 0.9)",
                  }}
                />
              );
            })}

            {/* Particle explosion */}
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const velocity = 250 + Math.random() * 150;
              const x = Math.cos(angle) * velocity;
              const y = Math.sin(angle) * velocity;

              return (
                <motion.div
                  key={`particle-${i}`}
                  initial={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x,
                    y,
                    scale: 0,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 2,
                    delay: Math.random() * 0.4,
                    ease: "easeOut",
                  }}
                  className='absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-300 to-purple-500 blur-sm'
                  style={{
                    left: "50%",
                    top: "50%",
                    boxShadow: "0 0 20px rgba(34, 211, 238, 0.9)",
                  }}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className='inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 awsmd-rounded bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-bold mb-8 sm:mb-12 shadow-xl'
          >
            <Sparkles className='h-3 w-3 sm:h-4 sm:w-4 animate-pulse' />
            <span className='hidden sm:inline'>
              Trusted by 50,000+ health-conscious individuals
            </span>
            <span className='sm:hidden'>50,000+ Trusted Users</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 sm:mb-8 leading-tight font-extrabold px-4 sm:px-0'
          >
            <span className='block mb-2 sm:mb-4 text-white drop-shadow-lg'>
              Professional
            </span>
            <span className='relative inline-block'>
              <span className='text-gradient-medical animate-gradient drop-shadow-lg'>
                Lab Testing
              </span>
            </span>
            <br />
            <span className='block mt-2 sm:mt-4 text-white drop-shadow-lg'>
              Made Simple
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className='text-base sm:text-lg md:text-xl lg:text-2xl text-white drop-shadow-lg max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed font-normal px-4 sm:px-0'
          >
            Order confidential lab tests online without a doctor{"'"}s visit.
            <br className='hidden sm:block' />
            <span className='font-semibold text-cyan-300 drop-shadow-md'>
              HIPAA-secure, CLIA-certified labs,
            </span>{" "}
            results in 24-48 hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-10 sm:mb-16 px-4 sm:px-0'
          >
            <Button
              size='xl'
              variant='medical'
              className='text-white hover:opacity-95 transition-all shadow-2xl group rounded-xl px-8 py-6 sm:px-10 sm:py-7 text-base sm:text-lg font-bold'
              asChild
            >
              <Link href='/tests'>
                Browse Lab Tests
                <ArrowRight className='ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform' />
              </Link>
            </Button>
            <Button
              size='xl'
              variant='glass'
              className='hover:scale-[1.02] transition-all shadow-xl rounded-xl px-8 py-6 sm:px-10 sm:py-7 text-base sm:text-lg font-bold'
              asChild
            >
              <Link href='/login'>Sign In</Link>
            </Button>
          </motion.div>

          {/* Trust indicators - Awsmd style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto px-4 sm:px-0'
          >
            {[
              {
                icon: Shield,
                title: "HIPAA Secure",
                description: "Bank-level encryption protects your health data",
                gradient: "from-blue-500 via-cyan-500 to-blue-600",
                bgGradient: "gradient-medical",
                iconColor: "text-white",
              },
              {
                icon: Award,
                title: "CLIA Certified",
                description: "Processed by certified laboratories nationwide",
                gradient: "from-emerald-500 via-teal-500 to-green-600",
                bgGradient: "gradient-health",
                iconColor: "text-white",
              },
              {
                icon: Zap,
                title: "Fast Results",
                description:
                  "Get your results in 24-48 hours with our reliable service",
                gradient: "from-cyan-500 via-blue-500 to-indigo-600",
                bgGradient: "gradient-lab",
                iconColor: "text-white",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className='relative group'
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} awsmd-rounded-xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-500`}
                />
                <div className='awsmd-glass-card p-6 sm:p-8 md:p-10 awsmd-hover-lift border-2 border-white/40 dark:border-gray-700/40 group-hover:border-white/60 dark:group-hover:border-gray-600/60 relative'>
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 sm:mb-6 awsmd-rounded ${item.bgGradient} flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110`}
                  >
                    <item.icon
                      className={`h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 ${item.iconColor}`}
                    />
                  </div>
                  <h3 className='font-black text-xl sm:text-xl md:text-2xl mb-3 sm:mb-4 text-gray-900 dark:text-white'>
                    {item.title}
                  </h3>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed'>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Carousel Controls - Dots and Navigation Arrows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className='mt-12 sm:mt-16 md:mt-20 flex flex-col items-center gap-6'
          >
            {/* Navigation Arrows */}
            <div className='flex items-center gap-4 sm:gap-6'>
              <motion.button
                onClick={goToPreviousImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 transition-all duration-300 text-white'
                aria-label='Previous image'
              >
                <ChevronLeft className='h-5 w-5 sm:h-6 sm:w-6' />
              </motion.button>

              {/* Dot Indicators */}
              <div className='flex gap-2 sm:gap-3'>
                {shuffledSlides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToImage(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white w-8 sm:w-10"
                        : "bg-white/50 w-2 sm:w-3 hover:bg-white/70"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={index === currentImageIndex}
                  />
                ))}
              </div>

              <motion.button
                onClick={goToNextImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 transition-all duration-300 text-white'
                aria-label='Next image'
              >
                <ChevronRight className='h-5 w-5 sm:h-6 sm:w-6' />
              </motion.button>
            </div>

            {/* Slide Title/Caption */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className='text-white/80 text-sm sm:text-base font-medium drop-shadow-md'
              >
                {shuffledSlides[currentImageIndex].title}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
