"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { onceInView } from "@/lib/inView";
import { REVEAL_EVENT, prefersReducedMotion } from "@/lib/motion";

/**
 * When the chapter's other parts may start, counted from the route's own
 * start, and the step between the parts of one slot (ms). The route's three
 * beats end with the caption at 720ms (About.module.css: 3 × 120ms +
 * 360ms). On a phone the places' details are parts of their own: each
 * waits for its dot, as the labels do on wider screens (360ms, then 120ms
 * apart). Then the statement, the CV line and the ledger's columns, left to
 * right, their rows 45ms apart (02 §8.4: the columns rise in reading order).
 */
const SLOTS: Record<string, { after: number; step: number }> = {
  stop: { after: 360, step: 120 },
  statement: { after: 760, step: 0 },
  cv: { after: 830, step: 0 },
  exp: { after: 900, step: 45 },
  facts: { after: 970, step: 45 },
};
/** Parts that start later than this after the route keep their own delay. */
const ROUTE_SPAN = 900;

/**
 * The route: the chapter's one reveal part (data-reveal="route"), holding
 * the H2's three words and the stops. About.module.css plays its places
 * from its start, one beat each. This component keeps the rest of the
 * chapter in reading order and walks the places under reduced motion:
 *
 * 1. Holds. <Reveal>'s queue staggers parts that enter together by 70ms;
 *    the route's own beats run for 720ms, so a phone's place details, the
 *    statement, the CV line or a ledger row that enters with it (a deep
 *    link, a reload, a fast scroll) would land before what it follows. Each part announces its
 *    start (REVEAL_EVENT, the queue's own signal); one that starts within
 *    ROUTE_SPAN of the route gets `--hold`, the wait until its slot. The
 *    CSS adds it to the part's delay and declares the part's transition
 *    for its whole life, so the queue's cleanup never cuts it short.
 * 2. Reduced motion. Nothing travels; the order is still the information,
 *    so a route that is below the screen at load fades its places in one
 *    after the other as soon as any of it shows (200ms each, 01 §5.4).
 *    A page opened on the route is simply drawn.
 *
 * No JS, a failed boot or print: everything shows (the hidden states live
 * under html.js and @media screen).
 */
export function RouteWalk({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const route = ref.current;
    const root = route?.closest<HTMLElement>("[data-reveal-root]");
    if (!route || !root) return;

    if (prefersReducedMotion()) {
      if (route.getBoundingClientRect().top < window.innerHeight) return;
      root.setAttribute("data-walk", "pending");
      const cancel = onceInView(route, () => root.setAttribute("data-walk", "go"), {
        threshold: 0,
        rootMargin: "0px",
      });
      return () => {
        cancel();
        root.removeAttribute("data-walk");
      };
    }

    let routeAt = Number.NEGATIVE_INFINITY;
    const rows = new Map<string, number>();
    let frame = 0;
    const onReveal = (event: Event) => {
      const part = event.target;
      if (!(part instanceof HTMLElement)) return;
      const delay = (event as CustomEvent<{ delay?: number }>).detail?.delay ?? 0;
      const start = performance.now() + delay;
      if (part === route) {
        routeAt = start;
        return;
      }
      if (start > routeAt + ROUTE_SPAN) return;
      const slot = part.closest<HTMLElement>("[data-slot]");
      const key = slot?.dataset.slot ?? "";
      const timing = SLOTS[key];
      if (!slot || !timing || !root.contains(slot)) return;
      // Parts of one batch announce themselves in document order, in one frame.
      const n = rows.get(key) ?? 0;
      rows.set(key, n + 1);
      if (!frame) {
        frame = requestAnimationFrame(() => {
          rows.clear();
          frame = 0;
        });
      }
      const hold = Math.round(routeAt + timing.after + n * timing.step - start);
      if (hold > 0) part.style.setProperty("--hold", `${hold}ms`);
    };
    // REVEAL_EVENT does not bubble: listen in the capture phase.
    root.addEventListener(REVEAL_EVENT, onReveal, true);
    return () => {
      root.removeEventListener(REVEAL_EVENT, onReveal, true);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} data-reveal="route" className={className}>
      {children}
    </div>
  );
}
