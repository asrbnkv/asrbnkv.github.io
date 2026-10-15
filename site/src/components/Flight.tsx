"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { refreshOnResize, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { bezier, easeInOut, easeOut, SCRUB, subRange } from "@/lib/motion";
import styles from "./Flight.module.css";
import { avoidRects, occlusionClip, planRoutes, pointAt, unionRect, type Rect, type Route } from "./flightRoute";

/**
 * The flight (01-system.md §6.2; 02 §1.6): on the first scroll the ë's two
 * dots lift out of the monument and fall into the hero's pair, following
 * the reader's own scroll. The left dot turns grey and lands on ×1; the
 * right turns orange and travels on to ×2 while the run draws, its label
 * riding with it. The name reads "Artem" until the reader scrolls back up.
 *
 *   <Flight heroId="top" pairId="hero-pair" />   (the hero's last child)
 *
 * - Scrubbed, never parked. While the reader scrolls, the dots trail the
 *   scroll by 0.6s (power3 out, the system's scrub). When the scroll comes
 *   to rest mid-flight, the flight completes on its own in 450ms on the
 *   ease-out: forward if the reader was scrolling down, home if up. Once
 *   landed it holds, however the reader scrolls, until they are back above
 *   the start; then the dots fly home. The page itself never moves.
 * - One story, no cut. The pair's after dot, its run and the ×2 label hand
 *   over to the falling dots over the first 4% (the ×2 label comes back
 *   riding its dot); the ×1 dot stays until the grey dot arrives on it.
 * - Above the type (01 §4.5): the layer is absolute inside the hero at
 *   --z-flight, so the dots are seen crossing the e (the headline's own
 *   marks in motion). The routes keep them 2px clear of the role line, the
 *   bust and the facts (flightRoute.ts). Document space: the page's native
 *   scroll carries them.
 * - Lit as they lift: ink → grey and ink → orange in 200ms (time, not
 *   scroll), so no mixed colour can rest on screen.
 * - Phones: the same flight, shorter, single file down the lane right of
 *   the bust; the grey dot slides on to ×1 while the orange stops at ×2
 *   under the lane, and the run draws from ×1.
 * - Mounted at fonts-ready (the load beat's start). A scroll during the
 *   beat plays the rest of the beat 4× faster on its own curves, then the
 *   dots fly to where the scroll is (450ms), so nothing jump-cuts.
 * - JS and no-preference only; switching reduced motion on kills it and
 *   restores the static marks. Transform, opacity and the run's clip-path.
 */
const REDUCE = "(prefers-reduced-motion: reduce)";
const getReduced = () => window.matchMedia(REDUCE).matches;
const getTrue = () => true;
const subscribeReduced = (cb: () => void) => {
  const mql = window.matchMedia(REDUCE);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};

/** The fall ends here; the parting (on phones, the run) runs over FALL → 1. */
const FALL = 0.65;
/** The pair's after dot, run and ×2 label hand over to the flight over 0 → SWAP. */
const SWAP = 0.04;
/** The scrub: the dots trail the scroll by 0.6s. */
const FOLLOW_MS = SCRUB * 1000;
/** At rest mid-flight, the flight completes (or returns) in this time. */
const SETTLE_MS = 450;
/** Ink → grey / orange as the dots lift (and back as they come home). */
const LIT_MS = 200;
/** A scroll during the load beat plays the rest of it this much faster. */
const BEAT_RATE = 4;

