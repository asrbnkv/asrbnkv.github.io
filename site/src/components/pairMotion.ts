/**
 * Imperative helpers for <Pair> (browser only). Used by Pair itself, by the
 * Flight, and by sections that scrub or replay a parting:
 *
 *   measurePairTrack(el)     the after dot's rest and final x, px (once per layout)
 *   setPairProgress(el, p, track?)  0 = tréma rest, 1 = parted, linear in p
 *                            (scrubbed scenes); the start label stays
 *   replayPair(el, track?)   the dot steps back 15% and returns (fine-pointer
 *                            hover only; at most once per 2s)
 *   pairGeometry(el)         px geometry of the drawing, for the flight
 *
 * `el` is the Pair root ([data-pair]).
 */
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

export interface PairGeometry {
  /** Measure width and dot diameter, px. */
  width: number;
  d: number;
  /** Left edges of the dots, px from the drawing's left: before, rest and final positions of the after dot. */
  xBefore: number;
  xRest: number;
  xFinal: number;
  /** Viewport rects of the before and after discs as drawn now. */
  /** Width of the before mark: d for a dot, the capsule's length for a range. */
  beforeWidth: number;
  beforeRect: DOMRect;
  afterRect: DOMRect;
  drawingRect: DOMRect;
}

const num = (el: Element, prop: string) =>
  parseFloat(getComputedStyle(el).getPropertyValue(prop)) || 0;

export function pairGeometry(el: HTMLElement): PairGeometry | null {
  const drawing = el.querySelector<HTMLElement>("[data-pair-drawing]");
  const before = el.querySelector<HTMLElement>('[data-pair-disc="before"]');
  const after = el.querySelector<HTMLElement>('[data-pair-disc="after"]');
  if (!drawing || !before || !after) return null;
  const drawingRect = drawing.getBoundingClientRect();
  const width = drawingRect.width;
  const d = after.getBoundingClientRect().height;
  const fb = num(el, "--fb");
  const fe = num(el, "--fe");
  const fa = num(el, "--fa");
  return {
    width,
    d,
    xBefore: fb * (width - d),
    xRest: fe * (width - d) + 1.27 * d,
    xFinal: fa * (width - d),
    beforeWidth: before.offsetWidth,
    beforeRect: before.getBoundingClientRect(),
    afterRect: after.getBoundingClientRect(),
    drawingRect,
  };
}

/** The after dot's travel, px: measure once per layout (on refresh or resize), never per frame. */
export interface PairTrack {
  xRest: number;
  xFinal: number;
}

export function measurePairTrack(el: HTMLElement): PairTrack | null {
  const g = pairGeometry(el);
  return g ? { xRest: g.xRest, xFinal: g.xFinal } : null;
}

const movers = (el: HTMLElement) => ({
  mover: el.querySelector<HTMLElement>("[data-pair-mover]"),
  bar: el.querySelector<HTMLElement>("[data-pair-bar]"),
  // The start label (x(0), "0") names the scale: it stays at rest.
  labels: Array.from(el.querySelectorAll<HTMLElement>('[data-pair-label]:not([data-pair-label="start"])')),
});

/**
 * Drive a scrubbed parting: p in [0, 1], LINEAR in p, so the reader's scroll
 * is the travel (GSAP's scrub 0.6 adds the soft start and the settle). Pass
 * the track from measurePairTrack() to skip the geometry reads per frame.
 * Writes transform, clip-path and opacity only.
 */
export function setPairProgress(el: HTMLElement, p: number, track?: PairTrack | null) {
  const g = track ?? measurePairTrack(el);
  if (!g) return;
  const t = Math.min(1, Math.max(0, p));
  if (!el.hasAttribute("data-parted")) el.setAttribute("data-parted", "");
  const { mover, bar, labels } = movers(el);
  if (mover) mover.style.transform = `translateX(${(g.xRest + (g.xFinal - g.xRest) * t).toFixed(2)}px)`;
  if (bar) bar.style.clipPath = `inset(0 ${((1 - t) * 100).toFixed(2)}% 0 0)`;
  // The values arrive once the dot has nearly landed (the last quarter).
  const labelOpacity = String(Math.min(1, Math.max(0, (t - 0.76) / 0.24)));
  labels.forEach((l) => {
    l.style.opacity = labelOpacity;
  });
}

/** Hand a scrubbed pair back to its CSS (parted) state. */
export function releasePair(el: HTMLElement) {
  el.querySelectorAll<HTMLElement>("[data-pair-mover], [data-pair-bar], [data-pair-label]").forEach(
    (n) => {
      n.style.transform = "";
      n.style.clipPath = "";
      n.style.opacity = "";
    },
  );
  el.setAttribute("data-parted", "");
}

