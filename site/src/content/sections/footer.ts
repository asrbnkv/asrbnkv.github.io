import type { Localized } from "../localized";

/**
 * Words of the `footer` chapter (src/sections/Footer/), EN + FR.
 * Claim: The page ends where it began: the two dots come home to 'Artëm', now orange, the colour every 'after' took on the way down.
 * Spec: .aaa/brief/design-spec/02-home.md §11; the final copy deck §11 (the row).
 *
 * Owned by the footer section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */
export interface FooterCopy {
  /**
   * The row's first line: his name as plain text, "Artem Serebryannikov"
   * (copy deck §11, 02 §11.1; PRODUCT.md: the name is Artem, the ё is the
   * wordmark's). The ë stays where it is a mark: the monument above and the
   * bar's wordmark. This line is what a reader copies into a search or an
   * email, and what assistive tech reads for the aria-hidden monument.
   */
  name: string;
  /** Under the name, muted. */
  role: string;
  /** The languages he works in. */
  languages: string;
  /** CV link label. */
  cv: string;
}

export const footer: Localized<FooterCopy> = {
  en: {
    name: "Artem Serebryannikov",
    role: "Product Owner, Paris",
    languages: "French, English, Russian",
    cv: "Download CV",
  },
  fr: {
    name: "Artem Serebryannikov",
    role: "Product Owner, Paris",
    languages: "Français, anglais, russe",
    cv: "Télécharger le CV",
  },
};
