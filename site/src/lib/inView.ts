/**
 * Once-only viewport triggers (01-system.md §5.2 item 4): one shared
 * IntersectionObserver per option set, never a scroll listener, never
 * replayed on re-entry. Browser-only; call from effects.
 */
import { PART_AFTER_REVEAL, PART_OBSERVER, REVEAL_EVENT, REVEAL_LINE, REVEAL_OBSERVER } from "./motion";

type Callback = (entry: IntersectionObserverEntry) => void;

/**
 * How far a [data-reveal] part's hidden entrance state moves its top down, in
 * px (its rise, or a settle's scale about its origin); 0 once it has arrived
 * or when it carries no hidden transform. The reveal line is measured on the
 * untransformed box, so this is added back.
 */
export function revealTravel(el: Element): number {
  if (!(el instanceof HTMLElement) || !el.hasAttribute("data-reveal") || el.classList.contains("is-in")) return 0;
  const cs = getComputedStyle(el);
  if (!cs.transform || cs.transform === "none") return 0;
  const m = new DOMMatrixReadOnly(cs.transform);
  const originY = parseFloat(cs.transformOrigin.split(" ")[1] ?? "0") || 0;
  return m.f + (1 - m.d) * originY;
}

/** REVEAL_OBSERVER for this element: the chapter's line on its untransformed box. */
function revealLineFor(el: Element): IntersectionObserverInit {
  const travel = revealTravel(el);
  if (Math.abs(travel) < 0.5) return REVEAL_OBSERVER;
  const cut = Math.round(window.innerHeight * (1 - REVEAL_LINE) - travel);
  return { threshold: 0, rootMargin: `0px 0px ${-cut}px 0px` };
}

interface Pool {
  io: IntersectionObserver;
  callbacks: Map<Element, Callback>;
}

const pools = new Map<string, Pool>();

function poolFor(options: IntersectionObserverInit): Pool {
  const key = `${String(options.threshold)}|${options.rootMargin ?? ""}`;
  let pool = pools.get(key);
  if (!pool) {
    const callbacks = new Map<Element, Callback>();
    const io = new IntersectionObserver((entries) => {
      // Deliver in document order so staggers follow reading order.
      const hits = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) =>
          a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
      for (const entry of hits) {
        const cb = callbacks.get(entry.target);
        if (!cb) continue;
        callbacks.delete(entry.target);
        io.unobserve(entry.target);
        cb(entry);
      }
    }, options);
    pool = { io, callbacks };
    pools.set(key, pool);
  }
  return pool;
}

/**
 * Call `onEnter` once, the first time `el` intersects. Returns a cleanup that
 * cancels the trigger if it has not fired yet. With REVEAL_OBSERVER (the
 * default) on a [data-reveal] part that is still hidden, the line is measured
 * on its untransformed box, exactly as <Reveal> does, so a part you release
 * yourself never waits for its own 24px rise.
 */
export function onceInView(
  el: Element,
  onEnter: Callback,
  options: IntersectionObserverInit = REVEAL_OBSERVER,
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    // Ancient browser: fire at once so nothing stays hidden.
    onEnter({ target: el, isIntersecting: true } as IntersectionObserverEntry);
    return () => {};
  }
  const pool = poolFor(options === REVEAL_OBSERVER ? revealLineFor(el) : options);
  pool.callbacks.set(el, onEnter);
  pool.io.observe(el);
  return () => {
    if (pool.callbacks.delete(el)) pool.io.unobserve(el);
  };
}

/**
 * One trigger per chapter (01 §5.2.7: "a figure rises and then its pair
 * parts"): call `onPart` once `el` is in view (40% by default) AND, when it
 * sits inside a [data-reveal] part that has not arrived yet, PART_AFTER_REVEAL
 * after that part starts its entrance (its stagger delay included). Outside
 * a revealing part it is plain onceInView. Pair (motion="entry"), PairMark
 * and TypeSetPair use it. Returns the cleanup.
 */
export function onceRevealedInView(
  el: Element,
  onPart: () => void,
  options: IntersectionObserverInit = PART_OBSERVER,
): () => void {
  const part = el.parentElement?.closest<HTMLElement>("[data-reveal]") ?? null;
  const managed =
    part !== null &&
    part.closest("[data-reveal-root]") !== null &&
    document.documentElement.classList.contains("js");
  if (!part || !managed || part.classList.contains("is-in")) return onceInView(el, () => onPart(), options);

  let revealAt = -1;
  let seen = false;
  let done = false;
  let timer = 0;
  const go = () => {
    if (done || revealAt < 0 || !seen) return;
    done = true;
    timer = window.setTimeout(onPart, Math.max(0, revealAt - performance.now()));
  };
  const revealed = (delay: number) => {
    if (revealAt >= 0) return;
    revealAt = performance.now() + delay + PART_AFTER_REVEAL;
    mo.disconnect();
    go();
  };
  const onReveal = (e: Event) => revealed((e as CustomEvent<{ delay?: number }>).detail?.delay ?? 0);
  // A section that reveals its part itself (no event) still releases it.
  const mo = new MutationObserver(() => {
    if (part.classList.contains("is-in")) revealed(parseFloat(part.style.getPropertyValue("--reveal-delay")) || 0);
  });
  mo.observe(part, { attributes: true, attributeFilter: ["class"] });
  part.addEventListener(REVEAL_EVENT, onReveal, { once: true });
  const stopView = onceInView(
    el,
    () => {
      seen = true;
      go();
    },
    options,
  );
  return () => {
    part.removeEventListener(REVEAL_EVENT, onReveal);
    mo.disconnect();
    stopView();
    window.clearTimeout(timer);
  };
}

/* ── Hover intent: a replay answers a real pointer, never a page scrolling
 * under a resting one, a touch, or keyboard focus. One shared pair of
 * listeners for the page. */
let pointerMoved = false;
let hoverListeners = 0;
const onPointerMove = (e: PointerEvent) => {
  if (e.pointerType !== "touch" && (e.movementX !== 0 || e.movementY !== 0)) pointerMoved = true;
};
const onPageScroll = () => {
  pointerMoved = false;
};

/**
 * Call `cb` when a fine pointer enters `target` after a real pointer move
 * (not after the page scrolled under a resting pointer). Nothing on touch,
 * nothing on focus. Returns the cleanup.
 */
export function onHoverIntent(target: Element, cb: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return () => {};
  }
  if (hoverListeners++ === 0) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onPageScroll, { passive: true });
  }
  const onEnter = (e: Event) => {
    if ((e as PointerEvent).pointerType === "touch" || !pointerMoved) return;
    cb();
  };
  target.addEventListener("pointerenter", onEnter);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    target.removeEventListener("pointerenter", onEnter);
    if (--hoverListeners === 0) {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onPageScroll);
    }
  };
}

/**
 * Watch a media query and get called on every change (and once at start).
 * Returns the unsubscribe function.
 */
export function watchMedia(query: string, onChange: (matches: boolean) => void): () => void {
  const mql = window.matchMedia(query);
  const handler = () => onChange(mql.matches);
  handler();
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}
