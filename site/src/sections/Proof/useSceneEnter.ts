"use client";

import { useEffect, type RefObject } from "react";
import { onceInView } from "@/lib/inView";
import { DURATION, prefersReducedMotion, STAGGER } from "@/lib/motion";

/**
 * Entrances of one proof scene (02-home.md §3.9), varied by what each part is:
 *
 * - The head (h3, reference, copy) rises 24px and the case link fades
 *   (data-reveal "" / "fade", globals.css), each as it enters, staggered
 *   70ms in reading order.
 * - The figure is the scene's cue (data-enter="mask"): it rises from behind
 *   its own baseline, opacity 1, 900ms out, as soon as it can be seen (its
 *   top past 80% of the screen), pinned or not.
 * - The drawing follows the cue with explicit delays (data-cue-delay, ms
 *   after the figure starts), never before it is itself in view: the stat
 *   row item by item (45ms), the plate settles, the quote word by word.
 *   A part marked data-cue-pin (B's quote) also waits, when pinned, for the
 *   stage to lock (the article's top at the screen's top), so the first
 *   notch inside the pin plays the scene's second beat.
 * - The pair and the dot field are not entrances: Scene.tsx drives them.
 * - Reduced motion, or focus entering the scene: everything is simply there.
 */
export const PINNED = "(min-width: 1024px) and (min-height: 780px)";

/* Pinned, a part enters when half of it is in view (a held stage keeps its
   lower third on screen, where a bottom line would never be crossed); in
   flow, at the chapter's reveal line (REVEAL_OBSERVER, measured on the part's
   untransformed box, so nothing waits for its own rise near the fold). */
const PART_PINNED = { threshold: 0.5, rootMargin: "0px" } as const;
const CUE = { threshold: 0, rootMargin: "0px 0px -20% 0px" } as const;
/* The stage locks when the article's top reaches the screen's top. */
const PIN_LINE = { threshold: 0, rootMargin: "0px 0px -99% 0px" } as const;

type Part = { el: HTMLElement; cueDelay: number | null; pin: boolean; entered: boolean; done: boolean };

/** Longest entrance of a part, so its state can be cleaned up after it. */
const settleOf = (el: HTMLElement) =>
  el.dataset.reveal === "settle" ? DURATION.settle : el.dataset.enter === "words" ? 1300 : DURATION.rise;

function show(el: HTMLElement, delay: number, timers: number[]) {
  el.style.setProperty("--reveal-delay", `${delay}ms`);
  el.style.setProperty("--enter-delay", `${delay}ms`);
  if (el.hasAttribute("data-reveal")) el.classList.add("is-revealing", "is-in");
  if (el.hasAttribute("data-enter")) el.dataset.enterState = "run";
  timers.push(
    window.setTimeout(() => {
      el.classList.remove("is-revealing");
      if (el.hasAttribute("data-enter")) el.dataset.enterState = "done";
      el.style.removeProperty("--reveal-delay");
      el.style.removeProperty("--enter-delay");
    }, delay + settleOf(el) + 120),
  );
}

/** Everything at once, with no entrance (reduced motion, keyboard focus). */
function showNow(el: HTMLElement) {
  el.classList.remove("is-revealing");
  el.classList.add("is-in");
  el.style.removeProperty("--reveal-delay");
  el.style.removeProperty("--enter-delay");
  if (el.hasAttribute("data-enter")) el.dataset.enterState = "done";
}

export function useSceneEnter(articleRef: RefObject<HTMLElement | null>, stageRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const article = articleRef.current;
    const stage = stageRef.current;
    if (!article || !stage) return;
    const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-reveal], [data-enter]")).filter(
      (el) => el.closest("[data-reveal-root]") === stage,
    );
    const cue = els.find((el) => el.dataset.enter === "mask") ?? null;
    const parts: Part[] = els
      .filter((el) => el !== cue)
      .map((el) => {
        const host = el.closest<HTMLElement>("[data-cue-delay]");
        return {
          el,
          cueDelay: host ? Number(host.dataset.cueDelay) : null,
          pin: el.hasAttribute("data-cue-pin"),
          entered: false,
          done: false,
        };
      });

    if (prefersReducedMotion()) {
      els.forEach(showNow);
      return;
    }

    const pinned = window.matchMedia(PINNED).matches;
    const timers: number[] = [];
    let cueAt: number | null = null;
    let pinAt: number | null = pinned ? null : 0;
    let batch: Part[] = [];
    let raf = 0;

    const flush = () => {
      raf = 0;
      batch.forEach((part, i) => {
        part.done = true;
        show(part.el, i * STAGGER.chapter, timers);
      });
      batch = [];
    };
    const release = (part: Part) => {
      if (part.done || !part.entered) return;
      if (part.cueDelay === null) {
        batch.push(part);
        if (!raf) raf = requestAnimationFrame(flush);
        return;
      }
      if (cueAt === null) return; // waits for the figure
      if (part.pin && pinAt === null) return; // waits for the stage to lock
      part.done = true;
      show(part.el, Math.max(0, cueAt + part.cueDelay - performance.now()), timers);
    };
    const startCue = () => {
      if (cueAt !== null) return;
      cueAt = performance.now();
      if (cue) show(cue, 0, timers);
      parts.forEach(release);
    };

    const cancels = parts.map((part) => {
      const enter = () => {
        part.entered = true;
        release(part);
      };
      return pinned ? onceInView(part.el, enter, PART_PINNED) : onceInView(part.el, enter);
    });
    if (cue) cancels.push(onceInView(cue, startCue, CUE));
    else startCue();
    if (pinned && parts.some((p) => p.pin)) {
      cancels.push(
        onceInView(article, () => {
          pinAt = performance.now();
          parts.forEach(release);
        }, PIN_LINE),
      );
    }

    // Keyboard focus never lands in a half-built scene: show it all, now.
    const onFocus = () => {
      cueAt ??= performance.now();
      pinAt ??= performance.now();
      els.forEach(showNow);
      parts.forEach((p) => (p.done = true));
    };
    article.addEventListener("focusin", onFocus);

    return () => {
      article.removeEventListener("focusin", onFocus);
      cancels.forEach((c) => c());
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((t) => clearTimeout(t));
      els.forEach((el) => {
        el.classList.remove("is-revealing");
        el.style.removeProperty("--reveal-delay");
        el.style.removeProperty("--enter-delay");
        if (el.dataset.enterState === "run") el.dataset.enterState = "done";
      });
    };
  }, [articleRef, stageRef]);
}
