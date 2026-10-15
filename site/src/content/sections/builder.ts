import type { Localized } from "../localized";

/**
 * Words of the `builder` chapter (src/sections/Builder/), EN + FR.
 * Claim: When nothing fits, he builds the tool and ships it, with AI: a job-search tracker in beta, a creative agent used on client campaigns, and 15+ sites and prototypes since 2020 (final deck, round 3).
 * Spec: .aaa/brief/design-spec/02-home.md §5.3 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * Plate alt text is `dict.media.add|ai`, and the add caption is
 * `dict.media.add.caption`; the roadmap's caption and alt are this chapter's
 * own (`roadmapCaption`, `roadmapAlt`: below 1280px the stage shows an
 * art-directed crop of it, so its alt names only what both show). The ai
 * plate shows a 4:3 crop of the menu screen (the AI button and its open
 * menu) at the interface size of the other two, on three columns where the
 * media caption would run two to four lines, so its one-line caption here
 * (`aiCaption`) is that caption's own first clause. The two poster
 * values are facts: `FREELANCE.campaigns` ("5") and
 * `FREELANCE.sitesCount` ("15+"); each fact reads as one sentence:
 * value + text. The CV A/B test stays on the freelance page only (round 2).
 *
 * Owned by the builder section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */
export interface BuilderCopy {
  /** 2 lines on 8 columns (measured 1116 / 1059px at 96px). The authored break follows the first comma. */
  h2: string;
  /** ≤ 2 lines on 7 columns. */
  statement: string;
  /**
   * The one-click line at the statement step, a plain sentence (the
   * type-set pair is kept for numbers he owns, 01 §7.7), in its two
   * authored lines at every width: "One click from a job post" / "to a
   * full AI analysis." (FR "Un clic, de l'offre" / "à l'analyse IA
   * complète."), so no line ends on "to"/"à". Read as one sentence.
   */
  oneClick: readonly [string, string];
  /** Body under it, ≤ 50 words. */
  oneClickBody: string;
  /** What comes next, in Small. */
  next: string;
  /** Link to the job-tracker case (plus a visually hidden case title). */
  readCase: string;
  /** Caption of the L plate (the roadmap), ≤ 2 Small lines on 8 columns. */
  roadmapCaption: string;
  /**
   * Caption of the S plate (the AI menu), one Small line on 4 columns: the
   * first clause of dict.media.ai.caption (the menu itself shows the four
   * actions, and its alt names them).
   */
  aiCaption: string;
  /**
   * Alt of the L plate. Phones get an art-directed crop of the same
   * roadmap (Month 2 to Month 5), so this alt names only what both
   * pictures show (dict.media.roadmap.alt also names the MVP rows).
   */
  roadmapAlt: string;
  /** Text after the value "5": one sentence with it, ≤ 40 words. */
  agent: string;
  /** Text after the value "15+" (FREELANCE.sitesCount): one sentence with it, ≤ 30 words. */
  sites: string;
  /** The facts' link, in Small: the freelance case. */
  factsLink: string;
}

export const builder: Localized<BuilderCopy> = {
  en: {
    h2: "When no tool fits, I build one",
    statement: "I built my own job\u2011search tracker with AI, and I\u00a0run it like a\u00a0product.",
    oneClick: ["One click from a\u00a0job\u00a0post", "to a\u00a0full AI\u00a0analysis."],
    oneClickBody:
      "Company research, CV fit score, interview prep and follow-up timing with ready\u2011to\u2011send text, plus analytics by company, industry and status, and a Chrome extension that captures a job when you apply.",
    next: "Next: automatic vacancy tracking, direct replies, auto follow-ups.",
    readCase: "Read the case",
    roadmapCaption: "The tracker's roadmap, from shipped MVP to public launch. The beta is live.",
    aiCaption: "AI on every application",
    roadmapAlt:
      "My job-search tracker's roadmap to public launch: a closed beta, then an open beta, the Chrome extension built and tested in parallel, a marker saying the beta is live, and the launch milestone.",
    agent:
      "client campaigns used the Claude\u2011powered creative agent I built. It makes on-brand social and Meta ad creatives from a prompt and supplied images.",
    sites:
      "sites and prototypes I've designed and built since\u00a02020, for artists, influencers, shops and public figures.",
    factsLink: "Freelance web and AI",
  },
  fr: {
    h2: "Faute d'outil, j'en\u00a0construis\u00a0un",
    statement: "J'ai conçu avec l'IA mon propre tracker de\u00a0candidatures, et\u00a0je\u00a0le\u00a0pilote comme un\u00a0produit.",
    oneClick: ["Un\u00a0clic, de\u00a0l'offre", "à\u00a0l'analyse IA\u00a0complète."],
    oneClickBody:
      "Recherche sur l'entreprise, score d'adéquation du CV, préparation d'entretien et date de relance conseillée, avec un message prêt à envoyer. Des statistiques par entreprise, secteur et statut, et une extension Chrome qui enregistre l'offre au moment où vous postulez.",
    next: "À venir : suivi automatique des offres, réponses directes, relances automatiques.",
    readCase: "Voir le projet",
    roadmapCaption: "La roadmap de mon tracker, de la livraison du\u00a0MVP au lancement public. La bêta est en ligne.",
    aiCaption: "L'IA sur chaque candidature",
    roadmapAlt:
      "La roadmap de mon tracker de candidatures jusqu'au lancement public : une bêta fermée puis une bêta ouverte, l'extension Chrome développée et testée en parallèle, un repère indiquant que la bêta est en ligne, et le jalon du lancement.",
    agent:
      "campagnes clients ont utilisé l'agent créatif basé sur Claude que\u00a0j'ai\u00a0conçu. À\u00a0partir d'un prompt et d'images sources, il génère des visuels fidèles à la charte pour les réseaux sociaux et les publicités Meta.",
    sites:
      "sites et prototypes conçus et réalisés depuis\u00a02020, pour des artistes, des influenceurs, des boutiques et des personnalités.",
    factsLink: "Freelance web et IA",
  },
};
