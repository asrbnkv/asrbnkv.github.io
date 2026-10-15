"use client";

import clsx from "clsx";
import { useEffect, useRef, type MouseEvent } from "react";
import { PairMark } from "@/components/Marks";
import { prefersReducedMotion } from "@/lib/motion";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { rowName, type StoriesLabels, type StoryView } from "./model";
import type { Pick, PickInput } from "./Stories";
import { StoryBody } from "./StoryBody";
import styles from "./Stories.module.css";
import { STORY_TIMING, holdMark, partInView, pickDuration, playRegion } from "./storyMotion";

/**
 * The row: persona at the statement step, its company in Small under it.
 * Only the open row carries the S pair at its end (the clasp of its paper
 * band); a closed row is the persona and its company, nothing else.
 */
function RowLabel({ story, open }: { story: StoryView; open: boolean }) {
  return (
    <>
      <span className={styles.persona}>{story.persona}</span>
      <span className={styles.company}>{story.company}</span>
      {open ? (
        <span className={styles.marker} aria-hidden="true" data-row-marker="">
          <PairMark motion="static" length={3.5} />
        </span>
      ) : null}
    </>
  );
}

/** The bar's height (the fixed band over the page), for the scroll that reveals an opened region. */
function barHeight(): number {
  const bar = document.querySelector<HTMLElement>("[data-bar]");
  return bar ? bar.getBoundingClientRect().height : 0;
}

/**
 * Accordion mode (JS, below 1100px; 02 §2.2). Six h3 > button rows, each
 * followed by its region; one open at a time. The open row and its region
 * share one paper band that runs edge to edge (data-field="paper", so the
 * bar takes it as it passes). Heights change at once
 * (nothing animates height). The tapped row is held in place when a region
 * above it closes; if the region it opened starts below the screen, the
 * page moves up just enough to show its first lines, never hiding the row.
 */
export function StoryAccordion({
  stories,
  labels,
  pick,
  arrived,
  onToggle,
}: {
  stories: readonly StoryView[];
  labels: StoriesLabels;
  pick: Pick;
  /** The stage has risen: the open story's pair may part. */
  arrived: boolean;
  onToggle: (index: number, input: PickInput) => void;
}) {
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const regions = useRef<(HTMLDivElement | null)[]>([]);
  const anchor = useRef<{ index: number; top: number } | null>(null);
  const { index, open, input, seq } = pick;

  useIsomorphicLayoutEffect(() => {
    const held = anchor.current;
    anchor.current = null;
    const row = held ? rows.current[held.index] : null;
    if (held && row) {
      const delta = row.getBoundingClientRect().top - held.top;
      if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });
      const region = open && held.index === index ? regions.current[index] : null;
      if (region) {
        // Show the first ~120px of the opened story, keeping the row in view.
        const r = row.getBoundingClientRect();
        const reg = region.getBoundingClientRect();
        const vh = window.innerHeight;
        const want = Math.min(reg.top + Math.min(reg.height, 120) - vh, r.top - barHeight() - 16);
        if (want > 1) window.scrollBy({ top: want, behavior: "instant" });
      } else {
        row.scrollIntoView({ block: "nearest", behavior: "instant" });
      }
    }
    // A tap: the region rises in, the row's marker grows from 0.4, and the
    // marker and the pair part together once in view. Keys: no motion.
    if (seq === 0 || !open || input !== "pointer" || prefersReducedMotion()) return;
    const region = regions.current[index];
    if (!region) return;
    const marker = rows.current[index]?.querySelector<HTMLElement>("[data-row-marker]") ?? null;
    const mark = marker?.querySelector<HTMLElement>("[data-pair-mark]");
    const duration = pickDuration();
    const parked = mark ? holdMark(mark, duration) : [];
    const stopRise = playRegion(region, marker);
    const stopPart = partInView(region, { notBefore: STORY_TIMING.region, duration, extra: parked });
    return () => {
      stopRise();
      stopPart();
      parked.forEach((a) => a.cancel());
    };
  }, [index, open, input, seq]);

  // On arrival, the story open on load parts its pair (and its row's
  // marker) once it is in view.
  useEffect(() => {
    if (!arrived || seq !== 0 || !open || prefersReducedMotion()) return;
    const region = regions.current[index];
    if (!region) return;
    const mark = rows.current[index]?.querySelector<HTMLElement>("[data-row-marker] [data-pair-mark]");
    const held = mark ? holdMark(mark) : [];
    const stop = partInView(region, { notBefore: STORY_TIMING.arrival, extra: held });
    return () => {
      stop();
      held.forEach((a) => a.cancel());
    };
  }, [arrived, index, open, seq]);

  const onClick = (i: number) => (event: MouseEvent<HTMLButtonElement>) => {
    const row = rows.current[i];
    anchor.current = row ? { index: i, top: row.getBoundingClientRect().top } : null;
    onToggle(i, event.detail === 0 ? "key" : "pointer");
  };

  return (
    <div className={styles.accordion}>
      {stories.map((story, i) => {
        const isOpen = open && i === index;
        return (
          <div
            key={story.id}
            className={clsx(styles.item, isOpen && styles.itemOpen)}
            data-field={isOpen ? "paper" : undefined}
          >
            <h3 className={styles.rowHeading}>
              <button
                ref={(el) => {
                  rows.current[i] = el;
                }}
                type="button"
                id={`story-row-${story.id}`}
                aria-expanded={isOpen}
                aria-controls={`story-region-${story.id}`}
                aria-label={rowName(story)}
                className={styles.row}
                onClick={onClick(i)}
              >
                <RowLabel story={story} open={isOpen} />
              </button>
            </h3>
            <div
              ref={(el) => {
                regions.current[i] = el;
              }}
              role="region"
              id={`story-region-${story.id}`}
              aria-labelledby={`story-row-${story.id}`}
              className={styles.region}
              hidden={!isOpen}
            >
              <StoryBody story={story} labels={labels} heading="h4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * No JS (and the server render): six <details name="stories">, the first
 * open, every word in the HTML. Same look as the accordion; at 1100px and up
 * the column is 8 columns wide.
 */
export function StoryDetails({ stories, labels }: { stories: readonly StoryView[]; labels: StoriesLabels }) {
  return (
    <div className={clsx(styles.accordion, styles.details)}>
      {stories.map((story, i) => (
        <details key={story.id} name="stories" open={i === 0} className={styles.item}>
          <summary className={styles.row} aria-label={rowName(story)}>
            <RowLabel story={story} open />
          </summary>
          <div className={styles.region}>
            <StoryBody story={story} labels={labels} heading="h3" />
          </div>
        </details>
      ))}
    </div>
  );
}
