"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scroll, synced with GSAP ScrollTrigger. DO NOT MOUNT.
 * The Tréma spec decided native scrolling with no smoothing library
 * (01-system.md §5.2, direction contract "Scrolling is native"). The file
 * stays only so the decision is visible; mounting it is a spec violation.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
