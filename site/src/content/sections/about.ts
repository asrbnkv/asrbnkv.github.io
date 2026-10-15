import type { Period } from "../format";
import type { Localized } from "../localized";

/**
 * Words of the `about` chapter (src/sections/About/), EN + FR.
 * Claim: Trained in three countries, certified in product, trilingual; the path in one screen, without repeating the cases.
 * Spec: .aaa/brief/design-spec/02-home.md §8.3 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * The ledger under the route reuses shared words: `dict.experience.items`,
 * `dict.certifications.items`, `dict.languages`, `dict.skills.groups`
 * (product, metrics, data, crmTools, design, ai). Conservative choices
 * (content-source conflict table): "Key Account Manager" for Havaianas,
 * "Top 5%" for HSE, "master's, Luxury & Design Management" for ICN,
 * "2021–22" for the Erasmus semester.
 *
 * Owned by the about section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */

export type RouteStop = "moscow" | "breda" | "paris";

/** The route's order (an <ol>: the order is the information). Paris is now. */
export const ROUTE_ORDER: readonly RouteStop[] = ["moscow", "breda", "paris"];

/** The stop where he is now: drawn in the after colour (01 §7.11). */
export const ROUTE_NOW: RouteStop = "paris";

/**
 * When he was in each place: the route's time axis, printed under each city
 * at the statement step (EN "2019–23", FR "2019–2023"; an ongoing stay reads
 * the dictionary's present: "2023–now", « Depuis 2023 »).
 * Moscow: the HSE bachelor's (EDUCATION.hse). Breda: the Erasmus semester at
 * Avans (EDUCATION.erasmus, the conservative 2021–22). Paris: ICN 2023–25 and
 * Havaianas 2023–25, and he is still there (02 §0.3 ROUTE: 2023–present).
 */
export const ROUTE_PERIODS: Record<RouteStop, Period> = {
  moscow: { from: 2019, to: 2023 },
  breda: { from: 2021, to: 2022 },
  paris: { from: 2023, to: "present" },
};

/**
 * The six tool groups the chapter lists, in this order (02 §8.1): the
 * soft-skills, account and languages groups and the legacy filters are not
 * shown here. Words: dict.skills.groups.
 */
export const ABOUT_TOOL_GROUPS = ["product", "metrics", "data", "crmTools", "design", "ai"] as const;

export interface AboutCopy {
  /** ≤ 2 lines (measured). Its three words are the route's places. */
  h2: string;
  /** ≤ 2 lines on 7 columns (measured). */
  statement: string;
  /**
   * One stop of the route. `city` is the H2's word; `lines` are the stop's
   * label, three authored Small lines (school, programme, distinction or
   * dates), each ≤ 420px at 15px in EN and FR. A line breaks only at its
   * authored points, marked "|": "Bachelor's,|International Business
   * Administration" may wrap after "Bachelor's," and nowhere else, so a
   * school or programme name is never split. The years are not repeated
   * here: they come from ROUTE_PERIODS.
   */
  route: Record<RouteStop, { city: string; lines: readonly string[] }>;
  /** Small, muted, under the whole route. */
  routeCaption: string;
  /** The ledger's headings (h3). */
  headings: { experience: string; certifications: string; languages: string; tools: string };
  /** Before the Download CV link, beside the statement. */
  cvLine: string;
}

export const about: Localized<AboutCopy> = {
  en: {
    h2: "Moscow, Breda, Paris",
    statement: "Two business degrees, an\u00a0Erasmus semester and\u00a0four product certifications, the latest in 2026.",
    route: {
      moscow: {
        city: "Moscow",
        lines: [
          "Higher School of Economics",
          "Bachelor's,|International Business Administration",
          "Top\u00a05% of the programme.",
        ],
      },
      breda: {
        city: "Breda",
        lines: [
          "Avans University of Applied Sciences",
          "Erasmus,|Business Leadership\u00a0&\u00a0Sustainability",
          "Led a project for the city council.",
        ],
      },
      paris: {
        city: "Paris",
        lines: [
          "ICN Business School:|master's, Luxury\u00a0&\u00a0Design\u00a0Management",
          "2023–25. Thesis\u00a018/20.",
          "Havaianas, 2023–25.|Now open to Product\u00a0Owner roles.",
        ],
      },
    },
    routeCaption: "Not a map, not to scale: three places, in order.",
    headings: { experience: "Experience", certifications: "Certifications", languages: "Languages", tools: "Tools" },
    cvLine: "The full CV:",
  },
  fr: {
    h2: "Moscou, Breda, Paris",
    statement: "Deux diplômes de management, un\u00a0semestre Erasmus et\u00a0quatre certifications\u00a0produit, dont la dernière en 2026.",
    route: {
      moscow: {
        city: "Moscou",
        lines: [
          "Higher School of Economics",
          "Bachelor,|International Business Administration",
          "Top\u00a05% de la promotion.",
        ],
      },
      breda: {
        city: "Breda",
        lines: [
          "Avans University of Applied Sciences",
          "Erasmus,|Business Leadership\u00a0&\u00a0Sustainability",
          "Projet mené pour la municipalité.",
        ],
      },
      paris: {
        city: "Paris",
        lines: [
          "ICN Business School :|master, Luxury\u00a0&\u00a0Design\u00a0Management",
          "2023–2025. Mémoire noté\u00a018/20.",
          "Havaianas, 2023–2025.|Aujourd'hui ouvert aux postes de PO.",
        ],
      },
    },
    routeCaption: "Schéma sans échelle : trois villes, dans l'ordre.",
    headings: { experience: "Expérience", certifications: "Certifications", languages: "Langues", tools: "Outils" },
    cvLine: "Le CV complet :",
  },
};
