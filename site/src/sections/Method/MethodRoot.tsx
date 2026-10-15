"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { onceInView, watchMedia } from "@/lib/inView";
import { DURATION, EASE, prefersReducedMotion, REVEAL_OBSERVER, STAGGER } from "@/lib/motion";
import { MONTH_END, RELIGHT, WEEK_ONE_END } from "./ring";

type DataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined };

/** Share of the ring (or of the screen, for a ring taller than it) that must be in view to light it. */
const RING_IN_VIEW = 0.85;
const RING_STEPS = Array.from({ length: 21 }, (_, i) => i / 20);
/**
 * Week 1 lifts again with the last step's words: its line fades in two UI
 * staggers after its name (Method.module.css), so the dots answer "…then the
 * loop starts again" while it is being read, and while the ring still holds
 * (the hold ends about 250px after that row starts rising).
 */
const WITH_LINE = 2 * STAGGER.ui;

/**
 * The chapter's root and its one choreography (02 §6.4, 01 §5.2 item 7).
 *
 * 1. Opening, one trigger: the first of the heading or the statement to
 *    cross the system's entrance line opens the chapter. The heading rises
 *    at 0ms, the statement at +70ms when it is on screen (beside the heading
 *    from 768px; on phones it waits for its own line, never before +70ms).
 * 2. The month lights once the heading has started (at +140ms at the
 *    earliest) and 85% of the ring is in view: the days clockwise, 18ms
 *    apart with a 70ms rest at each weekend, the review dropping in last.
 *    Until then it waits unlit (12% ink), so the drawing is never blank.
 * 3. "…then the loop starts again": when the loop's last step rises while
 *    the ring is pinned (1024px and wider), week 1's five days lift 6px and
 *    settle once more, in order, as its words arrive. Once per visit; never
 *    before week 1 has landed; never once the ring has moved on.
 *
 * The loop's rows keep their own per-row entrances (a nested <Reveal>).
 * State lives on the DOM (is-in, data-played, data-relit), so a strict-mode
 * remount mid-entrance lets it finish instead of restarting it. Without JS
 * everything is drawn; under reduced motion everything is drawn at once,
 * also when the preference changes mid-session.
 */
