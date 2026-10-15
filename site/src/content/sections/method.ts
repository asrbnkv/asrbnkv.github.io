import type { PairId } from "../home";
import type { Localized } from "../localized";

/**
 * Words of the `method` chapter (src/sections/Method/), EN + FR.
 * Claim: He runs the whole Product Owner loop on a real cadence: a call with engineering every day, sprint planning every two weeks, a product review every month; ranking, testing and measuring in between.
 * Spec: .aaa/brief/design-spec/02-home.md §6.3 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * The month's shape is MONTH (02 §0.3); the Test step's S-pair is
 * `PAIRS.abWording`. Sources: the cadence and RICE note (legacy AppBazar
 * product case), the cross-team list and LTV/MRR/NPS reporting (CV), the
 * A/B test (legacy).
 *
 * Owned by the method section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */

export type LoopId = "collect" | "rank" | "build" | "test" | "measure" | "review";

/** The loop's order (an <ol>: the sequence is information). */
export const LOOP_ORDER: readonly LoopId[] = ["collect", "rank", "build", "test", "measure", "review"];

/** The step that carries a scaled pair (02 §6.1: the Test step's S-pair). */
export const LOOP_PAIR: Partial<Record<LoopId, PairId>> = { test: "abWording" };

/**
 * The month's shape (02 §0.3, 01 §7.11): four weeks of five working days,
 * one call with engineering a day; sprint planning on day 1 of weeks 1 and
 * 3 ([week, day], 1-based); the product review on the last day. No dates.
 */
export const MONTH = {
  weeks: 4,
  days: 5,
  sprintPlanning: [
    [1, 1],
    [3, 1],
  ],
  review: [4, 5],
} as const satisfies {
  weeks: number;
  days: number;
  sprintPlanning: readonly (readonly [number, number])[];
  review: readonly [number, number];
};

/** A label attached under a dot: value line (Figtree 600), then description (Figtree 400). Each ≤ 26 characters. */
export interface MonthLabel {
  value: string;
  text: string;
}

export interface MethodCopy {
  /** 2 lines on 6 columns, 1 line on 7+. */
  h2: string;
  /** ≤ 3 lines on 6 columns at 1440 and at 1100 (measured). */
  statement: string;
  month: {
    /** Under week 1 day 1 and week 3 day 1 (the same words), week 2 day 1, and the review dot. */
    labels: { planning: MonthLabel; call: MonthLabel; review: MonthLabel };
    /** Small, muted, under the whole month: 1 line at 1440. */
    caption: string;
    /** Phone key, one line per dot kind: its count (tabular figures), then what it is. */
    key: readonly { count: string; text: string }[];
    /** Visually hidden sentence for the aria-hidden drawing. */
    sentence: string;
  };
  /**
   * The loop: step name (hangs in columns 1–2) and the line (statement
   * step). `link`, when present, is the part of `text` that links to
   * #stories (the method points back to the stories).
   */
  loop: Record<LoopId, { step: string; text: string; link?: string }>;
  /**
   * The Test step's pair: its one inline value, its hidden sentence, and the
   * scale's maximum, set under the measure's end as the Pair sets its 0
   * under the start (01 §7.6; the same words as the caption's "Scale 0 to ×2").
   */
  testPair: { value: string; sentence: string; max: string };
}

