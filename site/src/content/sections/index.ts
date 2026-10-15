import type { Locale } from "../locales";
import { PAIR_COPY, type PairCopy } from "../pairs";
import type { PairId } from "../home";
import { about } from "./about";
import { builder } from "./builder";
import { contact } from "./contact";
import { edge } from "./edge";
import { footer } from "./footer";
import { hero } from "./hero";
import { human } from "./human";
import { method } from "./method";
import { proof } from "./proof";
import { retro } from "./retro";
import { work } from "./work";

/**
 * The home's words, one module per chapter (src/content/sections/<id>.ts),
 * composed here into `dict.home`. Owned by the design-system/content owner:
 * section agents never edit this file, only their own module.
 * Order = the page order (02-home.md §0.1).
 */
const HOME_SECTIONS = {
  hero,
  edge,
  proof,
  work,
  builder,
  method,
  retro,
  about,
  human,
  contact,
  footer,
} as const;

export type HomeSectionId = keyof typeof HOME_SECTIONS;

export type HomeCopy = { [K in HomeSectionId]: (typeof HOME_SECTIONS)[K]["en"] } & {
  /** Shared pair words (02 §3.8): read by hero, edge, proof and method. */
  pairs: Record<PairId, PairCopy>;
};

export function homeCopy(locale: Locale): HomeCopy {
  const out = {} as Record<string, unknown>;
  for (const [id, copy] of Object.entries(HOME_SECTIONS)) out[id] = copy[locale];
  out.pairs = PAIR_COPY[locale];
  return out as HomeCopy;
}
