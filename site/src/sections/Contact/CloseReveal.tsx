"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { revealTravel } from "@/lib/inView";
import { prefersReducedMotion, REVEAL_LINE, STAGGER } from "@/lib/motion";

/**
 * The close's entrances (02-home.md §10.4): the same classes as <Reveal>
 * (is-in, is-revealing, --reveal-delay; globals.css hides parts under
 * html.js), with the rules this chapter needs:
 *
 * 1. Line. A part starts when its untransformed top crosses the chapter's
 *    line (92% of the viewport height, REVEAL_LINE, as everywhere else):
 *    one observer per line, so it fires exactly as the part crosses it.
 *    data-reveal-at="0.9" waits until 90% of the part is in view (the
 *    address: its letters rise where the reader is looking). Parts already
 *    in view when the chapter mounts arrive at once.
 * 2. Rest. When the chapter stops moving (its own visibility observer is
 *    quiet for 200ms), a part still waiting anywhere on screen plays: the
 *    foot of a resting screen never keeps a hole. Never a scroll listener.
 * 3. Order. A part never plays before the parts above it. Parts that start
 *    together play in reading order (rows top to bottom, then left to
 *    right), 70ms apart (40ms at rest). data-reveal-with="<key>" ties a part
 *    to the one marked data-reveal-key="<key>": it starts 70ms after it and
 *    holds nobody back (Copy rides with the address). data-reveal-span="550"
 *    holds the parts after it in the same batch back that long (on arrival
 *    or at rest, the letter starts as the address's last letters land). A
 *    release clock keeps later batches one stagger behind the last start,
 *    so a part the reader scrolls to never waits on screen.
 *
 * Focus never waits: a part that takes focus plays at once with the parts
 * above it (globals.css also shows a focused part with no entrance). Under
 * reduced motion the same order drives a 180ms opacity fade (the module CSS).
 */
const REST_MS = 200;
const REST_STAGGER = 40;
const REST_FADE = "420ms";
const CLEANUP_MS = 2000;
/** Parts whose tops are this close (px) share a row. */
const ROW = 32;
const MOVE_THRESHOLDS = Array.from({ length: 41 }, (_, i) => i / 40);

type DataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined };

type CloseRevealProps = HTMLAttributes<HTMLElement> & DataAttributes & { children?: ReactNode };

interface Part {
  el: HTMLElement;
  /** Share of the part in view it waits for; null = the chapter's line. */
  at: number | null;
  key?: string;
  with?: string;
  span: number;
}

const num = (value: string | undefined) => {
  const n = Number.parseFloat(value ?? "");
  return Number.isFinite(n) ? n : null;
};

