import clsx from "clsx";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Bust } from "@/components/Bust";
import { CvLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import {
  ANCHORS,
  CERTIFICATIONS,
  EXPERIENCE,
  SPOKEN_LANGUAGES,
  dateTimeAttr,
  formatMonth,
  formatPeriod,
  isMonthDate,
  type DateValue,
  type Period,
} from "@/content";
import { ABOUT_TOOL_GROUPS, ROUTE_NOW, ROUTE_ORDER, ROUTE_PERIODS } from "@/content/sections/about";
import { STAGGER } from "@/lib/motion";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import styles from "./About.module.css";
import { RouteWalk } from "./RouteWalk";

type Locale = SectionProps["locale"];

/** "depuis 2023" opens a line: « Depuis 2023 ». */
function sentenceCase(text: string, locale: Locale): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}

/**
 * No line ends on an article or a short preposition, a figure is never
 * parted from its noun ("90+ B2B", "20 grands") and a month never from its
 * year ("Oct 2025").
 */
const ARTICLES = {
  en: /(?<=^|\s)([Aa]n?|[Tt]he|[Mm]y|I) /g,
  fr: /(?<=^|\s)(le|la|les|un|une|des|du|de|au|aux|mon|ma|mes|je|et|à|en) /gi,
} as const;
const FIGURE_NOUN = /(\d[\d.,]*\+?%?) (?=\p{L})/gu;
const MONTH_YEAR =
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept?|Oct|Nov|Dec|janv\.|févr\.|mars|avr\.|mai|juin|juil\.|août|sept\.|oct\.|nov\.|déc\.) (?=\d{4})/giu;
function glue(text: string, locale: Locale): string {
  const articles = text.replace(locale === "fr" ? ARTICLES.fr : ARTICLES.en, "$1\u00a0");
  return articles.replace(FIGURE_NOUN, "$1\u00a0").replace(MONTH_YEAR, "$1\u00a0");
}

/** Items of a list that breaks only between items, after a comma. */
function items(list: readonly string[]): ReactNode[] {
  return list.map((item, i) => (
    <Fragment key={item}>
      {i > 0 ? ", " : null}
      <span className={t.nowrap}>{item}</span>
    </Fragment>
  ));
}

/**
 * A stop's authored lines (about.ts): one line each, breaking only at the
 * authored "|", so a school or a programme is never split. Read as one
 * sentence: a line that ends without punctuation is joined to the next by
 * a comma only assistive tech hears.
 */
function stopLines(lines: readonly string[]): ReactNode[] {
  return lines.map((line, i) => {
    const segments = line.split("|");
    return (
      <Fragment key={line}>
        <span className={styles.line}>
          {segments.map((segment, j) => (
            <Fragment key={segment}>
              {j > 0 ? " " : null}
              <span className={styles.seg}>{segment}</span>
            </Fragment>
          ))}
        </span>
        {i < lines.length - 1 ? (
          <span className="visually-hidden">{/[.:,;!?]$/.test(line) ? " " : ", "}</span>
        ) : null}
      </Fragment>
    );
  });
}

/**
 * `about`: "Moscow, Breda, Paris" (02-home.md §8; the route, 01 §7.11).
 *
 * Claim: trained in three countries, certified in product, trilingual; the
 *   path in one screen, without repeating the cases.
 * Field: paper (the route sits on paper only).
 *
 * - The H2 is the route. From 1360px its three words stand on the grid's
 *   thirds, a dot over each first letter like the ë's: Moscow and Breda in
 *   ink, Paris in the after colour because it is now, his bust on its
 *   baseline. Under each word, on the same edge: the years at the statement
 *   step (the route's time axis) and three authored Small lines. No bar
 *   joins the dots; the caption says it is not to scale.
 * - 600–1359: one row per place (city left, years and lines right). Under
 *   600: the H2 keeps the three words on one line under their dots; the
 *   places' details follow as a list.
 * - The statement, the CV line on its last baseline (from 1280px), then the
 *   ledger on the same three edges: Experience under Moscow;
 *   Certifications (right under the statement that counts them), Languages
 *   and Tools under Breda, the certifications' dates under Paris.
 * Lists carry role="list": Safari drops list semantics without bullets. The
 *   ledger's rows are short, so each arrives as soon as it shows (line 1):
 *   a reader resting on the chapter never sees a band of empty paper.
 * Motion: About.module.css (one beat per place) and RouteWalk (reading order
 *   for the rest; the reduced-motion walk).
 */