export function MethodRoot({
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & DataAttributes & { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const title = root.querySelector<HTMLElement>('[data-open="title"]');
    const statement = root.querySelector<HTMLElement>('[data-open="statement"]');
    const month = root.querySelector<HTMLElement>("[data-month]");
    const score = month?.querySelector<HTMLElement>("[data-score]");
    const stage = root.querySelector<HTMLElement>("[data-stage]");
    const lastRow = root.querySelector<HTMLElement>("[data-loop]")?.lastElementChild as HTMLElement | null;
    if (!title || !month || !score) return;

    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const cleanups: Array<() => void> = [];

    /* ── 1. Opening ─────────────────────────────────────────────────── */
    const reveal = (el: HTMLElement | null, delay: number) => {
      if (!el || el.classList.contains("is-in")) return;
      el.style.setProperty("--reveal-delay", `${delay}ms`);
      el.classList.add("is-revealing", "is-in");
      later(() => {
        el.classList.remove("is-revealing");
        el.style.removeProperty("--reveal-delay");
      }, delay + DURATION.settle + 100);
    };
    // When the heading started rising (performance.now()); kept on the DOM for remounts.
    let openedAt = title.classList.contains("is-in") ? Number(root.dataset.openedAt ?? 0) : NaN;
    const opened = () => Number.isFinite(openedAt);

    /* ── 2. The month ───────────────────────────────────────────────── */
    let ringReady = month.hasAttribute("data-played");
    const light = (delay: number) => {
      if (month.hasAttribute("data-played")) return;
      month.style.setProperty("--month-delay", `${delay}ms`);
      month.dataset.weekOneAt = String(performance.now() + delay + WEEK_ONE_END);
      month.setAttribute("data-played", "");
      later(() => month.setAttribute("data-settled", ""), delay + MONTH_END + 160);
    };
    const maybeLight = () => {
      if (ringReady && opened()) light(Math.max(0, openedAt + 2 * STAGGER.chapter - performance.now()));
    };

    const open = () => {
      if (opened()) return;
      openedAt = performance.now();
      root.dataset.openedAt = String(openedAt);
      reveal(title, 0);
      if (statement && !statement.classList.contains("is-in")) {
        if (statement.getBoundingClientRect().top < window.innerHeight) reveal(statement, STAGGER.chapter);
        else
          cleanups.push(
            onceInView(
              statement,
              () => reveal(statement, Math.max(0, openedAt + STAGGER.chapter - performance.now())),
              REVEAL_OBSERVER,
            ),
          );
      }
      maybeLight();
    };

    const drawNow = () => {
      for (const el of [title, statement]) el?.classList.add("is-in");
      month.setAttribute("data-played", "");
      month.setAttribute("data-settled", "");
    };
    cleanups.push(watchMedia("(prefers-reduced-motion: reduce)", (reduce) => reduce && drawNow()));

    if (month.hasAttribute("data-played") && !month.hasAttribute("data-settled")) {
      // Remounted mid-entrance: let it finish, then settle.
      later(() => month.setAttribute("data-settled", ""), MONTH_END + 400);
    }
    if (!opened()) {
      cleanups.push(onceInView(title, open, REVEAL_OBSERVER));
      if (statement) cleanups.push(onceInView(statement, open, REVEAL_OBSERVER));
    }
    if (!ringReady && typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e) return;
          const need = RING_IN_VIEW * Math.min(e.boundingClientRect.height, window.innerHeight);
          if (e.intersectionRect.height < need - 1) return;
          io.disconnect();
          ringReady = true;
          maybeLight();
        },
        { threshold: RING_STEPS },
      );
      io.observe(score);
      cleanups.push(() => io.disconnect());
    }

    /* ── 3. "…then the loop starts again" ───────────────────────────── */
    const pinned = () => {
      if (!stage) return false;
      const cs = getComputedStyle(stage);
      return cs.position === "sticky" && Math.abs(stage.getBoundingClientRect().top - parseFloat(cs.top)) < 2;
    };
    const relight = () => {
      if (month.hasAttribute("data-relit") || !month.hasAttribute("data-played")) return;
      if (prefersReducedMotion() || !pinned()) return;
      // Week 1 still landing (a fast scroll): the entrance is its motion; lift it once it has landed.
      const landing = Number(month.dataset.weekOneAt ?? 0) - performance.now();
      if (landing > 0) return later(relight, landing);
      month.setAttribute("data-relit", "");
      const week = Array.from(month.querySelectorAll<HTMLElement>('[data-week="1"]'));
      week.sort((a, b) => Number(a.dataset.day) - Number(b.dataset.day));
      week.forEach((dot, i) =>
        dot.animate(
          [
            { transform: "translate3d(0, 0, 0)" },
            { transform: `translate3d(0, -${RELIGHT.lift}px, 0)`, offset: 0.4 },
            { transform: "translate3d(0, 0, 0)" },
          ],
          { duration: RELIGHT.duration, delay: i * RELIGHT.stagger, easing: EASE.inOut },
        ),
      );
    };
    if (lastRow && !lastRow.classList.contains("is-in")) {
      const watcher = new MutationObserver(() => {
        if (!lastRow.classList.contains("is-in")) return;
        watcher.disconnect();
        const delay = parseFloat(lastRow.style.getPropertyValue("--reveal-delay")) || 0;
        later(relight, delay + WITH_LINE);
      });
      watcher.observe(lastRow, { attributes: true, attributeFilter: ["class"] });
      cleanups.push(() => watcher.disconnect());
    }

    return () => {
      cleanups.forEach((c) => c());
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <section ref={ref} data-reveal-root="" {...rest}>
      {children}
    </section>
  );
}
