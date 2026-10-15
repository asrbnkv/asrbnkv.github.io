"use client";

import { useEffect, type RefObject } from "react";
import { onceInView } from "@/lib/inView";
import { EASE, prefersReducedMotion, STAGGER } from "@/lib/motion";

/**
 * The retro chapter's one choreography (02-home.md §7.4, 01 §7.13): one
 * trigger set for the whole chapter, so the H2, the statement and the six
 * rows keep their reading order at any scroll speed.
 *
 * - The H2 and each poster line rise out of their own baselines, line by
 *   line, 90ms apart (Retro.module.css, the masked rise); the statement
 *   follows the H2 by 70ms with the chapter's 24px rise (globals.css).
 * - The baseline is the event: each reason starts when its line is 80% up
 *   (240ms into the 900ms rise), rising 8px in 400ms, so the pair lands on
 *   the shared baseline together; the case follows 45ms later.
 * - Rows met in one frame cascade in order: 90ms between the lines of the
 *   first row, 50ms after that, so a jump never leaves the screen half blank.
 *   A part met while the one above is still arriving waits for it, never
 *   more than 140ms.
 * - Met through the top edge (scrolling back up), a part is simply there:
 *   a 200ms fade, no travel against the scroll.
 * - Keyboard actions are not animated: keyboard focus anywhere in the
 *   chapter finishes every entrance at once (running ones included).
 * - Reduced motion: no travel and no waiting state; a part caught at the
 *   bottom edge as the reader scrolls down fades in over 200ms (opacity
 *   only). A change of preference mid-session shows everything.
 *
 * Hidden states exist only under html.js and no-preference (CSS), so the
 * chapter is whole without JS, under reduced motion and in print. Everything
 * is torn down on unmount (React strict mode safe): a part cut off
 * mid-entrance lands where it was going.
 */

const LINE_STEP = 90;
const LINE_STEP_PACKED = 50;
const NEXT_AFTER_HEAD = STAGGER.chapter;
/** 240ms into a 900ms rise on the out curve, a line is 80% up. */
const REASON_AFTER_LINE = 240;
const CASE_AFTER_REASON = STAGGER.ui;
const MAX_WAIT = 2 * STAGGER.chapter;
const FADE_IN = 200;
const TRIGGER: IntersectionObserverInit = { threshold: 0, rootMargin: "0px 0px -8% 0px" };
/** Reduced motion: the viewport's own edge, and the slice of it (6% of the
 *  viewport, about 54px at 900) within which an arriving part still fades. */
const EDGE: IntersectionObserverInit = { threshold: 0, rootMargin: "0px" };
const EDGE_SLICE = 0.06;

interface Unit {
  kind: "head" | "statement" | "row";
  /** What is observed, and what fades when the unit simply appears. */
  el: HTMLElement;
  /** The masked block (H2 or poster line), if any. */
  masked: HTMLElement | null;
  /** data-reveal parts, in order (statement; reason, case). */
  parts: HTMLElement[];
  started: boolean;
  done: boolean;
}

function collect(root: HTMLElement): Unit[] {
  const unit = (kind: Unit["kind"], el: HTMLElement, masked: HTMLElement | null, parts: HTMLElement[]): Unit => {
    // Already landed (a remount in strict mode): leave it as it is.
    const done = masked ? "settled" in masked.dataset : parts.every((p) => p.classList.contains("is-in"));
    return { kind, el, masked, parts, started: done, done };
  };
  const units: Unit[] = [];
  const head = root.querySelector<HTMLElement>("[data-retro-head]");
  if (head) units.push(unit("head", head, head, []));
  const statement = root.querySelector<HTMLElement>("[data-retro-statement]");
  if (statement) units.push(unit("statement", statement, null, [statement]));
  root.querySelectorAll<HTMLElement>("[data-poster]").forEach((row) => {
    const parts = Array.from(row.querySelectorAll<HTMLElement>("[data-reveal]"));
    units.push(unit("row", row, row.querySelector<HTMLElement>("[data-masked]"), parts));
  });
  return units;
}

/** The words of a masked block, grouped by the visual line they sit on. */
function visualLines(block: HTMLElement): HTMLElement[][] {
  const lines: HTMLElement[][] = [];
  let top = Number.NaN;
  block.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
    const box = word.parentElement ?? word;
    if (box.offsetTop !== top) {
      top = box.offsetTop;
      lines.push([]);
    }
    lines[lines.length - 1].push(word);
  });
  return lines;
}

