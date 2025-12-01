"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Award, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    // For hero section (typically above fold), load immediately but with delay
    // This prevents blocking initial page load
    const loadTimer = setTimeout(() => {
      if (!shouldLoadVideo) {
        setShouldLoadVideo(true);
      }
    }, 100); // Small delay to let page content load first

    const sectionElement = sectionRef.current;

    if (!sectionElement) {
      return () => {
        clearTimeout(loadTimer);
        mediaQuery.removeEventListener("change", handleMediaChange);
      };
    }

    // Intersection Observer as fallback for when section scrolls into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadVideo) {
            setShouldLoadVideo(true);
          }
        });
      },
      {
        rootMargin: "100px", // Start loading before it's visible
        threshold: 0.01,
      }
    );

    observer.observe(sectionElement);

    return () => {
      clearTimeout(loadTimer);
      mediaQuery.removeEventListener("change", handleMediaChange);
      observer.unobserve(sectionElement);
    };
  }, [shouldLoadVideo]);

  useEffect(() => {
    // Handle video load and play
    if (videoRef.current && shouldLoadVideo && !prefersReducedMotion) {
      const video = videoRef.current;

      const handleLoadedData = () => {
        setIsVideoLoaded(true);
        video.play().catch(() => {
          // Silently handle autoplay restrictions
        });
      };

      video.addEventListener("loadeddata", handleLoadedData);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, [shouldLoadVideo, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
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

      {/* Background video element - Optimized for performance */}
      <div className='absolute inset-0 w-full h-full overflow-hidden z-0'>
        {shouldLoadVideo && !prefersReducedMotion ? (
          <video
            ref={videoRef}
            preload='metadata'
            aria-label='Hero background video'
            muted
            loop
            playsInline
            className='w-full h-full object-cover absolute inset-0'
            style={{
              opacity: isVideoLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in",
            }}
          >
            <source
              src='https://ik.imagekit.io/an6uwgksy/Hero.mp4'
              type='video/mp4'
            />
          </video>
        ) : null}
        {/* Fallback gradient background */}
        <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-purple-900/20' />
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
            <span className='block mb-2 sm:mb-4 text-gray-900 dark:text-white'>
              Professional
            </span>
            <span className='relative inline-block'>
              <span className='text-gradient-medical animate-gradient'>
                Lab Testing
              </span>
            </span>
            <br />
            <span className='block mt-2 sm:mt-4 text-gray-800 dark:text-gray-100'>
              Made Simple
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed font-normal px-4 sm:px-0'
          >
            Order confidential lab tests online without a doctor{"'"}s visit.
            <br className='hidden sm:block' />
            <span className='font-semibold text-cyan-600 dark:text-cyan-400'>
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
        </div>
      </div>
    </section>
  );
}
