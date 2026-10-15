import type { PairId } from "./home";
import type { Localized } from "./localized";

/**
 * Words of the shared pairs (`dict.home.pairs`, 02 §3.8), read by the hero,
 * the stories, the proof scenes and the method so every chapter says the
 * same thing. Shared: changed only by the content owner.
 */
export interface PairLabel {
  /** The value line (Figtree 600), e.g. "×1". */
  value: string;
  /** The description line (Figtree 400), e.g. "at the start". */
  text: string;
}

export interface PairCopy {
  /** The measure's name, e.g. "DAU at AppBazar (MTS)" (the social card). */
  measure?: string;
  /**
   * The value under x(0), on the ×1 / ×2 line: "0", "0%" (01 §7.6, the
   * scale stated in words). Defaults to "0".
   */
  zero?: string;
  /**
   * @deprecated v2.0 shape: [the zero label, unused]. Read as `zero` when
   * that is absent (the case covers still pass it).
   */
  start?: readonly [string, string];
  /** The before state (a dot, or the capsule of a range). */
  before: PairLabel;
  /** The after state. */
  after: PairLabel;
  /**
   * The measure and the scale in one line ("DAU at AppBazar (MTS). Scale 0
   * to ×2."): the Small caption under the pair from 600px (it starts at the
   * before dot's left edge), and the phone legend's closing line.
   */
  legend: string;
  /** Visually hidden sentence stating the comparison (01 §7.6). */
  sentence: string;
}

export const PAIR_COPY: Localized<Record<PairId, PairCopy>> = {
  en: {
    dau: {
      measure: "DAU at AppBazar (MTS)",
      zero: "0",
      before: { value: "×1", text: "at the start" },
      after: { value: "×2", text: "three months in" },
      legend: "DAU at AppBazar (MTS). Scale 0\u00A0to\u00A0×2.",
      sentence:
        "Daily active users at AppBazar (MTS) went from ×1 to ×2 in the first three months, on a scale from 0 to ×2.",
    },
    mau: {
      measure: "MAU at AppBazar (MTS)",
      zero: "0",
      before: { value: "×1", text: "before" },
      after: { value: "×1.4", text: "after" },
      legend: "MAU at AppBazar (MTS). Scale 0\u00A0to\u00A0×2.",
      sentence:
        "Monthly active users at AppBazar (MTS) grew 40%, from ×1 to ×1.4, on a scale from 0 to ×2.",
    },
    abWording: {
      measure: "Sign-up conversion",
      zero: "0",
      before: { value: "×1", text: "the other wording" },
      after: { value: "about ×1.5", text: "the winning wording" },
      legend: "Sign-up conversion. Scale 0\u00A0to\u00A0×2.",
      sentence:
        "The winning wording converted about 50% better than the other: about ×1.5, on a scale from 0 to ×2.",
    },
    retention: {
      measure: "Clients kept",
      zero: "0%",
      before: { value: "60–70%", text: "expected by management" },
      after: { value: "about 97%", text: "kept" },
      legend: "Clients kept through a restructuring. Scale 0\u00A0to\u00A0100%.",
      sentence:
        "About 97% of clients were kept through a restructuring, where management expected 60 to 70%, on a scale from 0 to 100%.",
    },
  },
  fr: {
    dau: {
      measure: "DAU chez AppBazar (MTS)",
      zero: "0",
      before: { value: "×1", text: "au départ" },
      after: { value: "×2", text: "trois mois plus tard" },
      legend: "DAU chez AppBazar (MTS). Échelle de 0\u00A0à\u00A0×2.",
      sentence:
        "Le nombre d'utilisateurs actifs quotidiens d'AppBazar (MTS) a doublé en trois mois : de ×1 à ×2, sur une échelle de 0 à ×2.",
    },
    mau: {
      measure: "MAU chez AppBazar (MTS)",
      zero: "0",
      before: { value: "×1", text: "avant" },
      after: { value: "×1,4", text: "après" },
      legend: "MAU chez AppBazar (MTS). Échelle de 0\u00A0à\u00A0×2.",
      sentence:
        "Le nombre d'utilisateurs actifs mensuels d'AppBazar (MTS) a augmenté de 40% : de ×1 à ×1,4, sur une échelle de 0 à ×2.",
    },
    abWording: {
      measure: "Conversion à l'inscription",
      zero: "0",
      before: { value: "×1", text: "l'autre formulation" },
      after: { value: "environ ×1,5", text: "la formulation gagnante" },
      legend: "Conversion à l'inscription. Échelle de 0\u00A0à\u00A0×2.",
      sentence:
        "La formulation gagnante a obtenu un taux de conversion supérieur d'environ 50% à celui de l'autre : environ ×1,5, sur une échelle de 0 à ×2.",
    },
    retention: {
      measure: "Clients conservés",
      zero: "0%",
      before: { value: "60–70%", text: "attendus par la direction" },
      after: { value: "environ 97%", text: "conservés" },
      legend: "Clients conservés malgré une restructuration. Échelle de 0\u00A0à\u00A0100%.",
      sentence:
        "Environ 97% des clients ont été conservés malgré une restructuration, quand la direction en attendait 60 à 70%, sur une échelle de 0 à 100%.",
    },
  },
};
