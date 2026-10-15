"use client";

import { useRef, type PointerEvent, type RefObject } from "react";
import { canHover, EASE, prefersReducedMotion } from "@/lib/motion";

/** At most one replay every 2s. */
const REPLAY_GAP = 2000;
/** An entry made by the pointer itself is followed by its move within a frame or so. */
const SAME_GESTURE = 60;

/**
 * The month answers a hovering mouse (01 §6.3's replay, for the month): the
 * days lift and settle once more in their arrival order (a 6px wave, 520ms
 * in-out, each dot at its own entrance delay). It runs only when:
 * - the pointer is a mouse on a device that can hover;
 * - the entry was made by moving the pointer: its move arrives with the
 *   entry, which never happens when the page scrolls under a resting
 *   pointer (that entry stays unarmed until the pointer leaves and comes
 *   back);
 * - the entrance has settled (data-settled on the figure), so a replay can
 *   never cut it short; a dot still running anything is left alone;
 * - reduced motion is off, and 2s have passed since the last replay.
 */
export function useReplay(figure: RefObject<HTMLElement | null>) {
  const enteredAt = useRef(0);
  const lastReplay = useRef(-Infinity);

  const onPointerEnter = (e: PointerEvent<HTMLElement>) => {
    enteredAt.current = e.pointerType === "mouse" ? performance.now() : 0;
  };

  const onPointerLeave = () => {
    enteredAt.current = 0;
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = figure.current;
    const entered = enteredAt.current;
    enteredAt.current = 0;
    if (!el || !entered || e.pointerType !== "mouse") return;
    if (e.movementX === 0 && e.movementY === 0) return;
    if (performance.now() - entered > SAME_GESTURE) return;
    if (!el.hasAttribute("data-settled") || prefersReducedMotion() || !canHover()) return;
    const now = performance.now();
    if (now - lastReplay.current < REPLAY_GAP) return;
    lastReplay.current = now;
    el.querySelectorAll<HTMLElement>("[data-t]").forEach((dot) => {
      if (dot.getAnimations().some((a) => a.playState === "running")) return;
      dot.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: "translate3d(0, -6px, 0)", offset: 0.4 },
          { transform: "translate3d(0, 0, 0)" },
        ],
        { duration: 520, delay: Number(dot.dataset.t), easing: EASE.inOut },
      );
    });
  };

  return { onPointerEnter, onPointerLeave, onPointerMove };
}
