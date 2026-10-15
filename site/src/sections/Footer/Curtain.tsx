"use client";

import { useEffect, useRef } from "react";
import { clearFit, fitCurtain } from "./curtainFit";

/**
 * The curtain's behaviour (01 §7.15), from inside the footer:
 *
 * 1. Keyboard focus (WCAG 2.2, 2.4.11). When a link in the footer takes
 *    keyboard focus while <main> still covers it, or while it sits below the
 *    fold, the page goes to its end at once, where the curtain has fully
 *    lifted: tab focus moves instantly, never through a smooth scroll (§5.1).
 *    The CSS (:has(:focus-visible) puts the footer in flow) is the no-JS half
 *    of the same rule. Pointer focus never matches :focus-visible on a link,
 *    so a click does not move the page.
 * 2. The end frame (curtainFit.ts): the footer takes the least height at
 *    which the band under the bar starts on empty field or on a whole group,
 *    without stretching its own composition (the extra goes over the name,
 *    capped, then to a hem in the close's colour); refreshed on resize, at
 *    fonts-ready and whenever <main> changes height.
 * 3. The ground. Once the close has lifted off the footer, the root's
 *    background turns ink, so the rubber band at the end of the page (macOS
 *    trackpads, iOS) continues the footer instead of showing paper under it.
 *    At the top of the page it stays paper.
 */
export function Curtain() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const footer = ref.current?.closest("footer");
    if (!footer) return;
    const main = document.querySelector<HTMLElement>("[data-curtain-main]");
    const html = document.documentElement;

    const onFocusIn = (e: FocusEvent) => {
      const el = e.target;
      if (!(el instanceof HTMLElement) || !el.matches(":focus-visible")) return;
      const r = el.getBoundingClientRect();
      const covered = main ? main.getBoundingClientRect().bottom > r.top : false;
      if (covered || r.bottom > window.innerHeight || r.top < 0) {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      }
    };
    footer.addEventListener("focusin", onFocusIn);
    if (!main) return () => footer.removeEventListener("focusin", onFocusIn);

    let alive = true;
    let ground: IntersectionObserver | null = null;
    const setGround = (ink: boolean) => {
      if (ink) html.style.setProperty("background-color", "var(--ink)");
      else html.style.removeProperty("background-color");
    };
    // A one-pixel line at the foot of the viewport: main leaves it when the
    // close has lifted off the footer.
    const watchGround = () => {
      ground?.disconnect();
      ground = null;
      const vh = window.innerHeight;
      if (main.offsetHeight <= vh) return setGround(false);
      ground = new IntersectionObserver(
        ([e]) => setGround(!e.isIntersecting && e.boundingClientRect.bottom < vh),
        { rootMargin: `-${vh - 1}px 0px 0px 0px`, threshold: 0 },
      );
      ground.observe(main);
    };

    let raf = 0;
    let size = "";
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!alive) return;
        fitCurtain(footer, main);
        const now = `${window.innerWidth}x${window.innerHeight}x${main.offsetHeight > window.innerHeight}`;
        if (now !== size) {
          size = now;
          watchGround();
        }
      });
    };
    refresh();
    const ro = new ResizeObserver(refresh);
    ro.observe(main);
    window.addEventListener("resize", refresh);
    document.fonts?.ready.then(refresh, () => {});

    return () => {
      alive = false;
      footer.removeEventListener("focusin", onFocusIn);
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", refresh);
      ground?.disconnect();
      setGround(false);
      clearFit(footer);
    };
  }, []);

  return <span ref={ref} hidden />;
}
