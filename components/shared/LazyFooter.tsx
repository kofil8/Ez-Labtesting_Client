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
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    observer.observe(footerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={footerRef}>
      {isVisible && <SiteFooterLazy />}
    </div>
  );
}
