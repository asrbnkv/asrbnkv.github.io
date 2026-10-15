import clsx from "clsx";
import {
  ANCHORS,
  getDictionary,
  homeHref,
  LOCALE_META,
  LOCALES,
  mailtoHref,
  SITE,
  type Locale,
  type RouteKey,
} from "@/content";
import { ButtonLink, CvLink, NoteLink, textButtonClass } from "./Button";
import styles from "./Bar.module.css";
import { BarBehaviour } from "./BarBehaviour";
import { LanguageSwitch } from "./LanguageSwitch";

/**
 * The bar (01-system.md §7.2–7.3), one per page, rendered by src/views
 * before <main>.
 *
 * - variant "home": Work, Method, About anchors; CV, language, Email me.
 * - variant "case": the case's short name and years in the middle slot,
 *   linking to the cover; nav links point at the home's chapters.
 * - variant "404": wordmark, CV and the language switch (the body carries
 *   the action); wordmark and switch in both languages (the boot script
 *   shows one), the switch pointing at the other locale's home.
 *
 * Behaviour (BarBehaviour): the bar takes the field under its bottom edge
 * and tints <meta name="theme-color">; its Email me hides while any
 * [data-handoff] element (a content Email me group) is in view; the link of
 * the chapter in view gets aria-current.
 */
export function Bar({
  locale,
  route,
  variant = "home",
  caseLabel,
}: {
  locale: Locale;
  route: RouteKey;
  variant?: "home" | "case" | "404";
  /** Case pages: "Havaianas, 2023–25", linking to the cover. */
  caseLabel?: string;
}) {
  const t = getDictionary(locale).chrome;
  // Under 430px the wordmark steps down to the first name while the bar's
  // Email me shows, so the language switch keeps its place beside it.
  const [first, ...rest] = t.wordmark.split(" ");
  const surname = rest.join(" ");
  const anchor = (id: string) => (variant === "home" ? `#${id}` : homeHref(locale, id));
  const navItems = [
    { id: ANCHORS.work, label: t.nav.work },
    { id: ANCHORS.method, label: t.nav.method },
    { id: ANCHORS.about, label: t.nav.about },
  ];
  const menuItems = [...navItems, { id: ANCHORS.contact, label: t.nav.contact }];

  if (variant === "404") {
    return (
      <header className={styles.bar} data-bar="" data-field="paper" data-cta="none">
        {LOCALES.map((l) => (
          <a
            key={l}
            href={homeHref(l)}
            className={styles.wordmark}
            lang={LOCALE_META[l].htmlLang}
            data-nf={l}
            aria-label={getDictionary(l).chrome.homeLabel}
          >
            {t.wordmark}
          </a>
        ))}
        <div className={styles.right}>
          <a href={SITE.cv.href} download={SITE.cv.downloadName} className={clsx(styles.link, styles.textOnPhone)}>
            {t.cv}
          </a>
          {/* The right end always holds CV and the switch: here it goes to
              the other locale's home (the boot script shows one). */}
          {LOCALES.map((l) => (
            <span key={l} data-nf={l} className={styles.nfSwitch}>
              <LanguageSwitch locale={l} route={{ page: "home" }} className={clsx(styles.link, styles.lang)} />
            </span>
          ))}
        </div>
        <BarBehaviour />
      </header>
    );
  }

  return (
    <header
      className={clsx(styles.bar, variant === "home" && styles.ctaOut, variant === "case" && caseLabel && styles.withLabel)}
      data-bar=""
      data-field="paper"
      data-cta={variant === "home" ? "hidden" : "shown"}
    >
      <a href={homeHref(locale, ANCHORS.top)} className={styles.wordmark} aria-label={t.homeLabel}>
        <span>
          {first}
          <span className={styles.surname}> {surname}</span>
        </span>
      </a>

      {variant === "case" && caseLabel ? (
        <a href="#top" className={clsx(styles.link, styles.caseLabel)}>
          {caseLabel}
        </a>
      ) : null}

      <nav className={styles.nav} aria-label={t.navLabel}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={anchor(item.id)} className={styles.link} data-nav={item.id}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.right}>
        <a
          href={SITE.cv.href}
          download={SITE.cv.downloadName}
          className={clsx(styles.link, styles.shift, styles.desktopOnly)}
        >
          {t.cv}
          <span className="visually-hidden"> ({t.cvNote})</span>
        </a>
        <span className={clsx(styles.slot)}>
          <LanguageSwitch
            locale={locale}
            route={route}
            className={clsx(styles.link, styles.shift, styles.lang)}
          />
          <ButtonLink
            size="bar"
            href={mailtoHref(t.emailSubject)}
            className={clsx(styles.cta, styles.phoneCta)}
            data-bar-cta=""
          >
            {t.emailMe}
          </ButtonLink>
        </span>
        {/* Names its action: "Menu" while the sheet is shut, "Close" while
            it is open (BarBehaviour sets aria-expanded and hides the other
            label from the name). "Menu" sizes the target; "Close" lies over
            it, so the closed bar never changes (Bar.module.css). */}
        <button
          type="button"
          popoverTarget="menu"
          className={clsx(textButtonClass, styles.menuButton, styles.phoneOnly)}
          aria-controls="menu"
          data-menu-toggle=""
        >
          <span className={styles.toggleLabel} data-label="menu">
            {t.menu}
          </span>
          <span className={styles.toggleLabel} data-label="close">
            {t.menuClose}
          </span>
        </button>
      </div>

      <nav id="menu" popover="auto" className={styles.menu} aria-label={t.menuLabel} data-menu="">
        <ul className={styles.menuLinks}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <a href={anchor(item.id)} className={styles.menuLink} data-nav={item.id}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.menuWays}>
          <ButtonLink block href={mailtoHref(t.emailSubject)}>
            {t.emailMe}
          </ButtonLink>
          <CvLink id="menu-cv" label={t.cvLong} note={t.cvNote} />
          <NoteLink id="menu-linkedin" href={SITE.links.linkedin} label={t.linkedin} note={SITE.display.linkedin} />
          <NoteLink id="menu-ai" href={SITE.links.aiTwin} label={t.aiTwin} note={t.aiTwinNote} />
          <LanguageSwitch locale={locale} route={route} form="long" className={textButtonClass} />
        </div>
      </nav>
      {variant === "home" ? (
        // Without JS the hand-off cannot run: the bar carries Email me, in
        // flow, from load (01 §7.2; under 430px the wordmark steps down).
        <noscript>
          <style>{`[data-bar][data-cta] [data-bar-cta]{position:static;visibility:visible;opacity:1;translate:none}@media (min-width:360px) and (max-width:429px){[data-bar][data-cta] .${styles.surname}{display:none}}`}</style>
        </noscript>
      ) : null}
      <BarBehaviour />
    </header>
  );
}
