"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { revealTravel } from "@/lib/inView";
import {
  DURATION,
  prefersReducedMotion,
  REVEAL_CASCADE_MAX,
  REVEAL_EVENT,
  REVEAL_LINE,
  STAGGER,
} from "@/lib/motion";

/**
 * Chapter entrances (01-system.md §5.2 item 7): the parts of a chapter
 * arrive in reading order, rising 24px with opacity (900ms transform, 700ms
 * opacity, out curve), staggered 70ms, once.
 *
 *   <Reveal as="section" id="work" data-field="paper" aria-labelledby="work-h2">
 *     <h2 data-reveal id="work-h2">…</h2>
 *     <p data-reveal>…</p>
 *     <figure data-reveal="settle">…</figure>
 *   </Reveal>
 *
 * - Mark each part with data-reveal: "" rise 24px · "fade" opacity only ·
 *   "settle" scale from 0.94 over 1200ms (plates) · "ui" rise 8px.
 * - A part starts when its top crosses the reveal line (92% of the viewport
 *   height), measured on its untransformed box: the hidden rise never delays
 *   it. Parts already in the viewport when they mount arrive at once (a deep
 *   link, a reload mid-page, a part at the bottom of the first screen).
 *   `line` on <Reveal> or data-reveal-line="1" on a part moves the line (1 =
 *   the viewport's bottom, for parts held in a pinned 100svh stage);
 *   data-reveal-threshold="0.3" asks for that share of the part in view.
 * - ONE queue for the page: parts that enter together, in any root (a Stage
 *   inside a section, a nested list), stagger in document order, and a later
 *   batch never starts before the cascade still running (a release clock),
 *   capped at 5 parts so a fast scroll never builds a queue.
 * - Each part fires REVEAL_EVENT ("trema:reveal", detail.delay) when its
 *   entrance starts: onceRevealedInView (lib/inView) parts a pair after its
 *   row has risen.
 * - Visible without JS, and under reduced motion (no hidden state at all).
 *   Hidden states exist only under html.js (globals.css).
 * - Parts inside a nested <Reveal> belong to that one.
 * - Never put data-reveal on an element whose transform you animate
 *   elsewhere while it reveals; wrap it instead.
 */
type RevealTag =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "ul"
  | "ol"
  | "li"
  | "figure"
  | "span"
  | "p"
  | "dl";

type DataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined };

export type RevealProps = HTMLAttributes<HTMLElement> &
  DataAttributes & {
    as?: RevealTag;
    /** Delay between parts entering together, in ms. Default 70 (§5.1). */
    stagger?: number;
    /** The reveal line as a share of the viewport height. Default 0.92; 1 for a pinned stage. */
    line?: number;
    children?: ReactNode;
    style?: CSSProperties;
  };

export function Reveal({ as = "div", stagger = STAGGER.chapter, line, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, stagger, line);
  const Tag = as as ElementType;
  return (
    <Tag ref={ref} data-reveal-root="" {...rest}>
      {children}
    </Tag>
  );
}

/* ── The engine: one queue and one set of observers for the page ───────── */
interface Part {
  el: HTMLElement;
  stagger: number;
  line: number;
  io: IntersectionObserver | null;
  queued: boolean;
  timer: number;
}

const parts = new Map<HTMLElement, Part>();
const observers = new Map<string, IntersectionObserver>();
let queue: Part[] = [];
let frame = 0;
let clock = -Infinity;
let builtFor = 0;
let resizeTimer = 0;

const byDocumentOrder = (a: Part, b: Part) =>
  a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/** How far the hidden state moves the part's top down (rise, or a settle's scale), px. */
const travelOf = revealTravel;

function onEntries(entries: IntersectionObserverEntry[]) {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const part = parts.get(e.target as HTMLElement);
    if (!part || part.queued) continue;
    part.io?.unobserve(part.el);
    part.io = null;
    enqueue(part);
  }
}

function observe(part: Part) {
  const vh = window.innerHeight;
  const explicit = parseFloat(part.el.dataset.revealThreshold ?? "");
  const threshold = Number.isFinite(explicit) ? Math.min(1, Math.max(0, explicit)) : 0;
  const cut = Math.round(vh * (1 - part.line) - travelOf(part.el));
  const key = `${threshold}|${cut}`;
  let io = observers.get(key);
  if (!io) {
    io = new IntersectionObserver(onEntries, { threshold, rootMargin: `0px 0px ${-cut}px 0px` });
    observers.set(key, io);
  }
  part.io = io;
  io.observe(part.el);
}

/** The line is in px (it compensates each part's own travel): rebuild it when the viewport's height really changes. */
function onResize() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if (Math.abs(window.innerHeight - builtFor) < 50) return;
    builtFor = window.innerHeight;
    observers.forEach((io) => io.disconnect());
    observers.clear();
    parts.forEach((p) => {
      if (p.io) observe(p);
    });
  }, 150);
}

function enqueue(part: Part) {
  part.queued = true;
  queue.push(part);
  if (!frame) frame = requestAnimationFrame(flush);
}

function flush() {
  frame = 0;
  const batch = queue.sort(byDocumentOrder);
  queue = [];
  const now = performance.now();
  for (const part of batch) {
    const el = part.el;
    if (!el.isConnected) {
      parts.delete(el);
      continue;
    }
    const start = Math.min(Math.max(now, clock + part.stagger), now + part.stagger * (REVEAL_CASCADE_MAX - 1));
    clock = start;
    const delay = Math.round(start - now);
    el.style.setProperty("--reveal-delay", `${delay}ms`);
    el.classList.add("is-revealing", "is-in");
    el.dispatchEvent(new CustomEvent(REVEAL_EVENT, { detail: { delay } }));
    part.timer = window.setTimeout(() => {
      el.classList.remove("is-revealing");
      el.style.removeProperty("--reveal-delay");
      parts.delete(el);
    }, delay + DURATION.settle + 100);
  }
}

function release(el: HTMLElement) {
  const part = parts.get(el);
  if (!part) return;
  part.io?.unobserve(el);
  if (part.queued && queue.includes(part)) queue = queue.filter((p) => p !== part);
  window.clearTimeout(part.timer);
  el.classList.remove("is-revealing");
  el.style.removeProperty("--reveal-delay");
  parts.delete(el);
}

/** The same behaviour on an element you render yourself (it must carry data-reveal-root). */
export function useReveal(
  ref: RefObject<HTMLElement | null>,
  stagger: number = STAGGER.chapter,
  line: number = REVEAL_LINE,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (el) => el.closest("[data-reveal-root]") === root && !el.classList.contains("is-in"),
    );
    if (prefersReducedMotion()) {
      for (const el of items) el.classList.add("is-in");
      return;
    }
    if (!builtFor) {
      builtFor = window.innerHeight;
      window.addEventListener("resize", onResize, { passive: true });
    }
    const vh = window.innerHeight;
    for (const el of items) {
      if (parts.has(el)) continue;
      const own = parseFloat(el.dataset.revealLine ?? "");
      const part: Part = { el, stagger, line: Number.isFinite(own) ? own : line, io: null, queued: false, timer: 0 };
      parts.set(el, part);
      const r = el.getBoundingClientRect();
      const travel = travelOf(el);
      // Already on screen (untransformed): arrive now, with the rest of this frame.
      if (r.height > 0 && r.top - travel < vh && r.bottom - travel > 0) enqueue(part);
      else observe(part);
    }
    return () => items.forEach(release);
  }, [ref, stagger, line]);
}
