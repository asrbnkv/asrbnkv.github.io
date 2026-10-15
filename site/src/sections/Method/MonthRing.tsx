"use client";

import clsx from "clsx";
import { useRef, type CSSProperties } from "react";
import type { MethodCopy } from "@/content/sections/method";
import t from "@/styles/type.module.css";
import { DAYS, keyDelay, LABELS, MONTH_END, SIZE, SIZE_PHONE, type DotKind } from "./ring";
import styles from "./MonthRing.module.css";
import { useNearLift } from "./useNearLift";

/** The key's swatch for each line (content order: call, planning, review). */
const KEY_KINDS: readonly DotKind[] = ["call", "planning", "review"];

/** The caption arrives with the review's label, once the loop has closed. */
const CAPTION_T = LABELS.find((l) => l.kind === "review")?.t ?? MONTH_END;

/** Dot sizes in R, from 600px (-l) and on phones (-s). */
const SIZE_VARS = {
  "--sc-l": SIZE.call,
  "--sp-l": SIZE.planning,
  "--sv-l": SIZE.review,
  "--sc-s": SIZE_PHONE.call,
  "--sp-s": SIZE_PHONE.planning,
  "--sv-s": SIZE_PHONE.review,
} as CSSProperties;

/**
 * The month in dots, drawn as the loop (02 §6.1–6.5; geometry in ring.ts):
 * one month of working days clockwise round a ring, sprint planning just
 * past 12 and just past 6, the product review just before 12, the weekends
 * as the gaps at 12, 3, 6 and 9. The drawing, its labels and the phone key
 * are aria-hidden; the figcaption carries the sentence and the visible
 * caption.
 *
 * Motion belongs to the chapter (MethodRoot.tsx), which lights the month
 * once its heading has risen and most of the ring is in view (data-played,
 * --month-delay, then data-settled), and lifts week 1 once more when the
 * loop's last step arrives. Here: the drawing, and the pointer's local lift
 * (useNearLift.ts). Without JS and under reduced motion the month is drawn.
 */
export function MonthRing({ copy }: { copy: MethodCopy["month"] }) {
  const ref = useRef<HTMLElement>(null);
  useNearLift(ref);

  return (
    <figure
      ref={ref}
      className={styles.month}
      data-month=""
      style={{ ...SIZE_VARS, "--caption-t": `${CAPTION_T}ms` } as CSSProperties}
    >
      <div className={styles.score} data-score="" aria-hidden="true">
        {DAYS.map((d) => (
          <span
            key={`${d.week}-${d.day}`}
            className={clsx(styles.dot, styles[d.kind])}
            data-day={d.day}
            data-week={d.week}
            style={{ "--x": d.x, "--y": d.y, "--t": `${d.t}ms` } as CSSProperties}
          />
        ))}
        <span className={clsx(t.small, styles.labels)}>
          {LABELS.map((l) => {
            const label = copy.labels[l.kind];
            return (
              <span
                key={`${l.kind}-${l.row}`}
                className={styles.label}
                data-row={l.row}
                data-align={l.align}
                style={{ "--ax": l.ax, "--t": `${l.t}ms` } as CSSProperties}
              >
                <span className={styles.value}>{label.value}</span>
                <span className={styles.text}>{label.text}</span>
              </span>
            );
          })}
        </span>
      </div>

      <ul className={clsx(t.small, styles.key)} aria-hidden="true">
        {copy.key.map((line, i) => {
          const kind = KEY_KINDS[i] ?? "call";
          return (
            <li
              key={line.count}
              className={styles.keyRow}
              style={{ "--t": `${keyDelay(kind)}ms` } as CSSProperties}
            >
              <span className={styles.swatchCell}>
                <span className={clsx(styles.swatch, styles[kind])} />
              </span>
              <span className={styles.keyText}>
                <span className={clsx(styles.count, t.tabular)}>{line.count}</span> {line.text}
              </span>
            </li>
          );
        })}
      </ul>

      <figcaption className={clsx(t.small, t.muted, styles.caption)}>
        <span className="visually-hidden">{copy.sentence} </span>
        {copy.caption}
      </figcaption>
    </figure>
  );
}
