import clsx from "clsx";
import { PairMark } from "@/components/Marks";
import { Reveal } from "@/components/Reveal";
import {
  ANCHORS,
  CASE_SLUGS,
  caseHref,
  FREELANCE,
  formatPeriod,
  PROJECTS,
  type CaseSlug,
  type Dictionary,
  type Locale,
} from "@/content";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import { Preview } from "./Preview";
import { WorkIndex } from "./WorkIndex";
import styles from "./Work.module.css";

/**
 * Chapter 4, `work` (02-home.md §4; 01 §7.12): the body of work behind the
 * numbers. Paper field; the H2 and statement, then one <ul> of seven rows in
 * CASE_SLUGS order, each one link to its case.
 *
 * - Hover mode ((min-width:1280px) and (hover:hover) and (pointer:fine),
 *   with JS): text rows (the title at the display step on one line, the
 *   metric block on the plate's left edge, its last baseline on the
 *   title's) and one ink plate beside them. The plate rides the viewport's
 *   middle while the list scrolls and shows the row it stands beside; a
 *   pointer on a row brings it to that row (WorkIndex).
 * - Inline (touch, under 1280px, or no JS): each row holds its own 16:10
 *   ink stage, the metric block beside it (from 600px) and the title under
 *   them; on phones the picture, the title, then the metric line.
 * - The S mark's dots hold view-transition names in data-vt (tr-<slug>-a/-b);
 *   a plain <a> (a full document load) lets the clicked one fly into the
 *   case cover's pair (lib/viewTransitions.ts names it on pageswap).
 */
interface Row {
  slug: CaseSlug;
  href: string;
  title: string;
  metric: string;
  caption: string;
  period: string | null;
  label: string;
}

function rowsFor(locale: Locale, dict: Dictionary): Row[] {
  const copy = dict.home.work;
  return CASE_SLUGS.map((slug) => {
    const title = slug === "freelance" ? dict.freelance.shortTitle : dict.projects[slug].shortTitle;
    const span = slug === "freelance" ? FREELANCE.period : PROJECTS[slug].period;
    // EN "2023–25"; FR in full ("2023–2025"), and the present word either way.
    const period = span ? formatPeriod(span, dict.common.present, { short: locale === "en" }) : null;
    const { metric, caption } = copy.rows[slug];
    const label = [title, `${metric} ${caption}`, period].filter(Boolean).join(", ");
    return { slug, href: caseHref(locale, slug), title, metric, caption, period, label };
  });
}

export function Work({ locale, dict }: SectionProps) {
  const copy = dict.home.work;
  const rows = rowsFor(locale, dict);
  return (
    <Reveal
      as="section"
      id={ANCHORS.work}
      data-field="paper"
      aria-labelledby="work-title"
      className={styles.root}
    >
      <div className={styles.head}>
        <h2 id="work-title" data-reveal="" className={clsx(t.display, styles.title)}>
          {copy.h2}
        </h2>
        <p data-reveal="" className={clsx(t.statement, styles.statement)}>
          {copy.statement}
        </p>
      </div>
      <WorkIndex
        slides={rows.map((row) => (
          <div key={row.slug} className={styles.slide} data-slide={row.slug}>
            <Preview slug={row.slug} dict={dict} variant="plate" />
          </div>
        ))}
      >
        <ul className={styles.list} role="list">
          {rows.map((row) => (
            <li key={row.slug} className={styles.item} data-slug={row.slug} data-reveal="row">
              <a className={styles.row} href={row.href} aria-label={row.label}>
                <div className={styles.pic} aria-hidden="true">
                  <Preview slug={row.slug} dict={dict} variant="inline" />
                </div>
                <h3 className={clsx(t.display, styles.rowTitle)}>
                  <span className={styles.cue}>
                    <span className={styles.titleLine}>{row.title}</span>
                  </span>
                </h3>
                <p className={styles.meta} data-meta="">
                  <span className={styles.metricLine}>
                    <span className={styles.markSlot}>
                      <PairMark length={4} motion="static" vt={{ a: `tr-${row.slug}-a`, b: `tr-${row.slug}-b` }} />
                    </span>
                    <span className={styles.metric}>{row.metric}</span>{" "}
                    <span className={styles.caption}>{row.caption}</span>
                  </span>
                  {/* no year for Cannes (unconfirmed, 02 §4.4): its caption is the last line */}
                  {row.period ? <span className={styles.period}>{row.period}</span> : null}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </WorkIndex>
    </Reveal>
  );
}
