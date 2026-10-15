/**
 * How the proof scenes move their Pair (02-home.md §3.9, 01 §6.3–6.4).
 * Browser only. The Pair draws itself; this file only moves its after dot
 * and its run, on geometry measured once per layout, and sets the labels'
 * state:
 *
 *   measurePair(pair)        the after dot's rest and final x, the run (px)
 *   drawPair(pair, g, p)     scrubbed parting, LINEAR in p: the reader's
 *                            scroll is the travel (scrub 0.6 adds the soft
 *                            start and the trailing settle)
 *   landPair(pair, on, how)  the labels' state: the after label waits for
 *                            its dot (data-landed; the before and capsule
 *                            labels name the start from the first frame)
 *   partPair(pair, g, done)  the timed parting of flow layouts (1000ms in-out)
 *   replayPair(pair, g)      the reader's response: the dot steps back 15%,
 *                            stops, and returns (ease-out away, in-out home)
 *   restPair(pair, parted)   hand the pair back to its CSS state
 *
 * The run is clipped from the moving dot's own x, never from p: it grows out
 * of the before dot (the tréma stays clean at rest), catches the dot within
 * its first 0.27d of travel and then always ends under it, so the crossing
 * reads as one dot drawing its own line.
 */
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

export interface PairTrack {
  /** Left edge of the after dot at rest (the tréma) and parted, px. */
  xRest: number;
  xFinal: number;
  /** The run's start (x of the before dot, or the capsule's end) and length, px. */
  xBase: number;
  len: number;
  /** Dot diameter, px. */
  d: number;
}

const parts = (pair: HTMLElement) => ({
  mover: pair.querySelector<HTMLElement>("[data-pair-mover]"),
  bar: pair.querySelector<HTMLElement>("[data-pair-bar]"),
});

/** Read once per layout (on refresh and resize), never per frame. */
export function measurePair(pair: HTMLElement): PairTrack | null {
  const drawing = pair.querySelector<HTMLElement>("[data-pair-drawing]");
  const disc = pair.querySelector<HTMLElement>('[data-pair-disc="after"]');
  if (!drawing || !disc) return null;
  const width = drawing.clientWidth;
  const d = disc.offsetHeight;
  const fe = parseFloat(pair.style.getPropertyValue("--fe")) || 0;
  const fa = parseFloat(pair.style.getPropertyValue("--fa")) || 0;
  if (!width || !d) return null;
  const xBase = fe * (width - d);
  const xFinal = fa * (width - d);
  return { xRest: xBase + 1.27 * d, xFinal, xBase, len: xFinal - xBase, d };
}

/** The run's right inset (px) for the after dot's left edge at x. */
function runInset(g: PairTrack, x: number): number {
  const travelled = Math.max(0, x - g.xRest);
  // from the before dot's edge (0.5d into the run) at twice the dot's speed,
  // until it reaches the dot's centre (1.27d + travelled), then with it
  const end = Math.min(1.27 * g.d + travelled, 0.5 * g.d + 2 * travelled);
  return Math.max(0, g.len - end);
}

const at = (g: PairTrack, t: number) => g.xRest + (g.xFinal - g.xRest) * t;

/** p in [0, 1]: 0 the tréma, 1 parted. Writes transform and clip-path only. */
export function drawPair(pair: HTMLElement, g: PairTrack, p: number) {
  const t = Math.min(1, Math.max(0, p));
  const { mover, bar } = parts(pair);
  if (!pair.hasAttribute("data-parted")) pair.setAttribute("data-parted", "");
  const x = at(g, t);
  if (mover) mover.style.transform = `translateX(${x.toFixed(2)}px)`;
  if (bar) bar.style.clipPath = `inset(0 ${runInset(g, x).toFixed(2)}px 0 0)`;
}

/**
 * The labels are a state, never a function of the scroll: text is either
 * legible or not there. "scrub": 240ms in, 160ms out; "flow": the timed
 * parting's 500ms fade; "now": no transition (keyboard, reduced motion).
 */
export function landPair(pair: HTMLElement, landed: boolean, how: "scrub" | "flow" | "now" = "scrub") {
  if (how === "now") pair.setAttribute("data-instant", "");
  else pair.removeAttribute("data-instant");
  pair.dataset.drive = how === "flow" ? "flow" : "scrub";
  if (landed) pair.setAttribute("data-landed", "");
  else pair.removeAttribute("data-landed");
}

