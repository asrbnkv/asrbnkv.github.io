import { easeInOut, easeOut, subRange } from "@/lib/motion";

/**
 * The flight's routes (01 §6.2, 02 §1.6). During the fall phase (progress
 * 0 → 0.65) each dot travels from its ë position to its pair position. The
 * spec's route falls first and slides after (y over 0 → 0.50, x over
 * 0.30 → 0.65); the layout decides whether that clears the hero's
 * [data-flight-avoid] elements (the role line's text, the bust, the facts),
 * so the route is chosen on every measure:
 *
 * 1. Plain routes: the dot slides only toward its target (the spec's family).
 * 2. Lane routes, when no plain route is clear: the dot first moves along the
 *    ë's own height to a lane beside an obstacle (above the letters' x-height),
 *    falls down the lane, then slides in along the pair's row. On a phone the
 *    only lane is right of the bust, too narrow for two dots abreast: the dots
 *    go down it in single file, so the dot nearer the lane (the right one)
 *    leads and becomes the grey one (`swap`).
 *
 * The clearest route wins (penetration in px of the dot's box into an
 * obstacle's box, with 2px of air), then the one closest to the spec. Where
 * no route is clear (under ~375px the role line and the bust fill the
 * width), the dots keep the spec's route and pass behind the obstacles. The second dot never comes closer than 1.1 diameters
 * to the first, and without a swap it keeps to the first one's right.
 */
export interface Route {
  /** Plain routes: share of the slide taken early, over 0 → 0.2 (a sidestep). */
  pre: number;
  /** Lane routes: the lane's x, reached over 0 → lb at the start height. */
  lane?: number;
  lb?: number;
  /** 0: centred in its gap; 1: pressed against an obstacle; 2: also cropped
   *  by the screen's edge (preferred in that order). */
  tight?: number;
  /** The rest of the slide runs over xa → xb (in-out). */
  xa: number;
  xb: number;
  /** The fall ends at ye (power2.in); lane routes start it at lb. */
  ye: number;
}

export type Pt = { x: number; y: number };
export type Rect = { l: number; t: number; r: number; b: number };

export const slideAt = (q: Route, p: number) =>
  q.pre * easeOut(subRange(p, 0, 0.2)) + (1 - q.pre) * easeInOut(subRange(p, q.xa, q.xb));

/** Share of the fall at p (power2.in). */
export const dropAt = (q: Route, p: number) => subRange(p, q.lb ?? 0, q.ye) ** 2;

export const pointAt = (q: Route, from: Pt, to: Pt, p: number): Pt => {
  const y = from.y + (to.y - from.y) * dropAt(q, p);
  if (q.lane === undefined) return { x: from.x + (to.x - from.x) * slideAt(q, p), y };
  const toLane = (q.lane - from.x) * easeInOut(subRange(p, 0, q.lb ?? 0.1));
  return { x: from.x + toLane + (to.x - q.lane) * easeInOut(subRange(p, q.xa, q.xb)), y };
};

/** The grids are decimal steps: compare with a hair of tolerance (0.6 − 0.45 < 0.15 in binary). */
const EPS = 1e-9;
const PLAIN: Route[] = [];
for (const pre of [0, 0.2, 0.4])
  for (const xa of [0.2, 0.25, 0.3, 0.35, 0.4])
    for (const xb of [0.55, 0.6, 0.65])
      for (const ye of [0.4, 0.45, 0.5, 0.55, 0.6, 0.65]) if (xb - xa >= 0.15 - EPS) PLAIN.push({ pre, xa, xb, ye });

/** Lane timings (the lane's x is filled in per layout). */
const LANE: Array<Omit<Route, "lane">> = [];
for (const lb of [0.06, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45])
  for (const ye of [0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65])
    for (const xa of [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6])
      for (const xb of [0.5, 0.55, 0.6, 0.65])
        if (ye - lb >= 0.15 - EPS && xb - xa >= 0.1 - EPS && xa >= lb + 0.1 - EPS) LANE.push({ pre: 0, lb, ye, xa, xb });