const lastReplay = new WeakMap<HTMLElement, number>();

/**
 * The reader's response (01 §6.3): the dot steps back over the last 15% of
 * its parting, stops, and returns. The effect is linear and each keyframe
 * carries its own curve: ease-out away (it answers at once), zero speed at
 * the turn, in-out home. 600ms, at most once every 2s, never under reduced
 * motion, never while another animation runs on the dot. Call it from a
 * fine-pointer hover only (onHoverIntent in lib/inView), never from focus:
 * keyboard actions are not animated.
 */
export function replayPair(el: HTMLElement, track?: PairTrack | null) {
  if (prefersReducedMotion() || !el.hasAttribute("data-parted")) return;
  const now = performance.now();
  if (now - (lastReplay.get(el) ?? -Infinity) < 2000) return;
  const g = track ?? measurePairTrack(el);
  const { mover, bar } = movers(el);
  if (!g || !mover || !bar || mover.getAnimations().length) return;
  lastReplay.set(el, now);
  const x85 = g.xRest + (g.xFinal - g.xRest) * 0.85;
  const opts: KeyframeAnimationOptions = { duration: 600, easing: "linear" };
  mover.animate(
    [
      { transform: `translateX(${g.xFinal}px)`, easing: EASE.out },
      { transform: `translateX(${x85}px)`, offset: 0.35, easing: EASE.inOut },
      { transform: `translateX(${g.xFinal}px)` },
    ],
    opts,
  );
  bar.animate(
    [
      { clipPath: "inset(0 0% 0 0)", easing: EASE.out },
      { clipPath: "inset(0 15% 0 0)", offset: 0.35, easing: EASE.inOut },
      { clipPath: "inset(0 0% 0 0)" },
    ],
    opts,
  );
}

/**
 * Place attached labels exactly: centred on their dot, clamped inside the
 * measure, and pushed apart (before label ends at its dot, after label
 * starts at its dot) if they would touch. Runs on the parted geometry, so a
 * label that travels with its dot ends in the right place.
 */
export function clampPairLabels(el: HTMLElement) {
  const g = pairGeometry(el);
  if (!g || g.width === 0) return;
  const W = g.width;
  type L = { node: HTMLElement; x: number; w: number; off: number; role: string };
  const labels: L[] = [];
  el.querySelectorAll<HTMLElement>("[data-pair-label]").forEach((node) => {
    const role = node.dataset.pairLabel!;
    if (role === "start") return;
    const x = role === "after" ? g.xFinal : g.xBefore;
    const w = node.offsetWidth;
    const span = role === "before" ? g.beforeWidth : g.d;
    labels.push({ node, x, w, off: span / 2 - w / 2, role });
  });
  const clamp = (l: L) => {
    l.off = Math.max(-l.x, Math.min(W - l.w - l.x, l.off));
  };
  labels.forEach(clamp);
  const b = labels.find((l) => l.role === "before");
  const a = labels.find((l) => l.role === "after");
  // The zero label shares the band at the measure's start (centred on x(0),
  // never past the start): the before label keeps 16px clear of it (only a
  // before value near 0 would need it).
  const start = el.querySelector<HTMLElement>('[data-pair-label="start"]');
  if (start && b && start.offsetWidth > 0) {
    const zeroRight = Math.max(0, g.d / 2 - start.offsetWidth / 2) + start.offsetWidth;
    const clear = zeroRight + 16 - (b.x + b.off);
    if (clear > 0) {
      b.off += clear;
      clamp(b);
    }
  }
  if (b && a && b.x + b.off + b.w + 12 > a.x + a.off) {
    b.off = g.beforeWidth - b.w;
    a.off = 0;
    clamp(b);
    clamp(a);
  }
  for (const l of labels) {
    l.node.setAttribute("data-clamped", "");
    l.node.style.setProperty("--label-x", `${l.off}px`);
  }
  // The measure line starts where the run starts (the before dot's centre),
  // pulled left as far as needed to stay one line inside the measure.
  const line = el.querySelector<HTMLElement>("[data-pair-measure]");
  if (line && line.offsetWidth > 0) {
    line.style.whiteSpace = "nowrap";
    const textW = line.offsetWidth;
    line.style.whiteSpace = "";
    const x = Math.max(0, Math.min(g.xBefore + g.d / 2, W - textW));
    // floor, never round: a line placed 1px late would wrap at exactly the measure
    line.style.setProperty("--measure-x", `${Math.floor(x)}px`);
  }
}

export const PAIR_TIMING = { part: DURATION.part, delay: 120, labelsAt: 760 } as const;