export function useRetroChoreography(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const all = collect(root);
    const units = all.filter((u) => !u.done);
    let alive = true;

    /** Land a unit: finish what runs, then hand back plain, finished markup. */
    const settle = (u: Unit) => {
      if (u.done) return;
      u.done = true;
      u.started = true;
      // Removing a class does not cancel a running transition: finish first.
      u.el.getAnimations({ subtree: true }).forEach((a) => {
        try {
          a.finish();
        } catch {
          a.cancel();
        }
      });
      if (u.masked) {
        u.masked.dataset.revealed = "";
        u.masked.dataset.settled = "";
        u.masked.querySelectorAll<HTMLElement>("[data-word]").forEach((w) => w.style.removeProperty("--line-delay"));
      }
      u.parts.forEach((p) => {
        p.classList.add("is-in");
        p.classList.remove("is-revealing");
        p.style.removeProperty("--reveal-delay");
      });
    };

    /** Shown without travel: met through the top edge (scrolling back up). */
    const appear = (u: Unit) => {
      settle(u);
      u.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_IN, easing: EASE.out });
    };

    const settleAll = () => units.forEach(settle);

    // ── Reduced motion: nothing is ever hidden (no waiting state, so a still
    //    frame or a screenshot always holds every word). A part that slides
    //    in at the bottom edge while the reader scrolls down takes a 200ms
    //    opacity fade (WAAPI, the top-edge fade) so its arrival is still
    //    signalled without travel; one already well in view stays as it is.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = prefersReducedMotion();
    if (reduced) units.forEach(settle);

    // ── Scroll direction (a passive listener that only stores a sign; the
    //    triggers stay IntersectionObservers): parts met while the reader
    //    scrolls back up appear without travel.
    let lastY = window.scrollY;
    let goingUp = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) {
        goingUp = y < lastY;
        lastY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── The cascade: parts met in one frame form a batch, in reading order.
    let batch: Unit[] = [];
    let raf = 0;
    /** performance.now() before which the next part should not start. */
    let nextAt = 0;

    const play = (u: Unit, at: number, step: number): number => {
      u.started = true;
      let lastLine = at;
      if (u.masked) {
        visualLines(u.masked).forEach((words, i) => {
          lastLine = at + i * step;
          words.forEach((w) => w.style.setProperty("--line-delay", `${lastLine}ms`));
        });
        // One attribute starts every line's rise with its own delay.
        u.masked.dataset.revealed = "";
      }
      // The statement at its own start; a row's reason when its line is 80%
      // up, then its case.
      const partsAt = u.kind === "row" ? lastLine + REASON_AFTER_LINE : at;
      u.parts.forEach((p, i) => {
        p.style.setProperty("--reveal-delay", `${partsAt + i * CASE_AFTER_REASON}ms`);
        p.classList.add("is-revealing", "is-in");
      });
      // Land it once everything in it has finished (running animations
      // only exist after the style change, which getAnimations flushes).
      const running = u.el.getAnimations({ subtree: true });
      void Promise.allSettled(running.map((a) => a.finished)).then(() => {
        if (alive) settle(u);
      });
      if (u.kind === "head") return lastLine + NEXT_AFTER_HEAD;
      if (u.kind === "statement") return at + NEXT_AFTER_HEAD;
      return lastLine + step;
    };

    const flush = () => {
      raf = 0;
      const now = performance.now();
      let cursor = Math.round(Math.min(Math.max(0, nextAt - now), MAX_WAIT));
      let rows = 0;
      for (const u of batch) {
        if (u.started) continue;
        const step = u.kind === "row" && rows++ > 0 ? LINE_STEP_PACKED : LINE_STEP;
        cursor = play(u, cursor, step);
      }
      nextAt = now + cursor;
      batch = [];
    };

    const enter = (u: Unit, entry: IntersectionObserverEntry) => {
      if (u.started || !alive) return;
      const fromTop = goingUp || entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0) - 1;
      if (fromTop) {
        appear(u);
        return;
      }
      batch.push(u);
      if (!raf) raf = requestAnimationFrame(flush);
    };

    /** Reduced motion: the fade only for a part caught at the bottom edge. */
    const arrive = (u: Unit, entry: IntersectionObserverEntry) => {
      if (!alive || goingUp || !motionQuery.matches) return;
      const view = entry.rootBounds?.height ?? window.innerHeight;
      if (entry.intersectionRect.height > view * EDGE_SLICE) return;
      u.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_IN, easing: EASE.out });
    };

    const cancels = reduced
      ? all.map((u) => onceInView(u.el, (entry) => arrive(u, entry), EDGE))
      : units.filter((u) => !u.done).map((u) => onceInView(u.el, (entry) => enter(u, entry), TRIGGER));

    // ── Keyboard: focus that lands by keyboard finishes the whole chapter.
    const onFocus = (event: FocusEvent) => {
      const target = event.target as Element | null;
      if (target?.matches(":focus-visible")) settleAll();
    };
    root.addEventListener("focusin", onFocus);

    // ── A change of preference mid-session: everything is simply there.
    const onPreference = () => settleAll();
    motionQuery.addEventListener("change", onPreference);

    return () => {
      alive = false;
      cancels.forEach((cancel) => cancel());
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("focusin", onFocus);
      motionQuery.removeEventListener("change", onPreference);
      // A part cut off mid-entrance lands where it was going; one never
      // reached keeps waiting for the next mount.
      units.forEach((u) => {
        if (u.started) settle(u);
      });
    };
  }, [ref]);
}
