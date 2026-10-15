/**
 * The live thing's choreography (01 §7.10, 02 §2.2). Browser only: WAAPI on
 * transform, opacity, filter and clip-path. Every function returns a cancel
 * (or the animations it made), so a reader who changes story mid-way never
 * sees two stories stacked or a pair stuck in the tréma.
 *
 * The pairs and the tab's S marker are drawn parted (motion="static"). A
 * parting is a WAAPI overlay that holds the tréma during its delay (fill:
 * backwards), so a cancel always lands on the true drawing: no-JS, keyboard
 * and reduced motion read it with no motion code at all.
 *
 *   pointer pick   the paper tab slides to the pick (CSS, 240ms out) with
 *                  the S marker riding at its seam; the marker closes into
 *                  the tréma as it leaves (120ms out). The outgoing story
 *                  fades in 100ms while the new one's parts rise 8px and
 *                  clear a 2px blur from the first frame (320ms out, 45ms
 *                  apart). At 200ms the result is revealed by clip (360ms
 *                  out). At 340ms, as the clip lands, the marker and the
 *                  story's pair part together on one in-out curve (560ms on
 *                  the first pick of a visit, 420ms after: it repeats): the
 *                  clasp and the chart tell one before and after. ≤ 900ms.
 *   keyboard pick  opacity only: out 100ms, in 160ms; drawn parted.
 *   arrival        the marker and the story's pair hold the tréma, then part
 *                  together (the chapter's 1000ms) once the result is 40% in
 *                  view, no sooner than the stage has mostly risen.
 *   accordion      the region fades in with an 8px rise (240ms out) and the
 *                  open row's marker grows from scale(0.4) (240ms out); the
 *                  marker and the pair part together once 40% in view.
 *   reduced motion the keyboard swap; everything drawn parted.
 */
import { pairGeometry } from "@/components/pairMotion";
import { onceInView } from "@/lib/inView";
import { DURATION, EASE, PART_OBSERVER, RISE, STAGGER, TREMA_GAP, prefersReducedMotion } from "@/lib/motion";

export type Cancel = () => void;

export const STORY_TIMING = {
  /** The outgoing story: gone before the new one is half in. */
  exit: 100,
  /** The marker closing into the tréma as the tab leaves. */
  close: 120,
  /** Keyboard swaps and reduced motion: opacity only. */
  keyFade: 160,
  /** The result's clip reveal starts after the card's parts. */
  clipAt: 200,
  /** The case link arrives last. */
  tailAt: 290,
  /** Marker and pair part as the result's clip lands. */
  partAt: 340,
  /** The first parting of a visit; later picks part faster (they repeat). */
  part: 560,
  partAgain: 420,
  /** Accordion region: fade with an 8px rise; the open row's marker grows. */
  region: DURATION.ui,
  /** On arrival the pair parts no sooner than the stage has mostly risen. */
  arrival: 600,
} as const;

const RISE_IN: Keyframe[] = [
  { opacity: 0, transform: `translate3d(0, ${RISE.ui}px, 0)`, filter: "blur(2px)" },
  { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0px)" },
];
const CLIP_IN: Keyframe[] = [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }];
const FADE_IN: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
/* The outgoing panel is visibility: hidden in CSS already; the animation
   keeps it visible while it fades, then lets the hidden state apply. */
const FADE_OUT: Keyframe[] = [
  { opacity: 1, visibility: "visible" },
  { opacity: 0, visibility: "visible" },
];

const out = (delay: number, duration: number): KeyframeAnimationOptions => ({
  delay,
  duration,
  easing: EASE.out,
  fill: "backwards",
});

let pointerPicks = 0;

/** How long a pick's parting runs: the visit's first at full length, the rest shorter. */
export function pickDuration(): number {
  return pointerPicks++ === 0 ? STORY_TIMING.part : STORY_TIMING.partAgain;
}

/** The Pair roots in a panel (the type-set pair is revealed by its clip). */
function pairsIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-story-mark] [data-pair]"));
}

/** What must be in view for the parting: the pair, else the story's result. */
function resultIn(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>("[data-story-mark] [data-pair], [data-story-clip]") ?? root;
}

