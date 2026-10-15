"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { watchMedia } from "@/lib/inView";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Work.module.css";

/** Hover mode (02 §4.2). Work.module.css applies the same query under html.js. */
const HOVER_MODE = "(min-width: 1280px) and (hover: hover) and (pointer: fine)";
/** The spring that carries the plate: critically damped, settles in about 240ms. */
const OMEGA = 26;
/** A pointer's row shows its picture once the pointer has rested on it this long. */
const DWELL = 80;
/** While the list scrolls, the row beside the plate shows after this long. */
const SCROLL_DWELL = 90;
/** A scroll has ended after this long without scroll events (or at scrollend). */
const SETTLE = 120;
/** A pointer heading for the plate crosses other rows: they wait this long. */
const INTENT = 150;
/** A title's cap middle, from the top of its line box (League Spartan, measured). */
const CAP_MID = 0.385;
/** The plate's clearance under the bar and over the viewport's bottom edge. */
const EDGE = 16;
/** Keyboard: the room between the focused row and the plate (its ring included). */
const RING_ROOM = 12;
/** The H2's cap line, from the top of its line box (League Spartan in a 0.95em line). */
const H2_CAP = 0.055;

/**
 * The index's behaviour around the server-rendered rows (02 §4.3).
 *
 * Hover mode: an ink stage band runs beside the titles, from the H2's cap
 * line to the chapter's end, and the plate (aria-hidden) stands on it,
 * sticky in the upper part of the viewport inside a track that starts beside the H2 and
 * ends on the last row, so while the list scrolls it stands still and shows
 * the row beside it (a cross-dissolve, never a dip). A pointer on a row brings it to that row's
 * middle (a critically damped spring on its transform, one row per row, in
 * the pointer's direction); the picture changes once the pointer has
 * rested 80ms, and a pointer heading for the plate keeps it. After a scroll
 * under a resting pointer, the row under it takes the plate. Keyboard focus
 * puts the plate right under (or over) the focused row and its picture in
 * the same frame. Esc hides it until another row is chosen; hovering the
 * plate keeps it (WCAG 1.4.13); a click removes it synchronously, so the
 * view transition's first snapshot shows the row and its mark.
 *
 * Inline mode needs no script: CSS answers the pointer.
 */
