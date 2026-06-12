"use client";

import { useEffect } from "react";

type ScrollToTopOnMountProps = {
  scrollKey?: string;
};

export function ScrollToTopOnMount({ scrollKey }: ScrollToTopOnMountProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [scrollKey]);

  return null;
}
