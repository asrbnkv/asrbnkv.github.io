/**
 * GSAP for the components that scrub (Flight, the proof scenes' partings).
 * Import this ONLY from a "use client" component, and only where a scrub is
 * needed: everything else in the system is CSS plus one small observer
 * (01-system.md §5.5). Every GSAP context must be reverted in the effect's
 * cleanup (React 19 strict mode mounts twice in dev).
 *
 *   useIsomorphicLayoutEffect(() => {
 *     if (prefersReducedMotion()) return;
 *     const gsap = registerGsap();
 *     const ctx = gsap.context(() => { ... }, rootRef);
 *     return () => ctx.revert();
 *   }, []);
 *
 * Scroll is native (no Lenis, 01 §5.2), so ScrollTrigger reads the real
 * scroll position; shoot.mjs needs no --scroll-mode wheel.
 *
 * Never call ScrollTrigger.refresh() from a resize or mutation callback:
 * use requestRefresh() (debounced, one per 150ms of quiet) or
 * refreshOnResize() (a shared body ResizeObserver, ≥2px height changes).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easeInOut, easeOut } from "./motion";

let registered = false;

/** Register ScrollTrigger and the system curves once. Call inside an effect. */
export function registerGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // The two system curves, usable as ease: "trema.out" / "trema.inOut".
    gsap.registerEase("trema.out", easeOut);
    gsap.registerEase("trema.inOut", easeInOut);
    registered = true;
  }
  return gsap;
}

/* ── One debounced refresh for the whole page ───────────────────────────
 * ScrollTrigger.refresh() re-measures every trigger synchronously: called on
 * every body resize (an accordion tap, an image decode, a font swap) it costs
 * 100ms+ of main thread and makes pins jump mid-interaction. Ask for it
 * instead: requests coalesce into one refresh after 150ms of quiet, run in a
 * frame. Sections that change their own height call requestRefresh(); the
 * scrubs that need the page's height followed call refreshOnResize() once. */
const QUIET_MS = 150;
let quietTimer = 0;
let refreshFrame = 0;

/** Ask for one ScrollTrigger.refresh() once layout has been quiet for 150ms. */
export function requestRefresh(): void {
  if (typeof window === "undefined") return;
  window.clearTimeout(quietTimer);
  quietTimer = window.setTimeout(() => {
    quietTimer = 0;
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      if (registered) ScrollTrigger.refresh();
    });
  }, QUIET_MS);
}

let bodyObserver: ResizeObserver | null = null;
let bodyUsers = 0;
let bodyHeight = -1;

/**
 * Follow the page's height: a shared ResizeObserver on <body> that asks for
 * a refresh when the height really changes (2px or more). Ref-counted; call
 * the returned function in your effect's cleanup.
 */
export function refreshOnResize(): () => void {
  if (typeof window === "undefined" || typeof ResizeObserver === "undefined") return () => {};
  bodyUsers += 1;
  if (!bodyObserver) {
    bodyHeight = document.body.getBoundingClientRect().height;
    bodyObserver = new ResizeObserver((entries) => {
      const h = entries[entries.length - 1]?.contentRect.height ?? bodyHeight;
      if (Math.abs(h - bodyHeight) < 2) return;
      bodyHeight = h;
      requestRefresh();
    });
    bodyObserver.observe(document.body);
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    bodyUsers -= 1;
    if (bodyUsers <= 0 && bodyObserver) {
      bodyObserver.disconnect();
      bodyObserver = null;
      bodyUsers = 0;
    }
  };
}

export { gsap, ScrollTrigger };