export const method: Localized<MethodCopy> = {
  en: {
    h2: "How I run the loop",
    statement:
      "At AppBazar (MTS): a\u00a0daily call with engineering, sprint\u00a0planning every two\u00a0weeks, a\u00a0monthly product review.",
    month: {
      labels: {
        planning: { value: "Sprint planning", text: "every two weeks" },
        call: { value: "A call with engineering", text: "every working day" },
        review: { value: "Product review", text: "every month" },
      },
      caption: "A typical month, drawn as four weeks of working days.",
      key: [
        { count: "20 dots", text: "a call with engineering, every working day" },
        { count: "2 dots", text: "sprint planning, every two weeks" },
        { count: "1 dot", text: "the product review, every month" },
      ],
      sentence:
        "One month of the loop at AppBazar (MTS), drawn as 20 working days: a call with engineering every working day, sprint planning every two weeks, and a product review once a month.",
    },
    loop: {
      collect: {
        step: "Collect",
        text: "Requests from 90+\u00a0B2B partners, written\u00a0up as user\u00a0stories and specs in the\u00a0backlog.",
        link: "user\u00a0stories",
      },
      rank: {
        step: "Prioritise",
        text: "Backlog ranked RICE-style: the\u00a0requests touching the\u00a0most installs and revenue, for the\u00a0least build, went first.",
      },
      build: {
        step: "Build",
        text: "Two-week sprints with the\u00a0front-end and back-end teams, and direct work with marketing, legal, sales and\u00a0finance.",
      },
      test: {
        step: "Test",
        text: "A/B tests on subscription screens, button\u00a0labels and copy, measured at\u00a0sign-up.",
      },
      measure: {
        step: "Measure",
        text: "DAU, MAU, churn and conversion, with LTV, MRR and NPS reported to leadership.",
      },
      review: { step: "Review", text: "A\u00a0product review every month, then the\u00a0loop starts again." },
    },
    testPair: {
      value: "about ×1.5",
      sentence: "The winning wording converted about 50% better: about ×1.5 against ×1.",
      max: "×2",
    },
  },
  fr: {
    h2: "Ma boucle produit",
    statement:
      "Chez AppBazar (MTS) : un\u00a0appel quotidien avec\u00a0l'équipe\u00a0tech, un\u00a0sprint\u00a0planning tous\u00a0les\u00a0quinze\u00a0jours, une\u00a0revue mensuelle.",
    month: {
      labels: {
        planning: { value: "Sprint planning", text: "tous les quinze jours" },
        call: { value: "Appel avec l'équipe tech", text: "chaque jour ouvré" },
        review: { value: "Revue produit", text: "chaque mois" },
      },
      caption:
        "Un mois type, représenté sur quatre semaines ouvrées.",
      key: [
        { count: "20 points", text: "un appel avec l'équipe tech, chaque jour ouvré" },
        { count: "2 points", text: "le sprint planning, tous les quinze jours" },
        { count: "1 point", text: "la revue produit, chaque mois" },
      ],
      sentence:
        "Un mois de la boucle chez AppBazar (MTS), représenté en 20 jours ouvrés : un appel avec l'équipe tech chaque jour ouvré, un sprint planning tous les quinze jours et une revue produit par mois.",
    },
    loop: {
      collect: {
        step: "Collecter",
        text: "Les\u00a0demandes de\u00a0plus de\u00a090\u00a0partenaires B2B, rédigées en\u00a0user\u00a0stories et en\u00a0specs dans le\u00a0backlog.",
        link: "user\u00a0stories",
      },
      rank: {
        step: "Prioriser",
        text: "Un\u00a0backlog priorisé façon RICE : d'abord les\u00a0demandes à\u00a0fort\u00a0potentiel d'installations et de\u00a0revenus, peu coûteuses à\u00a0développer.",
      },
      build: {
        step: "Développer",
        text: "Des sprints de\u00a0deux\u00a0semaines avec\u00a0les\u00a0équipes front-end et back-end, en\u00a0lien direct avec\u00a0le\u00a0marketing, le\u00a0juridique, les\u00a0ventes et la\u00a0finance.",
      },
      test: {
        step: "Tester",
        text: "Des tests\u00a0A/B sur les\u00a0écrans d'abonnement, les\u00a0libellés et les\u00a0textes, mesurés à\u00a0l'inscription.",
      },
      measure: {
        step: "Mesurer",
        text: "DAU, MAU, churn et conversion, avec\u00a0LTV, MRR et NPS remontés à\u00a0la\u00a0direction.",
      },
      review: { step: "Faire le point", text: "Une\u00a0revue produit chaque mois, puis la\u00a0boucle repart." },
    },
    testPair: {
      value: "environ ×1,5",
      sentence: "La formulation gagnante a obtenu un taux de conversion supérieur d'environ 50% : environ ×1,5 contre ×1.",
      max: "×2",
    },
  },
};
