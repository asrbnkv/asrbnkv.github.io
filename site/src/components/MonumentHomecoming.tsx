"use client";

import { useEffect, useRef } from "react";
import { onceInView } from "@/lib/inView";

/**
 * The homecoming (01-system.md §6.5; 02 §11.2): the footer monument's two
 * orange dots drop into the ë (from −0.5em, 560ms out, the right dot 60ms
 * after the left; each switches on at once, hidden behind an edge), once per
 * page view.
 * Renders an empty marker inside the monument to find it.
 *
 * Under the curtain (01 §7.15) the sticky footer always sits inside the
 * viewport, hidden behind <main>: "visible" has to mean UNCOVERED. The page
 * lifts off the footer from the bottom up, so the reader sees the row, then
 * "Artem" with a bare e, and only then the air above it. The dots drop once
 * their whole landing spot and some air above it are uncovered: they fall
 * out from under the lifting orange edge of the close and settle in the ë,
 * in plain view. The air is one dot, or half of what the curtain will ever
 * uncover above the dots, whichever is less, so the line is always crossed
 * before the end of the page. A footer that is not sticky (the 404, short
 * windows, the lab) uses the plain 35% intersection.
 *
 * A reader who stops with the landing spot uncovered but the air above it
 * not yet (a wheel notch short of the line) gets the payoff after a 400ms
 * dwell: a second line at the spot itself starts a timer, which the curtain
 * covering the spot again cancels.
 *
 * Each dot waits wholly above the ink's top edge (--drop-from on the frame:
 * the landing spot's depth under that edge, plus one dot and a pixel; the
 * footer's clip hides it there). That edge is the highest the curtain's line
 * can ever reach, so at every width the dots fall out from under the orange
 * edge, cut by it, and never switch on in mid-air.
 *
 * The drop waits for the display face (html.fonts-ready, at most 700ms after
 * load), so the dots never land on a fallback e. Its timing lives in
 * Footer.module.css.
 */
export function MonumentHomecoming() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const frame = ref.current?.closest<HTMLElement>("[data-monument]");
    if (!frame || frame.hasAttribute("data-home")) return;
    const footer = frame.closest("footer");
    const main = document.querySelector<HTMLElement>("[data-curtain-main]");
    const html = document.documentElement;

    let done = false;
    let stop = () => {};
    let unwait = () => {};

    const land = () => {
      if (done) return;
      done = true;
      stop();
      const go = () => frame.setAttribute("data-home", "");
      if (html.classList.contains("fonts-ready")) {
        go();
        return;
      }
      const mo = new MutationObserver(() => {
        if (!html.classList.contains("fonts-ready")) return;
        mo.disconnect();
        go();
      });
      mo.observe(html, { attributes: true, attributeFilter: ["class"] });
      unwait = () => mo.disconnect();
    };

    /** The ink's top edge: the footer's top under the hem (curtainFit.ts). */
    const inkTop = (foot: Element) =>
      foot.getBoundingClientRect().top + (parseFloat(getComputedStyle(foot).borderTopWidth) || 0);

    /** The landing spot: the dot's box with whatever lift the hidden state applies undone. */
    const landing = (dot: HTMLElement) => {
      const r = dot.getBoundingClientRect();
      const lift = new DOMMatrixReadOnly(getComputedStyle(dot).transform).m42;
      return { top: r.top - lift, height: r.height };
    };

    /** Hides each dot wholly above the ink's top edge, where the footer clips it. */
    const hideAbove = (dot: HTMLElement, foot: Element) => {
      const spot = landing(dot);
      const from = Math.ceil(spot.top - inkTop(foot) + spot.height + 1);
      frame.style.setProperty("--drop-from", `${Math.max(0, from)}px`);
    };

    /** The trigger lines, in viewport px: where main's bottom edge must rise to. */
    const linesFor = (dot: HTMLElement, foot: HTMLElement) => {
      const { top, height } = landing(dot);
      const air = Math.min(height, 0.5 * (top - inkTop(foot)));
      const clamp = (y: number) => Math.round(Math.min(window.innerHeight - 1, Math.max(1, y)));
      return { drop: clamp(top - Math.max(0, air)), dwell: clamp(top) };
    };

    /** Calls `past` when main's bottom edge rises above `line`, `covered` when it is below. */
    const watch = (curtain: HTMLElement, line: number, past: () => void, covered?: () => void) => {
      // The viewport below the line: main leaves it when its bottom edge
      // rises past the line (the initial callback covers a page that loads
      // already scrolled to the end). No bottom margin, so a root a little
      // shorter than innerHeight (mobile toolbars) cannot empty the band.
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting && e.boundingClientRect.bottom <= line + 1) past();
            else if (e.isIntersecting) covered?.();
          }
        },
        { rootMargin: `-${line}px 0px 0px 0px`, threshold: 0 },
      );
      io.observe(curtain);
      return () => io.disconnect();
    };

    const setup = () => {
      stop();
      if (done) return;
      const dot = frame.querySelector<HTMLElement>("[data-monument-dot]");
      if (dot && footer) hideAbove(dot, footer);
      const sticky = footer && main && dot && getComputedStyle(footer).position === "sticky";
      if (!sticky) {
        stop = onceInView(frame, land, { threshold: 0.35, rootMargin: "0px" });
        return;
      }
      const lines = linesFor(dot, footer);
      let timer = 0;
      const cancel = () => {
        window.clearTimeout(timer);
        timer = 0;
      };
      const stopDrop = watch(main, lines.drop, land);
      const stopDwell = watch(
        main,
        lines.dwell,
        () => {
          if (!timer) timer = window.setTimeout(land, 400);
        },
        cancel,
      );
      stop = () => {
        stopDrop();
        stopDwell();
        cancel();
      };
    };

    setup();

    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(setup);
    };
    window.addEventListener("resize", refresh);
    // The display face changes the e's box, and so the landing spot; the
    // curtain's fit (Footer/curtainFit.ts) changes the footer's height.
    document.fonts?.ready.then(refresh, () => {});
    const ro = footer ? new ResizeObserver(refresh) : null;
    if (footer) ro?.observe(footer);

    return () => {
      done = true;
      ro?.disconnect();
      window.removeEventListener("resize", refresh);
      cancelAnimationFrame(raf);
      stop();
      unwait();
      frame.style.removeProperty("--drop-from");
    };
  }, []);

  return <span ref={ref} hidden />;
}
