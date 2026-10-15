"use client";

import clsx from "clsx";
import { useEffect, useRef, type CSSProperties } from "react";
import { onceRevealedInView } from "@/lib/inView";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import styles from "./Marks.module.css";

/**
 * Part once when 40% visible (rest = the tréma arrangement); inside a
 * [data-reveal] part, only once that part has started rising (+240ms).
 */
function usePartOnEntry(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || el.hasAttribute("data-parted")) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-parted", "");
      return;
    }
    return onceRevealedInView(el, () => el.setAttribute("data-parted", ""));
  }, [ref, enabled]);
}

/**
 * The S mark: two dots, grey then orange, joined by the orange bar
 * (01 §7.12 work-index rows, persona markers, the next-case link). Not to
 * scale: an emblem. `vt={{ a: "tr-havaianas-a", b: "tr-havaianas-b" }}`
 * names the dots that fly into the case cover (01 §6.6). The names are
 * held in data-vt and applied only for the navigation in progress: the
 * page-swap script (lib/viewTransitions.ts) names the clicked mark alone, so
 * no other dot joins the transition. aria-hidden: the row's text carries
 * the meaning.
 */
export function PairMark({
  size = "S",
  length = 4,
  vt,
  motion = "entry",
  className,
}: {
  size?: "S" | "M";
  /** Total length in dot diameters (≥ 2.27). */
  length?: number;
  vt?: { a: string; b: string };
  motion?: "entry" | "static";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  usePartOnEntry(ref, motion === "entry");
  return (
    <span
      ref={ref}
      className={clsx(styles.mark, size === "M" && styles.markM, motion === "entry" && styles.partable, className)}
      style={{ "--len": length } as CSSProperties}
      aria-hidden="true"
      data-pair-mark=""
      data-parted={motion === "static" ? "" : undefined}
    >
      <span className={styles.bar} data-mark-bar="" />
      <span className={clsx(styles.dot, styles.dotBefore)} data-vt={vt?.a} />
      <span className={clsx(styles.dot, styles.dotAfter)} data-vt={vt?.b} data-mark-after="" />
    </span>
  );
}

/**
 * Replay a mark's last 15% (row hover; at most once per 2s): the after dot
 * steps back 15% of its parting travel and the run retracts by the same px
 * (0.15 × (len − 2.27) × d), with no speed at the turn (ease-out away,
 * in-out home, per keyframe). Call it on a fine-pointer hover only.
 */
const lastMarkReplay = new WeakMap<Element, number>();
export function replayMark(el: HTMLElement | null) {
  if (!el || prefersReducedMotion()) return;
  const now = performance.now();
  if (now - (lastMarkReplay.get(el) ?? -Infinity) < 2000) return;
  const after = el.querySelector<HTMLElement>("[data-mark-after]");
  const bar = el.querySelector<HTMLElement>("[data-mark-bar]");
  if (!after || !bar || after.getAnimations().length) return;
  lastMarkReplay.set(el, now);
  const d = after.offsetWidth;
  const len = parseFloat(getComputedStyle(el).getPropertyValue("--len")) || 4;
  const back = Math.max(0, 0.15 * (len - 2.27) * d);
  const final = getComputedStyle(after).transform;
  const opts: KeyframeAnimationOptions = { duration: 600, easing: "linear" };
  after.animate(
    [
      { transform: final, easing: EASE.out },
      { transform: `${final === "none" ? "" : final} translateX(${-back}px)`, offset: 0.35, easing: EASE.inOut },
      { transform: final },
    ],
    opts,
  );
  bar.animate(
    [
      { clipPath: "inset(0 0px 0 0)", easing: EASE.out },
      { clipPath: `inset(0 ${back}px 0 0)`, offset: 0.35, easing: EASE.inOut },
      { clipPath: "inset(0 0px 0 0)" },
    ],
    opts,
  );
}

/**
 * The type-set pair (01 §7.7): for a before and after with no honest scale.
 * "~~Days~~ ●—● about two hours". The before word is muted and struck
 * (0.06em); with strike={false} (03 A5, a start → end span) it stays in
 * full ink. Set it at the display or statement step (it inherits the size).
 * The inline pair is aria-hidden; `joiner` ("to" / "à") is read in its place.
 */
export function TypeSetPair({
  before,
  after,
  joiner,
  strike = true,
  face = "display",
  motion = "entry",
  vt,
  partDelay,
  partDuration,
  className,
}: {
  before: string;
  after: string;
  /** Read by assistive tech in place of the drawing: "to" / "à". */
  joiner: string;
  strike?: boolean;
  /** The face it is set in, for the x-height alignment. */
  face?: "display" | "text";
  motion?: "entry" | "static";
  /**
   * View-transition names for the two dots (01 §6.6), held in data-vt like
   * PairMark's: lib/viewTransitions names them only for the navigation in
   * progress (inside a case cover, #top, whenever that case is carried).
   */
  vt?: { a: string; b: string };
  /** The parting's delay after its trigger, ms (default 120; the case cover: about 500, 03 §9.1). */
  partDelay?: number;
  /** The parting's duration, ms (default 1000; the case cover: 600). */
  partDuration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  usePartOnEntry(ref, motion === "entry");
  const timing = {
    ...(partDelay !== undefined ? { "--part-delay": `${partDelay}ms` } : {}),
    ...(partDuration !== undefined ? { "--part-dur": `${partDuration}ms` } : {}),
  } as CSSProperties;
  return (
    <span
      ref={ref}
      className={clsx(styles.typeset, face === "text" && styles.typesetText, motion === "entry" && styles.partable, className)}
      style={partDelay !== undefined || partDuration !== undefined ? timing : undefined}
      data-parted={motion === "static" ? "" : undefined}
    >
      {strike ? <s className={styles.struck}>{before}</s> : <span>{before}</span>}
      <span className={styles.inline} aria-hidden="true">
        <span className={styles.bar} />
        <span className={clsx(styles.dot, styles.dotBefore)} data-vt={vt?.a} />
        <span className={clsx(styles.dot, styles.dotAfter)} data-vt={vt?.b} />
      </span>
      <span className="visually-hidden-inline"> {joiner} </span>
      <span>{after}</span>
    </span>
  );
}
