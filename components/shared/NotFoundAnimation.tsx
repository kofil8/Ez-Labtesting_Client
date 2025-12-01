"use client";

import { useEffect } from "react";

export default function NotFoundAnimation() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js";
    script.onload = () => {
      // @ts-ignore
      if (typeof window !== "undefined" && (window as any).lottie) {
        // @ts-ignore
        (window as any).lottie.loadAnimation({
          container: document.querySelector(".lottie-animation"),
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "https://lottie.host/d987597c-7676-4424-8817-7fca6dc1a33e/BVrFXsaeui.json",
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch {}
    };
  }, []);

  return null;
}
