import { LOCALE_META, LOCALES, type Locale } from "./locales";
import type { CaseSlug } from "./projects";
import { SITE } from "./site";

/**
 * Locale-agnostic route keys -> URL paths. Always trailing slash
 * (next.config trailingSlash: true). Never hand-write "/fr/..." in a component.
 */
export type RouteKey =
  | { page: "home" }
  | { page: "case"; slug: CaseSlug };

export function pathFor(route: RouteKey): string {
  switch (route.page) {
    case "home":
      return "/";
    case "case":
      return `/work/${route.slug}/`;
  }
}

/** Path in a locale, e.g. href("fr", {page:"case", slug:"cannes"}) -> "/fr/work/cannes/". */
export function href(locale: Locale, route: RouteKey, hash?: string): string {
  const path = `${LOCALE_META[locale].prefix}${pathFor(route)}`;
  return hash ? `${path}#${hash}` : path;
}

export function homeHref(locale: Locale, hash?: string): string {
  return href(locale, { page: "home" }, hash);
}

export function caseHref(locale: Locale, slug: CaseSlug): string {
  return href(locale, { page: "case", slug });
}

/** Absolute URL on the canonical origin. */
export function absoluteUrl(path: string): string {
  return `${SITE.url}${path}`;
}

/** hreflang map for a route, including x-default (English). */
export function alternatesFor(route: RouteKey): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_META[l].htmlLang] = absoluteUrl(href(l, route));
  languages["x-default"] = absoluteUrl(href("en", route));
  return languages;
}

/**
 * In-page anchors on the home page (02-home.md §0.1), shared by the bar, the
 * menu and the sections. Each chapter's <section id> is its anchor.
 */
export const ANCHORS = {
  top: "top",
  stories: "stories",
  results: "results",
  work: "work",
  builder: "builder",
  method: "method",
  retro: "retro",
  about: "about",
  offTheClock: "off-the-clock",
  contact: "contact",
} as const;

export type AnchorId = (typeof ANCHORS)[keyof typeof ANCHORS];
