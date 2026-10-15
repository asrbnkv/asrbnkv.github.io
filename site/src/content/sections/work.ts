import type { Localized } from "../localized";
import type { MediaId } from "../media";
import type { CaseSlug } from "../projects";

/**
 * Words of the `work` chapter (src/sections/Work/), EN + FR.
 * Claim: A body of work stands behind the numbers, and every case can be read in full.
 * Spec: .aaa/brief/design-spec/02-home.md §4.4 and §4.6 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * Row titles are `dict.projects[slug].shortTitle` (`dict.freelance.shortTitle`),
 * periods come from `formatPeriod`. The index's pictures are aria-hidden
 * previews: the case page shows each screen with its `dict.media[id]` alt
 * text and caption. The hover plate covers its row's metric block, so it
 * carries the row's metric and caption in its bottom edge; drawn plates
 * keep their few words (`plateCaptions`).
 *
 * Owned by the work section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */

/**
 * Tighter 16:10 stage crops of real screens, made for the index's pictures
 * (about 420×260 inside the 1440 plate, 330×206 on a phone) so their words
 * stay legible there: the full stage files set a 14px UI label at 5–9px in
 * a picture this size. Same grade as every stage file (01 §8.1: saturation
 * ×0.85, then levels black → ink, white → paper), native size, never
 * upscaled, no UI text cut. Boxes are [left, top, right, bottom] in source
 * pixels (.aaa/source-assets/<source>.webp); the files sit in
 * src/sections/Work/media/.
 */
export const WORK_CROPS = {
  /** The AI button and its four actions: one click to "Analyse match". */
  "ai-menu": { source: "ai", box: [110, 44, 734, 434] },
  /** The head of one film card: title, director, section, length, time, room. */
  "film-card": { source: "c_film", box: [8, 68, 664, 478] },
  /**
   * The top of the slide's stack of sites (an artist's portfolio, a shop
   * catalogue, a main page): three things, 400×250, so "Mitchell Rouse" and
   * "Catalogue" read at 1:1 (the slide's decks, logos and posts left out).
   */
  "fl-sites": { source: "fl_slide", box: [52, 176, 452, 426] },
} as const satisfies Record<string, { source: MediaId; box: readonly [number, number, number, number] }>;

export type WorkCrop = keyof typeof WORK_CROPS;

/**
 * What each row previews (02 §4.4), in CASE_SLUGS order on the page. The
 * picture is an ink 16:10 stage: a graded screen crop (contained, never
 * upscaled), the AppBazar phone screen at its own radius beside the DAU
 * pair it moved (×1 → ×2, the shared `PAIRS.dau`), or a drawing made from
 * the case's own facts (the Havaianas sum, the 80 accounts, the two 100-dot
 * retention fields). `list`, `dash` and `stats` never appear.
 */
export type WorkPlate =
  | { kind: "screen"; crop: WorkCrop }
  | { kind: "phone"; media: "ab_feed"; pair: "dau" }
  | { kind: "sum" }
  | { kind: "accounts" }
  | { kind: "retention" };

export const WORK_INDEX: Record<CaseSlug, { plate: WorkPlate }> = {
  "appbazar-product": { plate: { kind: "phone", media: "ab_feed", pair: "dau" } },
  havaianas: { plate: { kind: "sum" } },
  "appbazar-payments": { plate: { kind: "retention" } },
  "appbazar-crm": { plate: { kind: "accounts" } },
  "job-tracker": { plate: { kind: "screen", crop: "ai-menu" } },
  cannes: { plate: { kind: "screen", crop: "film-card" } },
  freelance: { plate: { kind: "screen", crop: "fl-sites" } },
};

/**
 * The drawn plates' units (01 §7.9: one dot, one unit; content-source.md):
 * 80+ B2B accounts on one CRM (the "+" is said in words, never drawn);
 * about 97 clients in 100 kept through the restructuring, against the 60 to
 * 70 in 100 management expected (the range drawn faint).
 */
type DotSegment = { kind: "after" | "before" | "faint" | "empty"; count: number };

export const WORK_FIELDS: Record<"accounts" | "kept" | "expected", readonly DotSegment[]> = {
  accounts: [{ kind: "after", count: 80 }],
  kept: [
    { kind: "after", count: 97 },
    { kind: "before", count: 3 },
  ],
  expected: [
    { kind: "before", count: 60 },
    { kind: "faint", count: 10 },
    { kind: "empty", count: 30 },
  ],
};

export interface WorkRowCopy {
  /** The row's metric, written for this language (the case cover's figure). */
  metric: string;
  /** What the metric measures, read after it: "2× upsell in one season". ≤ 34 characters. */
  caption: string;
}

export interface WorkCopy {
  /** 1 line on 9 columns at 1440; ≤ 2 lines at 390 (measured). */
  h2: string;
  /** ≤ 2 lines on 6 columns. */
  statement: string;
  /** One per case, in CASE_SLUGS order on the page. */
  rows: Record<CaseSlug, WorkRowCopy>;
  /** Small captions inside the drawn plates (dot fields). */
  plateCaptions: { field: string; kept: string; expected: string };
}

export const work: Localized<WorkCopy> = {
  en: {
    h2: "Behind the numbers",
    statement: "Every case in full, from a telecom's app store to a festival planner.",
    rows: {
      "appbazar-product": { metric: "+100%", caption: "DAU in three months" },
      havaianas: { metric: "2×", caption: "upsell in one season" },
      "appbazar-payments": { metric: "97%", caption: "of clients kept" },
      "appbazar-crm": { metric: "80+", caption: "B2B accounts on one system" },
      "job-tracker": { metric: "1 click", caption: "from job post to AI analysis" },
      cannes: { metric: "3 days", caption: "planned by the app I built" },
      freelance: { metric: "15+", caption: "sites and prototypes" },
    },
    plateCaptions: { field: "One dot, one account", kept: "Kept", expected: "Expected by management" },
  },
  fr: {
    h2: "Derrière les chiffres",
    statement: "Chaque projet en détail, d'une marketplace d'apps mobiles à un planning de festival.",
    rows: {
      "appbazar-product": { metric: "+100%", caption: "de DAU en trois mois" },
      havaianas: { metric: "×2", caption: "d'upsell en une saison" },
      "appbazar-payments": { metric: "97%", caption: "des clients conservés" },
      "appbazar-crm": { metric: "80+", caption: "comptes B2B dans un seul CRM" },
      "job-tracker": { metric: "1 clic", caption: "de l'offre à l'analyse IA" },
      cannes: { metric: "3 jours", caption: "planifiés par l'app que j'ai créée" },
      freelance: { metric: "15+", caption: "sites et prototypes" },
    },
    plateCaptions: { field: "Un point, un compte", kept: "Conservés", expected: "Attendus par la direction" },
  },
};