export function About({ locale, dict }: SectionProps) {
  const copy = dict.home.about;
  // EN prints short ranges (2019–23), FR full years (2019–2023), as the deck does.
  const period = (p: Period) =>
    sentenceCase(formatPeriod(p, dict.common.present, { short: locale === "en" }), locale);
  const when = (d: DateValue) => (isMonthDate(d) ? formatMonth(d, locale) : period(d));
  const bust = <Bust locale={locale} alt="" className={styles.bust} />;

  return (
    <Reveal
      as="section"
      id={ANCHORS.about}
      data-field="paper"
      aria-labelledby="about-title"
      className={styles.root}
    >
      <RouteWalk className={styles.route}>
        <h2 id="about-title" className={clsx(t.display, styles.cities)}>
          {ROUTE_ORDER.map((id, i) => (
            <span
              key={id}
              className={styles.city}
              data-now={id === ROUTE_NOW ? "" : undefined}
              style={{ "--i": i } as CSSProperties}
            >
              <span className={styles.mask}>
                <span className={styles.word}>
                  {copy.route[id].city}
                  {id === ROUTE_NOW ? bust : null}
                </span>
              </span>
              {i < ROUTE_ORDER.length - 1 ? <span className="visually-hidden">, </span> : null}
            </span>
          ))}
        </h2>

        <figure className={styles.figure}>
          <ol role="list" className={styles.stops}>
            {ROUTE_ORDER.map((id, i) => {
              const stop = copy.route[id];
              const now = id === ROUTE_NOW;
              return (
                <li
                  key={id}
                  data-reveal="ui"
                  data-slot="stop"
                  className={styles.stop}
                  data-now={now ? "" : undefined}
                  style={{ "--i": i } as CSSProperties}
                >
                  <p className={clsx(t.display, styles.stopCity)}>
                    <span className={styles.mask}>
                      <span className={styles.word}>
                        {stop.city}
                        {now ? bust : null}
                      </span>
                    </span>
                    <span className="visually-hidden">, </span>
                  </p>
                  <p className={clsx(t.statement, styles.years)}>{period(ROUTE_PERIODS[id])}</p>
                  <p className={clsx(t.small, styles.lines)}>{stopLines(stop.lines)}</p>
                </li>
              );
            })}
          </ol>
          <figcaption className={clsx(t.small, t.muted, styles.caption)}>{copy.routeCaption}</figcaption>
        </figure>
      </RouteWalk>

      <p data-reveal="" data-slot="statement" className={clsx(t.statement, styles.statement)}>
        {copy.statement}
      </p>
      <p data-reveal="ui" data-slot="cv" className={clsx(t.body, styles.cv)}>
        <span>{copy.cvLine}</span>
        <CvLink id="about-cv" label={dict.chrome.cvLong} note={dict.chrome.cvNote} className={styles.cvLink} />
      </p>

      <div className={styles.ledger}>
        <Reveal className={clsx(styles.block, styles.experience)} data-slot="exp" line={1}>
          <h3 data-reveal="ui" className={styles.h3}>
            {copy.headings.experience}
          </h3>
          <ul role="list" className={styles.entries}>
            {EXPERIENCE.map((job) => {
              const item = dict.experience.items[job.id];
              return (
                <li key={job.id} data-reveal="ui">
                  <h4 className={clsx(t.body, t.value, styles.role)}>{glue(item.title, locale)}</h4>
                  <p className={clsx(t.small, t.muted, styles.meta)}>
                    <span className={clsx(t.tabular, t.nowrap)}>{period(job.period)}</span> · {item.industry}
                  </p>
                  <p className={clsx(t.body, styles.note)}>{glue(item.note, locale)}</p>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal className={styles.facts} data-slot="facts" stagger={STAGGER.ui} line={1}>
          <div className={clsx(styles.block, styles.certs)}>
            <h3 data-reveal="ui" className={styles.h3}>
              {copy.headings.certifications}
            </h3>
            <ul role="list" className={styles.certList}>
              {CERTIFICATIONS.map((cert) => (
                <li key={cert.id} data-reveal="ui" className={styles.cert}>
                  <span className={t.body}>
                    {dict.certifications.items[cert.id]}
                    <span className="visually-hidden">, </span>
                  </span>
                  <time dateTime={dateTimeAttr(cert.date)} className={clsx(t.small, t.muted, t.tabular)}>
                    {when(cert.date)}
                  </time>
                </li>
              ))}
            </ul>
          </div>

          <div className={clsx(styles.block, styles.langs)}>
            <h3 data-reveal="ui" className={styles.h3}>
              {copy.headings.languages}
            </h3>
            <ul role="list" data-reveal="ui" className={clsx(t.body, styles.langList)}>
              {SPOKEN_LANGUAGES.map((code, i) => (
                <Fragment key={code}>
                  {i > 0 ? " " : null}
                  <li className={styles.lang}>
                    {dict.languages[code].name}
                    <span className={clsx(t.small, t.muted)}>
                      , {dict.languages[code].level.toLocaleLowerCase(locale)}
                    </span>
                    {i < SPOKEN_LANGUAGES.length - 1 ? (
                      <span aria-hidden="true" className={clsx(t.small, styles.sep)}>
                        ·
                      </span>
                    ) : null}
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>

          <div className={clsx(styles.block, styles.tools)}>
            <h3 data-reveal="ui" className={styles.h3}>
              {copy.headings.tools}
            </h3>
            <dl className={styles.toolList}>
              {ABOUT_TOOL_GROUPS.map((group) => (
                <div key={group} data-reveal="ui" className={clsx(t.body, styles.tool)}>
                  <dt className={t.value}>{dict.skills.groups[group].label}</dt>
                  <dd>{items(dict.skills.groups[group].items)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Reveal>
  );
}
