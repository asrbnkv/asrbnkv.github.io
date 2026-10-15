import type { Localized } from "../localized";

/**
 * Words of the `hero` chapter (src/sections/Hero/), EN + FR.
 * Claim: In one second: Artëm, Product Owner, Paris, three languages, one number (DAU ×1 → ×2) and the action.
 * Spec: .aaa/brief/design-spec/02-home.md §1.4 (copy deck, budgets).
 *
 * Owned by the hero section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */
export interface HeroCopy {
  /** The h1's aria-label. Plain "Artem": recruiters and search read it that way; the ë stays in display type. */
  h1Label: string;
  /** Role line, set with a no-break space. */
  role: string;
  /**
   * City, the roles he is open to, the languages. Each ≤ 330px at 19px
   * Figtree 400 (measured EN 116 / 317 / 310, FR 100 / 292 / 327).
   */
  facts: readonly [string, string, string];
  /** ≤ 25 words; ≤ 3 lines on 6 columns at 1440. */
  statement: string;
  /** Primary button label (≤ 12 characters). */
  cta: string;
  /** Mailto subject of the primary button. */
  ctaSubject: string;
  /** Download CV link label. */
  cv: string;
  /** What the CV is (Small, after the link). */
  cvNote: string;
  /** Alt text of the bust glyph. */
  bustAlt: string;
}

export const hero: Localized<HeroCopy> = {
  en: {
    h1Label: "Artem Serebryannikov, Product Owner",
    role: "Product\u00a0Owner",
    facts: [
      "Based in Paris",
      "Open to PO and PM roles",
      "I speak French, English and Russian",
    ],
    statement: "Three years in product and key accounts, across IT and retail. I turn commercial chaos into systems that teams rely on.",
    cta: "Email me",
    ctaSubject: "Product Owner role",
    cv: "Download CV",
    cvNote: "PDF, in French",
    bustAlt: "Artem Serebryannikov",
  },
  fr: {
    h1Label: "Artem Serebryannikov, Product Owner",
    role: "Product\u00a0Owner",
    facts: [
      "Basé à Paris",
      "Ouvert aux postes de PO et de PM",
      "Je parle français, anglais et russe",
    ],
    statement: "Trois ans entre produit et grands\u00a0comptes, dans l'IT et le\u00a0retail. Je transforme le\u00a0chaos commercial en systèmes fiables.",
    cta: "Écrivez-moi",
    ctaSubject: "Poste de Product Owner",
    cv: "Télécharger le CV",
    cvNote: "PDF",
    bustAlt: "Artem Serebryannikov",
  },
};
