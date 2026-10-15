import type { PairCopy, ScaledPair } from "@/content";
import type { StoryId } from "@/content/sections/edge";

/**
 * What the live thing receives from the server section: plain, serialisable
 * story views, so neither the dictionary nor the case modules ship to the
 * client. Built in Edge.tsx from EDGE_STORIES, dict.home.edge and
 * dict.projects[case].stories (verbatim, split into clauses).
 */

/** One hanging clause: "As a" + "B2B partner,". */
export interface StoryClauseView {
  label: string;
  text: string;
  /** What joins label and text in the sentence: " ", or "" after an elided "qu’". */
  join: string;
}

export type StoryVisual =
  | { kind: "pair"; data: ScaledPair; copy: PairCopy }
  | { kind: "typeSet"; before: string; after: string; caption: string; joiner: string }
  | null;

export interface StoryView {
  id: StoryId;
  persona: string;
  company: string;
  clauses: readonly StoryClauseView[];
  built: string;
  happened: string;
  visual: StoryVisual;
  caseHref: string;
  caseTitle: string;
}

/**
 * A row's accessible name, persona then company (02 §2.6: "As a B2B
 * partner, AppBazar (MTS)"). Set as aria-label: the persona is a block, so
 * a hidden comma between the spans was read with a stray space before it.
 */
export function rowName(story: Pick<StoryView, "persona" | "company">): string {
  return `${story.persona}, ${story.company}`;
}

export interface StoriesLabels {
  whatIBuilt: string;
  whatHappened: string;
  readCase: string;
}
