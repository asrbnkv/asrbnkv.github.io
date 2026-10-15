import type { RichText } from "../dictionary";
import type { ProjectSlug, ProjectStatId } from "../projects";

/**
 * Types of the case-study words (03-case-and-pages.md §10). Owned by the
 * case-study agent: change a shape here and TypeScript asks every case
 * module (EN and FR) for it. The final copy deck, with every headline's
 * measured fit, is .aaa/brief/copy-deck.md.
 *
 * Conventions: "\n" in a heading marks the authored line break (03 §1.2;
 * rendered as <br>, or as a plain space where a component ignores it).
 * Plain text everywhere; typography.ts curls apostrophes and sets the
 * French spaces at load. Prose writes "plus de 80", figures keep "80+".
 */

/** A pair label: the value line (Figtree 600) and its description (Figtree 400). */
export interface CasePairLabel {
  value: string;
  text: string;
}

/** A pair drawn to scale on a case page (01 §7.6): labels, caption and hidden sentence. */
export interface CaseScaledPair {
  /** The before state: a dot, or the capsule of a range (60–70%). */
  before: CasePairLabel;
  after: CasePairLabel;
  /** Small, under the pair: the measure and the scale in words. */
  caption: string;
  /** Visually hidden sentence stating the comparison. */
  sentence: string;
}

/**
 * A type-set pair (01 §7.7): before words, the inline dots, after words.
 * Struck unless the case's config says it is a span (job tracker, 03 §14 A5).
 * `spoken` is the whole pair as one phrase, for assistive tech.
 */
export interface CaseTypeSet {
  before: string;
  after: string;
  spoken: string;
}

/** The cover's lower third (03 §2.3). Which parts exist follows the cover variant P, C, S or T. */
export interface CaseCover {
  /** Statement-step caption of the figure, read after it ("97% of clients kept…"). C and S covers. */
  caption?: string;
  /** P and C covers: the scaled pair. */
  pair?: CaseScaledPair;
  /** S and T covers: the type-set pair. */
  typeSet?: CaseTypeSet;
  /** S and T covers: the Small context line with the type-set pair. */
  context?: string;
}

/** The sum drawing (03 §7.1): Havaianas, payments, CRM. */
export interface CaseSum {
  /** One term per line; op "" for the first. `role` (CRM) sits on the term's baseline. */
  terms: readonly { op: "" | "+" | "="; text: string; role?: string }[];
  /** The outputs after the connector; `after` marks the one orange output dot (Havaianas). */
  outputs: readonly { text: string; after?: boolean }[];
  /** Small caption under the outputs (CRM). */
  outputsCaption?: string;
  /** Visually hidden sentence beside the aria-hidden drawing. */
  sentence: string;
}

/** The words of the case template every case shares (03 §1–§5, §10). */
export interface CaseTemplateCopy {
  /** The case title on one line: <title>, "Read the case: …", next-case link. */
  title: string;
  /** Cover H1: the title with its authored break ("\n"), ≤ 2 lines at 1440, 1100, 1024, 768 and 390 (measured). */
  h1: string;
  /** Short title for tight places (work index rows, bar, retro links). ≤ 840px at 96px. */
  shortTitle: string;
  /** Statement beside the H1: ≤ 25 words, ≤ 3 lines on columns 8–12. */
  tagline: string;
  /** Small, muted, under the tagline: role, company and years as one phrase. */
  meta: string;
  /** Alt text of the case's social card: "<title>: <figure>, <caption or pair in words>." (03 §13). */
  ogAlt: string;
  cover: CaseCover;
  /** Context chapter: the lead statement (≤ 25 words). */
  lead: string;
  /** Context body after the lead (lead + body ≤ 90 words). Absent on the freelance page: its lead and the named project types answer the heading. */
  contextBody?: RichText;
  /** Names beside the context, statement step, each with an optional Small note (03 §3.1). */
  names?: { items: readonly { name: string; note?: string }[]; caption?: string };
  /** Work chapter: one past-tense, verb-first sentence per item (3–5). The stack line is PROJECTS[slug].stack. */
  actions: readonly string[];
  /** Result chapter: lead statement (≤ 25 words). Absent on the freelance page (two AI projects instead). */
  changedLead?: string;
  /** Result chapter body. */
  changedBody?: RichText;
  /**
   * Small, on its own line after the result chapter: where the rest of the
   * same job is told (the AppBazar payments and CRM cases point to the product
   * case). The context ends on its tension, never on navigation.
   */
  related?: RichText;
  /** Stat row (03 §14 A3): value (statement step) over a Small caption. */
  statRow?: readonly { value: string; caption: string }[];
  /** Retro chapter (stone): the imperative is the H2, the reason sits on its last baseline. The same imperative as the home's retro wall. Absent for Cannes. */
  retro?: { line: string; reason: string };
}

