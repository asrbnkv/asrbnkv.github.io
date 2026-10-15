"use client";

import clsx from "clsx";
import { useEffect, useRef, type CSSProperties } from "react";
import { MONTH, type MethodCopy } from "@/content/sections/method";
import { onceInView, watchMedia } from "@/lib/inView";
import { DURATION, REVEAL_OBSERVER } from "@/lib/motion";
import t from "@/styles/type.module.css";
import { DAY_STAGGER, WEEK_REST, type DotKind } from "./ring";
import styles from "./MonthLine.module.css";
import { useReplay } from "./useReplay";

interface Day {
  week: number;
  day: number;
  kind: DotKind;
  /** Entrance delay, ms: days in order, a rest at each weekend, the review last. */
  t: number;
}

const isPlanning = (week: number, day: number) =>
  MONTH.sprintPlanning.some(([w, d]) => w === week && d === day);
const isReview = (week: number, day: number) => MONTH.review[0] === week && MONTH.review[1] === day;

function buildWeeks(): Day[][] {
  const weeks: Day[][] = [];
  let i = 0;
  let last = 0;
  for (let week = 1; week <= MONTH.weeks; week++) {
    const days: Day[] = [];
    for (let day = 1; day <= MONTH.days; day++) {
      const kind: DotKind = isReview(week, day) ? "review" : isPlanning(week, day) ? "planning" : "call";
      const t = kind === "review" ? -1 : i++ * DAY_STAGGER + (week - 1) * WEEK_REST;
      last = Math.max(last, t);
      days.push({ week, day, kind, t });
    }
    weeks.push(days);
  }
  for (const days of weeks) for (const d of days) if (d.t < 0) d.t = last + DAY_STAGGER + 60;
  return weeks;
}

const WEEKS = buildWeeks();
const ALL = WEEKS.flat();
const REVIEW_T = ALL.find((d) => d.kind === "review")?.t ?? 0;
const MONTH_END = REVIEW_T + DURATION.drop;

/** Which label hangs under each week (its first dot, or the review), and when it fades in. */
function weekLabel(days: Day[]): { kind: DotKind; t: number } {
  const review = days.find((d) => d.kind === "review");
  if (review) return { kind: "review", t: review.t + 300 };
  return { kind: days[0].kind === "planning" ? "planning" : "call", t: days[0].t + 200 };
}

/** The key's lines (content order: call, planning, review), each as its kind first lands. */
const KEY: readonly { kind: DotKind; t: number }[] = [
  { kind: "call", t: (ALL.find((d) => d.kind === "call")?.t ?? 0) + 200 },
  { kind: "planning", t: Math.max(...ALL.filter((d) => d.kind === "planning").map((d) => d.t)) + 200 },
  { kind: "review", t: REVIEW_T + 300 },
];

/**
 * The month in dots on one line (01 §7.11, 03 §7.5): one month of the loop
 * as four weeks of working days, no dates. 20 ink dots on one centre line,
 * the sprint-planning days larger, the product review largest, on the
 * margin. Used by the product case; the home chapter draws the same month
 * as a ring (MonthRing). The drawing, its labels and the key are
 * aria-hidden; the figcaption carries the sentence and the visible caption.
 *
 * Motion: when the dot row crosses the system's reveal line, the days
 * arrive one by one (opacity and a 6px rise, 18ms apart, a 70ms rest at
 * each weekend), each label fading in as its dot lands, and the review
 * drops in last. Without JS and under reduced motion the month is drawn;
 * a preference that changes mid-session draws it at once.
 */
export function Month({ copy }: { copy: MethodCopy["month"] }) {
  const ref = useRef<HTMLElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const replay = useReplay(ref);

  useEffect(() => {
    const el = ref.current;
    const score = scoreRef.current;
    if (!el || !score) return;
    let timer = 0;
    const drawNow = () => {
      el.setAttribute("data-played", "");
      el.setAttribute("data-settled", "");
    };
    const stopWatching = watchMedia("(prefers-reduced-motion: reduce)", (reduce) => {
      if (reduce) drawNow();
    });
    let cancel = () => {};
    if (el.hasAttribute("data-played")) {
      if (!el.hasAttribute("data-settled")) timer = window.setTimeout(drawNow, MONTH_END + 400);
    } else {
      cancel = onceInView(
        score,
        () => {
          el.setAttribute("data-played", "");
          timer = window.setTimeout(() => el.setAttribute("data-settled", ""), MONTH_END + 160);
        },
        REVEAL_OBSERVER,
      );
    }
    return () => {
      stopWatching();
      cancel();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <figure
      ref={ref}
      className={styles.month}
      data-month=""
      style={{ "--caption-t": `${REVIEW_T + 300}ms` } as CSSProperties}
    >
      <div
        ref={scoreRef}
        className={styles.score}
        aria-hidden="true"
        {...replay}
      >
        {WEEKS.map((days) => (
          <div key={days[0].week} className={styles.week}>
            {days.map((d) => (
              <span
                key={d.day}
                className={clsx(styles.dot, styles[d.kind])}
                data-t={d.t}
                style={{ "--week": d.week - 1, "--day": d.day - 1, "--t": `${d.t}ms` } as CSSProperties}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={clsx(t.small, styles.labels)} aria-hidden="true">
        {WEEKS.map((days) => {
          const { kind, t: at } = weekLabel(days);
          const label = copy.labels[kind];
          return (
            <span
              key={days[0].week}
              className={clsx(styles.label, styles[kind])}
              data-kind={kind}
              style={{ "--week": days[0].week - 1, "--t": `${at}ms` } as CSSProperties}
            >
              <span className={styles.value}>{label.value}</span>
              <span className={styles.text}>{label.text}</span>
            </span>
          );
        })}
      </div>

      <ul className={clsx(t.small, styles.key)} aria-hidden="true">
        {copy.key.map((line, i) => {
          const key = KEY[i] ?? KEY[0];
          return (
            <li key={line.count} className={styles.keyRow} style={{ "--t": `${key.t}ms` } as CSSProperties}>
              <span className={styles.swatchCell}>
                <span className={clsx(styles.swatch, styles[key.kind])} />
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