export function WorkIndex({ slides, children }: { slides: ReactNode; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let detach: () => void = () => {};
    const stop = watchMedia(HOVER_MODE, (hoverMode) => {
      detach();
      detach = hoverMode ? attachPlate(root) : () => {};
    });
    return () => {
      stop();
      detach();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.index}>
      <div className={styles.band} aria-hidden="true" data-reveal="band" />
      <div className={styles.track} aria-hidden="true" data-track="">
        <div className={styles.sticky} data-sticky="">
          <div className={styles.plate} data-plate="" data-state="off">
            <div className={styles.plateShow}>
              <div className={styles.plateReveal} data-reveal="plate">
                <div className={styles.slides}>{slides}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

type Point = { x: number; y: number };

const twoFrames = (cb: () => void) => requestAnimationFrame(() => requestAnimationFrame(cb));

function attachPlate(root: HTMLElement): () => void {
  const track = root.querySelector<HTMLElement>("[data-track]");
  const sticky = root.querySelector<HTMLElement>("[data-sticky]");
  const plate = root.querySelector<HTMLElement>("[data-plate]");
  const items = Array.from(root.querySelectorAll<HTMLElement>("li[data-slug]"));
  if (!track || !sticky || !plate || items.length === 0) return () => {};
  const slides = new Map<string, HTMLElement>();
  plate.querySelectorAll<HTMLElement>("[data-slide]").forEach((s) => slides.set(s.dataset.slide ?? "", s));
  const bar = document.querySelector<HTMLElement>("[data-bar]");
  const section = root.closest<HTMLElement>("section") ?? root;
  const heading = section.querySelector<HTMLElement>("h2") ?? root;
  const slugOf = (li: HTMLElement) => li.dataset.slug ?? "";

  // ── Geometry, in the index's own coordinates (offsets ignore transforms,
  //    so rows mid-entrance measure where they will rest). ──
  let mids: number[] = []; // each title's cap middle
  let tops: number[] = [];
  let bottoms: number[] = [];
  let metas: [number, number][] = []; // each metric block's top and bottom
  let plateH = 0;
  let bandTop = 0;
  let bandBottom = 0;
  const offsetIn = (el: HTMLElement) => {
    let y = 0;
    for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) y += e.offsetTop;
    return y;
  };
  const measure = () => {
    plateH = sticky.offsetHeight;
    mids = items.map((li) => {
      const h = li.querySelector<HTMLElement>("h3") ?? li;
      return offsetIn(h) + parseFloat(getComputedStyle(h).fontSize) * CAP_MID;
    });
    tops = items.map((li) => offsetIn(li));
    bottoms = items.map((li, i) => tops[i] + li.offsetHeight);
    metas = items.map((li) => {
      const m = li.querySelector<HTMLElement>("[data-meta]");
      const top = m ? offsetIn(m) : 0;
      return [top, top + (m?.offsetHeight ?? 0)];
    });
    // The stage band: from the H2's cap line to the chapter's end (hard cuts).
    // (rects of untransformed boxes; the H2's entrance rise is taken out)
    const hs = getComputedStyle(heading);
    const rise = new DOMMatrixReadOnly(hs.transform === "none" ? undefined : hs.transform).m42;
    const r = root.getBoundingClientRect().top;
    bandTop = heading.getBoundingClientRect().top - rise + parseFloat(hs.fontSize) * H2_CAP - r;
    bandBottom = section.getBoundingClientRect().bottom - r;
    root.style.setProperty("--band-top", `${bandTop}px`);
    root.style.setProperty("--band-h", `${bandBottom - bandTop}px`);
    // The plate's track: from 32px under the band's top edge (beside the
    // H2) to where it stands on the last row's middle.
    const trackTop = bandTop + 2 * EDGE;
    root.style.setProperty("--track-top", `${trackTop}px`);
    root.style.setProperty("--track-h", `${mids[mids.length - 1] + plateH / 2 - trackTop}px`);
  };
  const rootTop = () => root.getBoundingClientRect().top;
  const baseTop = () => sticky.getBoundingClientRect().top; // the plate's top without its offset
  const barBottom = () => Math.max(0, bar?.getBoundingClientRect().bottom ?? 0);

  // ── State ──
  let offset = 0; // the plate's transform, px
  let vel = 0;
  let target = 0;
  let raf = 0;
  let last = 0;
  let on = false; // shown
  let hand: "pointer" | "focus" | null = null; // what put the plate where it is
  let anchor: HTMLElement | null = null; // the row the hand chose
  let hot: HTMLElement | null = null; // the row answering the pointer (cue, parted mark)
  let shown = ""; // the slug on the plate
  let want = ""; // a picture waiting for its dwell
  let wantTimer = 0;
  let dismissed: HTMLElement | null = null; // Esc: hidden until another row is chosen
  let isDismissed = false;
  let pointer: Point | null = null;
  let prev: Point | null = null;
  let intentTimer = 0;
  let intentSince = 0;
  let settleTimer = 0;
  let frame = 0;
  let leaving = false; // a row was activated: the page is on its way to the case

  // ── Metric blocks under the plate are gone in the frame it covers them
  //    (never a figure cut by its edge) and fade back once it has left. ──
  let covering = false; // shown, or still fading out
  let coverTimer = 0;
  const cover = () => {
    const top = baseTop() + offset - rootTop();
    for (let i = 0; i < items.length; i++) {
      const under = covering && metas[i][1] > top + 4 && metas[i][0] < top + plateH - 4;
      if (under !== items[i].hasAttribute("data-under")) items[i].toggleAttribute("data-under", under);
    }
  };

  // ── The spring (critically damped, solved exactly per frame) ──
  const render = () => {
    plate.style.transform = offset ? `translate3d(0, ${Math.round(offset * 10) / 10}px, 0)` : "";
    cover();
  };
  const tick = (now: number) => {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    const e = offset - target;
    const b = vel + OMEGA * e;
    const decay = Math.exp(-OMEGA * dt);
    offset = target + (e + b * dt) * decay;
    vel = (vel - OMEGA * b * dt) * decay;
    if (Math.abs(offset - target) < 0.25 && Math.abs(vel) < 2) {
      offset = target;
      vel = 0;
    }
    render();
    raf = offset === target && vel === 0 ? 0 : requestAnimationFrame(tick);
  };
  const jump = (to: number) => {
    target = to;
    cancelAnimationFrame(raf);
    raf = 0;
    offset = to;
    vel = 0;
    render();
  };
  const glide = (to: number) => {
    if (prefersReducedMotion()) return jump(to);
    target = to;
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  // ── Where the plate may stand: under the bar, over the viewport's bottom,
  //    and inside the chapter (never above its H2, never past its end). ──
  const clampOffset = (o: number) => {
    const b = baseTop();
    const lo = barBottom() + EDGE - b;
    const hi = window.innerHeight - EDGE - plateH - b;
    let v = Math.min(Math.max(o, lo), Math.max(lo, hi));
    const r = rootTop();
    const sLo = r + bandTop + 2 * EDGE - b;
    const sHi = r + bandBottom - 2 * EDGE - plateH - b;
    v = Math.min(Math.max(v, sLo), Math.max(sLo, sHi));
    return v;
  };
  /** Pointer: the plate's middle on the row's (title cap) middle. */
  const centreOn = (i: number) => clampOffset(rootTop() + mids[i] - plateH / 2 - baseTop());
  /** Keyboard: right under the focused row, else right over it, so its ring and number stay clear. */
  const nextTo = (i: number) => {
    const r = rootTop();
    const b = baseTop();
    const under = r + bottoms[i] + RING_ROOM;
    if (under + plateH <= window.innerHeight - EDGE) return under - b;
    const over = r + tops[i] - RING_ROOM - plateH;
    if (over >= barBottom() + EDGE) return over - b;
    return centreOn(i);
  };
  /** The row whose middle is nearest the plate's middle (a 12px hysteresis). */
  const besidePlate = () => {
    const c = baseTop() + offset + plateH / 2 - rootTop();
    let best = 0;
    for (let i = 1; i < mids.length; i++) if (Math.abs(mids[i] - c) < Math.abs(mids[best] - c)) best = i;
    const cur = items.findIndex((li) => slugOf(li) === shown);
    if (cur >= 0 && Math.abs(mids[cur] - c) - Math.abs(mids[best] - c) < 12) return items[cur];
    return items[best];
  };
  /** The row under a point (not through the plate), or null. */
  const rowAt = (p: Point | null) => {
    if (!p) return null;
    const el = document.elementFromPoint(p.x, p.y);
    if (!el || plate.contains(el) || !root.contains(el)) return null;
    return el.closest<HTMLElement>("li[data-slug]");
  };
  const overPlate = (p: Point | null) => {
    if (!p || !on) return false;
    const el = document.elementFromPoint(p.x, p.y);
    return !!el && plate.contains(el);
  };

  // ── Pictures: a cross-dissolve (Work.module.css .slide), or a cut. ──
  const swap = (slug: string, instant = false) => {
    window.clearTimeout(wantTimer);
    wantTimer = 0;
    want = "";
    if (slug === shown) return;
    shown = slug;
    if (instant) plate.setAttribute("data-instant", "");
    slides.forEach((s, key) => s.toggleAttribute("data-on", key === slug));
    cue();
    if (instant) twoFrames(() => plate.removeAttribute("data-instant"));
  };
  /** Show `slug` once it is still the right one after `ms` (a skim never flashes the rows it crosses). */
  const swapAfter = (slug: string, ms: number, still: () => boolean) => {
    if (slug === shown) {
      window.clearTimeout(wantTimer);
      want = "";
      return;
    }
    if (slug === want) return;
    want = slug;
    window.clearTimeout(wantTimer);
    wantTimer = window.setTimeout(() => {
      wantTimer = 0;
      if (want === slug && still()) swap(slug);
      else if (want === slug) want = "";
    }, ms);
  };

  // The row the plate shows steps toward it (the cue): the pointer's row
  // first, else the row whose picture is on the plate.
  let cued: HTMLElement | null = null;
  const cue = () => {
    const li = hot ?? (on ? (items.find((l) => slugOf(l) === shown) ?? null) : null);
    if (cued === li) return;
    cued?.removeAttribute("data-cue");
    cued = li;
    li?.setAttribute("data-cue", "");
  };
  const setHot = (li: HTMLElement | null) => {
    if (hot === li) return;
    hot?.removeAttribute("data-hot");
    hot = li;
    li?.setAttribute("data-hot", "");
    cue();
  };

  const show = (instant: boolean) => {
    if (on) return;
    on = true;
    window.clearTimeout(coverTimer);
    covering = true;
    plate.hidden = false;
    if (instant) plate.setAttribute("data-instant", "");
    plate.dataset.state = "on";
    cover();
    cue();
    if (instant) twoFrames(() => plate.removeAttribute("data-instant"));
  };
  const hide = () => {
    if (!on) return;
    on = false;
    window.clearTimeout(wantTimer);
    want = "";
    plate.dataset.state = "off";
    cue();
    // The covered numbers return once the plate has gone (160ms).
    window.clearTimeout(coverTimer);
    coverTimer = window.setTimeout(() => {
      covering = false;
      cover();
    }, prefersReducedMotion() ? 0 : 160);
  };

  /** A pointer chose `li`: the plate glides to it, its picture follows the dwell. */
  const choosePointer = (li: HTMLElement, settled: boolean) => {
    if (isDismissed && li === dismissed) return;
    isDismissed = false;
    dismissed = null;
    hand = "pointer";
    anchor = li;
    setHot(li);
    const i = items.indexOf(li);
    if (!on) {
      // From nothing: it opens on its row, with its picture.
      jump(centreOn(i));
      swap(slugOf(li), true);
      show(false);
      return;
    }
    glide(centreOn(i));
    if (settled) swap(slugOf(li));
    else swapAfter(slugOf(li), DWELL, () => anchor === li && hot === li);
  };
  /** Keyboard focus chose `li`: position and picture change in one frame. */
  const chooseFocus = (li: HTMLElement) => {
    isDismissed = false;
    dismissed = null;
    hand = "focus";
    anchor = li;
    jump(nextTo(items.indexOf(li)));
    swap(slugOf(li), true);
    show(true);
  };

  /** Is the pointer, moving from a to b, heading for the plate's left edge? */
  const headingForPlate = (a: Point | null, b: Point) => {
    if (!a || !on) return false;
    const dx = b.x - a.x;
    if (dx <= 0) return false;
    const r = plate.getBoundingClientRect();
    if (b.x >= r.left) return false;
    const y = b.y + ((b.y - a.y) / dx) * (r.left - b.x);
    return y >= r.top && y <= r.bottom;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    const p = { x: e.clientX, y: e.clientY };
    const still = pointer !== null && Math.abs(p.x - pointer.x) + Math.abs(p.y - pointer.y) < 1;
    prev = pointer;
    pointer = p;
    if (still || settleTimer) return; // made up by a scroll under a resting pointer
    leaving = false;
    const el = e.target instanceof Element ? e.target : null;
    if (el && plate.contains(el)) {
      // Hovering the plate keeps it, and keeps its row answering.
      window.clearTimeout(intentTimer);
      intentTimer = 0;
      if (anchor && hand === "pointer") setHot(anchor);
      return;
    }
    const li = el && root.contains(el) ? el.closest<HTMLElement>("li[data-slug]") : null;
    if (!li) {
      setHot(null); // off the rows: the plate stays where it is
      return;
    }
    if (li === anchor && hand === "pointer" && on) {
      setHot(li);
      return;
    }
    // On its way to the plate the pointer may cross a row: give it 150ms.
    const now = performance.now();
    if (anchor && headingForPlate(prev, p) && (!intentTimer || now - intentSince < INTENT)) {
      if (!intentTimer) intentSince = now;
      window.clearTimeout(intentTimer);
      intentTimer = window.setTimeout(() => {
        intentTimer = 0;
        if (overPlate(pointer)) return;
        const row = rowAt(pointer);
        if (row && row !== anchor) choosePointer(row, false);
      }, Math.max(0, INTENT - (now - intentSince)));
      return;
    }
    window.clearTimeout(intentTimer);
    intentTimer = 0;
    choosePointer(li, false);
  };
  const onPointerOut = (e: PointerEvent) => {
    if (e.relatedTarget !== null) return; // still in the window
    pointer = null;
    prev = null;
    setHot(null);
  };

  const focusedRow = () => {
    const el = document.activeElement;
    return el instanceof HTMLElement && root.contains(el) && el.matches(":focus-visible")
      ? el.closest<HTMLElement>("li[data-slug]")
      : null;
  };
  const onFocusIn = (e: FocusEvent) => {
    const el = e.target instanceof HTMLElement ? e.target : null;
    const li = el?.closest<HTMLElement>("li[data-slug]");
    if (!el || !li || !el.matches(":focus-visible")) return;
    leaving = false;
    chooseFocus(li);
  };
  const onFocusOut = (e: FocusEvent) => {
    const next = e.relatedTarget;
    if (leaving || (next instanceof Node && root.contains(next))) return;
    if (hand === "focus") hand = null; // the plate stays; the list's scroll moves its picture again
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Escape" || !on) return;
    const inPlay = hand !== null || hot !== null || root.contains(document.activeElement);
    if (!inPlay) return;
    isDismissed = true;
    dismissed = anchor ?? hot;
    hide();
  };

  /** Activation: the plate goes at once; the chosen row keeps its parted mark. */
  const removeNow = () => {
    leaving = true;
    root.setAttribute("data-instant", "");
    on = false;
    window.clearTimeout(wantTimer);
    window.clearTimeout(intentTimer);
    cancelAnimationFrame(raf);
    raf = 0;
    plate.hidden = true;
    covering = false;
    window.clearTimeout(coverTimer);
    cover();
  };
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const el = e.target instanceof Element ? e.target : null;
    if (!el) return;
    if (plate.contains(el)) {
      // The plate previews a row: a click on it opens that case.
      const li = items.find((l) => slugOf(l) === shown);
      const a = li?.querySelector<HTMLAnchorElement>("a");
      if (!li || !a) return;
      setHot(li);
      removeNow();
      a.click();
      return;
    }
    const li = el.closest<HTMLElement>("li[data-slug]");
    if (li && el.closest("a") && root.contains(li)) {
      setHot(li);
      removeNow();
    }
  };

  // ── Scrolling: the plate stands still (sticky) and shows the row beside
  //    it, or the row under a resting pointer; once the scroll has settled,
  //    that row takes the plate. ──
  const inSight = () => {
    const r = root.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };
  /** Never past the chapter's ends, even when the list's end carries the plate. */
  const keepInSection = () => {
    if (!offset) return;
    const o = clampOffset(offset);
    const b = baseTop();
    const top = b + offset;
    const r = rootTop();
    const sLo = r + bandTop + 2 * EDGE;
    const sHi = r + bandBottom - 2 * EDGE;
    if ((top < sLo || top + plateH > sHi) && Math.abs(o - offset) > 0.5) jump(o);
  };
  const scrollFrame = () => {
    frame = 0;
    if (leaving || !inSight()) return;
    keepInSection();
    cover();
    if (!on || hand === "focus") return;
    const under = rowAt(pointer);
    const li = under ?? besidePlate();
    swapAfter(slugOf(li), SCROLL_DWELL, () => (rowAt(pointer) ?? besidePlate()) === li);
  };
  const settle = () => {
    window.clearTimeout(settleTimer);
    settleTimer = 0;
    if (leaving || !inSight()) return;
    if (!isDismissed) {
      const under = rowAt(pointer);
      if (under) {
        choosePointer(under, true);
        return;
      }
    }
    if (hand === "focus" && anchor && focusedRow() === anchor) return;
    if (hand === "pointer") hand = null;
    anchor = null;
    if (on) swap(slugOf(besidePlate()));
  };
  const onScroll = () => {
    if (settleTimer === 0) setHot(null); // the pointer no longer chose that row: the row it rests on will
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, SETTLE);
    if (!frame) frame = requestAnimationFrame(scrollFrame);
  };
  const onScrollEnd = () => {
    if (settleTimer) settle();
  };

  // ── Layout changes (fonts, resize): measure again and stand at once. ──
  let relayoutFrame = 0;
  const relayout = () => {
    relayoutFrame = 0;
    measure();
    const focused = focusedRow();
    if (hand === "focus" && focused) jump(nextTo(items.indexOf(focused)));
    else if (hand === "pointer" && anchor) jump(centreOn(items.indexOf(anchor)));
    else jump(clampOffset(offset));
    if (on && !hand) swap(slugOf(besidePlate()), true);
  };
  const ro = new ResizeObserver(() => {
    if (!relayoutFrame) relayoutFrame = requestAnimationFrame(relayout);
  });

  // Back/forward cache: the page returns with the plate removed and the
  // clicked row parted. Stand at rest before the reverse flight is captured.
  const onPageShow = (e: PageTransitionEvent) => {
    if (!e.persisted) return;
    leaving = false;
    pointer = null;
    hand = null;
    anchor = null;
    setHot(null);
    plate.hidden = false;
    show(true);
    measure();
    jump(0);
    swap(slugOf(besidePlate()), true);
    twoFrames(() => root.removeAttribute("data-instant"));
  };

  // ── Start: the plate stands at rest beside the H2 with the first row's
  //    picture; its first appearance is the chapter's entrance (Reveal). Its
  //    seven pictures load now (small files), so no swap waits on the network. ──
  plate.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
    img.loading = "eager";
  });
  measure();
  show(true);
  jump(0);
  swap(slugOf(besidePlate()), true);
  ro.observe(root);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerout", onPointerOut, { passive: true });
  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("focusout", onFocusOut);
  root.addEventListener("click", onClick, true);
  document.addEventListener("keydown", onKey);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", onScrollEnd, { passive: true });
  window.addEventListener("pageshow", onPageShow);

  return () => {
    ro.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerout", onPointerOut);
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("focusout", onFocusOut);
    root.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("scrollend", onScrollEnd);
    window.removeEventListener("pageshow", onPageShow);
    cancelAnimationFrame(raf);
    cancelAnimationFrame(frame);
    cancelAnimationFrame(relayoutFrame);
    window.clearTimeout(wantTimer);
    window.clearTimeout(intentTimer);
    window.clearTimeout(settleTimer);
    window.clearTimeout(coverTimer);
    setHot(null);
    for (const li of items) li.removeAttribute("data-under");
    for (const li of items) li.removeAttribute("data-cue");
    slides.forEach((s) => s.removeAttribute("data-on"));
    root.removeAttribute("data-instant");
    plate.dataset.state = "off";
    plate.hidden = false;
    plate.removeAttribute("data-instant");
    plate.style.transform = "";
    for (const v of ["--track-top", "--track-h", "--band-top", "--band-h"]) root.style.removeProperty(v);
  };
}
