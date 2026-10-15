import type { ComponentType } from "react";
import { OgCard } from "@/lab/og/OgCard";
import { Specimen } from "@/lab/specimen/Specimen";
import type { SectionProps } from "@/sections/types";

/**
 * LAB REGISTRY (dev server only; never exported). Owned by the design-system
 * agent; section agents NEVER edit the lab.
 *
 * - Each home section has its OWN route, app/(lab)/lab/<id>/[[...opts]]/,
 *   which imports only that section: a section whose module is missing or
 *   broken (mid-write) breaks only its own lab page, never the others.
 *   /lab/<id>/ English, /lab/<id>/fr/ French, …/runway/ (a scroll runway
 *   after it), …/bar/ (the home bar before it, plus the runway):
 *   lab/labSectionPage.tsx.
 * - The system pages live in the catch-all route below: `specimen` (the
 *   whole system) and `og` (the 1200×630 social card that
 *   public/og-<locale>.png is rendered from).
 */
export interface LabEntry {
  /** Human name shown on /lab/. */
  title: string;
  component: ComponentType<SectionProps>;
}

export const LAB_REGISTRY = {
  og: { title: "Social card 1200×630 (public/og-<locale>.png)", component: OgCard },
  specimen: { title: "Specimen · the Tréma system", component: Specimen },
} satisfies Record<string, LabEntry>;

/** Every lab page, for the index at /lab/ (sections have their own routes). */
export const LAB_INDEX: readonly { id: string; title: string }[] = [
  { id: "about", title: "About · Moscow, Breda, Paris" },
  { id: "builder", title: "Builder · When no tool fits, I build one" },
  { id: "contact", title: "Contact · Send me your chaos" },
  { id: "edge", title: "Edge · I also speak client" },
  { id: "footer", title: "Footer · the bookend" },
  { id: "hero", title: "Hero · Artëm / Product Owner" },
  { id: "human", title: "Human · 7h 56m in the dark" },
  { id: "method", title: "Method · How I run the loop" },
  { id: "proof", title: "Proof · Shipped, then measured" },
  { id: "retro", title: "Retro · What I'd do differently" },
  { id: "work", title: "Work · Seven cases, end to end" },
  { id: "og", title: LAB_REGISTRY.og.title },
  { id: "specimen", title: LAB_REGISTRY.specimen.title },
];

export type LabSectionId = keyof typeof LAB_REGISTRY;
export const LAB_IDS = Object.keys(LAB_REGISTRY) as LabSectionId[];

export function isLabSectionId(value: unknown): value is LabSectionId {
  return typeof value === "string" && value in LAB_REGISTRY;
}