const power3Out = (t: number) => 1 - (1 - t) ** 3;
const easeHover = bezier(0.25, 0.1, 0.25, 1);
/** A gentle in-out for the parting: the scrub's smoothing shapes it. */
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const clamp = (lo: number, v: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Ease = (t: number) => number;
type Seg = { from: number; to: number; t0: number; dur: number; ease: Ease; done?: () => void };

export function Flight({
  heroId,
  pairId,
  yRange = [0, 0.5],
  xRange = [0.3, 0.65],
}: {
  heroId: string;
  /** The hero Pair's id (its dots are the targets). */
  pairId: string;
  /**
   * The preferred route within the fall phase (0 → 0.65): y over 0 → yRange[1],
   * x over xRange, so each dot falls first and slides after (02 §1.6). A dot
   * leaves it only when it would cross a [data-flight-avoid] element.
   */
  yRange?: [number, number];
  xRange?: [number, number];
}) {
  const [, y1] = yRange; // the fall always starts at 0
  const [x0, x1] = xRange;
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getTrue);
  const [ready, setReady] = useState(false);
  const dotL = useRef<HTMLSpanElement>(null);
  const dotR = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  // Under reduced motion the beat never plays: mark it done, so switching
  // the preference off later does not replay it mid-reading. The live query
  // decides (the hydration pass renders the server's "reduced" snapshot).
  useEffect(() => {
    if (reduced && getReduced()) document.documentElement.classList.add("beat-done");
  }, [reduced]);

  // Gate: from fonts-ready, the moment the load beat starts.
  useEffect(() => {
    if (reduced) return;
    const html = document.documentElement;
    if (html.classList.contains("fonts-ready")) {
      const t = window.setTimeout(() => setReady(true), 0);
      return () => clearTimeout(t);
    }
    const mo = new MutationObserver(() => {
      if (!html.classList.contains("fonts-ready")) return;
      mo.disconnect();
      setReady(true);
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!ready || reduced) return;
    const html = document.documentElement;
    const hero = document.getElementById(heroId);
    const pair = document.getElementById(pairId);
    const srcL = hero?.querySelector<HTMLElement>('[data-monument-dot="l"]');
    const srcR = hero?.querySelector<HTMLElement>('[data-monument-dot="r"]');
    const line = srcL?.closest<HTMLElement>("[data-monument]")?.firstElementChild;
    const tgtB = pair?.querySelector<HTMLElement>('[data-pair-disc="before"]');
    const tgtA = pair?.querySelector<HTMLElement>('[data-pair-disc="after"]');
    const run = pair?.querySelector<HTMLElement>("[data-pair-bar]");
    const labelA = pair?.querySelector<HTMLElement>('[data-pair-label="after"]') ?? null;
    const labelB = pair?.querySelector<HTMLElement>('[data-pair-label="before"]') ?? null;
    const L = dotL.current;
    const R = dotR.current;
    const B = bar.current;
    if (!hero || !pair || !srcL || !srcR || !(line instanceof HTMLElement) || !tgtB || !tgtA || !run) return;
    if (!L || !R || !B) return;
    const layerEl = L.parentElement as HTMLElement;
    const barEl = document.querySelector<HTMLElement>("[data-bar]");

    // Geometry in document coordinates; the layer's origin is the hero's.
    type Box = { x: number; y: number; s: number };
    const zero: Box = { x: 0, y: 0, s: 1 };
    let g = { sL: zero, sR: zero, tB: zero, tA: zero };
    const centre = (el: HTMLElement): Box => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY, s: r.height };
    };
    const k = {
      L: { pre: 0, xa: x0, xb: x1, ye: y1 } as Route,
      R: { pre: 0, xa: x0, xb: x1, ye: y1 } as Route,
      /** The trigger's length in px of scroll. */
      len: 1,
      behind: [] as Rect[],
      ox: 0,
      oy: 0,
      top: 0,
      /** Phones: the orange dot lands on ×2 itself; the run draws after. */
      direct: false,
      /** The after label at rest (doc x of its left edge, its width) and the before label's right edge. */
      la: 0,
      lw: 0,
      lb: 0,
    };
    const state = { rest: false, settling: false, gone: false, committed: false, dir: 1, target: 0 };
    const proxy = { p: 0 };
    let lit = 0;

    // The load beat's animations still running inside the hero.
    const beat = () =>
      hero.getAnimations({ subtree: true }).filter((a) => {
        const end = a.effect?.getComputedTiming().endTime;
        return typeof end === "number" && Number.isFinite(end) && a.playState !== "finished";
      });

    const measure = () => {
      const fs = parseFloat(getComputedStyle(line).fontSize);
      const hr = hero.getBoundingClientRect();
      const phone = window.innerWidth < 600;
      k.ox = hr.left;
      k.oy = hr.top + window.scrollY;
      k.top = barEl ? Math.max(0, barEl.getBoundingClientRect().bottom) : 0;
      const tB = centre(tgtB);
      // Until the beat settles the letters and dots are mid-rise: the dots'
      // height comes from the line box (baseline 0.64em down, dots 0.557em up).
      const sY = state.rest ? centre(srcL).y : line.getBoundingClientRect().top + window.scrollY + 0.083 * fs;
      // The trigger's length in px of scroll: until the pair's centre is at
      // 45% of the viewport (desktop), 100–140px on phones (01 §6.2: the same
      // flight, shorter). Tall viewports load with the pair already above the
      // line: 0.6 of the fall (at most 200px), never a jump.
      k.len = phone
        ? clamp(100, tB.y - window.innerHeight * 0.25, 140)
        : Math.max(Math.min(200, 0.6 * (tB.y - sY)), tB.y - window.innerHeight * 0.45 - 16);
      g = { ...g, tB };
      if (!state.rest) return;

      g = { sL: centre(srcL), sR: centre(srcR), tB, tA: centre(tgtA) };
      const base = g.sL.s;
      for (const el of [L, R]) el.style.width = el.style.height = `${base}px`;
      const d = g.tB.s;
      B.style.height = `${d * 0.25}px`;
      B.style.setProperty("--d", `${d}px`);
      k.direct = phone;
      const avoidEls = Array.from(hero.querySelectorAll("[data-flight-avoid]"));
      const routes = planRoutes({
        sL: g.sL,
        sR: g.sR,
        tL: g.tB,
        tR: k.direct ? { x: g.tA.x, y: g.tA.y } : { x: g.tB.x + 1.27 * d, y: g.tB.y },
        size: (p) => base + (d - base) * easeInOut(Math.min(1, p / FALL)),
        avoid: avoidEls.flatMap(avoidRects),
        // the spec's route (fall first, slide after); phones fall over more
        // of their shorter trigger, so the dots are still falling at 100px
        prefer: { pre: 0, xa: x0, xb: x1, ye: phone ? Math.max(y1, 0.62) : y1 },
        vw: document.documentElement.clientWidth,
        minLane: clamp(0, 20 / k.len, 0.3),
      });
      k.L = routes.L;
      k.R = routes.R;
      // No clear route (none expected: the phone's role line leaves a lane):
      // the dots pass behind the obstacles, clipped by their boxes.
      k.behind = routes.clear
        ? []
        : avoidEls.map((el) => unionRect(avoidRects(el))).filter((q): q is Rect => q !== null);
      if (!k.behind.length) L.style.clipPath = R.style.clipPath = "";
      // Single file down a lane (phones): the ë's right dot leads and turns
      // grey, the left one follows and turns orange.
      if (routes.swap) g = { ...g, sL: g.sR, sR: g.sL };
      // The after label's rest box (attached labels only: a legend on phones).
      k.lw = 0;
      if (labelA && labelB && labelA.offsetWidth > 0) {
        const t = labelA.style.translate;
        labelA.style.translate = "";
        const a = labelA.getBoundingClientRect();
        labelA.style.translate = t;
        k.la = a.left;
        k.lw = a.width;
        k.lb = labelB.getBoundingClientRect().right;
      }
    };

    let shown = false;
    const show = (on: boolean) => {
      if (on === shown) return;
      shown = on;
      layerEl.style.visibility = on ? "visible" : "hidden";
      for (const el of [L, R]) el.style.willChange = on ? "transform" : "";
    };

    const place = (el: HTMLElement, x: number, y: number, size: number) => {
      const base = g.sL.s;
      el.style.transform = `translate3d(${(x - k.ox - base / 2).toFixed(2)}px, ${(y - k.oy - base / 2).toFixed(2)}px, 0) scale(${(size / base).toFixed(4)})`;
    };

    // The ×2 label rides with its dot during the parting (01 §7.6): it fades
    // in once it clears the ×1 label by 12px.
    const ride = (dotX: number | null) => {
      if (!labelA || !k.lw) return;
      if (dotX === null) {
        labelA.style.opacity = labelA.style.translate = "";
        return;
      }
      const dx = Math.min(0, dotX - g.tA.x);
      labelA.style.translate = `${dx.toFixed(2)}px 0`;
      labelA.style.opacity = clamp(0, (k.la + dx - k.lb - 12) / 48, 1).toFixed(3);
    };

    const render = () => {
      if (!state.rest) return;
      const p = proxy.p;
      // "Artem" while the flight is out, and while its colour comes home.
      const out = p > 0 || lit > 0.001;
      srcL.style.opacity = srcR.style.opacity = out ? "0" : "";
      if (p >= 1 || !out) {
        show(false);
        tgtA.style.opacity = tgtB.style.opacity = run.style.opacity = "";
        ride(null);
        return;
      }
      show(true);
      const fall = Math.min(1, Math.max(0, p) / FALL);
      const d = g.tB.s;
      const size = g.sL.s + (d - g.sL.s) * easeInOut(fall);
      const restR = k.direct ? { x: g.tA.x, y: g.tA.y } : { x: g.tB.x + 1.27 * d, y: g.tB.y };
      const l = pointAt(k.L, g.sL, g.tB, fall * FALL);
      const r = pointAt(k.R, g.sR, restR, fall * FALL);
      if (!k.direct && p > FALL) r.x = restR.x + (g.tA.x - restR.x) * easeInOutSine(subRange(p, FALL, 1));
      // Never under the bar: the centre stays a radius and 4px below it,
      // unless that would carry it past its own landing (a fling).
      const floor = window.scrollY + k.top + size / 2 + 4;
      l.y = Math.max(l.y, Math.min(floor, g.tB.y));
      r.y = Math.max(r.y, Math.min(floor, restR.y));
      place(L, l.x, l.y, size);
      place(R, r.x, r.y, size);
      if (k.behind.length) {
        L.style.clipPath = occlusionClip(l, size, g.sL.s, k.behind);
        R.style.clipPath = occlusionClip(r, size, g.sL.s, k.behind);
      }
      // Lit as they lift (time-based, see tick).
      const c = lit.toFixed(3);
      L.style.setProperty("--c", c);
      R.style.setProperty("--c", c);
      // The pair hands over: its after dot and run fade as the dots lift;
      // the ×1 dot gives way only as the grey dot arrives on it.
      const fade = (1 - subRange(p, 0, SWAP)).toFixed(3);
      tgtA.style.opacity = run.style.opacity = fade;
      tgtB.style.opacity = clamp(0, Math.hypot(l.x - g.tB.x, l.y - g.tB.y) / d, 1).toFixed(3);
      // The run, drawn from ×1 by clip-path (with the orange dot on desktop;
      // after both have landed on phones).
      const full = g.tA.x - g.tB.x;
      B.style.width = `${full}px`;
      B.style.transform = `translate3d(${(g.tB.x - k.ox).toFixed(2)}px, ${(g.tB.y - k.oy - (d * 0.25) / 2).toFixed(2)}px, 0)`;
      const drawn = p <= FALL ? 0 : k.direct ? easeInOut(subRange(p, FALL, 1)) : clamp(0, (r.x - g.tB.x) / full, 1);
      B.style.clipPath = `inset(0 ${((1 - drawn) * 100).toFixed(2)}% 0 0)`;
      if (!k.direct && p > FALL) ride(r.x);
      else if (labelA && k.lw) {
        labelA.style.translate = "";
        labelA.style.opacity = fade;
      }
    };

    // ── The animator: one rAF loop while the progress or the light moves.
    // Every change starts from the current value, so a new scroll, a
    // settle or a return retargets the motion instead of restarting it.
    let seg: Seg | null = null;
    let litSeg: Seg | null = null;
    let frame = 0;
    const at = (s: Seg, now: number) => s.from + (s.to - s.from) * s.ease(s.dur > 0 ? clamp(0, (now - s.t0) / s.dur, 1) : 1);
    const tick = (now: number) => {
      frame = 0;
      if (seg) {
        proxy.p = at(seg, now);
        if (now - seg.t0 >= seg.dur) {
          const done = seg.done;
          proxy.p = seg.to;
          seg = null;
          done?.();
        }
      }
      const litTo = proxy.p > 0 ? 1 : 0;
      if (lit !== litTo && litSeg?.to !== litTo)
        litSeg = { from: lit, to: litTo, t0: now, dur: LIT_MS * Math.abs(litTo - lit), ease: easeHover };
      if (litSeg) {
        lit = at(litSeg, now);
        if (now - litSeg.t0 >= litSeg.dur) {
          lit = litSeg.to;
          litSeg = null;
        }
      }
      render();
      if (seg || litSeg) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame && !state.gone) frame = requestAnimationFrame(tick);
    };
    // Landed: held there until the reader is back above the start.
    const landed = () => {
      if (proxy.p >= 1) state.committed = true;
    };
    const tweenTo = (to: number, dur: number, ease: Ease) => {
      seg = { from: proxy.p, to, t0: performance.now(), dur, ease, done: landed };
      wake();
    };

    // ── The load beat hands over. It ends on its own (a frame first, so the
    // CSS animations fonts-ready started are there to wait for); a scroll
    // during it plays the rest 4× faster on its own curves. Then the dots
    // measure at rest and fly to where the scroll is.
    const toRest = () => {
      if (state.rest || state.gone) return;
      state.rest = true;
      html.classList.add("beat-done");
      measure();
      if (state.target > 0) tweenTo(state.target, SETTLE_MS, easeOut);
      else render();
    };
    const hurry = () => {
      if (state.rest || state.settling) return;
      state.settling = true;
      for (const a of beat()) {
        try {
          a.updatePlaybackRate(BEAT_RATE);
        } catch {
          // an animation without a timeline keeps its pace
        }
      }
    };
    let raf = requestAnimationFrame(function wait() {
      raf = 0;
      const pending = beat();
      if (!pending.length) return toRest();
      Promise.all(pending.map((a) => a.finished.catch(() => undefined))).then(() => {
        if (!state.gone && !state.rest) raf = requestAnimationFrame(wait);
      });
    });

    // ── The trigger: from the first 16px of scroll until the pair's centre
    // reaches its line. "top+=16 top" in 01 §6.2 assumes the hero starts at
    // 0; the bar is sticky in flow, so the start is an absolute 16px.
    const onUpdate = (self: ScrollTrigger) => {
      state.dir = self.direction;
      state.target = self.progress;
      if (!state.rest) {
        if (self.progress > 0) hurry();
        return;
      }
      if (state.committed) {
        if (self.progress > 0) return;
        state.committed = false;
      }
      tweenTo(self.progress, FOLLOW_MS, power3Out);
    };
    // The scroll came to rest mid-flight: complete it, never park it.
    const onIdle = () => {
      if (!state.rest || state.committed || state.target <= 0 || state.target >= 1) return;
      tweenTo(state.dir < 0 ? 0 : 1, SETTLE_MS, easeOut);
    };

    const gsap = registerGsap();
    let st: ScrollTrigger | null = null;
    const ctx = gsap.context(() => {
      st = ScrollTrigger.create({
        trigger: hero,
        start: 16,
        end: () => {
          measure();
          return 16 + k.len;
        },
        onUpdate,
        onRefresh: (self) => {
          state.target = self.progress;
          render();
        },
      });
    });
    ScrollTrigger.addEventListener("scrollEnd", onIdle);
    const stop = refreshOnResize();
    // Loaded mid-page: the beat hurries, then the flight takes its state.
    const now = st as ScrollTrigger | null;
    if (now && now.progress > 0) {
      state.target = now.progress;
      hurry();
    }

    // Tests and the lab: freeze the flight at a progress (dev builds only).
    type Hook = { set: (p: number) => void; get: () => object };
    const w = window as Window & { __flight?: Hook };
    if (process.env.NODE_ENV !== "production")
      w.__flight = {
        set: (p) => {
          seg = litSeg = null;
          toRest();
          state.committed = false;
          proxy.p = p;
          lit = p > 0 ? 1 : 0;
          render();
        },
        get: () => ({ ...state, p: proxy.p, lit, len: k.len, direct: k.direct, behind: k.behind.length, L: k.L, R: k.R }),
      };

    return () => {
      state.gone = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener("scrollEnd", onIdle);
      stop();
      ctx.revert();
      show(false);
      ride(null);
      srcL.style.opacity = srcR.style.opacity = "";
      tgtA.style.opacity = tgtB.style.opacity = run.style.opacity = "";
      L.style.clipPath = R.style.clipPath = "";
      if (w.__flight) delete w.__flight;
    };
  }, [ready, reduced, heroId, pairId, y1, x0, x1]);

  // The layer exists only with JS, no-preference and the display face
  // (01 §6.2): under reduced motion nothing is mounted.
  if (reduced || !ready) return null;
  return (
    <div className={styles.layer} aria-hidden="true" data-flight="">
      <span ref={bar} className={styles.bar} />
      <span ref={dotL} className={`${styles.dot} ${styles.before}`} />
      <span ref={dotR} className={`${styles.dot} ${styles.after}`} />
    </div>
  );
}
