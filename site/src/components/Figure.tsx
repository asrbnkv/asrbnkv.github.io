"use client";

import clsx from "clsx";
import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import styles from "./Figure.module.css";

/**
 * A giant figure (01-system.md §3.5), sized by the fit rule and aligned by
 * its ink, never by its advance box.
 *
 *   <Figure value={FIGURES.dau.value[locale]} fit={FIGURES.dau.fit[locale]}
 *           inkLeft={FIGURES.dau.inkLeft[locale]} />
 *
 * - The component's width is the measure: give it the columns it may fill.
 * - align="start": the first ink sits on the margin (margin-left: −inkLeft).
 * - inkRightTo="<id>": the last glyph's right INK edge lands exactly on the
 *   right edge of that element (the after dot), ±1px, measured with canvas
 *   on mount, on resize and after fonts load. Used by the 97% scene and the
 *   C cover.
 * - coverRest: case covers only (03 §14 A2), adds the height term with
 *   --fig-rest (30rem P/C, 27rem T, 22rem S).
 * - French "97 %" keeps its U+202F, set at half size.
 */
export function Figure({
  value,
  fit,
  inkLeft = 0,
  align = "start",
  inkRightTo,
  coverRest,
  as: Tag = "p",
  className,
  id,
}: {
  value: string;
  /** Ink width of the value in em, for this locale (content layer). */
  fit: number;
  /** Shift that puts the first ink on the margin, em. */
  inkLeft?: number;
  align?: "start" | "end";
  inkRightTo?: string;
  coverRest?: string;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inkRightTo) return;
    let applied = 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const align = () => {
      const target = document.getElementById(inkRightTo);
      // The last non-empty text node (in French the % sits in a nested span).
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let textNode: Text | null = null;
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (n.textContent && n.textContent.trim()) textNode = n as Text;
      }
      if (!target || !textNode || !ctx) return;
      const text = textNode.textContent!;
      const range = document.createRange();
      range.setStart(textNode, text.length - 1);
      range.setEnd(textNode, text.length);
      const charRect = range.getBoundingClientRect();
      const cs = getComputedStyle(textNode.parentElement ?? el);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const inkRight = charRect.left + ctx.measureText(text.slice(-1)).actualBoundingBoxRight;
      const delta = target.getBoundingClientRect().right - (inkRight - applied);
      applied = Math.round(delta * 2) / 2;
      el.style.translate = `${applied}px 0`;
    };
    align();
    document.fonts?.ready.then(align).catch(() => {});
    const ro = new ResizeObserver(align);
    ro.observe(el.parentElement ?? el);
    const target = document.getElementById(inkRightTo);
    if (target) ro.observe(target);
    return () => ro.disconnect();
  }, [inkRightTo, value]);

  const parts = value.split(" ");
  return (
    <Tag
      id={id}
      className={clsx(styles.frame, align === "end" && styles.end, coverRest && styles.heightBound, className)}
      style={{ "--fit": fit, "--ink-left": inkLeft, ...(coverRest ? { "--fig-rest": coverRest } : {}) } as CSSProperties}
    >
      <span ref={ref} className={styles.figure}>
        {parts.map((part, i) =>
          i === 0 ? (
            part
          ) : (
            <span key={i}>
              <span className={styles.nnbsp}>{" "}</span>
              {part}
            </span>
          ),
        )}
      </span>
    </Tag>
  );
}
