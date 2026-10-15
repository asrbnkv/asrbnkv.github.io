import type { DateValue, Period } from "./format";
import type { CaseSlug } from "./projects";

/**
 * Locale-independent profile data. Display order = array order.
 * Words (titles, notes, captions) live in the dictionary keyed by `id`.
 */

export const EXPERIENCE = [
  { id: "havaianas", period: { from: 2023, to: 2025 }, cases: ["havaianas"] },
  {
    id: "appbazar",
    period: { from: 2022, to: 2023 },
    cases: ["appbazar-product", "appbazar-crm", "appbazar-payments"],
  },
  { id: "freedomFinance", period: { from: 2022 }, cases: [] },
  { id: "freelance", period: { from: 2020, to: "present" }, cases: ["freelance"] },
] as const satisfies readonly { id: string; period: Period; cases: readonly CaseSlug[] }[];
export type ExperienceId = (typeof EXPERIENCE)[number]["id"];

export const EDUCATION = [
  { id: "icn", period: { from: 2023, to: 2025 } },
  { id: "erasmus", period: { from: 2021, to: 2022 } },
  { id: "hse", period: { from: 2019, to: 2023 } },
] as const satisfies readonly { id: string; period: Period }[];
export type EducationId = (typeof EDUCATION)[number]["id"];

export const CERTIFICATIONS = [
  { id: "google", date: { month: "2026-01" } },
  { id: "tinkoff", date: { month: "2023-06" } },
  { id: "alpha", date: { month: "2023-02" } },
  { id: "yandex", date: { from: 2022, to: 2023 } },
] as const satisfies readonly { id: string; date: DateValue }[];
export type CertificationId = (typeof CERTIFICATIONS)[number]["id"];

/** Skill filter chips on the legacy About page. "all" first. */
export const SKILL_FILTERS = [
  "all",
  "product",
  "account",
  "data",
  "design",
  "ai",
  "soft",
  "lang",
] as const;
export type SkillFilterId = (typeof SKILL_FILTERS)[number];

export const SKILL_GROUPS = [
  { id: "product", filter: "product" },
  { id: "metrics", filter: "product" },
  { id: "account", filter: "account" },
  { id: "data", filter: "data" },
  { id: "crmTools", filter: "data" },
  { id: "design", filter: "design" },
  { id: "ai", filter: "ai" },
  { id: "soft", filter: "soft" },
  { id: "languages", filter: "lang" },
] as const satisfies readonly { id: string; filter: Exclude<SkillFilterId, "all"> }[];
export type SkillGroupId = (typeof SKILL_GROUPS)[number]["id"];
