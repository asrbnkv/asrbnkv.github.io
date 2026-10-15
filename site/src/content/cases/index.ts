import type { Locale } from "../locales";
import { appbazarCrm } from "./appbazar-crm";
import { appbazarPayments } from "./appbazar-payments";
import { appbazarProduct } from "./appbazar-product";
import { cannes } from "./cannes";
import { freelance } from "./freelance";
import { havaianas } from "./havaianas";
import { jobTracker } from "./job-tracker";
import { caseStudyLabels } from "./labels";
import type { CaseStudyLabels, FreelanceCopy, ProjectsCopy } from "./types";

/**
 * Composes the case modules into the dictionary (dictionary.ts calls this).
 * One module per case: src/content/cases/<slug>.ts. Owned by the
 * case-study agent.
 */
export function casesCopy(locale: Locale): {
  projects: ProjectsCopy;
  freelance: FreelanceCopy;
  caseStudy: CaseStudyLabels;
} {
  return {
    projects: {
      "appbazar-product": appbazarProduct[locale],
      havaianas: havaianas[locale],
      "appbazar-payments": appbazarPayments[locale],
      "appbazar-crm": appbazarCrm[locale],
      "job-tracker": jobTracker[locale],
      cannes: cannes[locale],
    },
    freelance: freelance[locale],
    caseStudy: caseStudyLabels[locale],
  };
}

export type { CaseStudyLabels, FreelanceCopy, ProjectCopy, ProjectsCopy } from "./types";
