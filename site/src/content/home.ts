import type { Localized } from "./localized";
import type { CaseSlug } from "./projects";

/**
 * Shared, locale-independent facts read by more than one home chapter
 * (02-home.md §0.3). Every value traces to content-source.md. Facts used by
 * a single chapter live in that chapter's module (src/content/sections/).
 */

/** A pair drawn to an honest, zero-based scale (01 §7.6). */
export interface ScaledPair {
  /** The before state as a point… */
  before?: number;
  /** …or as a range, drawn as a capsule (the 60–70% forecast). */
  band?: readonly [number, number];
  after: number;
  /** Scale maximum; the scale always starts at 0. */
  max: number;
  /** The after value is approximate ("about ×1.5"): the label says so. */
  hedged?: boolean;
}

export const PAIRS = {
  /** DAU at AppBazar (MTS), first three months: ×1 → ×2. */
  dau: { before: 1, after: 2, max: 2 },
  /** MAU at AppBazar (MTS): ×1 → ×1.4 (+40%). */
  mau: { before: 1, after: 1.4, max: 2 },
  /** Sign-up wording A/B test: the winner converted about 50% better. */
  abWording: { before: 1, after: 1.5, max: 2, hedged: true },
  /** Clients kept through the restructuring: 60–70% expected, about 97% kept. */
  retention: { band: [60, 70], after: 97, max: 100, hedged: true },
} as const satisfies Record<string, ScaledPair>;

export type PairId = keyof typeof PAIRS;

/**
 * Giant figures (01 §3.5). `fit` is the measured ink width in em at −0.04em
 * tracking (Chromium, League Spartan 800, first ink to last ink; the French
 * U+202F at half size; re-measured WF3 r2), `inkLeft` the shift that puts the first ink on the margin
 * (03 §10 table). The French value keeps U+202F before % (the Figure
 * component sets it at half size).
 */
export interface FigureFact {
  value: Localized<string>;
  fit: Localized<number>;
  inkLeft: Localized<number>;
  case: CaseSlug;
}

export const FIGURES = {
  dau: {
    value: { en: "+100%", fr: "+100 %" },
    fit: { en: 2.647, fr: 2.9425 },
    inkLeft: { en: 0.0525, fr: 0.0525 },
    case: "appbazar-product",
  },
  upsell: {
    value: { en: "2×", fr: "×2" },
    fit: { en: 0.9985, fr: 0.976 },
    inkLeft: { en: 0.01, fr: 0.0405 },
    case: "havaianas",
  },
  retention: {
    value: { en: "97%", fr: "97 %" },
    fit: { en: 1.823, fr: 2.0385 },
    inkLeft: { en: 0.0175, fr: 0.0175 },
    case: "appbazar-payments",
  },
  accounts: {
    value: { en: "80+", fr: "80+" },
    fit: { en: 1.5205, fr: 1.5205 },
    inkLeft: { en: 0.026, fr: 0.026 },
    case: "appbazar-crm",
  },
} as const satisfies Record<string, FigureFact>;

export type FigureId = keyof typeof FIGURES;