export function CloseReveal({ children, ...rest }: CloseRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const root: HTMLElement = host;
    const parts: Part[] = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
      .filter((el) => el.closest("[data-reveal-root]") === root)
      .map((el) => ({
        el,
        at: num(el.dataset.revealAt),
        key: el.dataset.revealKey,
        with: el.dataset.revealWith,
        span: num(el.dataset.revealSpan) ?? 0,
      }));
    const pending = new Set(parts.filter((p) => !p.el.classList.contains("is-in")));
    if (pending.size === 0) return;

    const byEl = new Map(parts.map((p) => [p.el, p]));
    const keyed = new Map(parts.filter((p) => p.key).map((p) => [p.key as string, p]));
    const started = new Map<string, number>();
    const observers = new Map<string, IntersectionObserver>();
    const timers: number[] = [];
    let queued = new Set<Part>();
    let queuedAtRest = false;
    let clock = -Infinity;
    let raf = 0;
    let restTimer = 0;

    const keyOf = (p: Part) => (p.with ? keyed.get(p.with) : undefined);

    const schedule = (p: Part, start: number, now: number, atRest: boolean) => {
      const { el } = p;
      const delay = Math.max(0, Math.round(start - now));
      pending.delete(p);
      observers.forEach((io) => io.unobserve(el));
      if (p.key) started.set(p.key, start);
      el.style.setProperty("--reveal-delay", `${delay}ms`);
      if (atRest) el.style.setProperty("--dur-fade", REST_FADE);
      el.classList.add("is-revealing", "is-in");
      timers.push(
        window.setTimeout(() => {
          el.classList.remove("is-revealing");
          el.style.removeProperty("--reveal-delay");
          el.style.removeProperty("--dur-fade");
        }, delay + CLEANUP_MS),
      );
    };

    const play = () => {
      raf = 0;
      const asked = Array.from(queued).filter((p) => pending.has(p));
      const atRest = queuedAtRest;
      queued = new Set();
      queuedAtRest = false;
      if (asked.length === 0) return;

      // Geometry on the untransformed boxes (the hidden rise is added back).
      const geo = new Map<Part, { top: number; left: number }>();
      pending.forEach((p) => {
        const r = p.el.getBoundingClientRect();
        geo.set(p, { top: r.top - revealTravel(p.el), left: r.left });
      });
      const lowest = Math.max(...asked.map((p) => geo.get(p)?.top ?? 0));
      const inBatch = new Set(Array.from(pending).filter((p) => asked.includes(p) || (geo.get(p)?.top ?? 0) <= lowest + 1));
      // A key brings the parts tied to it; a tied part brings its key.
      inBatch.forEach((p) => {
        const key = keyOf(p);
        if (key && pending.has(key)) inBatch.add(key);
      });
      pending.forEach((p) => {
        const key = keyOf(p);
        if (key && inBatch.has(key)) inBatch.add(p);
      });

      const order = (a: Part, b: Part) => {
        const ga = geo.get(a) ?? { top: 0, left: 0 };
        const gb = geo.get(b) ?? { top: 0, left: 0 };
        return Math.abs(ga.top - gb.top) < ROW ? ga.left - gb.left : ga.top - gb.top;
      };
      const batch = Array.from(inBatch).sort(order);
      const tied = batch.filter((p) => keyOf(p));
      const leading = batch.filter((p) => !keyOf(p));

      // Reduced motion: short fades in the same order, no holds.
      const reduced = prefersReducedMotion();
      const now = performance.now();
      const stagger = atRest || reduced ? REST_STAGGER : STAGGER.chapter;
      let t = Math.max(now, clock);
      let last = t;
      for (const p of leading) {
        schedule(p, t, now, atRest);
        last = t;
        t += (reduced ? 0 : p.span) || stagger;
      }
      // A later batch follows the last start by one stagger: a hold never
      // keeps a part that the reader has scrolled to waiting on screen.
      clock = last + stagger;
      for (const p of tied) {
        const keyStart = started.get(p.with ?? "") ?? now;
        schedule(p, Math.max(now, keyStart + stagger), now, atRest);
      }
      if (pending.size === 0) stop();
    };

    const queue = (p: Part, atRest: boolean) => {
      if (!pending.has(p)) return;
      queued.add(p);
      queuedAtRest ||= atRest;
      if (!raf) raf = requestAnimationFrame(play);
    };

    /** At rest, whatever still waits on screen plays. */
    const rest = () => {
      restTimer = 0;
      const vh = window.innerHeight;
      pending.forEach((p) => {
        const r = p.el.getBoundingClientRect();
        const travel = revealTravel(p.el);
        if (r.width > 0 && r.top - travel < vh && r.bottom - travel > 0) queue(p, true);
      });
    };
    const moved = () => {
      window.clearTimeout(restTimer);
      restTimer = window.setTimeout(rest, REST_MS);
    };

    const onEntries = (entries: IntersectionObserverEntry[]) => {
      const vh = window.innerHeight;
      for (const e of entries) {
        const p = byEl.get(e.target as HTMLElement);
        if (!p || !e.isIntersecting) continue;
        if (p.at !== null && e.intersectionRatio < p.at - 0.005 && e.intersectionRect.height < vh * p.at) continue;
        queue(p, false);
      }
      moved();
    };

    const observerFor = (options: IntersectionObserverInit) => {
      const id = `${String(options.threshold)}|${options.rootMargin ?? ""}`;
      let io = observers.get(id);
      if (!io) {
        io = new IntersectionObserver(onEntries, options);
        observers.set(id, io);
      }
      return io;
    };

    // Mount: parts already in view arrive at once, in reading order.
    const vh = window.innerHeight;
    pending.forEach((p) => {
      const r = p.el.getBoundingClientRect();
      const travel = revealTravel(p.el);
      if (r.height > 0 && r.top - travel < vh && r.bottom - travel > 0) {
        queue(p, true);
        return;
      }
      if (keyOf(p)) return; // comes with its key
      if (p.at !== null) {
        observerFor({ threshold: p.at, rootMargin: "0px" }).observe(p.el);
      } else {
        const cut = Math.round(vh * (1 - REVEAL_LINE) - travel);
        observerFor({ threshold: 0, rootMargin: `0px 0px ${-cut}px 0px` }).observe(p.el);
      }
    });

    // The chapter's own movement, for the rest rule.
    const motion = new IntersectionObserver(moved, { threshold: MOVE_THRESHOLDS });
    motion.observe(root);

    const onFocus = (event: FocusEvent) => {
      const p = parts.find((q) => q.el.contains(event.target as Node));
      if (p) queue(p, true);
    };
    root.addEventListener("focusin", onFocus);

    function stop() {
      observers.forEach((io) => io.disconnect());
      motion.disconnect();
      window.clearTimeout(restTimer);
      root.removeEventListener("focusin", onFocus);
    }

    return () => {
      stop();
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      for (const p of parts) {
        p.el.classList.remove("is-revealing");
        p.el.style.removeProperty("--reveal-delay");
        p.el.style.removeProperty("--dur-fade");
      }
    };
  }, []);

  return (
    <section ref={ref} data-reveal-root="" {...rest}>
      {children}
    </section>
  );
}
