"use client";

import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Monitor Core Web Vitals
    if ("web-vital" in window) {
      return;
    }

    // Measure page load performance
    const measurePerformance = () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime =
          timing.domContentLoadedEventEnd - timing.navigationStart;
        const firstPaintTime = timing.responseStart - timing.navigationStart;

        if (process.env.NODE_ENV === "development") {
          console.log("Performance Metrics:", {
            loadTime: `${loadTime}ms`,
            domReadyTime: `${domReadyTime}ms`,
            firstPaintTime: `${firstPaintTime}ms`,
          });
        }
      }
    };

    // Wait for load event
    if (document.readyState === "complete") {
      measurePerformance();
    } else {
      window.addEventListener("load", measurePerformance);
    }

    // Monitor long tasks (> 50ms)
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              if (process.env.NODE_ENV === "development") {
                console.warn("Long task detected:", {
                  duration: `${entry.duration.toFixed(2)}ms`,
                  name: entry.name,
                });
              }
            }
          }
        });

        observer.observe({ entryTypes: ["longtask"] });

        return () => observer.disconnect();
      } catch (e) {
        // PerformanceObserver not fully supported
      }
    }

    return () => {
      window.removeEventListener("load", measurePerformance);
    };
  }, []);

  return null;
}