const AIR = 2; // px kept between a dot and an obstacle
// Planned with 1.5px more: the scrub's smoothing renders every progress in
// between the 1% samples, where an in-out slide can bow out by about 1px.
const PLAN_AIR = AIR + 1.5;
const STEPS = 65; // the fall phase, sampled every 0.01 of progress

export function planRoutes(o: {
  /** Start and end centres (document coordinates). */
  sL: Pt;
  sR: Pt;
  tL: Pt;
  tR: Pt;
  /** The dots' diameter at progress p. */
  size: (p: number) => number;
  avoid: Rect[];
  prefer: Route;
  /** The viewport's width: lanes stay on screen. */
  vw: number;
  /**
   * The least share of progress a move to a lane may take (a phone's lane
   * change spread over at least 20px of scroll, never a sideways jump).
   */
  minLane?: number;
}): { L: Route; R: Route; swap: boolean; clear: boolean } {
  // A dot's whole box (not only its disc) keeps AIR from every obstacle box.
  const hit = (c: Pt, rad: number) => {
    let w = 0;
    const e = rad + PLAN_AIR;
    for (const q of o.avoid)
      w = Math.max(w, Math.min(c.x + e - q.l, q.r + e - c.x, c.y + e - q.t, q.b + e - c.y));
    return w;
  };
  const sMax = Math.max(o.size(0), o.size(0.65));
  const rMax = sMax / 2;
  // Lanes: tight beside each obstacle (and one dot further, for the second
  // dot abreast), or centred between it and the screen's edge. Last resort
  // (a 375px phone, where the bust leaves less than a dot at the right): a
  // lane against the obstacle that lets the screen's edge crop the dot by up
  // to 0.4 of its radius, as the edge crops the m.
  const lanes: Array<{ x: number; tight: number }> = [];
  const addLane = (x: number, tight: number) => {
    const lo = rMax + PLAN_AIR + 2;
    const hi = o.vw - rMax - PLAN_AIR - 2;
    const v = Math.round(tight === 2 ? x : Math.max(lo, Math.min(hi, x)));
    if (v > o.vw - 0.6 * rMax || v < 0.6 * rMax) return;
    if (!lanes.some((l) => l.x === v)) lanes.push({ x: v, tight });
  };
  for (const q of o.avoid) {
    addLane((q.r + o.vw) / 2, 0);
    addLane(q.l / 2, 0);
    for (const edge of [q.r + PLAN_AIR + rMax + 2, q.l - PLAN_AIR - rMax - 2])
      for (const off of [0, 1.15 * sMax, -1.15 * sMax]) addLane(edge + off, 1);
    addLane(q.r + PLAN_AIR + rMax + 0.5, 2);
    addLane(q.l - PLAN_AIR - rMax - 0.5, 2);
  }
  const cost = (q: Route, from: Pt) =>
    q.pre +
    Math.abs(q.xa - o.prefer.xa) +
    Math.abs(q.xb - o.prefer.xb) +
    Math.abs(q.ye - o.prefer.ye) +
    (q.lane === undefined ? 0 : 1 + (q.lb ?? 0) + Math.abs(q.lane - from.x) / o.vw + 0.3 * (q.tight ?? 0));
  // The worst penetration along the fall; stops once it cannot beat `best`.
  const worst = (fn: (p: number) => number, best: number) => {
    let w = 0;
    for (let i = 0; i <= STEPS; i++) {
      w = Math.max(w, fn(i / 100));
      if (Math.round(w) > best) break;
    }
    return Math.round(w);
  };
  const choose = (from: Pt, score: (q: Route, best: number) => number) => {
    let pick = o.prefer;
    let best = score(o.prefer, Infinity);
    if (best === 0) return { pick, best };
    const consider = (q: Route) => {
      const s = score(q, best);
      if (s < best || (s === best && cost(q, from) < cost(pick, from))) {
        pick = q;
        best = s;
      }
    };
    PLAIN.forEach(consider);
    const minLane = o.minLane ?? 0;
    if (best > 0)
      for (const l of lanes)
        for (const t of LANE) if ((t.lb ?? 0) >= minLane) consider({ ...t, lane: l.x, tight: l.tight });
    return { pick, best };
  };
  const plan = (sL: Pt, sR: Pt, ordered: boolean) => {
    const L = choose(sL, (q, best) => worst((p) => hit(pointAt(q, sL, o.tL, p), o.size(p) / 2), best));
    const R = choose(sR, (q, best) =>
      worst((p) => {
        const s = o.size(p);
        const r = pointAt(q, sR, o.tR, p);
        const l = pointAt(L.pick, sL, o.tL, p);
        const apart = 1.1 * s - Math.hypot(r.x - l.x, r.y - l.y);
        return Math.max(hit(r, s / 2), apart, ordered ? l.x + 0.5 * s - r.x : 0);
      }, best),
    );
    return { L: L.pick, R: R.pick, score: L.best + R.best };
  };
  const straight = plan(o.sL, o.sR, true);
  if (straight.score === 0) return { L: straight.L, R: straight.R, swap: false, clear: true };
  const swapped = plan(o.sR, o.sL, false);
  if (swapped.score === 0) return { L: swapped.L, R: swapped.R, swap: true, clear: true };
  // No lane at all (under ~375px the role line and the bust fill the width):
  // the spec's route, and the dots pass behind the obstacles (occlude()).
  return { L: o.prefer, R: o.prefer, swap: false, clear: false };
}