function canceller(anims: Animation[], cancels: Cancel[] = []): Cancel {
  return () => {
    anims.forEach((a) => a.cancel());
    cancels.forEach((c) => c());
  };
}

/**
 * The parting as an overlay on a pair drawn parted: the after dot travels
 * from the tréma to its value with the run drawn behind it (in-out); the
 * before and after labels, which travel with their dots, fade in over the
 * second half. Before `delay` the pair holds the tréma.
 */
function parting(pair: HTMLElement, delay: number, duration: number): Animation[] {
  const g = pairGeometry(pair);
  if (!g || g.width === 0) return [];
  const anims: Animation[] = [];
  const travel: KeyframeAnimationOptions = { delay, duration, easing: EASE.inOut, fill: "backwards" };
  const mover = pair.querySelector<HTMLElement>("[data-pair-mover]");
  const bar = pair.querySelector<HTMLElement>("[data-pair-bar]");
  if (mover) {
    anims.push(
      mover.animate(
        [{ transform: `translateX(${g.xRest}px)` }, { transform: `translateX(${g.xFinal}px)` }],
        travel,
      ),
    );
  }
  if (bar) anims.push(bar.animate(CLIP_IN, travel));
  pair.querySelectorAll<HTMLElement>('[data-pair-label="before"], [data-pair-label="after"]').forEach((label) => {
    anims.push(
      label.animate([{ opacity: 0 }, { opacity: 0, offset: 0.5, easing: EASE.out }, { opacity: 1 }], {
        delay,
        duration,
        easing: "linear",
        fill: "backwards",
      }),
    );
  });
  return anims;
}

/** The S marker's moving parts and its two resting places (px from its start). */
function markParts(mark: HTMLElement) {
  const after = mark.querySelector<HTMLElement>("[data-mark-after]");
  const bar = mark.querySelector<HTMLElement>("[data-mark-bar]");
  const d = after?.offsetWidth ?? 0;
  const len = parseFloat(getComputedStyle(mark).getPropertyValue("--len")) || 4;
  return { after, bar, rest: (1 + TREMA_GAP) * d, parted: (len - 1) * d };
}

/** The marker held in the tréma, paused: start it with the pair (partInView `extra`). */
export function holdMark(mark: HTMLElement, duration: number = DURATION.part): Animation[] {
  const { after, bar, rest, parted } = markParts(mark);
  if (!after) return [];
  const travel: KeyframeAnimationOptions = { duration, easing: EASE.inOut, fill: "backwards" };
  const anims = [after.animate([{ transform: `translateX(${rest}px)` }, { transform: `translateX(${parted}px)` }], travel)];
  if (bar) anims.push(bar.animate(CLIP_IN, travel));
  anims.forEach((a) => a.pause());
  return anims;
}

/**
 * The tab's marker on a pointer pick: it closes from wherever it is (the
 * running set is read, then replaced), rides the tab closed, and parts at
 * `partAt` on the pair's own curve and length. Returns the new set.
 */
export function pickMark(mark: HTMLElement, running: Animation[], duration: number): Animation[] {
  const { after, bar, rest, parted } = markParts(mark);
  const x0 = after ? getComputedStyle(after).transform : "none";
  const clip0 = bar ? getComputedStyle(bar).clipPath : "none";
  running.forEach((a) => a.cancel());
  if (!after) return [];
  const total = STORY_TIMING.partAt + duration;
  const closed = STORY_TIMING.close / total;
  const held = STORY_TIMING.partAt / total;
  const timing: KeyframeAnimationOptions = { duration: total, easing: "linear" };
  const anims = [
    after.animate(
      [
        { transform: x0 === "none" ? `translateX(${parted}px)` : x0, easing: EASE.out },
        { transform: `translateX(${rest}px)`, offset: closed },
        { transform: `translateX(${rest}px)`, offset: held, easing: EASE.inOut },
        { transform: `translateX(${parted}px)` },
      ],
      timing,
    ),
  ];
  if (bar) {
    anims.push(
      bar.animate(
        [
          { clipPath: clip0 === "none" ? "inset(0 0% 0 0)" : clip0, easing: EASE.out },
          { clipPath: "inset(0 100% 0 0)", offset: closed },
          { clipPath: "inset(0 100% 0 0)", offset: held, easing: EASE.inOut },
          { clipPath: "inset(0 0% 0 0)" },
        ],
        timing,
      ),
    );
  }
  return anims;
}

