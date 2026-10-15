import type { ReactNode } from "react";
import { getDictionary, LOCALE_META, LOCALES, type Locale } from "@/content";
import { bootScript } from "@/lib/boot";
import { viewTransitionScript } from "@/lib/viewTransitions";
import { FONT_FAMILY, fontVariables } from "@/styles/fonts";
import { MotionRoot } from "./MotionRoot";
import "@/styles/globals.css";

/**
 * The <html>/<body> shell shared by every root layout (en, fr, lab, 404).
 * Site chrome (bar, footer) does NOT live here: it is composed in src/views
 * so the lab can render a section without it.
 *
 * <html> carries suppressHydrationWarning because the boot script adds
 * classes (js, fonts-ready, motion-ready) and, on the 404, lang, before
 * React hydrates.
 */
export function RootDocument({
  locale,
  children,
  skipLink = true,
  fr404 = false,
}: {
  locale: Locale;
  children: ReactNode;
  skipLink?: boolean;
  /** Bilingual 404: switch <html lang> to fr before paint under /fr/. */
  fr404?: boolean;
}) {
  const dict = getDictionary(locale);
  return (
    <html lang={LOCALE_META[locale].htmlLang} className={fontVariables} suppressHydrationWarning>
      {/* App Router root layout: an explicit <head> is the documented way to add a
          before-paint script (the rule targets the Pages Router). */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script
          // Runs before first paint; see lib/boot.ts and lib/viewTransitions.ts.
          dangerouslySetInnerHTML={{
            __html: bootScript({ displayFamily: FONT_FAMILY.display, fr404 }) + viewTransitionScript(),
          }}
        />
      </head>
      <body>
        {skipLink ? (
          <a className="skip-link" href="#main">
            {fr404
              ? LOCALES.map((l) => (
                  <span key={l} lang={LOCALE_META[l].htmlLang} data-nf={l}>
                    {getDictionary(l).common.skipToContent}
                  </span>
                ))
              : dict.common.skipToContent}
          </a>
        ) : null}
        {children}
        <MotionRoot />
      </body>
    </html>
  );
}
