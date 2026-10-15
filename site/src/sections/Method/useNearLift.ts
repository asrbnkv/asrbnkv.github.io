"use client";

import { useEffect, type RefObject } from "react";
import { canHover, prefersReducedMotion } from "@/lib/motion";

/** How far from a dot's edge the pointer still lifts it, px. */
const REACH = 60;

/**
 * The month under a mouse (replaces the old replay wave, which played round
 * the whole ring on its own): the days within about 60px of the pointer lift
 * 4px and settle when it moves on (MonthRing.module.css holds the 160ms /
 * 240ms transitions). Local and immediate, so it answers the hand and never
 * plays while someone reads. It runs only when:
 * - the pointer is a mouse on a device that can hover;
 * - the month has settled (data-settled on the figure), so it never cuts
 *   the entrance short;
 * - reduced motion is off;
 * - the hand moves: moves of 0 (the page scrolling under a resting mouse)
 *   are ignored, and a scroll lets the days settle.
 * Positions come from the layout (offsetLeft/Top: the dot's centre, before
 * any transform), read once per pointer entry.
 */
export function useNearLift(figure: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = figure.current;
    const score = el?.querySelector<HTMLElement>("[data-score]");
    if (!el || !score) return;
    const dots = Array.from(score.querySelectorAll<HTMLElement>("[data-day]"));
    let centres: { x: number; y: number; r: number }[] = [];
    const near = new Set<HTMLElement>();
    let raf = 0;
    let px = 0;
    let py = 0;

    const clear = () => {
      near.forEach((d) => d.removeAttribute("data-near"));
      near.clear();
    };
    const measure = () => {
      centres = dots.map((d) => ({ x: d.offsetLeft, y: d.offsetTop, r: d.offsetWidth / 2 }));
    };
    const update = () => {
      raf = 0;
      if (!el.hasAttribute("data-settled") || prefersReducedMotion()) return clear();
      const box = score.getBoundingClientRect();
      const x = px - box.left;
      const y = py - box.top;
      dots.forEach((dot, i) => {
        const c = centres[i];
        if (!c) return;
        const isNear = Math.hypot(x - c.x, y - c.y) <= c.r + REACH;
        if (isNear && !near.has(dot)) {
          near.add(dot);
          dot.setAttribute("data-near", "");
        } else if (!isNear && near.has(dot)) {
          near.delete(dot);
          dot.removeAttribute("data-near");
        }
      });
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") measure();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !canHover()) return;
      // Only a hand that moves: the page scrolling under a resting mouse sends moves of 0.
      if (e.movementX === 0 && e.movementY === 0) return;
      if (!centres.length) measure();
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      clear();
    };

    score.addEventListener("pointerenter", onEnter);
    score.addEventListener("pointermove", onMove);
    score.addEventListener("pointerleave", onLeave);
    // A scroll moves the ring under the pointer: let the days settle until the hand moves again.
    window.addEventListener("scroll", onLeave, { passive: true });
    return () => {
      score.removeEventListener("pointerenter", onEnter);
      score.removeEventListener("pointermove", onMove);
      score.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onLeave);
      cancelAnimationFrame(raf);
      clear();
    };
  }, [figure]);
}
