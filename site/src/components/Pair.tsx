"use client";

import clsx from "clsx";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { PairCopy, ScaledPair } from "@/content";
import { onceRevealedInView } from "@/lib/inView";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Pair.module.css";
import { clampPairLabels } from "./pairMotion";

export type PairMotion = "load" | "entry" | "static" | "scrub" | "manual";

export interface PairProps {
  /** S 16/12px dots (marks, rows) · M 28/20 (hero, panels, case results) · L 44/32 (number scenes). */
  size?: "S" | "M" | "L";
  /** The facts: PAIRS[id] (before or band, after, max). */
  data: ScaledPair;
  /** The words: dict.home.pairs[id] (start caption, labels, legend, sentence). */
  copy?: PairCopy;
  /**
   * load    the hero's beat: dots fade in at 360ms, part at 500ms (01 §6.1)
   * entry   rest in the tréma arrangement, part once at 40% visible (§6.3);
   *         inside a [data-reveal] part, 240ms after that part starts rising
   * scrub   rest until driven by setPairProgress() (pinned scenes, ≥1024px)
   * manual  rest until the owner sets data-parted on the root, then part
   *         with the entry transitions (a pair in a tab panel, for one)
   * static  drawn parted
   */
  motion?: PairMotion;
  /** attached: labels on the dots (a legend under 600px) · legend: always a legend · none. */
  labels?: "attached" | "legend" | "none";
  /**
   * A visible caption under the pair (Small, muted), read by assistive
   * tech. It replaces the measure line (copy.legend), which otherwise sits
   * under the label band from 600px, starting at the before dot's centre.
   */
  caption?: ReactNode;
  /** S pairs: one inline value after the drawing ("about ×1.5"). */
  inlineValue?: string;
  /**
   * M pairs: the pair's one number. The after value is set at the statement
   * step (League Spartan 700, 22–32px) over its Small description, on the
   * dot and in the phone legend. The label band grows by about 12px (two
   * Small lines no longer hold it), so the composition opts in.
   * "both": both values at the statement step, so the comparison reads at a
   * glance (×1 → ×2); the descriptions share a baseline by construction.
   */
  lead?: boolean | "both";
  /** Width of the drawing (the measure), e.g. "120px" for an S pair in a row. Default: the container. */
  measure?: string;
  /** Cross-document view-transition names for the two dots (01 §6.6). */
  vt?: { a: string; b: string };
  /**
   * id of an invisible box at the after dot's FINAL position (it never
   * moves): point <Figure inkRightTo> at it so the % ends on its dot.
   */
  anchorId?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Pair v2, the tréma chart (01-system.md §7.6). The drawing is aria-hidden;
 * the visually hidden sentence states the comparison. Sits on paper or ink
 * only (orange on stone fails 3:1): on stone, put it in a paper panel.
 * Without JS and under reduced motion it is drawn parted.
 */
export function Pair({
  size = "M",
  data,
  copy,
  motion = "entry",
  labels = copy ? "attached" : "none",
  caption,
  inlineValue,
  lead = false,
  measure,
  vt,
  anchorId,
  id,
  className,
  style,
}: PairProps) {
  const ref = useRef<HTMLElement>(null);
  const isBand = "band" in data && data.band !== undefined;
  const fb = (isBand ? data.band![0] : data.before ?? 0) / data.max;
  const fe = (isBand ? data.band![1] : data.before ?? 0) / data.max;
  const fa = data.after / data.max;
  const showLabels = labels !== "none" && copy !== undefined;
  const zero = copy ? (copy.zero ?? copy.start?.[0] ?? "0") : "0";
  const measureLine = caption === undefined && copy?.legend ? copy.legend : null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanups: Array<() => void> = [];
    if (motion === "entry" && !prefersReducedMotion() && !el.hasAttribute("data-parted")) {
      // 40% in view, and inside a revealing row only once that row has
      // risen (one trigger per chapter, 01 §5.2.7).
      cleanups.push(onceRevealedInView(el, () => el.setAttribute("data-parted", "")));
    }
    if (showLabels) {
      const run = () => clampPairLabels(el);
      run();
      document.fonts?.ready.then(run).catch(() => {});
      const ro = new ResizeObserver(run);
      ro.observe(el);
      cleanups.push(() => ro.disconnect());
    }
    return () => cleanups.forEach((c) => c());
  }, [motion, showLabels]);

  const align = (f: number) => (f <= 0.12 ? "start" : f >= 0.88 ? "end" : "center");
  const vtStyle = (name?: string) =>
    name ? ({ viewTransitionName: name, viewTransitionClass: "trema" } as CSSProperties) : undefined;

  return (
    <figure
      ref={ref}
      id={id}
      className={clsx(
        styles.pair,
        styles[size],
        styles[motion],
        showLabels && styles.withLabels,
        labels === "legend" && styles.legendAlways,
        inlineValue && styles.withInline,
        lead && styles.lead,
        lead === "both" && styles.leadBoth,
        className,
      )}
      style={
        { ...style, "--fb": fb, "--fe": fe, "--fa": fa, ...(measure ? { "--measure-w": measure } : {}) } as CSSProperties
      }
      data-pair=""
      data-parted={motion === "static" ? "" : undefined}
    >
      <div className={styles.drawing} aria-hidden="true" data-pair-drawing="">
        {/* The bar paints first: its ends hide under both discs (01 §7.6). */}
        <div className={clsx(styles.layer, styles.barLayer)}>
          <span className={styles.bar} data-pair-bar="" />
        </div>
        {/* x(0): a 0.25d band dot and its value, on the ×1 / ×2 line. The
            measure and the scale are the caption under the pair. */}
        {showLabels && copy ? (
          <div className={clsx(styles.layer, styles.startLayer)}>
            <span className={styles.zeroTick} />
            <span className={clsx(styles.label, styles.start)} data-align="center" data-pair-label="start">
              <span className={styles.value}>{zero}</span>
            </span>
          </div>
        ) : null}
        <div className={clsx(styles.layer, styles.before, isBand && styles.band)}>
          <span className={styles.disc} data-pair-disc="before" style={vtStyle(vt?.a)} />
          {showLabels && copy ? (
            <span className={styles.label} data-align={align(isBand ? (fb + fe) / 2 : fb)} data-pair-label="before">
              <span className={styles.value}>{copy.before.value}</span>
              <span className={styles.text}>{copy.before.text}</span>
            </span>
          ) : null}
        </div>
        {anchorId ? (
          <div className={clsx(styles.layer, styles.anchorLayer)}>
            <span id={anchorId} className={styles.anchor} />
          </div>
        ) : null}
        <div className={clsx(styles.layer, styles.after)} data-pair-mover="">
          <span className={styles.disc} data-pair-disc="after" style={vtStyle(vt?.b)} />
          {showLabels && copy ? (
            <span className={styles.label} data-align={align(fa)} data-pair-label="after">
              <span className={styles.value}>{copy.after.value}</span>
              <span className={styles.text}>{copy.after.text}</span>
            </span>
          ) : null}
        </div>
      </div>

      {inlineValue ? <span className={styles.inlineValue}>{inlineValue}</span> : null}

      {showLabels && copy ? (
        <ul className={styles.legend} aria-hidden="true" data-pair-legend="">
          <li className={styles.legendRow}>
            <span className={clsx(styles.swatch, isBand ? styles.swatchBand : styles.swatchBefore)} />
            <span>
              <span className={styles.legendValue}>{copy.before.value}</span> {copy.before.text}
            </span>
          </li>
          <li className={styles.legendRow}>
            <span className={clsx(styles.swatch, styles.swatchAfter)} />
            <span>
              <span className={styles.legendValue}>{copy.after.value}</span> {copy.after.text}
            </span>
          </li>
          <li className={styles.legendText}>{copy.legend}</li>
        </ul>
      ) : null}

      {copy || caption ? (
        <figcaption className={caption ? styles.caption : undefined}>
          {copy ? <span className="visually-hidden">{copy.sentence}</span> : null}
          {caption}
          {showLabels && measureLine ? (
            <span className={styles.measure} aria-hidden="true" data-pair-measure="">
              {measureLine}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
