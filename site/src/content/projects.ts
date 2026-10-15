import type { Period } from "./format";
import type { MediaId } from "./media";

/**
 * Locale-independent case-study data: slugs, order, years, metric values,
 * stack, partners, screenshots. Words live in the dictionary under
 * `projects[slug]`, keyed by the same slug and stat ids.
 *
 * Metric and stat values are the legacy site's exact figures. Do not change
 * a number. A dictionary may override how a value is *written* in its
 * language (e.g. "1-click" -> "1 clic") via `metricValue` / `statValues`.
 */
export const PROJECT_SLUGS = [
  "appbazar-product",
  "havaianas",
  "appbazar-payments",
  "appbazar-crm",
  "job-tracker",
  "cannes",
] as const;
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

/**
 * Every case-study route: the six projects plus the freelance page, in the
 * argument's order (03 §5.2). The home's work index and "Next case" use it.
 */
export const CASE_SLUGS = [...PROJECT_SLUGS, "freelance"] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

export function isCaseSlug(value: unknown): value is CaseSlug {
  return typeof value === "string" && (CASE_SLUGS as readonly string[]).includes(value);
}

export type ProjectCategory = "product" | "ai";

export interface ProjectData {
  slug: ProjectSlug;
  category: ProjectCategory;
  /**
   * Years shown after the short title in the case bar. `null` prints none:
   * the Cannes screens say 2026 and the legacy site says 2025, so no year is
   * claimed until Artem confirms it (copy-deck open items).
   */
  period: Period | null;
  /** Hero metric, as written on the legacy site. */
  metric: string;
  /** Supporting stats, in display order. `id` keys the dictionary label. */
  stats: readonly { id: string; value: string }[];
  stack: readonly string[];
  /** Plain-text facts, never logos or endorsements. */
  partners: readonly string[];
  shots: readonly MediaId[];
  /** True when the dictionary carries a quote for this case. */
  hasQuote: boolean;
}

export const PROJECTS = {
  havaianas: {
    slug: "havaianas",
    category: "product",
    period: { from: 2023, to: 2025 },
    metric: "2×",
    stats: [
      { id: "hoursSaved", value: "20h" },
      { id: "adoption", value: "100%" },
      { id: "accounts", value: "20+" },
    ],
    stack: ["Excel", "Power BI", "SQL"],
    partners: ["Galeries Lafayette", "Printemps", "Monoprix", "Courir", "Intersport"],
    shots: [],
    hasQuote: true,
  },
  "appbazar-product": {
    slug: "appbazar-product",
    category: "product",
    period: { from: 2022, to: 2023 },
    metric: "+100%",
    stats: [
      { id: "mau", value: "+40%" },
      { id: "churn", value: "<5%" },
      { id: "partners", value: "90+" },
    ],
    stack: ["Roadmap", "Sprints", "Salesforce", "Analytics"],
    partners: ["Tencent", "Playrix", "NetEase", "MiHoYo"],
    shots: ["ab_feed"],
    hasQuote: false,
  },
  "appbazar-crm": {
    slug: "appbazar-crm",
    category: "product",
    period: { from: 2022, to: 2023 },
    metric: "80+",
    stats: [
      { id: "zeroToOne", value: "0→1" },
      { id: "adoption", value: "100%" },
      { id: "markets", value: "4" },
    ],
    stack: ["Salesforce", "Notion", "Slack"],
    partners: ["Tencent", "Playrix", "NetEase", "MiHoYo"],
    shots: [],
    hasQuote: false,
  },
  "appbazar-payments": {
    slug: "appbazar-payments",
    category: "product",
    period: { from: 2022, to: 2023 },
    metric: "97%",
    stats: [
      { id: "churn", value: "~3%" },
      { id: "expected", value: "60–70%" },
      { id: "onboarded", value: "80+" },
    ],
    stack: ["Salesforce", "Slack"],
    partners: [],
    shots: [],
    hasQuote: false,
  },
  "job-tracker": {
    slug: "job-tracker",
    category: "ai",
    period: { from: 2025, to: "present" },
    metric: "1-click",
    stats: [
      { id: "aiActions", value: "5" },
      { id: "sso", value: "SSO" },
      { id: "beta", value: "Beta" },
    ],
    stack: ["HTML/JS", "Anthropic API", "Chrome Extension"],
    partners: [],
    shots: ["roadmap", "add", "ai"],
    hasQuote: false,
  },
  cannes: {
    slug: "cannes",
    category: "ai",
    period: null,
    metric: "Cannes",
    stats: [
      { id: "days", value: "3" },
      { id: "auto", value: "Auto" },
    ],
    stack: ["HTML/JS", "Anthropic API"],
    partners: [],
    shots: ["c_day", "c_rhythm", "c_alt", "c_film"],
    hasQuote: false,
  },
} as const satisfies { [S in ProjectSlug]: ProjectData & { slug: S } };

export type ProjectStatId<S extends ProjectSlug> =
  (typeof PROJECTS)[S]["stats"][number]["id"];

/** Freelance web & AI (2020 to now). */
export const FREELANCE = {
  slug: "freelance",
  period: { from: 2020, to: "present" },
  /** "15+ sites and prototypes". */
  sitesCount: "15+",
  /** AI creative agent used across this many client campaigns. */
  campaigns: "5",
  /** Resume A/B test: application-to-interview conversion of the winner. */
  resumeConversion: "25%",
  tools: ["Figma", "Webflow", "Tilda", "Wix", "HTML/CSS", "Lovable", "AI"],
  shots: ["fl_slide"],
} as const satisfies {
  slug: "freelance";
  period: Period;
  tools: readonly string[];
  shots: readonly MediaId[];
  [k: string]: unknown;
};

export const FREELANCE_PROJECT_IDS = [
  "artist",
  "influencers",
  "shops",
  "brand",
  "aiIntegrations",
] as const;
export type FreelanceProjectId = (typeof FREELANCE_PROJECT_IDS)[number];

/** Previous / next case, wrapping around. */
export function adjacentCases(slug: CaseSlug): { prev: CaseSlug; next: CaseSlug } {
  const i = CASE_SLUGS.indexOf(slug);
  const n = CASE_SLUGS.length;
  return { prev: CASE_SLUGS[(i - 1 + n) % n], next: CASE_SLUGS[(i + 1) % n] };
}
