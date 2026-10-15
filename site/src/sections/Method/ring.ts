import { MONTH } from "@/content/sections/method";
import { DURATION } from "@/lib/motion";

/**
 * The month drawn as the loop (02 §6, 01 §7.11): the geometry shared by the
 * chapter (Method.tsx sets the CSS variables) and the drawing (MonthRing.tsx).
 * Plain module, no "use client": the server component reads these values.
 *
 * One month of working days on a ring, clockwise from the top. Each week
 * takes six slots: its five working days, then one empty slot for the
 * weekend. With four weeks that is 24 slots of 15°, and the weekends fall
 * exactly on 3, 6, 9 and 12 o'clock, so each week fills one quarter. Sprint
 * planning (day 1 of weeks 1 and 3) sits just past 12 and just past 6, half
 * a turn apart; the product review (the last day) sits just before 12, and
 * the empty slot at 12 is the weekend after it, before the loop starts again.
 *
 * All lengths are in units of R, the radius of the centre line (CSS --R).
 */

export type DotKind = "call" | "planning" | "review";

/** Dot diameters in R: a day (one call with engineering), sprint planning, the review. */
export const SIZE: Record<DotKind, number> = { call: 0.07, planning: 0.19, review: 0.33 };

/**
 * On phones (< 600px) the ring runs margin to margin (R ≈ 179px at 390), so
 * the dots keep 01 §7.11's phone sizes: about 12, 30 and 40px. The key's
 * swatches use the same sizes, so its rows keep one rhythm.
 */
export const SIZE_PHONE: Record<DotKind, number> = { call: 0.065, planning: 0.165, review: 0.225 };

const SLOTS = MONTH.weeks * (MONTH.days + 1);
const STEP = (2 * Math.PI) / SLOTS;

/** Entrance rhythm (02 §6.4): days 18ms apart, one 70ms rest at each weekend; the review last. */
export const DAY_STAGGER = 18;
export const WEEK_REST = 70;
const REVIEW_AFTER = 60;
/** A label fades in as its dot lands (opacity only, 200ms). */
const LABEL_AFTER = 200;
/** The review's label waits until its dot is about 90% down, so the drop never crosses lit text. */
const REVIEW_LABEL_AFTER = 360;

export interface RingDay {
  week: number;
  day: number;
  kind: DotKind;
  /** Unit position of the centre (x right, y down). */
  x: number;
  y: number;
  /** Entrance delay, ms (after the chapter's month delay). */
  t: number;
}

const isPlanning = (week: number, day: number) =>
  MONTH.sprintPlanning.some(([w, d]) => w === week && d === day);
const isReview = (week: number, day: number) => MONTH.review[0] === week && MONTH.review[1] === day;

const round = (v: number) => Math.round(v * 10000) / 10000;

function build(): RingDay[] {
  const days: RingDay[] = [];
  let i = 0;
  let last = 0;
  for (let week = 1; week <= MONTH.weeks; week++) {
    for (let day = 1; day <= MONTH.days; day++) {
      const slot = (week - 1) * (MONTH.days + 1) + (day - 1);
      const a = (slot + 1) * STEP;
      const kind: DotKind = isReview(week, day) ? "review" : isPlanning(week, day) ? "planning" : "call";
      const t = kind === "review" ? -1 : i++ * DAY_STAGGER + (week - 1) * WEEK_REST;
      if (t > last) last = t;
      days.push({ week, day, kind, x: round(Math.sin(a)), y: round(-Math.cos(a)), t });
    }
  }
  // The review drops in after every other day.
  for (const d of days) if (d.t < 0) d.t = last + DAY_STAGGER + REVIEW_AFTER;
  return days;
}

export const DAYS: readonly RingDay[] = build();

/** Ink extent above and below the centre, in R (sets the drawing's height). */
function inkExtent(size: Record<DotKind, number>) {
  return {
    top: round(Math.max(...DAYS.map((d) => -d.y + size[d.kind] / 2))),
    bottom: round(Math.max(...DAYS.map((d) => d.y + size[d.kind] / 2))),
  };
}

const INK = inkExtent(SIZE);
const INK_PHONE = inkExtent(SIZE_PHONE);
export const INK_TOP = INK.top;
export const INK_BOTTOM = INK.bottom;
export const INK_TOP_PHONE = INK_PHONE.top;
export const INK_BOTTOM_PHONE = INK_PHONE.bottom;

/**
 * The three attached labels (02 §6.1): the review on its dot, sprint
 * planning once (on week 3's dot; week 1's dot is the same size and needs
 * no second label), and the call on the last day of week 2. Each hangs
 * from its own dot's outer edge: above the ring for a top dot, below it for
 * a bottom one; a left-half label ends on its dot's right edge, a right-half
 * label starts on its dot's left edge.
 */
const LABELLED: readonly { kind: DotKind; week: number; day: number }[] = [
  { kind: "review", week: MONTH.review[0], day: MONTH.review[1] },
  { kind: "planning", week: MONTH.sprintPlanning[1][0], day: MONTH.sprintPlanning[1][1] },
  { kind: "call", week: 2, day: MONTH.days },
];

export interface RingLabel {
  kind: DotKind;
  row: "top" | "bottom";
  align: "start" | "end";
  /** The anchor's x in R (the dot's left edge for start, right edge for end). */
  ax: number;
  /** Fade-in delay, ms. */
  t: number;
}

export const LABELS: readonly RingLabel[] = LABELLED.map(({ kind, week, day }) => {
  const d = DAYS.find((v) => v.week === week && v.day === day)!;
  const align = d.x < 0 ? "end" : "start";
  const half = SIZE[d.kind] / 2;
  return {
    kind,
    row: d.y < 0 ? "top" : "bottom",
    align,
    ax: round(align === "end" ? d.x + half : d.x - half),
    t: d.t + (kind === "review" ? REVIEW_LABEL_AFTER : LABEL_AFTER),
  };
});

/** The phone key fades in line by line as each kind first lands. */
export function keyDelay(kind: DotKind): number {
  if (kind === "call") return DAYS.find((d) => d.kind === "call")!.t + LABEL_AFTER;
  if (kind === "planning") return Math.max(...DAYS.filter((d) => d.kind === "planning").map((d) => d.t)) + LABEL_AFTER;
  return DAYS.find((d) => d.kind === "review")!.t + REVIEW_LABEL_AFTER;
}

/** A day's own entrance (MonthRing.module.css: opacity and the 6px rise, 520ms out). */
export const DAY_RISE = 520;

/** The whole entrance, review drop included (the caption follows it). */
export const MONTH_END = DAYS.find((d) => d.kind === "review")!.t + DURATION.drop;

/** Week 1 has landed (its last day's delay plus its rise): the closing beat may lift it again. */
export const WEEK_ONE_END = Math.max(...DAYS.filter((d) => d.week === 1).map((d) => d.t)) + DAY_RISE;

/** "…then the loop starts again": week 1 lifts once more, day by day (Method's closing beat). */
export const RELIGHT = { lift: 6, duration: 520, stagger: DAY_STAGGER } as const;
