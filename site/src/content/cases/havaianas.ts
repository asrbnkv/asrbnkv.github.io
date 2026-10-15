/**
 * Words for the havaianas case, EN + FR (03-case-and-pages.md; final deck in
 * .aaa/brief/copy-deck.md). Owned by the case-study agent. Facts live in
 * ../projects.ts. Cover S: 2× (FR ×2) beside the type-set pair.
 * Conservative choices (content-source.md): "Key Account Manager" (the CV
 * says Project Manager), "days to hours" (the wording both sources share:
 * the legacy says about two hours, the CV 3 days to 3 hours), "upsell" (the
 * CV says restock). The quote is attributed to "managers at Havaianas",
 * never "called me".
 */
import type { Localized } from "../localized";
import type { ProjectCopy } from "./types";

export const havaianas: Localized<ProjectCopy<"havaianas">> = {
  en: {
    company: "Havaianas",
    title: "Making sense of Havaianas sales",
    h1: "Making sense of\nHavaianas sales",
    shortTitle: "Havaianas",
    metricCaption: "upsell results in one season",
    tagline: "Scattered retail data, turned into decisions.",
    meta: "Key Account Manager and retail project lead at\u00a0Havaianas\u00a0France,\u00a02023–25",
    ogAlt: "Making sense of Havaianas sales: 2×, upsell results in one season.",
    stats: { hoursSaved: "Saved weekly, per person", adoption: "Team adoption", accounts: "Retail accounts" },
    cover: {
      caption: "upsell results in one season",
      typeSet: { before: "Days", after: "hours", spoken: "Days to hours" },
      context: "Weekly data work, per person",
    },
    lead: "Sales data arrived every week from different sources, in different formats.",
    contextBody:
      "I was Key Account Manager for 20+ major French retail accounts. Consolidating their weekly numbers took days, and gave back raw figures, not insight.",
    names: {
      items: [
        { name: "Galeries Lafayette" },
        { name: "Printemps" },
        { name: "Monoprix" },
        { name: "Courir" },
        { name: "Intersport" },
      ],
      caption: "Among the 20+ retail accounts I managed",
    },
    actions: [
      "Built a semi-automated analytics system in Excel and Power BI, from zero.",
      "Linked sell-in, sell-out and stock in one model.",
      "Added automatic upsell recommendations based on stock levels.",
      "Built dashboards by product, store, region and colour.",
      "Wrote full documentation, so the team could run it without me.",
    ],
    sum: {
      terms: [
        { op: "", text: "Sell-in" },
        { op: "+", text: "Sell-out" },
        { op: "+", text: "Stock" },
        { op: "=", text: "One model" },
      ],
      outputs: [
        { text: "Dashboards by product, store, region and colour" },
        { text: "Upsell recommendations, from stock levels", after: true },
      ],
      sentence:
        "Sell-in, sell-out and stock data feed one model, which gives dashboards by product, store, region and colour, and upsell recommendations based on stock levels.",
    },
    changedLead: "Upsell results nearly doubled in one season.",
    changedBody:
      "Weekly data work dropped from days to hours, and European development managers flagged the system as genuinely useful.",
    statRow: [
      { value: "100%", caption: "team adoption" },
      { value: "20+", caption: "retail accounts" },
    ],
    stories: [
      "As a sales analyst, I want to load weekly sell-in, sell-out and stock data fast and see a clear dashboard with charts and flagged problem areas, so that I can spot issues and opportunities without spending hours per store.",
      "As a manager, I want consistent year-over-year tracking, so that I can compare performance reliably over time.",
    ],
    quote: {
      text: "the god of Excel",
      source: "Managers at Havaianas",
      heading: "What managers at Havaianas said",
    },
    retro: {
      line: "Automate fully from the start.",
      reason:
        "The system was semi-automatic. I'd take it all the way with code and AI, instead of leaving part of the data entry manual.",
    },
  },
  fr: {
    company: "Havaianas",
    title: "Piloter les ventes chez Havaianas",
    h1: "Piloter les ventes\nchez Havaianas",
    shortTitle: "Havaianas",
    metricValue: "×2",
    metricCaption: "sur l'upsell, en une saison",
    tagline: "Des données retail éparpillées, transformées en décisions.",
    meta: "Key Account Manager et chef de projet retail chez\u00a0Havaianas\u00a0France,\u00a02023–2025",
    ogAlt: "Piloter les ventes chez Havaianas : ×2 sur l'upsell, en une saison.",
    stats: {
      hoursSaved: "Gagnées par semaine et par personne",
      adoption: "Adoption dans l'équipe",
      accounts: "Comptes retail",
    },
    statValues: { hoursSaved: "20 h" },
    cover: {
      caption: "sur l'upsell, en une saison",
      typeSet: { before: "Des jours", after: "quelques heures", spoken: "De plusieurs jours à quelques heures" },
      context: "Traitement hebdomadaire des données, par personne",
    },
    lead: "Chaque semaine, les données de vente arrivaient de sources multiples, dans des formats hétérogènes.",
    contextBody:
      "J'étais Key Account Manager pour plus de 20 grands comptes retail en France. Consolider leurs données hebdomadaires prenait des jours, pour n'obtenir que des chiffres bruts, pas des analyses.",
    names: {
      items: [
        { name: "Galeries Lafayette" },
        { name: "Printemps" },
        { name: "Monoprix" },
        { name: "Courir" },
        { name: "Intersport" },
      ],
      caption: "Parmi les plus de 20 comptes retail que je gérais",
    },
    actions: [
      "J'ai créé de toutes pièces un système d'analyse semi-automatisé, sous Excel et Power BI.",
      "J'ai relié sell-in, sell-out et stock dans un seul modèle.",
      "J'ai ajouté des recommandations d'upsell automatiques en fonction du stock.",
      "J'ai conçu des tableaux de bord par produit, magasin, région et couleur.",
      "J'ai rédigé une documentation complète pour que l'équipe puisse faire tourner l'outil sans moi.",
    ],
    sum: {
      terms: [
        { op: "", text: "Sell-in" },
        { op: "+", text: "Sell-out" },
        { op: "+", text: "Stock" },
        { op: "=", text: "Un seul modèle" },
      ],
      outputs: [
        { text: "Tableaux de bord par produit, magasin, région et couleur" },
        { text: "Recommandations d'upsell, en fonction du stock", after: true },
      ],
      sentence:
        "Les données de sell-in, de sell-out et de stock alimentent un seul modèle, qui donne des tableaux de bord par produit, magasin, région et couleur, et des recommandations d'upsell en fonction du stock.",
    },
    changedLead: "Les résultats d'upsell ont presque doublé en une saison.",
    changedBody:
      "Le traitement hebdomadaire des données est passé de plusieurs jours à quelques heures, et des responsables du développement en Europe ont jugé l'outil vraiment utile.",
    statRow: [
      { value: "100%", caption: "d'adoption dans l'équipe" },
      { value: "20+", caption: "comptes retail" },
    ],
    stories: [
      "En tant qu'analyste des ventes, je veux charger vite les données hebdomadaires de sell-in, de sell-out et de stock, et voir un tableau de bord clair, avec des graphiques et les points faibles signalés, pour repérer problèmes et opportunités sans passer des heures par magasin.",
      "En tant que manager, je veux un suivi cohérent d'une année sur l'autre, pour comparer les performances de façon fiable dans le temps.",
    ],
    quote: {
      text: "le dieu d'Excel",
      source: "Les managers de Havaianas",
      heading: "Ce que disaient les managers de Havaianas",
    },
    retro: {
      line: "Tout automatiser dès le départ.",
      reason:
        "Le système était semi-automatique. J'irais jusqu'au bout de l'automatisation, avec du code et de l'IA, plutôt que de laisser une part de saisie manuelle.",
    },
  },
};
