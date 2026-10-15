"use client";

import clsx from "clsx";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { onceRevealedInView } from "@/lib/inView";
import { prefersReducedMotion, REVEAL_OBSERVER } from "@/lib/motion";
import styles from "./Charts.module.css";

export type DotKind = "after" | "before" | "faint" | "empty";

/**
 * The unit chart (01-system.md §7.9): one dot, one unit, said in words in
 * the caption ("One dot, one account"). Segments fill the grid in order,
 * row by row: e.g. 80 accounts → [{ kind: "after", count: 80 }] on 10
 * columns; the payments "kept" field → 97 after + 3 before; "expected" →
 * 60 before + 10 faint + 30 empty. The "+" of "80+" is said in the label,
 * never drawn. Orange (after) sits on ink or paper only.
 *
 * The drawing is aria-hidden; `label` is the visually hidden sentence.
 * Rows arrive one by one once in view (12ms per row, §7.9; `rowDelay` for a
 * slower roll call, e.g. 40), and the visible caption follows the last row.
 * Space it with your className: the figure has no inline margin.
 */
export function DotField({
  segments,
  cols = 10,
  label,
  caption,
  rowDelay,
  className,
  style,
}: {
  segments: readonly { kind: DotKind; count: number }[];
  cols?: number;
  /** Visually hidden sentence stating what the field shows. */
  label: string;
  /** Visible caption under the field (Small, muted). */
  caption?: ReactNode;
  /** Delay between rows, ms. Default 12 (01 §7.9). */
  rowDelay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.hasAttribute("data-in")) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-in", "");
      return;
    }
    // At the reveal line; inside a revealing part, once that part has risen.
    return onceRevealedInView(el, () => el.setAttribute("data-in", ""), REVEAL_OBSERVER);
  }, []);

  const cells: DotKind[] = segments.flatMap((s) => Array<DotKind>(s.count).fill(s.kind));
  const rows = Math.ceil(cells.length / cols);
  return (
    <figure
      className={clsx(className)}
      style={
        {
          ...style,
          "--rows": rows,
          ...(rowDelay !== undefined ? { "--row-delay": `${rowDelay}ms` } : {}),
        } as CSSProperties
      }
    >
      <div
        ref={ref}
        className={styles.field}
        style={{ "--cols": cols } as CSSProperties}
        aria-hidden="true"
        data-dot-field=""
      >
        {cells.map((kind, i) => (
          <i
            key={i}
            className={clsx(styles.cell, styles[kind])}
            style={{ "--row": Math.floor(i / cols) } as CSSProperties}
          />
        ))}
      </div>
      <figcaption className={caption ? styles.fieldCaption : undefined}>
        <span className="visually-hidden">{label}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
