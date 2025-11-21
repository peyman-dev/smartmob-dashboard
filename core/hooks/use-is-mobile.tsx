"use client"
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") {
      return;
    }

    const checkIsMobile = () => {
      const widthCheck = window.innerWidth < breakpoint;
      const touchCheck =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setIsMobile(widthCheck);

    };

    // Initial check
    checkIsMobile();

    // Listen to resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}


export const isMobile = () => {
    return  typeof window !== "undefined" && window.innerWidth <= 768
}