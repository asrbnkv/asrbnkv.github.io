import clsx from "clsx";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Monument } from "@/components/Monument";
import { LOCALE_META, mailtoHref, SITE } from "@/content";
import type { SectionProps } from "../types";
import { Curtain } from "./Curtain";
import styles from "./Footer.module.css";

/**
 * The footer: the bookend (02-home.md §11; 01 §7.15 curtain, §3.4 monument,
 * §6.5 homecoming; 03 §5.3: the same footer on case pages and the 404).
 *
 * The page ends where it began. <main> lifts off this sticky ink footer like
 * a curtain, uncovering the row, then "Artem" with a bare e; then the two
 * dots that left the hero on the first scroll fall out from under the orange
 * edge of the close and come home, orange now, the colour every "after" took
 * on the way down (MonumentHomecoming, inside <Monument variant="footer">).
 *
 * The monument is a <p aria-hidden>; the row carries the name for assistive
 * tech, as plain text ("Artem Serebryannikov", copy deck §11), with a comma
 * for the ear between the name and the role. One row: four cells on desktop
 * (columns 1–3, 4–6, 7–9, 10–12), two by two under 1024px. Each line is its
 * own line box and each link sits inline in it, so a keyboard ring hugs the
 * words and never touches the line below.
 *
 * Contract kept for the views: rendered AFTER </main> (the curtain); takes
 * `route` (the language switch keeps the page) and `nfLang` (the bilingual
 * 404 renders one footer per language, shown by html[data-lang]).
 */
export function Footer({
  locale,
  dict,
  route = { page: "home" },
  nfLang = false,
  curtain = true,
}: SectionProps & {
  nfLang?: boolean;
  /**
   * The curtain (01 §7.15) needs a <main> taller than the viewport. A short
   * page (the 404) passes false: the footer follows in flow, so the fold
   * cuts it, never <main>'s edge.
   */
  curtain?: boolean;
}) {
  const copy = dict.home.footer;
  return (
    <footer
      data-field="ink"
      className={clsx(styles.root, !curtain && styles.inFlow)}
      data-nf={nfLang ? locale : undefined}
      lang={nfLang ? LOCALE_META[locale].htmlLang : undefined}
    >
      <Monument variant="footer" as="p" beat={false} className={styles.name} />
      <div className={styles.row} data-footer-row="">
        <p className={styles.cell}>
          <span className={styles.line}>
            {copy.name}
            <span className={styles.ear}>,</span>
          </span>
          <span className={clsx(styles.line, styles.muted)}>{copy.role}</span>
        </p>
        <address className={styles.cell}>
          <span className={styles.line}>
            <a className={styles.link} href={mailtoHref(dict.chrome.emailSubject)}>
              {SITE.email}
            </a>
          </span>
          <span className={styles.line}>
            <a className={styles.link} href={SITE.links.linkedin}>
              {dict.chrome.linkedin}
            </a>
          </span>
        </address>
        <p className={styles.cell}>
          <span className={styles.line}>
            <a
              className={styles.link}
              href={SITE.cv.href}
              download={SITE.cv.downloadName}
              aria-label={`${copy.cv}, ${dict.chrome.cvNote}`}
            >
              {copy.cv}
            </a>
          </span>
          <span className={styles.line}>
            <LanguageSwitch className={styles.link} locale={locale} route={route} form="long" />
          </span>
        </p>
        <p className={clsx(styles.cell, styles.languages)}>
          <span className={styles.line}>{copy.languages}</span>
        </p>
      </div>
      <Curtain />
    </footer>
  );
}
