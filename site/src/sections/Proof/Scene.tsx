"use client";

import clsx from "clsx";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { refreshOnResize, registerGsap } from "@/lib/gsap";
import { onceInView } from "@/lib/inView";
import { canHover, SCRUB } from "@/lib/motion";
import { fieldRows, releaseRows, showRows } from "./fieldCount";
import { drawPair, landPair, measurePair, partPair, replayPair, restPair, type PairTrack } from "./pairDrive";
import styles from "./Proof.module.css";
import { PINNED, useSceneEnter } from "./useSceneEnter";

/**
 * One number scene of the proof chapter (02-home.md §3.2, 01 §7.8): an
 * <article> holding a stage. Pinned where the screen can hold it (a 160svh
 * scene with a 100svh sticky stage, 130svh for B, which has no scrub: PINNED
 * must match the media query in Proof.module.css); it flows on tablets,
 * phones and short screens.
 *
 * One scrub per stage, over the first `scrubShare` of the pin, linear in the
 * scroll (scrub 0.6 trails it):
 * - A and C part their Pair (01 §6.3–6.4); the after label is a state that
 *   arrives once the dot has landed (p ≥ 0.98, gone again under 0.9);
 * - D (`count`) counts its 80-dot field in, row by row, once the figure has
 *   risen.
 * In flow the parting plays once at 40% visible (1000ms in-out, 120ms) and
 * the field rolls in 360ms after its figure (40ms a row). Reduced motion:
 * drawn parted, every dot present, nothing scrubs.
 *
 * Keyboard focus entering a pinned scene lands the page where the stage is
 * locked and finished (no animation), and parts the pair and fills the
 * field at once. A real pointer moving into the figure (fine pointer only)
 * replays the last 15% of the parting, at most once every 2s.
 */
const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** The figure's rise has had its moment before the field answers it (ms after the cue). */
const FIELD_AFTER_CUE = 360;