/** Back to the CSS state: parted (no inline styles), or at rest. */
export function restPair(pair: HTMLElement, parted: boolean) {
  const { mover, bar } = parts(pair);
  for (const n of [mover, bar]) {
    if (!n) continue;
    n.getAnimations().forEach((a) => a.cancel());
    n.style.transform = "";
    n.style.clipPath = "";
    n.style.willChange = "";
  }
  if (parted) {
    pair.setAttribute("data-parted", "");
    landPair(pair, true, "now");
  } else {
    pair.removeAttribute("data-parted");
    pair.removeAttribute("data-landed");
  }
}

/** The timed parting (flow layouts): 1000ms in-out after 120ms; the after label from 760ms. */
export function partPair(pair: HTMLElement, g: PairTrack | null, onDone: () => void): () => void {
  const { mover, bar } = parts(pair);
  if (!g || !mover || !bar) {
    restPair(pair, true);
    onDone();
    return () => {};
  }
  drawPair(pair, g, 0);
  const travel: KeyframeAnimationOptions = { duration: DURATION.part, delay: 120, easing: EASE.inOut, fill: "both" };
  // Keyframe offsets live in the eased progress, so the run's two linear
  // pieces (catch-up, then under the dot) stay locked to the mover.
  const q = Math.min(0.999, (0.77 * g.d) / Math.max(1, g.xFinal - g.xRest));
  const inset = (x: number) => `inset(0 ${runInset(g, x).toFixed(2)}px 0 0)`;
  const move = mover.animate(
    [{ transform: `translateX(${g.xRest}px)` }, { transform: `translateX(${g.xFinal}px)` }],
    travel,
  );
  bar.animate(
    [{ clipPath: inset(g.xRest) }, { clipPath: inset(at(g, q)), offset: q }, { clipPath: inset(g.xFinal) }],
    travel,
  );
  const timer = window.setTimeout(() => landPair(pair, true, "flow"), 760);
  let live = true;
  move.finished.then(
    () => {
      if (!live) return;
      drawPair(pair, g, 1);
      mover.getAnimations().forEach((a) => a.cancel());
      bar.getAnimations().forEach((a) => a.cancel());
      onDone();
    },
    () => {},
  );
  return () => {
    live = false;
    window.clearTimeout(timer);
  };
}

const lastReplay = new WeakMap<HTMLElement, number>();

/**
 * The reader's response (01 §6.3): the dot steps back over the last 15% of
 * its parting, comes to a stop, and returns. The effect is linear and each
 * keyframe carries its own curve, so the dot answers the pointer at once
 * (ease-out away), has zero speed at the turn, and settles home (in-out).
 * The run follows the dot (same keyframes, its inset from the dot's x).
 * 600ms, at most once every 2s, never under reduced motion, never mid-play.
 */
export function replayPair(pair: HTMLElement, g: PairTrack | null) {
  if (!g || prefersReducedMotion() || !pair.hasAttribute("data-landed")) return;
  const now = performance.now();
  if (now - (lastReplay.get(pair) ?? -Infinity) < 2000) return;
  const { mover, bar } = parts(pair);
  if (!mover || !bar || mover.getAnimations().length) return;
  lastReplay.set(pair, now);
  const x85 = at(g, 0.85);
  const away = "cubic-bezier(0.23, 1, 0.32, 1)";
  const home = EASE.inOut;
  const opts: KeyframeAnimationOptions = { duration: 600, easing: "linear" };
  const inset = (x: number) => `inset(0 ${runInset(g, x).toFixed(2)}px 0 0)`;
  mover.animate(
    [
      { transform: `translateX(${g.xFinal}px)`, easing: away },
      { transform: `translateX(${x85}px)`, offset: 0.35, easing: home },
      { transform: `translateX(${g.xFinal}px)` },
    ],
    opts,
  );
  bar.animate(
    [
      { clipPath: inset(g.xFinal), easing: away },
      { clipPath: inset(x85), offset: 0.35, easing: home },
      { clipPath: inset(g.xFinal) },
    ],
    opts,
  );
}
