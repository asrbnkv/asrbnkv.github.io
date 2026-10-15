/**
 * Labels of the case template, EN + FR (03-case-and-pages.md §1.1, §3.2,
 * §5). Owned by the case-study agent. "\n" marks an authored break.
 */
import type { Localized } from "../localized";
import type { CaseStudyLabels } from "./types";

export const caseStudyLabels: Localized<CaseStudyLabels> = {
  en: {
    headings: {
      context: "What I walked into",
      contextFreelance: "Who I built for",
      users: "Who the users were",
      work: "What I did",
      workBuilt: "What I built",
      workMade: "What I made",
      result: "What changed",
      resultTracker: "Where it stands",
      resultFreelance: "Two AI projects",
      prioritised: "How I prioritised",
      tested: "What I tested",
    },
    retroFrame: "What I'd do differently",
    stack: "Stack",
    tools: "Tools",
    next: "Next case",
    nextLabel: "Next case:",
    allWork: "All work",
    openFull: "Open full size",
  },
  fr: {
    headings: {
      context: "Le point de départ",
      contextFreelance: "Pour qui j'ai travaillé",
      users: "Qui étaient\nles utilisateurs",
      work: "Ce que j'ai fait",
      workBuilt: "Ce que j'ai développé",
      workMade: "Ce que j'ai réalisé",
      result: "Ce qui a changé",
      resultTracker: "Où en est le projet",
      resultFreelance: "Deux projets IA",
      prioritised: "Comment j'ai priorisé",
      tested: "Ce que j'ai testé",
    },
    retroFrame: "Ce que je ferais autrement",
    stack: "Stack",
    tools: "Outils",
    next: "Projet suivant",
    nextLabel: "Projet suivant :",
    allWork: "Tous les projets",
    openFull: "Agrandir",
  },
};
