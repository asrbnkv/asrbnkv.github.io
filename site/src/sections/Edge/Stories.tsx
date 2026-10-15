"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { onceInView } from "@/lib/inView";
import { REVEAL_OBSERVER, STAGGER, prefersReducedMotion } from "@/lib/motion";
import type { StoriesLabels, StoryView } from "./model";
import { StoryAccordion, StoryDetails } from "./StoryAccordion";
import { StoryTabs } from "./StoryTabs";
import styles from "./Stories.module.css";

/**
 * Stories, the live thing (01 §7.10, 02 §2.2). Markup by condition:
 *   no JS (and the server render)  six <details name="stories">, the first open
 *   JS, 1100px and up              a vertical tablist with a roving tabindex
 *   JS, below 1100px               an accordion, one region open at a time
 * The mode comes from useSyncExternalStore: the server snapshot is the
 * <details> markup, so hydration matches, then the client snapshot swaps in
 * the tablist or the accordion (the chapter is below the fold on load).
 * One selection is shared by both modes, so a resize keeps the story.
 *
 * Entrance: one trigger for the chapter. The invitation is a Reveal part;
 * the live thing rises 70ms after it starts (02 §2.5: invitation and list
 * rise as one block), never before the reader has the sentence that names
 * it. If the invitation is already in when this mounts, the stage is too.
 */
type Mode = "details" | "tabs" | "accordion";

export type PickInput = "init" | "pointer" | "key";

export interface Pick {
  index: number;
  /** Accordion only: false when the reader closed the open row. */
  open: boolean;
  input: PickInput;
  /** Increments on every reader action; 0 = the state on load (no motion). */
  seq: number;
}

const TABS = "(min-width: 1100px)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(TABS);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}
const clientMode = (): Mode => (window.matchMedia(TABS).matches ? "tabs" : "accordion");
const serverMode = (): Mode => "details";

/** Call `arrive` 70ms after the invitation starts its entrance (now, if it has). */
function followInvitation(invite: HTMLElement, arrive: () => void): () => void {
  let timer = 0;
  const go = () => {
    if (timer) return;
    const lag = parseFloat(invite.style.getPropertyValue("--reveal-delay")) || 0;
    timer = window.setTimeout(arrive, lag + STAGGER.chapter);
  };
  if (invite.classList.contains("is-in")) {
    arrive();
    return () => {};
  }
  const mo = new MutationObserver(() => {
    if (invite.classList.contains("is-in")) go();
  });
  mo.observe(invite, { attributes: true, attributeFilter: ["class"] });
  return () => {
    mo.disconnect();
    window.clearTimeout(timer);
  };
}

export function Stories({
  stories,
  labels,
  inviteId,
}: {
  stories: readonly StoryView[];
  labels: StoriesLabels;
  /** The invitation <p> that names the tablist (and leads its entrance). */
  inviteId: string;
}) {
  const mode = useSyncExternalStore(subscribe, clientMode, serverMode);
  const [pick, setPick] = useState<Pick>({ index: 0, open: true, input: "init", seq: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const arrive = () => setArrived(true);
    if (prefersReducedMotion()) {
      arrive();
      return;
    }
    const invite = document.getElementById(inviteId);
    if (!invite) return onceInView(el, arrive, { threshold: 0, rootMargin: "0px" });
    const stop = followInvitation(invite, arrive);
    // Fallback, for a jump that skipped the invitation's own trigger: the
    // stage is well in (15% past the reveal line, so the invitation above
    // it has long crossed its line) and still has not arrived.
    let late = 0;
    const off = onceInView(
      el,
      () => {
        late = window.setTimeout(arrive, 400);
      },
      { ...REVEAL_OBSERVER, threshold: 0.15 },
    );
    return () => {
      stop();
      off();
      window.clearTimeout(late);
    };
  }, [inviteId]);

  const select = useCallback((index: number, input: PickInput) => {
    setPick((p) => (p.index === index && p.open ? p : { index, open: true, input, seq: p.seq + 1 }));
  }, []);

  const toggle = useCallback((index: number, input: PickInput) => {
    setPick((p) =>
      p.index === index
        ? { index, open: !p.open, input, seq: p.seq + 1 }
        : { index, open: true, input, seq: p.seq + 1 },
    );
  }, []);

  let content;
  if (mode === "tabs") {
    content = (
      <StoryTabs
        stories={stories}
        labels={labels}
        inviteId={inviteId}
        pick={pick}
        arrived={arrived}
        onSelect={select}
      />
    );
  } else if (mode === "accordion") {
    content = <StoryAccordion stories={stories} labels={labels} pick={pick} arrived={arrived} onToggle={toggle} />;
  } else {
    content = <StoryDetails stories={stories} labels={labels} />;
  }

  return (
    <div ref={stage} className={styles.stage} data-in={arrived ? "" : undefined}>
      {content}
    </div>
  );
}
