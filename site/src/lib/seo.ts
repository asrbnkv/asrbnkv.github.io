import type { Metadata, Viewport } from "next";
import {
  absoluteUrl,
  alternatesFor,
  getDictionary,
  href,
  LOCALE_META,
  otherLocale,
  SITE,
  type CaseSlug,
  type Locale,
  type RouteKey,
} from "@/content";

/**
 * Metadata per page, from the content layer (03 §13). Canonical and
 * hreflang (en, fr, x-default), Open Graph (profile for the home, article
 * for cases) and Twitter cards with the locale's 1200×630 card, icons drawn
 * from the wordmark's tréma, and the toolbar tint (paper; the bar updates it
 * per field as the reader scrolls).
 */

/** <meta name="theme-color"> starts on paper; BarBehaviour follows the field under the bar. */
export const VIEWPORT: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f3f0",
  colorScheme: "light",
};

const ICONS: Metadata["icons"] = {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
};

/** The social card for a locale (public/og-en.png, public/og-fr.png). */
function ogImage(locale: Locale) {
  return {
    url: absoluteUrl(`/og-${locale}.png`),
    width: 1200,
    height: 630,
    alt: getDictionary(locale).meta.ogAlt,
    type: "image/png",
  };
}

function base(
  locale: Locale,
  route: RouteKey,
  title: string,
  description: string,
  type: "profile" | "article",
): Metadata {
  const url = absoluteUrl(href(locale, route));
  const image = ogImage(locale);
  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    alternates: { canonical: url, languages: alternatesFor(route) },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE.name,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: [LOCALE_META[otherLocale(locale)].ogLocale],
      images: [image],
      ...(type === "profile" ? { firstName: SITE.givenName, lastName: SITE.familyName } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    icons: ICONS,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export function homeMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return base(locale, { page: "home" }, dict.meta.homeTitle, dict.meta.siteDescription, "profile");
}

export function caseMetadata(locale: Locale, slug: CaseSlug): Metadata {
  const dict = getDictionary(locale);
  const copy = slug === "freelance" ? dict.freelance : dict.projects[slug];
  const title = dict.meta.titleTemplate.replace("%s", copy.title);
  const description = dict.meta.caseDescriptionTemplate.replace("%s", copy.tagline);
  return base(locale, { page: "case", slug }, title, description, "article");
}

/** The bilingual 404: both titles, never indexed. */
export function notFoundMetadata(): Metadata {
  const en = getDictionary("en").notFound.metaTitle;
  const fr = getDictionary("fr").notFound.metaTitle;
  return {
    metadataBase: new URL(SITE.url),
    title: `${en} · ${fr}`,
    robots: { index: false, follow: true },
    icons: ICONS,
  };
}