/** One box per obstacle element (its text lines merged), for occlusion. */
export function unionRect(rects: Rect[]): Rect | null {
  if (!rects.length) return null;
  return rects.reduce((a, q) => ({
    l: Math.min(a.l, q.l),
    t: Math.min(a.t, q.t),
    r: Math.max(a.r, q.r),
    b: Math.max(a.b, q.b),
  }));
}

/**
 * The clip-path that hides the parts of a dot (centre c, drawn size `size`,
 * laid out at `base` and scaled about its centre) lying over the obstacles,
 * so it passes behind them. "" when nothing overlaps.
 */
export function occlusionClip(c: Pt, size: number, base: number, boxes: Rect[]): string {
  const r = size / 2;
  const k = size / base;
  const lx = (x: number) => ((x - c.x) / k + base / 2).toFixed(2);
  const ly = (y: number) => ((y - c.y) / k + base / 2).toFixed(2);
  let holes = "";
  for (const q of boxes) {
    const l = Math.max(q.l - AIR, c.x - r - 1);
    const t = Math.max(q.t - AIR, c.y - r - 1);
    const rr = Math.min(q.r + AIR, c.x + r + 1);
    const b = Math.min(q.b + AIR, c.y + r + 1);
    if (rr > l && b > t) holes += `M${lx(l)} ${ly(t)}H${lx(rr)}V${ly(b)}H${lx(l)}Z`;
  }
  return holes ? `path(evenodd, "M0 0H${base}V${base}H0Z${holes}")` : "";
}

/** The obstacle rects of an element: the boxes of its text, or its own box. */
export function avoidRects(el: Element): Rect[] {
  const out: Rect[] = [];
  const push = (r: DOMRect) => {
    if (r.width > 0 && r.height > 0)
      out.push({ l: r.left, t: r.top + window.scrollY, r: r.right, b: r.bottom + window.scrollY });
  };
  if (el instanceof HTMLImageElement || !el.textContent?.trim()) {
    push(el.getBoundingClientRect());
    return out;
  }
  // Text nodes only: a range over the element would also return the boxes of
  // its block children (full-width list items), which are not ink.
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    range.selectNodeContents(n);
    for (const r of Array.from(range.getClientRects())) push(r);
  }
  return out;
}
