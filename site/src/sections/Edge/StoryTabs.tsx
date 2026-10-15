"use client";

import clsx from "clsx";
import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { PairMark } from "@/components/Marks";
import { prefersReducedMotion } from "@/lib/motion";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { rowName, type StoriesLabels, type StoryView } from "./model";
import type { Pick, PickInput } from "./Stories";
import { StoryBody } from "./StoryBody";
import styles from "./Stories.module.css";
import { STORY_TIMING, holdMark, partInView, pickDuration, pickMark, playKey, playPointer } from "./storyMotion";

const WIDE_ROWS = "(min-width: 1280px)";

/**
 * Tab mode (JS, 1100px and up; 02 §2.2). Six persona rows on stone in full
 * ink. The pick is a paper tab that runs from the page's edge across the
 * gutter into the paper panel, which runs on to the other edge, so tab and
 * panel read as one paper field on stone (a tone step:
 * no border, shadow or radius). The tab is one element under the rows'
 * text: it slides to a pick, and the S marker rides at its seam, the only
 * marker in the list. All six panels share one grid cell (inactive ones
 * visibility: hidden), so the panel is the tallest story's height and the
 * rows divide that height.
 *
 * Rows: persona and company on one line from 1280px when every row of the
 * locale fits with 24px to spare (measured here); otherwise, and always at
 * 1100–1279px, the company sits under its persona, in every row alike.
 *
 * Keyboard: roving tabindex; Up/Down (wrapping), Home/End move and select;
 * Tab goes on to the panel's case link. Keyboard picks swap by opacity.
 */
export function StoryTabs({
  stories,
  labels,
  inviteId,
  pick,
  arrived,
  onSelect,
}: {
  stories: readonly StoryView[];
  labels: StoriesLabels;
  inviteId: string;
  pick: Pick;
  /** The stage has risen: the first story's pair may part. */
  arrived: boolean;
  onSelect: (index: number, input: PickInput) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const clasp = useRef<HTMLSpanElement>(null);
  const claspAnims = useRef<Animation[]>([]);
  const shown = useRef(pick.index);
  const { index, input, seq } = pick;

  // One line per row where every row fits, else every row stacked.
  useIsomorphicLayoutEffect(() => {
    const host = root.current;
    const box = list.current;
    if (!host || !box) return;
    const wide = window.matchMedia(WIDE_ROWS);
    const fit = () => {
      let inline = wide.matches;
      for (const tab of tabs.current) {
        if (!inline) break;
        const persona = tab?.querySelector<HTMLElement>("[data-row-persona]");
        const company = tab?.querySelector<HTMLElement>("[data-row-company]");
        if (!tab || !persona || !company) continue;
        const cs = getComputedStyle(tab);
        const room = tab.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const gap = parseFloat(cs.columnGap) || 0;
        inline = persona.offsetWidth + gap + company.offsetWidth <= room;
      }
      host.dataset.rows = inline ? "inline" : "stacked";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    wide.addEventListener("change", fit);
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) fit();
    });
    return () => {
      live = false;
      ro.disconnect();
      wide.removeEventListener("change", fit);
    };
  }, []);

  // A reader's pick: the outgoing story fades under the incoming one, and
  // the clasp closes, rides the tab, and parts with the story's pair.
  useIsomorphicLayoutEffect(() => {
    const from = shown.current;
    shown.current = index;
    if (seq === 0) return;
    const panel = panels.current[index];
    if (!panel) return;
    const previous = from === index ? null : panels.current[from];
    const mark = clasp.current?.querySelector<HTMLElement>("[data-pair-mark]") ?? null;
    if (input !== "pointer" || prefersReducedMotion()) {
      claspAnims.current.forEach((a) => a.cancel());
      claspAnims.current = [];
      return playKey(panel, previous);
    }
    const duration = pickDuration();
    claspAnims.current = mark ? pickMark(mark, claspAnims.current, duration) : [];
    return playPointer(panel, previous, duration);
  }, [index, input, seq]);

  // On arrival, the clasp and the story's pair part together once in view.
  useEffect(() => {
    if (!arrived || seq !== 0 || prefersReducedMotion()) return;
    const panel = panels.current[index];
    const mark = clasp.current?.querySelector<HTMLElement>("[data-pair-mark]");
    if (!panel) return;
    const held = mark ? holdMark(mark) : [];
    claspAnims.current = held;
    const stop = partInView(panel, { notBefore: STORY_TIMING.arrival, extra: held });
    // A pick has already read and replaced the hold (pickMark); otherwise
    // (strict mode's second run, a resize back to the accordion) a paused
    // hold left behind would pin the clasp in the tréma for good.
    return () => {
      stop();
      held.forEach((a) => a.cancel());
    };
  }, [arrived, index, seq]);

  // The clasp's motion leaves with the component (a resize to the accordion).
  useEffect(() => () => claspAnims.current.forEach((a) => a.cancel()), []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const n = stories.length;
    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % n;
        break;
      case "ArrowUp":
        next = (index - 1 + n) % n;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = n - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onSelect(next, "key");
    tabs.current[next]?.focus();
  };

  const onClick = (i: number) => (event: MouseEvent<HTMLButtonElement>) => {
    // detail 0: Enter or Space on a focused tab, which is already selected.
    onSelect(i, event.detail === 0 ? "key" : "pointer");
  };

  return (
    <div
      ref={root}
      className={styles.tabs}
      data-input={input}
      style={{ "--n": stories.length, "--i": index } as CSSProperties}
    >
      <div
        ref={list}
        role="tablist"
        aria-orientation="vertical"
        aria-labelledby={inviteId}
        className={styles.tablist}
        onKeyDown={onKeyDown}
      >
        {/* The paper tab, under the rows' text (it comes first), blind to
            the pointer and to assistive tech. Its S marker is the clasp. */}
        <div className={styles.window} aria-hidden="true">
          <span ref={clasp} className={styles.marker}>
            <PairMark motion="static" length={3.5} />
          </span>
        </div>
        {stories.map((story, i) => {
          const selected = i === index;
          return (
            <button
              key={story.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`story-tab-${story.id}`}
              aria-selected={selected}
              aria-controls={`story-panel-${story.id}`}
              tabIndex={selected ? 0 : -1}
              aria-label={rowName(story)}
              className={styles.tab}
              onClick={onClick(i)}
            >
              <span className={styles.persona} data-row-persona="">
                {story.persona}
              </span>
              <span className={styles.company} data-row-company="">
                {story.company}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.panels}>
        {stories.map((story, i) => (
          <div
            key={story.id}
            ref={(el) => {
              panels.current[i] = el;
            }}
            role="tabpanel"
            id={`story-panel-${story.id}`}
            aria-labelledby={`story-tab-${story.id}`}
            inert={i !== index}
            className={clsx(styles.panel, i === index && styles.panelActive)}
          >
            <StoryBody story={story} labels={labels} heading="h3" />
          </div>
        ))}
      </div>
    </div>
  );
}
