import type { Localized } from "../localized";
import type { CaseSlug } from "../projects";

/**
 * Words of the `retro` chapter (src/sections/Retro/), EN + FR.
 * Claim: He judges his own work: one lesson from each of six projects, each linked to its case.
 * Spec: .aaa/brief/design-spec/02-home.md §7 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * Each line is his own reflection from the case, turned into an imperative
 * plus its reason. The case pages print the same imperative as their retro
 * H2 (`dict.projects[slug].retro.line`, `dict.freelance.retro.line`) with a
 * longer reason. Cannes has no reflection in the sources, so no line.
 *
 * Owned by the retro section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */

export type RetroCase = Exclude<CaseSlug, "cannes">;

/** The wall's order (CASE_SLUGS without Cannes). */
export const RETRO_ORDER: readonly RetroCase[] = [
  "appbazar-product",
  "havaianas",
  "appbazar-payments",
  "appbazar-crm",
  "job-tracker",
  "freelance",
];

export interface RetroItem {
  /**
   * The imperative, display step: ≤ 2 lines on 8 columns at 1440 and 1100, and at 768 and 390 (measured).
   * A no-break space glues a phrase so no line ends on an article, a preposition or "and"/« et »,
   * and no lesson ends on a lone word ("Write / the playbook earlier.", « Prioriser / plus radicalement. »).
   * Glued phrases never wrap: the widest, "the playbook earlier.", is 8.48em at LS 700, and the
   * phone size is set so it always fits (42px at 390, 38.6px at 360).
   */
  line: string;
  /** The reason, body size, on the line's last baseline: ≤ 130 characters EN, 150 FR. */
  reason: string;
}

export interface RetroCopy {
  /** ≤ 2 lines everywhere (measured). */
  h2: string;
  /** ≤ 2 lines on 7 columns. */
  statement: string;
  /** Accessible-name prefix of each case link ("Read the case: Havaianas"); the visible text is the short title. */
  readCase: string;
  items: Record<RetroCase, RetroItem>;
}

export const retro: Localized<RetroCopy> = {
  en: {
    h2: "What I'd do differently",
    statement: "Six projects, and the one thing I'd\u00a0change in each. Mostly: start sooner.",
    readCase: "Read the case:",
    items: {
      "appbazar-product": {
        line: "Prioritise harder.",
        reason: "The roadmap tried to please too many partners at once. Fewer, bigger bets would have moved the metrics more.",
      },
      havaianas: {
        line: "Automate fully from\u00a0the\u00a0start.",
        reason: "With code and AI, instead of leaving part of the data entry manual.",
      },
      "appbazar-payments": {
        line: "Write the\u00a0playbook\u00a0earlier.",
        reason: "The migration playbook, so that re-signing every contract didn't rest on me alone.",
      },
      "appbazar-crm": {
        line: "Build the CRM in\u00a0the\u00a0first\u00a0weeks.",
        reason: "Until it existed, some contacts probably slipped through.",
      },
      "job-tracker": {
        line: "Plan the migration from\u00a0day\u00a0one.",
        reason: "My account rollout wiped progress for users who were there before the beta.",
      },
      freelance: {
        line: "Lean into AI and\u00a0automation.",
        reason: "More than into design itself: that's where the leverage was.",
      },
    },
  },
  fr: {
    h2: "Ce que je ferais autrement",
    statement: "Six projets et, pour chacun, ce que je changerais. Le\u00a0plus\u00a0souvent : commencer plus tôt.",
    readCase: "Voir le projet :",
    items: {
      "appbazar-product": {
        line: "Prioriser plus\u00a0radicalement.",
        reason:
          "La roadmap voulait contenter trop de partenaires à la fois. Moins de paris, mais plus ambitieux, auraient davantage fait bouger les indicateurs.",
      },
      havaianas: {
        line: "Tout automatiser dès\u00a0le\u00a0départ.",
        reason: "Avec du code et de l'IA, plutôt que de laisser une part de saisie manuelle.",
      },
      "appbazar-payments": {
        line: "Écrire le\u00a0playbook plus\u00a0tôt.",
        reason: "Le playbook de migration, pour que la re-signature de chaque contrat ne repose pas sur moi seul.",
      },
      "appbazar-crm": {
        line: "Construire le\u00a0CRM plus\u00a0tôt.",
        reason: "Dès les premières semaines. Introduit tard, il a sans doute laissé filer des contacts.",
      },
      "job-tracker": {
        line: "Anticiper la\u00a0migration.",
        reason: "En déployant les comptes, j'ai effacé la progression des premiers utilisateurs, arrivés avant la bêta.",
      },
      freelance: {
        line: "Miser sur\u00a0l'IA et\u00a0l'automatisation.",
        reason: "Plus que sur le design lui-même : c'est là qu'était le levier.",
      },
    },
  },
};
