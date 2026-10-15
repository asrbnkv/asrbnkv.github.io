/**
 * Words for the appbazar-crm case, EN + FR (03-case-and-pages.md; final deck
 * in .aaa/brief/copy-deck.md). Owned by the case-study agent. Facts live in
 * ../projects.ts. Cover S: 80+ beside the type-set pair. "90%+ retention"
 * is never printed: the restructuring is told once, with the payments
 * case's numbers, and this page links there. No stage names, team sizes
 * or per-market counts exist in the sources.
 */
import type { Localized } from "../localized";
import type { ProjectCopy } from "./types";

export const appbazarCrm: Localized<ProjectCopy<"appbazar-crm">> = {
  en: {
    company: "AppBazar (MTS)",
    title: "A CRM from zero",
    h1: "A CRM from zero",
    shortTitle: "AppBazar CRM",
    metricCaption: "B2B accounts on one system",
    tagline: "Accounts, deals and onboarding in one place, at last.",
    meta: "Product & Account Manager at\u00a0AppBazar\u00a0(MTS), Dec\u00a02022\u00a0–\u00a0Aug\u00a02023",
    ogAlt: "A CRM from zero: 80+ B2B accounts on one system.",
    stats: { zeroToOne: "Built from scratch", adoption: "Team adoption", markets: "Markets" },
    cover: {
      caption: "B2B accounts on one system",
      typeSet: { before: "No CRM", after: "the team's daily tool", spoken: "No CRM to the team's daily tool" },
      context: "Salesforce, with Notion for docs and Slack for alerts",
    },
    lead: "There was no CRM.",
    contextBody:
      "Client data, deal stages, onboarding and account health had no single home. With the portfolio past 80 international partners, things were slipping through.",
    actions: [
      "Designed and built the CRM pipeline in Salesforce, for the whole commercial team.",
      "Connected it to Notion for documentation and onboarding, and to Slack for alerts.",
      "Defined the data model, the stages and the workflows.",
    ],
    sum: {
      terms: [
        { op: "", text: "Salesforce", role: "the pipeline" },
        { op: "+", text: "Notion", role: "docs and onboarding" },
        { op: "+", text: "Slack", role: "alerts" },
        { op: "=", text: "One system" },
      ],
      outputs: [{ text: "China" }, { text: "Spain" }, { text: "Poland" }, { text: "India" }],
      outputsCaption: "80+ accounts, four markets",
      sentence:
        "Salesforce runs the pipeline, Notion holds the docs and onboarding, and Slack sends the alerts: one system for 80+ accounts in China, Spain, Poland and India.",
    },
    changedLead: "Full visibility on 80+ accounts, where there had been none.",
    changedBody:
      "It was also the backbone that held the client base through a restructuring: the [payments case](case:appbazar-payments) tells how.",
    related: "More of my AppBazar work: [the product case](case:appbazar-product).",
    unitField: {
      caption: "One dot, one account.",
      markets: ["China", "Spain", "Poland", "India"],
      sentence: "80 dots, one per account: 80+ B2B accounts on one CRM, across China, Spain, Poland and India.",
    },
    statRow: [
      { value: "100%", caption: "team adoption" },
      { value: "4", caption: "markets" },
    ],
    retro: {
      line: "Build the CRM in the first weeks.",
      reason: "Until it existed, some contacts probably slipped through.",
    },
  },
  fr: {
    company: "AppBazar (MTS)",
    title: "Un CRM créé de\u00a0toutes\u00a0pièces",
    h1: "Un CRM créé\nde toutes pièces",
    shortTitle: "CRM AppBazar",
    metricCaption: "comptes B2B dans un seul CRM",
    tagline: "Comptes, opportunités et onboarding, enfin au même endroit.",
    meta: "Product & Account Manager chez\u00a0AppBazar\u00a0(MTS), déc.\u00a02022\u00a0–\u00a0août\u00a02023",
    ogAlt: "Un CRM créé de toutes pièces : plus de 80 comptes B2B dans un seul CRM.",
    stats: { zeroToOne: "Créé de toutes pièces", adoption: "Adoption dans l'équipe", markets: "Marchés" },
    cover: {
      caption: "comptes B2B dans un seul CRM",
      typeSet: {
        before: "Aucun CRM",
        after: "l'outil quotidien de l'équipe",
        spoken: "Aucun CRM, puis l'outil quotidien de l'équipe",
      },
      context: "Salesforce, avec Notion pour la doc et Slack pour les alertes",
    },
    lead: "Il n'y avait pas de CRM.",
    contextBody:
      "Données clients, avancement des négociations, onboarding et santé des comptes : rien n'était centralisé. Avec un portefeuille de plus de 80 partenaires internationaux, des informations passaient entre les mailles du filet.",
    actions: [
      "J'ai conçu et mis en place le pipeline CRM dans Salesforce, pour toute l'équipe commerciale.",
      "Je l'ai relié à Notion pour la documentation et l'onboarding, et à Slack pour les alertes.",
      "J'ai défini le modèle de données, les étapes et les workflows.",
    ],
    sum: {
      terms: [
        { op: "", text: "Salesforce", role: "le pipeline" },
        { op: "+", text: "Notion", role: "docs et onboarding" },
        { op: "+", text: "Slack", role: "alertes" },
        { op: "=", text: "Un seul système" },
      ],
      outputs: [{ text: "Chine" }, { text: "Espagne" }, { text: "Pologne" }, { text: "Inde" }],
      outputsCaption: "Plus de 80 comptes, quatre marchés",
      sentence:
        "Salesforce porte le pipeline, Notion la documentation et l'onboarding, Slack les alertes : un seul système pour plus de 80 comptes, en Chine, en Espagne, en Pologne et en Inde.",
    },
    changedLead: "Une visibilité complète sur plus de 80 comptes, là où il n'y avait rien.",
    changedBody:
      "C'est aussi sur ce CRM que la base clients a tenu pendant la restructuration : [l'étude de cas sur les paiements](case:appbazar-payments) raconte comment.",
    related: "Le reste de mon travail chez AppBazar : [l'étude de cas produit](case:appbazar-product).",
    unitField: {
      caption: "Un point, un compte.",
      markets: ["Chine", "Espagne", "Pologne", "Inde"],
      sentence:
        "80 points, un par compte : plus de 80 comptes B2B dans un seul CRM, en Chine, en Espagne, en Pologne et en Inde.",
    },
    statRow: [
      { value: "100%", caption: "d'adoption dans l'équipe" },
      { value: "4", caption: "marchés" },
    ],
    retro: {
      line: "Construire le CRM plus tôt.",
      reason: "Dès les premières semaines. Introduit tard, il a sans doute laissé filer des contacts.",
    },
  },
};
