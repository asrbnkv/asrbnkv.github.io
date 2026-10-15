/**
 * Words for the freelance page (the seventh case), EN + FR
 * (03-case-and-pages.md; final deck in .aaa/brief/copy-deck.md). Owned by
 * the case-study agent. Facts live in ../projects.ts (FREELANCE). Cover S:
 * 15+ beside the type-set pair. The period is "since 2020", never "four
 * years" (the CV splits it into web design 2020–24 and consulting since
 * 2025). Context is "Who I built for", result is "Two AI projects".
 */
import type { Localized } from "../localized";
import type { FreelanceCopy } from "./types";

export const freelance: Localized<FreelanceCopy> = {
  en: {
    title: "Freelance web and AI",
    h1: "Freelance\nweb and AI",
    shortTitle: "Freelance",
    tagline: "From an artist's portfolio site to AI built into clients’ workflows.",
    meta: "Freelance, since 2020",
    ogAlt: "Freelance web and AI: 15+ sites and prototypes since 2020.",
    cover: {
      caption: "sites and prototypes since 2020",
      typeSet: { before: "By hand", after: "from a prompt", spoken: "Made by hand, then from a prompt" },
      context:
        "Ad creatives for a marketing agency, made by the Claude-powered agent I built.",
    },
    lead: "Sites, prototypes and brand work for artists, influencers, shops and public figures.",
    names: {
      items: [
        { name: "Artist portfolio site", note: "A custom site for a visual artist." },
        { name: "Influencer websites", note: "Personal sites and landing pages for public figures." },
        { name: "Online shops", note: "E-commerce sites with ordering and payment." },
        { name: "Brand and promo materials" },
        { name: "AI integrations" },
      ],
    },
    actions: [
      "Designed and built 15+ sites and prototypes.",
      "Created brand and visual identities.",
      "Made promo material for furniture and IT companies.",
      "Built AI integrations into Figma and Excel workflows for clients.",
    ],
    aiProjects: {
      agent: {
        title: "An AI creative agent",
        body: "A marketing agency was spending hours building social and Meta ad creatives by hand in Figma. The brand design system already existed, so I built a Claude-powered agent that generates on-brand creatives from a prompt and supplied images. Used across five client campaigns.",
        fieldCaption: "One dot, one client campaign",
        fieldSentence: "5 dots, one per client campaign that used the agent.",
      },
      cv: {
        title: "My CV, A/B tested",
        body: "I A/B tested my own CV's wording, format and framing with an AI agent. The winning version raised application-to-interview conversion to 25%.",
        caption: "application-to-interview conversion, winning version",
      },
    },
    retro: {
      line: "Lean into AI and automation.",
      reason: "More than into design itself: that's where the leverage was.",
    },
  },
  fr: {
    title: "Freelance web et IA",
    h1: "Freelance\nweb et IA",
    shortTitle: "Freelance",
    tagline: "Du site d'une artiste à l'IA intégrée aux workflows de mes clients.",
    meta: "Freelance, depuis 2020",
    ogAlt: "Freelance web et IA : plus de 15 sites et prototypes depuis 2020.",
    cover: {
      caption: "sites et prototypes depuis 2020",
      typeSet: { before: "À la main", after: "à partir d'un prompt", spoken: "À la main, puis à partir d'un prompt" },
      context:
        "Des visuels publicitaires pour une agence marketing, générés par l'agent basé sur Claude que j'ai conçu.",
    },
    lead: "Des sites et du branding pour des artistes, des influenceurs, des boutiques et des personnalités.",
    names: {
      items: [
        { name: "Site portfolio d'artiste", note: "Un site sur mesure pour une artiste." },
        { name: "Sites d'influenceurs", note: "Sites personnels et landing pages pour des personnalités." },
        { name: "Boutiques en ligne", note: "Sites e-commerce avec commande et paiement." },
        { name: "Branding et supports promo" },
        { name: "Intégrations IA" },
      ],
    },
    actions: [
      "J'ai conçu et réalisé plus de 15 sites et prototypes.",
      "J'ai créé des identités de marque et des chartes graphiques.",
      "J'ai réalisé des supports promo pour des entreprises de mobilier et d'informatique.",
      "J'ai intégré l'IA dans les workflows Figma et Excel de mes clients.",
    ],
    aiProjects: {
      agent: {
        title: "Un agent créatif IA",
        body: "Une agence marketing passait des heures à créer à la main, dans Figma, ses visuels pour les réseaux sociaux et Meta Ads. La charte de la marque existait déjà : j'ai conçu un agent basé sur Claude qui génère des visuels fidèles à la charte à partir d'un prompt et d'images sources. L'agent a été utilisé pour cinq campagnes clients.",
        fieldCaption: "Un point, une campagne client",
        fieldSentence: "5 points, un par campagne client qui a utilisé l'agent.",
      },
      cv: {
        title: "Mon CV, testé en A/B",
        body: "Avec un agent IA, j'ai testé en A/B les textes, le format et l'angle de mon propre CV. La version gagnante a porté à 25% le taux de candidatures transformées en entretiens.",
        caption: "de candidatures transformées en entretiens, version gagnante",
      },
    },
    retro: {
      line: "Miser sur l'IA et l'automatisation.",
      reason: "Plus que sur le design lui-même : c'est là qu'était le levier.",
    },
  },
};