/** Keyboard pick (and every pick under reduced motion): a crossfade, opacity only. */
export function playKey(panel: HTMLElement, from?: HTMLElement | null): Cancel {
  const anims: Animation[] = [];
  if (from && from !== panel) anims.push(from.animate(FADE_OUT, { duration: STORY_TIMING.exit, easing: EASE.out }));
  anims.push(panel.animate(FADE_IN, { duration: STORY_TIMING.keyFade, easing: EASE.out }));
  return canceller(anims);
}

/**
 * Pointer pick in tab mode: the outgoing story fades while the new one
 * rises (they overlap from the first frame), then the result by clip, then
 * the pair parts (with the tab's marker, run by pickMark on the same clock).
 */
export function playPointer(panel: HTMLElement, from: HTMLElement | null, duration: number): Cancel {
  const anims: Animation[] = [];
  if (from && from !== panel) anims.push(from.animate(FADE_OUT, { duration: STORY_TIMING.exit, easing: EASE.out }));
  panel.querySelectorAll<HTMLElement>("[data-story-part]").forEach((el, i) => {
    anims.push(el.animate(RISE_IN, out(i * STAGGER.ui, DURATION.panel)));
  });
  panel.querySelectorAll<HTMLElement>("[data-story-clip]").forEach((el, i) => {
    anims.push(el.animate(CLIP_IN, out(STORY_TIMING.clipAt + i * STAGGER.ui, DURATION.clip)));
  });
  panel.querySelectorAll<HTMLElement>("[data-story-tail]").forEach((el) => {
    anims.push(el.animate(RISE_IN, out(STORY_TIMING.tailAt, DURATION.panel)));
  });
  for (const pair of pairsIn(panel)) anims.push(...parting(pair, STORY_TIMING.partAt, duration));
  return canceller(anims);
}

/**
 * Hold every pair in `root` in the tréma, with any `extra` paused set (the
 * marker, from holdMark), and part them all on one start time once the
 * result is 40% in view, no sooner than `notBefore` ms from now. The cancel
 * leaves the pairs parted; `extra` belongs to the caller.
 */
export function partInView(
  root: HTMLElement,
  { notBefore = 0, duration = DURATION.part, extra = [] }: { notBefore?: number; duration?: number; extra?: Animation[] } = {},
): Cancel {
  if (prefersReducedMotion()) return () => {};
  const set: Animation[] = [];
  for (const pair of pairsIn(root)) set.push(...parting(pair, 0, duration));
  set.forEach((a) => a.pause());
  const earliest = performance.now() + notBefore;
  const stop = onceInView(
    resultIn(root),
    () => {
      const now = document.timeline.currentTime;
      const at = (typeof now === "number" ? now : performance.now()) + Math.max(0, earliest - performance.now());
      [...set, ...extra].forEach((a) => {
        a.startTime = at;
      });
    },
    PART_OBSERVER,
  );
  return canceller(set, [stop]);
}

/** Accordion: the opened region rises 8px into view and the row's marker grows from 0.4. */
export function playRegion(region: HTMLElement, marker: HTMLElement | null): Cancel {
  if (prefersReducedMotion()) return () => {};
  const anims: Animation[] = [];
  const body = region.firstElementChild as HTMLElement | null;
  const rise: Keyframe[] = [
    { opacity: 0, transform: `translate3d(0, ${RISE.ui}px, 0)` },
    { opacity: 1, transform: "translate3d(0, 0, 0)" },
  ];
  const timing = { duration: STORY_TIMING.region, easing: EASE.out };
  if (body) anims.push(body.animate(rise, timing));
  if (marker) {
    anims.push(marker.animate([{ opacity: 0, transform: "scale(0.4)" }, { opacity: 1, transform: "scale(1)" }], timing));
  }
  return canceller(anims);
}
