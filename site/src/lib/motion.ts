/**
 * Motion constants (01-system.md §5.1), mirrored from tokens.css so CSS and
 * JS agree. No GSAP import here: importing a constant must never pull GSAP
 * into a bundle. GSAP lives in lib/gsap.ts and loads only in the components
 * that scrub (Flight, scene partings).
 *
 * Rules: purpose first; transform + opacity (clip-path,
 * filter when smooth); UI feedback < 300ms; entries start at 0.94 or more,
 * never from nothing; stagger 30–90ms; press scale(0.97); hover only under
 * (hover:hover) and (pointer:fine); reduced motion keeps content and drops
 * travel; content is visible without JS (hidden states apply only under
 * html.js).
 *
 * No "use client": server components may import the constants.
 */

export const EASE = {
  /** Entrances, feedback, settles, dot drops. */
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  /** Anything travelling on screen: partings, the flight's x path, VT groups. */
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  /** The phone menu. */
  drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
  /** Colour, opacity and underline on hover. */
  hover: "ease",
} as const;

/** Durations in ms. */
export const DURATION = {
  press: 140,
  hover: 180,
  ui: 240,
  exit: 180,
  panel: 320,
  clip: 360,
  drop: 560,
  fade: 700,
  rise: 900,
  part: 1000,
  settle: 1200,
} as const;

/** Staggers in ms. */
export const STAGGER = {
  chapter: 70,
  ui: 45,
  letter: 30,
  dots: 60,
} as const;

/** Entrance travel in px. */
export const RISE = { chapter: 24, hero: 28, ui: 8 } as const;

/** GSAP scrub smoothing (seconds), so the dots trail a fast scroll. */
export const SCRUB = 0.6;

/**
 * The reveal line (§5.2, amended WF3 r2): a part starts its entrance when its
 * top crosses 92% of the viewport height, measured on its untransformed box
 * (Reveal compensates the hidden rise). Parts already in the viewport when
 * they mount arrive at once, in reading order. Was threshold 0.15 with a
 * −12% margin, which left up to ~190px of blank band at the bottom of a
 * resting screen (the hidden 24px rise counted against the part).
 */
export const REVEAL_LINE = 0.92;

/** The same line for your own once-only observers, so they fire with the chapter. */
export const REVEAL_OBSERVER = {
  threshold: 0,
  rootMargin: "0px 0px -8% 0px",
} as const;

/** Fired on a [data-reveal] part when its entrance starts; detail.delay is its --reveal-delay (ms). */
export const REVEAL_EVENT = "trema:reveal";

/** A pair inside a revealing part parts this long after the part starts rising (§5.2.7). */
export const PART_AFTER_REVEAL = 240;

/** A pair's own trigger: 40% of it in view. */
export const PART_OBSERVER = { threshold: 0.4, rootMargin: "0px" } as const;

/** Parts in one cascade: the 6th and later start with the 5th (no long queues). */
export const REVEAL_CASCADE_MAX = 5;

/** The tréma: gap between the two dots in dot diameters (League Spartan's ratio). */
export const TREMA_GAP = 0.27;

/** cubic-bezier(x1,y1,x2,y2) as a JS easing function, for WAAPI-free math and GSAP. */
export function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dsx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = sx(t) - x;
      if (Math.abs(d) < 1e-6) break;
      const dd = dsx(t);
      if (Math.abs(dd) < 1e-6) break;
      t -= d / dd;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}

/** The two system curves as functions (for GSAP `ease` and scrub math). */
export const easeOut = bezier(0.23, 1, 0.32, 1);
export const easeInOut = bezier(0.77, 0, 0.175, 1);

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True on devices with a real hover-capable fine pointer. */
export function canHover(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/** Clamp to [0, 1]. */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Progress of `p` inside the sub-range [a, b], clamped to [0, 1]. */
export const subRange = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
