import {
  FIGURES,
  FREELANCE,
  PROJECTS,
  formatPeriod,
  localizeFigure,
  type CaseSlug,
  type Dictionary,
  type FreelanceCopy,
  type Locale,
  type Localized,
  type PairCopy,
  type ProjectSlug,
  type ProjectsCopy,
} from "@/content";
import type { CaseScaledPair, CaseTemplateCopy } from "@/content/cases/types";

/**
 * The case template's view model (03-case-and-pages.md §1, §2.2, §10): one
 * shape for all seven cases, so every block reads the same fields. Layout
 * facts only (cover variant, measured ink fits); every word comes from the
 * dictionary and every number from @/content.
 */
export type CoverVariant = "P" | "C" | "S" | "T";

export interface CaseLayout {
  /** P over its scale · C on its dot · S side · T stacked (03 §2.2). */
  cover: CoverVariant;
  /** The figure's measured ink width in em (−0.04em tracking), per locale (03 §10). */
  fit: Localized<number>;
  /** Shift that puts the figure's first ink on the margin, em. */
  inkLeft: Localized<number>;
  /** Sum drawing: the longest line's measured width in em, operator included (03 §7.1). */
  sumFit?: Localized<number>;
  /** The cover's type-set pair is a correction (struck) unless it is a span (03 §14 A5). */
  strike: boolean;
  /** The figure has descenders ("3 days", "3 jours"): rows under it keep clear of them. */
  descends?: boolean;
}

const LAYOUT: Record<CaseSlug, CaseLayout> = {
  "appbazar-product": { cover: "P", fit: FIGURES.dau.fit, inkLeft: FIGURES.dau.inkLeft, strike: true },
  havaianas: {
    cover: "S",
    fit: FIGURES.upsell.fit,
    inkLeft: FIGURES.upsell.inkLeft,
    sumFit: { en: 5.15, fr: 6.88 },
    strike: true,
  },
  "appbazar-payments": {
    cover: "C",
    fit: FIGURES.retention.fit,
    inkLeft: FIGURES.retention.inkLeft,
    sumFit: { en: 7.38, fr: 8.57 },
    strike: true,
  },
  "appbazar-crm": {
    cover: "S",
    fit: FIGURES.accounts.fit,
    inkLeft: FIGURES.accounts.inkLeft,
    sumFit: { en: 5.52, fr: 7.25 },
    strike: true,
  },
  "job-tracker": {
    cover: "T",
    fit: { en: 2.3055, fr: 1.7835 },
    inkLeft: { en: 0.0075, fr: 0.0075 },
    strike: false,
  },
  cannes: {
    cover: "T",
    fit: { en: 2.6985, fr: 2.748 },
    inkLeft: { en: 0.0065, fr: 0.0065 },
    strike: true,
    descends: true,
  },
  freelance: { cover: "S", fit: { en: 1.2565, fr: 1.2565 }, inkLeft: { en: 0.0075, fr: 0.0075 }, strike: true },
};

/** The cover's height term (03 §14 A2): what must stay above the fold under the figure. */
export const COVER_REST: Record<CoverVariant, string> = { P: "30rem", C: "30rem", T: "27rem", S: "22rem" };

export type ProjectCaseCopy = ProjectsCopy[ProjectSlug];

export interface CaseView {
  slug: CaseSlug;
  locale: Locale;
  dict: Dictionary;
  /** The words every case shares (cover, context, work, result, retro). */
  copy: CaseTemplateCopy;
  /** The six product cases' own fields (stories, drawings, pairs…); null on the freelance page. */
  project: ProjectCaseCopy | null;
  /** The freelance page's own fields; null on the six product cases. */
  freelance: FreelanceCopy | null;
  layout: CaseLayout;
  figure: { value: string; fit: number; inkLeft: number };
  stack: { label: string; items: readonly string[] };
  /** "2023–25" / "2023–2025"; null when no year is claimed (Cannes). */
  years: string | null;
  headings: { context: string; work: string; result: string };
}

export function caseView(slug: CaseSlug, locale: Locale, dict: Dictionary): CaseView {
  const layout = LAYOUT[slug];
  const labels = dict.caseStudy.headings;
  const isFreelance = slug === "freelance";
  const project = isFreelance ? null : dict.projects[slug];
  const freelance = isFreelance ? dict.freelance : null;
  const copy: CaseTemplateCopy = project ?? dict.freelance;
  const period = isFreelance ? FREELANCE.period : PROJECTS[slug].period;
  const value = isFreelance
    ? FREELANCE.sitesCount
    : (project?.metricValue ?? localizeFigure(PROJECTS[slug].metric, locale));
  const personal = slug === "job-tracker" || slug === "cannes";

  return {
    slug,
    locale,
    dict,
    copy,
    project,
    freelance,
    layout,
    figure: { value, fit: layout.fit[locale], inkLeft: layout.inkLeft[locale] },
    stack: isFreelance
      ? { label: dict.caseStudy.tools, items: FREELANCE.tools }
      : { label: dict.caseStudy.stack, items: PROJECTS[slug].stack },
    years: period ? formatPeriod(period, dict.common.present, { short: locale === "en" }) : null,
    headings: {
      context: isFreelance ? labels.contextFreelance : labels.context,
      work: isFreelance ? labels.workMade : personal ? labels.workBuilt : labels.work,
      result: isFreelance ? labels.resultFreelance : slug === "job-tracker" ? labels.resultTracker : labels.result,
    },
  };
}

/** "Requests in,\npriorities out" → its authored lines. */
export const linesOf = (text: string): string[] => text.split("\n");

/** One line, for accessible names and the next-case link. */
export const oneLine = (text: string): string => text.replace(/\s*\n\s*/g, " ");

/**
 * A case pair's words in the Pair's shape: the zero under x(0) ("0", "0%").
 * The legend line stays empty: the case template sets the pair's caption
 * itself, under the label band on column 1 (03 §2.2).
 */
export function casePairCopy(pair: CaseScaledPair, zero: string): PairCopy {
  return { zero, before: pair.before, after: pair.after, legend: "", sentence: pair.sentence };
}