export function Scene({
  labelledBy,
  className,
  style,
  scrubShare = 0.4,
  pin = "full",
  count = false,
  children,
}: {
  /** id of the scene's h3. */
  labelledBy: string;
  /** The scene's composition class (its block grid lives on the stage). */
  className?: string;
  /** Custom properties for the composition (sizes of real pictures, the fit). */
  style?: CSSProperties;
  /** Share of the pin the scrub takes (pinned layouts). */
  scrubShare?: number;
  /** "short": a 130svh scene for a stage with nothing to scrub (B). */
  pin?: "full" | "short";
  /** The stage's dot field is counted in by the scene (D). */
  count?: boolean;
  children: ReactNode;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useSceneEnter(articleRef, stageRef);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const pair = article.querySelector<HTMLElement>("[data-pair]");
    const host = count ? article.querySelector<HTMLElement>("[data-field-host]") : null;
    const figure = article.querySelector<HTMLElement>("[data-scene-figure]");
    const scrubs = Boolean(pair || host);
    const state = {
      parted: false,
      landed: false,
      floor: 0,
      /** the figure has risen far enough for the field to answer it */
      fieldOpen: false,
      track: pair ? measurePair(pair) : (null as PairTrack | null),
      render: () => {},
    };
    const gsap = registerGsap();
    const mm = gsap.matchMedia();
    const timers: number[] = [];

    // The field opens FIELD_AFTER_CUE after the figure starts its rise.
    let figureWatch: MutationObserver | null = null;
    const onFieldOpen: Array<() => void> = [];
    if (host && figure) {
      const check = () => {
        if (state.fieldOpen || !figure.dataset.enterState) return;
        figureWatch?.disconnect();
        const wait = figure.dataset.enterState === "done" ? 0 : FIELD_AFTER_CUE;
        timers.push(
          window.setTimeout(() => {
            state.fieldOpen = true;
            onFieldOpen.forEach((f) => f());
          }, wait),
        );
      };
      figureWatch = new MutationObserver(check);
      figureWatch.observe(figure, { attributes: true, attributeFilter: ["data-enter-state"] });
      check();
    }

    mm.add({ pinned: PINNED, motion: MOTION_OK }, (context) => {
      const { pinned, motion } = context.conditions as { pinned: boolean; motion: boolean };
      if (!motion) {
        state.parted = true;
        if (pair) restPair(pair, true);
        if (host) releaseRows(host);
        return;
      }
      if (pinned && scrubs) {
        const mover = pair?.querySelector<HTMLElement>("[data-pair-mover]");
        const proxy = { p: 0 };
        state.render = () => {
          const p = Math.max(proxy.p, state.floor);
          if (pair && state.track) {
            drawPair(pair, state.track, p);
            // hysteresis: the label never flickers around one scroll position
            if (!state.landed && p >= 0.98) state.landed = true;
            else if (state.landed && p < 0.9) state.landed = false;
            if (pair.hasAttribute("data-landed") !== state.landed || pair.dataset.drive !== "scrub") {
              landPair(pair, state.landed, state.floor >= 1 && p >= 1 ? "now" : "scrub");
            }
          }
          if (host) showRows(host, state.fieldOpen ? p * fieldRows(host) : 0, state.floor >= 1 ? "now" : "scrub");
          state.parted = p >= 0.999;
        };
        onFieldOpen.push(() => state.render());
        gsap.to(proxy, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: article,
            start: "top top",
            end: () => `+=${Math.max(1, (article.offsetHeight - window.innerHeight) * scrubShare)}`,
            scrub: SCRUB,
            invalidateOnRefresh: true,
            onRefresh: () => {
              if (pair) state.track = measurePair(pair);
              state.render();
            },
            onToggle: (self) => {
              if (mover) mover.style.willChange = self.isActive ? "transform" : "";
            },
            onLeaveBack: () => {
              state.floor = 0;
            },
          },
          onUpdate: () => state.render(),
        });
        state.render();
        return () => {
          state.render = () => {};
          onFieldOpen.length = 0;
          if (pair) restPair(pair, state.parted);
          if (host) releaseRows(host);
        };
      }
      // Flow: the pair parts once at 40% visible; the field rolls in after its figure.
      const stops: Array<() => void> = [];
      if (pair) {
        if (state.parted) restPair(pair, true);
        else {
          if (state.track) drawPair(pair, state.track, 0);
          landPair(pair, false, "flow");
          stops.push(
            onceInView(
              pair,
              () => {
                if (state.parted) return;
                stops.push(
                  partPair(pair, measurePair(pair), () => {
                    state.parted = true;
                  }),
                );
              },
              { threshold: 0.4, rootMargin: "0px" },
            ),
          );
        }
      }
      if (host) {
        const roll = () => showRows(host, fieldRows(host), "cascade");
        if (state.fieldOpen) roll();
        else {
          showRows(host, 0, "cascade");
          onFieldOpen.push(roll);
        }
      }
      return () => {
        stops.forEach((s) => s());
        onFieldOpen.length = 0;
        if (pair) restPair(pair, state.parted);
        if (host) releaseRows(host);
      };
    });

    // Keyboard focus: land where the stage is locked and finished; never animate.
    const onFocus = (e: FocusEvent) => {
      const keyboard = (e.target as Element | null)?.matches?.(":focus-visible") ?? false;
      state.floor = 1;
      state.fieldOpen = true;
      if (window.matchMedia(MOTION_OK).matches) {
        if (window.matchMedia(PINNED).matches && scrubs) state.render();
        else {
          if (pair) restPair(pair, true);
          if (host) showRows(host, fieldRows(host), "now");
        }
      }
      state.parted = true;
      if (!keyboard || !window.matchMedia(PINNED).matches) return;
      const top = article.getBoundingClientRect().top + window.scrollY;
      const hold = Math.max(0, article.offsetHeight - window.innerHeight);
      const target = Math.round(top + hold * (scrubs ? scrubShare : 0) + (scrubs ? 2 : 0));
      // after the browser's own focus scroll, in the next frame
      requestAnimationFrame(() => window.scrollTo({ top: target, behavior: "instant" }));
    };

    // The reader's response: armed when a fine pointer enters the figure,
    // fired by the first real move inside it (a page scrolled under a
    // resting pointer never moves it).
    let armed = false;
    const at = { x: 0, y: 0 };
    const onEnter = (e: PointerEvent) => {
      armed = e.pointerType !== "touch" && canHover();
      at.x = e.clientX;
      at.y = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!armed || e.pointerType === "touch" || (e.clientX === at.x && e.clientY === at.y)) return;
      armed = false;
      if (pair && state.parted) replayPair(pair, state.track);
    };
    const onLeave = () => {
      armed = false;
    };
    if (pair && figure) {
      figure.addEventListener("pointerenter", onEnter);
      figure.addEventListener("pointermove", onMove);
      figure.addEventListener("pointerleave", onLeave);
    }
    article.addEventListener("focusin", onFocus);
    const sized = pair
      ? new ResizeObserver(() => {
          state.track = measurePair(pair);
          state.render();
        })
      : null;
    if (pair) sized?.observe(pair);
    const stopFollowing = refreshOnResize();

    return () => {
      if (pair && figure) {
        figure.removeEventListener("pointerenter", onEnter);
        figure.removeEventListener("pointermove", onMove);
        figure.removeEventListener("pointerleave", onLeave);
      }
      article.removeEventListener("focusin", onFocus);
      figureWatch?.disconnect();
      timers.forEach((t) => clearTimeout(t));
      sized?.disconnect();
      stopFollowing();
      mm.revert();
    };
  }, [scrubShare, count]);

  return (
    <article
      ref={articleRef}
      aria-labelledby={labelledBy}
      className={clsx(styles.scene, pin === "short" && styles.short)}
    >
      <div ref={stageRef} data-reveal-root="" className={clsx(styles.stage, className)} style={style}>
        {children}
      </div>
    </article>
  );
}
