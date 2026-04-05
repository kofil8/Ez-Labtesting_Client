"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const SiteFooterLazy = dynamic(() =>
  import("@/components/shared/SiteFooter").then((m) => m.SiteFooter),
);

export function LazyFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can stop observing to avoid unnecessary updates
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
        rootMargin: "50px", // Start loading when 50px away from viewport
      },
    );

    observer.observe(footerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={footerRef}
      className={`transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {isVisible && <SiteFooterLazy />}
    </div>
  );
}