/** Words for one of the six product case studies. Same shape in every locale. */
export interface ProjectCopy<S extends ProjectSlug> extends CaseTemplateCopy {
  /** Company or context line, e.g. "Havaianas", "Personal project". */
  company: string;
  /** Override for how the shared metric is written in this language ("1 clic", "×2"). */
  metricValue?: string;
  /** What the cover figure measures, read after it (lowercase start). */
  metricCaption: string;
  /** Label per stat id (ids come from PROJECTS[slug].stats). */
  stats: Record<ProjectStatId<S>, string>;
  /** Overrides for how a shared stat value is written in this language. */
  statValues?: Partial<Record<ProjectStatId<S>, string>>;
  changedLead: string;
  /** Absent on Cannes: the day strip's caption says what the day shows. */
  changedBody?: RichText;
  /** The case's user stories: the legacy wording (FR with accents restored; the payments pair lightly edited in round 1). Split with splitStory. */
  stories?: readonly string[];
  /** Product only: the RICE note under "How I prioritised". */
  prioritization?: string;
  /** Product only: the A/B note under "What I tested". */
  abTest?: string;
  /** Product only: the month in dots on ink (03 §7.5). */
  month?: { caption: string; sentence: string };
  /** Product only: the result's MAU pair and the A/B test's pair (03 §7.2). */
  pairs?: { changed: CaseScaledPair; tested: CaseScaledPair };
  /** Havaianas, payments, CRM: the sum drawing (03 §7.1). */
  sum?: CaseSum;
  /** Payments: the two 100-dot fields (03 §7.3). */
  dotFields?: { expected: string; kept: string; note: string; sentence: string };
  /** CRM: the 80-dot field and the four markets (03 §7.3). */
  unitField?: { caption: string; markets: readonly string[]; sentence: string };
  /** Havaianas: the one quote, its attribution and the visually hidden h2 of its chapter (03 §4). */
  quote?: { text: string; source: string; heading: string };
  /** Job tracker: the roadmap artefact chapter (03 §6). */
  roadmap?: { h2: string; body: string; openFull: string };
  /** Cannes: the Pan window's link to the full day plan (03 §6). */
  pan?: { openFull: string };
  /** Cannes: the day strip (03 §7.4). Times and venues are read off the app's screens. */
  dayStrip?: CaseDayStrip;
}

/** The Cannes day strip's words (03 §7.4). */
export interface CaseDayStrip {
  /** The plan's films in time order; the fourth's title is cut off on the screen, so it is a label. */
  films: readonly { title: string; time: string; venue?: string }[];
  /** Counters at the statement step: value (LS 700) and word (LS 500), before and after the skip. */
  counters: {
    plan: readonly { value: string; word: string }[];
    skipped: readonly { value: string; word: string }[];
  };
  /** The text button, aria-pressed: skip, then keep. */
  skip: string;
  keep: string;
  /** The two real alternatives revealed in the skipped slot. */
  alternatives: readonly { title: string; time: string; venue: string; note: string }[];
  /** Under the counters when there is no JS (no button). */
  noScript: string;
  /** Small, under all of it. No date, no year. */
  caption: string;
  /** Visually hidden: the day in words. */
  sentence: string;
}

/** Words for the freelance page (the seventh case, same template). */
export interface FreelanceCopy extends CaseTemplateCopy {
  /** The result chapter's two h3 blocks ("Two AI projects"). */
  aiProjects: {
    agent: { title: string; body: string; fieldCaption: string; fieldSentence: string };
    cv: { title: string; body: string; caption: string };
  };
}

/** Labels of the case template (03 §1.1, §3.2, §5). */
export interface CaseStudyLabels {
  /** Chapter headings; "\n" marks an authored break. */
  headings: {
    context: string;
    contextFreelance: string;
    users: string;
    work: string;
    workBuilt: string;
    workMade: string;
    result: string;
    resultTracker: string;
    resultFreelance: string;
    /** h3 inside the product's work chapter. */
    prioritised: string;
    /** h3 inside the product's result chapter. */
    tested: string;
  };
  /** Small, muted, under the retro reason (the field name under the entry, never an eyebrow). */
  retroFrame: string;
  /** Field names after the stack line. */
  stack: string;
  tools: string;
  /** The next-case H2, and the accessible-name prefix of its link ("Next case: <title>"). */
  next: string;
  nextLabel: string;
  /** Text link under the next case, to /#work. */
  allWork: string;
  /** Text link that opens a stage file full size (freelance collage). */
  openFull: string;
}

export type ProjectsCopy = { [S in ProjectSlug]: ProjectCopy<S> };
