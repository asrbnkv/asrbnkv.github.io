import clsx from "clsx";
import {
  getDictionary,
  href,
  LOCALE_META,
  otherLocale,
  type Locale,
  type RouteKey,
} from "@/content";

/**
 * The EN/FR switch (01-system.md §7.5): the same route in the other locale,
 * a full page load between root layouts. Written in the TARGET language,
 * with lang and hreflang. Short form "FR"/"EN" in the bar; long form
 * "Français"/"English" in the menu and the footer.
 *
 * Both forms are named by aria-label, starting with the visible text so
 * speech input finds it (WCAG 2.5.3): "FR, version française", "Français,
 * version française", "EN, English version", "English version". (A hidden
 * span positioned out of flow was read as a block: "FR , version française".)
 *
 * The reader keeps their place: on activation BarBehaviour appends the
 * chapter in view (the one crossing 40% of the viewport, as aria-current)
 * as a hash, so switching at Method opens the other home at #method. On
 * the first chapter there is no hash.
 */
export function LanguageSwitch({
  locale,
  route,
  form = "short",
  className,
}: {
  locale: Locale;
  route: RouteKey;
  form?: "short" | "long";
  className?: string;
}) {
  const target = otherLocale(locale);
  const t = getDictionary(locale).chrome.switchTo;
  const lang = LOCALE_META[target].htmlLang;
  const shown = form === "short" ? t.short : t.long;
  // The name starts with the visible word (WCAG 2.5.3) and says what the link
  // opens: "FR, version française", "Français, version française", "EN,
  // English version", "English version" (the label alone when its first word
  // is the visible word; "EN" is not the word "English" for speech input).
  const firstWord = t.label.trim().split(/[\s,]+/)[0] ?? "";
  const name = firstWord.toLowerCase() === shown.toLowerCase() ? t.label : `${shown}, ${t.label}`;
  return (
    <a
      href={href(target, route)}
      hrefLang={lang}
      lang={lang}
      aria-label={name}
      className={clsx(className)}
      data-lang-switch=""
    >
      {shown}
    </a>
  );
}
